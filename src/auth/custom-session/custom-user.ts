// import { PrismaClient } from "@/generated/prisma";
// import { customSession } from "better-auth/plugins";

// const prisma = new PrismaClient();

// export const customSessionPlugin = customSession(async ({ user, session }) => {
//   let dbUser = null;
//   let subscription = null;
//   let subscriptionType = null;

//   if (user?.id) {
//     dbUser = await prisma.user.findUnique({
//       where: { id: user.id },
//       include: { subscription: { include: { type: true } } },
//     });

//     if (dbUser?.subscription) {
//       subscription = dbUser.subscription;
//       subscriptionType = dbUser.subscription.type;
//     }
//   }

//   return {
//     user: {
//       ...user,
//       role: dbUser?.role || "user",
//       subscriptionId: dbUser?.subscriptionId,
//       subscription: subscription,
//     },
//     session,
//     subscription,
//     subscriptionType,
//   };
// });

// export default customSessionPlugin;
// export { customSessionPlugin as customSession };
