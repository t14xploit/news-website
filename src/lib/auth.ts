import { PrismaClient } from "@/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email/email";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { customSession } from "better-auth/plugins";

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

  // Verify email
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const verificationUrl = new URL(url);
      if (!verificationUrl.searchParams.has("callbackURL")) {
        verificationUrl.searchParams.append("callbackURL", "/");
      }

      const emailResponse = await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
          <h1>Verify your email</h1>
          <p>Click the link below to verify your email address:</p>
          <a href="${verificationUrl.toString()}">${verificationUrl.toString()}</a>
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
      maxAge: 60, // 1 minute
    },
  },

  // Advanced cookie settings
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
    nextCookies(),
    customSession(async ({ user, session }) => {
      return {
        user,
        session,
      };
    }),
  ],
});

export const { api } = auth;
