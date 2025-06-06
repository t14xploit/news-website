// "use server";

// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// export async function inviteMemberAction(formData: FormData) {
//   const email = formData.get("email") as string;
//   const role = formData.get("role") as string;
//   const organizationId = formData.get("organizationId") as string;

//   if (!email || !role || !organizationId) {
//     return { error: "Missing required fields" };
//   }

//   try {
//     const result = await auth.api.inviteMember({
//       headers: await headers(),
//       body: {
//         email,
//         role,
//         organizationId,
//       },
//     });

//     if (result.error) {
//       return { error: result.error.message };
//     }

//     return { success: true, data: result.data };
//   } catch (error) {
//     return { error: "Failed to send invitation" };
//   }
// }

// export async function revokeInvitationAction(invitationId: string) {
//   try {
//     const result = await auth.api.cancelInvitation({
//       headers: await headers(),
//       body: { invitationId },
//     });

//     if (result.error) {
//       return { error: result.error.message };
//     }

//     return { success: true };
//   } catch (error) {
//     return { error: "Failed to revoke invitation" };
//   }
// }
