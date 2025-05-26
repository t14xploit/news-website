import { PrismaClient } from "@/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email/email";
import { createAuthMiddleware } from "better-auth/api";
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
    sendVerificationEmail: async ({ user, url, token }) => {
      const { previewUrl } = await sendEmail({
        to: user.email,
        subject: "Verify your OpenNews email",
        html: `
          <h1>Verify Your Email</h1>
          <p>Click here to verify:</p>
          <a href="${url}">${url}</a>
          console.log('${token}');
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

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (
        [
          "/send-verification-email",
          "/forget-password",
          "/verify-email",
        ].includes(ctx.path) &&
        ctx.context.returned
      ) {
        return ctx.json({
          ...ctx.context.returned,
          previewUrl: lastPreviewUrl,
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
    useSecureCookies: process.env.NODE_ENV === "production",
    cookies: {
      session_token: {
        name: "auth.session",
        attributes: {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
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
        const link = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${data.id}`;
        await sendEmail({
          to: data.email,
          subject: `Invitation to join ${data.organization.name}`,
          html: `<p><a href="${link}">Accept invitation</a></p>`,
        });
      },
      ac,
      roles: { owner, admin, member },
    }),

    adminPlugin({
      defaultRole: "user",
      adminRoles: ["admin"],
      ac,
      roles: { admin, user, editor },
    }),

    nextCookies(),

    customSession(async ({ user, session }) => {
      let role = "user";
      let subscriptionId: string | null = null;
      if (user.id) {
        const u = await prisma.user.findUnique({
          where: { id: user.id },
          include: { subscription: { include: { type: true } } },
        });
        if (u?.subscription) {
          subscriptionId = u.subscriptionId;
          if (u.subscription.type?.name === "Business") role = "editor";
        }
      }
      return {
        user: {
          id: user.id,
          email: user.email,
          role,
          subscriptionId,
        },
        session,
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
