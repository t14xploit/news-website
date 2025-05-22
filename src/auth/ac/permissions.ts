import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements as orgDefaultStatements } from "better-auth/plugins/organization/access";
import {
  defaultStatements as adminDefaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

const statements = {
  ...orgDefaultStatements,
  ...adminDefaultStatements,
  article: ["create", "read", "update", "delete", "repost"],
  subscription: ["view", "purchase", "cancel", "upgrade", "downgrade"],
  channel: ["view", "manage", "create", "update", "delete"],
  business: ["access"],
} as const;

export const ac = createAccessControl(statements);

export const user = ac.newRole({
  article: ["read"],
  subscription: ["view", "purchase", "upgrade"],
});

export const editor = ac.newRole({
  article: ["create", "read", "update", "delete", "repost"],
  channel: ["view", "manage"],
  subscription: ["view", "purchase", "cancel", "upgrade", "downgrade"],
  business: ["access"],
});

export const admin = ac.newRole({
  article: ["create", "read", "update", "delete", "repost"],
  subscription: ["view", "purchase", "cancel", "upgrade", "downgrade"],
  channel: ["view", "manage"],
  business: ["access"],
  ...adminAc.statements,
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
  ],
  session: ["list", "revoke", "delete"],
  organization: ["update", "delete"],
});

export const owner = ac.newRole({
  ...adminAc.statements,
  organization: ["update", "delete"],
});

export const member = ac.newRole({
  article: ["read"],
  channel: ["view", "create", "update"],
  subscription: ["view", "purchase", "upgrade"],
});

// import { createAccessControl } from "better-auth/plugins/access";
// import { defaultStatements as adminDefaultStatements, adminAc } from "better-auth/plugins/admin/access";

// const statement = {
//   ...adminDefaultStatements,
//   article: ["create", "read", "update", "delete", "list"],
//   subscription: ["view", "manage", "subscribe"],
// } as const;

// const ac = createAccessControl(statement);

// export const userRole = ac.newRole({
//   article: ["read"],
//   subscription: ["subscribe"],
// });

// export const editorRole = ac.newRole({
//   article: ["create", "read", "update", "delete"],
//   subscription: ["view", "manage", "subscribe"],
// });

// export const adminRole = ac.newRole({
//   article: ["create", "read", "update", "delete", "list"],
//   subscription: ["view", "manage", "subscribe"],
//   ...adminAc.statements,
//   // user management
//   user: [
//     "create",
//     "list",
//     "set-role",
//     "ban",
//     "impersonate",
//     "set-password",
//     "delete",
//   ],
//   session: ["list", "revoke", "delete"],

// });
