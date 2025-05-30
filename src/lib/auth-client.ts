import { createAuthClient } from "better-auth/react";
import {
  organizationClient,
  customSessionClient,
} from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";
import { adminClient } from "better-auth/client/plugins";
import { ac, user, editor, admin, owner, member } from "../auth/ac/permissions";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000",

  plugins: [
    customSessionClient<typeof auth>(),
    organizationClient({
      ac,
      roles: { owner, admin, member },
    }),

    adminClient({
      ac,
      roles: { admin, user, editor },
    }),
  ],
});

export const { signIn, signOut, signUp, getSession, changePassword } =
  authClient;
