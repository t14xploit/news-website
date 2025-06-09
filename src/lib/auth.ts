import { PrismaClient } from "@/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email/email";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { customSession, organization } from "better-auth/plugins";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, owner, admin, member, user, editor } from "@/auth/ac/permissions";
import { getActiveOrganization } from "./organization/get-active-organization";

const prisma = new PrismaClient();
let lastPreviewUrl: string | false = false;

const BASE_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const SECRET_KEY =
  process.env.BETTER_AUTH_SECRET || "QifjblZMPGfaRrUbR32rzcxcxtaF1XIq";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: BASE_URL,
  secret: SECRET_KEY,
  trustedOrigins: [BASE_URL],

  // Email verification —
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      const verifyLink = `${BASE_URL}/verify-email?token=${token}&email=${encodeURIComponent(
        user.email
      )}`;

      const { previewUrl } = await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `
          <h1>Welcome to OpenNews!</h1>
          <p>Please click below to verify your email address:</p>
          <a href="${verifyLink}">${verifyLink}</a>
        `,
      });
      lastPreviewUrl = previewUrl;
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 2 * 60 * 60,
  },

  // Password-reset
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }) => {
      const { previewUrl } = await sendEmail({
        to: user.email,
        subject: "Reset your OpenNews password",
        html: `<p><a href="${url}">Reset your password</a></p>`,
      });
      lastPreviewUrl = previewUrl;
    },
    resetPasswordTokenExpiresIn: 2 * 60 * 60,
  },

  // hooks: {
  //   after: createAuthMiddleware(async (ctx) => {
  //     if (
  //       [
  //         "/send-verification-email",
  //         "/forget-password",
  //         "/verify-email",
  //       ].includes(ctx.path) &&
  //       ctx.context.returned
  //     ) {
  //       return ctx.json({
  //         ...ctx.context.returned,
  //         previewUrl: lastPreviewUrl,
  //       });
  //     }
  //   }),
  // },

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
        [
          "/forget-password",
          "/send-verification-email",
          "/verify-email",
        ].includes(ctx.path) &&
        ctx.context.returned
      ) {
        return ctx.json({
          ...ctx.context.returned,
          previewUrl: lastPreviewUrl || null,
        });
      }
      if (ctx.path.includes("/organization/invite") && ctx.context.returned) {
        return ctx.json({
          ...ctx.context.returned,
          previewUrl: lastPreviewUrl || null,
        });
      }
    }),
  },

  session: {
    expiresIn: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    freshAge: 60 * 60,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  advanced: {
    useSecureCookies: false,
    cookies: {
      session_token: {
        name: "auth.session",
        attributes: {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          path: "/",
        },
      },
    },
  },

  //  Organization & admin plugins
  plugins: [
    organization({
      teams: {
        enabled: true,
        maximumTeams: 10,
        allowRemovingAllTeams: false,
      },
      allowUserToCreateOrganization: async (user) => {
        const sub = await prisma.user.findUnique({
          where: { id: user.id },
          include: { subscription: { include: { type: true } } },
        });
        return sub?.subscription?.type?.name === "Business";
      },
      organizationCreation: {
        beforeCreate: async ({ organization, user }) => {
          const sub = await prisma.user.findUnique({
            where: { id: user.id },
            include: { subscription: { include: { type: true } } },
          });
          return {
            data: {
              ...organization,
              metadata: {
                createdByUserId: user.id,
                subscriptionId: sub?.subscription?.id || null,
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
        const { previewUrl } = await sendEmail({
          to: data.email,
          subject: `Invitation to join ${data.organization.name}`,
          html: `
      <h1>You've been invited to join ${data.organization.name}!</h1>
      <p>Click the link below to accept the invitation:</p>
      <a href="${inviteLink}">Accept Invitation</a>
      <p>Invited by: ${data.inviter.user.name} (${data.inviter.user.email})</p>
    `,
        });
        lastPreviewUrl = previewUrl;
      },
      ac,
      roles: { owner, admin, member },
    }),

    adminPlugin({
      defaultRole: "user",
      adminRoles: ["admin"],
      defaultBanReason: "Violation of terms of service",
      bannedUserMessage:
        "Your account has been suspended. Please contact support for assistance.",
      ac,
      roles: { admin, user, editor },
    }),

    nextCookies(),

    customSession(async ({ user, session }) => {
      const u = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          subscription: {
            include: {
              type: true,
            },
          },
        },
      });

      let role = u?.role === "admin" ? "admin" : "user";
      let subscriptionId: string | null = null;
      let subscriptionType = null;

      if (u?.subscription) {
        subscriptionId = u.subscriptionId;
        subscriptionType = u.subscription.type?.name;

        if (subscriptionType === "Business" && role !== "admin") {
          role = "editor";
        } else if (subscriptionType === "Elite") {
          role = "reader";
        }
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          role,
          subscriptionId,
          name: user?.name ?? null,
          avatar: user?.image ?? null,
        },
        session,
        subscriptionType,
      };
    }),
  ],

  //  DB‐hook for putting activeOrganization into new sessions
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const org = await getActiveOrganization(session.userId);
          return {
            data: { ...session, activeOrganizationId: org?.id },
          };
        },
      },
    },
  },
});

export const { api } = auth;
