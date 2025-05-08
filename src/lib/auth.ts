import { PrismaClient } from "@/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email";
import { createAuthMiddleware, APIError } from "better-auth/api";

const prisma = new PrismaClient();

let lastEmailPreviewUrl: string | false = false;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "QifjblZMPGfaRrUbR32rzcxcxtaF1XIq",

  trustedOrigins: ["http://localhost:3000", "/verify-email"],

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
    expiresIn: 7200, // 2 hour
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    minPasswordLength: 8,

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
    resetPasswordTokenExpiresIn: 7200, // 2 hour
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/forget-password") {
        const email = ctx.body?.email;

        // Check if the user exists
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

      if (ctx.path === "/verify-email") {
        return;
      }
    }),

    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/forget-password" && ctx.context.returned) {
        return ctx.json({
          ...ctx.context.returned,
          previewUrl: lastEmailPreviewUrl,
        });
      }

      if (
        (ctx.path === "/send-verification-email" ||
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
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minutes
    },
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

  plugins: [nextCookies()],
});
