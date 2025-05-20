import { PrismaClient } from "@/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email/email";
import { createAuthMiddleware, APIError } from "better-auth/api";

import { customSession, organization } from "better-auth/plugins";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user, owner, member, editor } from "@/auth/ac/permissions";

const prisma = new PrismaClient();
let lastEmailPreviewUrl: string | false = false;

const BASE_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const SECRET_KEY =
  process.env.BETTER_AUTH_SECRET || "QifjblZMPGfaRrUbR32rzcxcxtaF1XIq";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: BASE_URL,
  secret: SECRET_KEY,
  trustedOrigins: [BASE_URL, "/verify-email"],

  // SEND verification email
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const emailResponse = await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
          <h1>Verify your email</h1>
          <p>Click the link below to verify your email address:</p>
          <a href="${url}">${url}</a>
        `,
      });
      lastEmailPreviewUrl = emailResponse.previewUrl;
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 7200, // 2 hours
  },

  // Reset password
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // SEND reset password
    sendResetPassword: async ({ user, url }) => {
      const emailResponse = await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
          <h1>Reset your password</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${url}">${url}</a>
        `,
      });
      lastEmailPreviewUrl = emailResponse.previewUrl;
    },
    resetPasswordTokenExpiresIn: 7200, // 2 hours
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/forget-password") {
        const email = ctx.body?.email;
        if (!email) {
          throw new APIError("BAD_REQUEST", {
            code: "EMAIL_REQUIRED",
            message: "Email is required.",
          });
        }
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          throw new APIError("BAD_REQUEST", {
            code: "USER_NOT_FOUND",
            message: "We couldn't find an account with that email address.",
          });
        }
      }
      // verify email
      if (ctx.path === "/verify-email") {
        const token = ctx.query?.token;
        if (!token) {
          throw new APIError("BAD_REQUEST", {
            code: "TOKEN_REQUIRED",
            message: "Verification token is required.",
          });
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (
        (ctx.path === "/forget-password" ||
          ctx.path === "/send-verification-email" ||
          ctx.path === "/verify-email") &&
        ctx.context.returned
      ) {
        return ctx.json({
          ...ctx.context.returned,
          previewUrl: lastEmailPreviewUrl,
        });
      }
    }),
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    freshAge: 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, //
    },
  },

  advanced: {
    useSecureCookies: IS_PRODUCTION,
    cookies: {
      session_token: {
        name: "auth.session",
        attributes: {
          httpOnly: true,
          sameSite: "lax",
          secure: IS_PRODUCTION,
          path: "/",
        },
      },
    },
  },

  plugins: [
    organization({
      teams: {
        enabled: true,
        maximumTeams: 10,
        allowRemovingAllTeams: false,
      },
      allowUserToCreateOrganization: async (user) => {
        const subscription = await prisma.user.findUnique({
          where: { id: user.id },
          include: { subscription: { include: { type: true } } },
        });
        return subscription?.subscription?.type?.name === "business";
      },

      organizationCreation: {
        beforeCreate: async ({ organization, user }) => {
          const userWithSubscription = await prisma.user.findUnique({
            where: { id: user.id },
            include: { subscription: { include: { type: true } } },
          });
          return {
            data: {
              ...organization,
              metadata: {
                createdByUserId: user.id,
                subscriptionId: userWithSubscription?.subscription?.id || null,
              },
            },
          };
        },
        afterCreate: async ({ organization, member, user }) => {
          console.log(
            `Channel created: ${organization.name} by ${user.email}, memberId: ${member.id}`
          );
        },
      },

      sendInvitationEmail: async (data) => {
        const inviteLink = `${BASE_URL}/accept-invitation/${data.id}`;
        await sendEmail({
          to: data.email,
          subject: `You've been invited to join ${data.organization.name} on OpenNews`,
          html: `
              <h1>You've been invited to join a channel</h1>
            <p>${
              data.inviter.user.name || data.inviter.user.email
            } has invited you to join "${
            data.organization.name
          }" on OpenNews.</p>
            <p>Click the link below to accept the invitation:</p>
            <a href="${inviteLink}">${inviteLink}</a>
          `,
        });
      },
      ac,
      roles: {
        owner,
        admin,
        member,
      },
    }),

    adminPlugin({
      defaultRole: "user",
      adminRoles: ["admin"],
      defaultBanReason: "Violation of terms of service",
      bannedUserMessage:
        "Your account has been suspended. Please contact support for assistance.",
      ac,
      roles: {
        admin,
        user,
        editor,
      },
    }),
    nextCookies(),

    customSession(async ({ user, session }) => {
      let dbUser = null;
      let subscription = null;
      let subscriptionType = null;

      if (user?.id) {
        dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { subscription: { include: { type: true } } },
        });

        if (dbUser?.subscription) {
          subscription = dbUser.subscription;
          subscriptionType = dbUser.subscription.type;
        }
      }

      return {
        user: {
          ...user,
          role: dbUser?.role || "user",
          subscriptionId: dbUser?.subscriptionId,
          subscription: subscription,
        },
        session,
        subscription,
        subscriptionType,
      };
    }),
  ],
});
export const { api } = auth;
