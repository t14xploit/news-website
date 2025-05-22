// // components/MyChannel/InviteUser.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner";
// import { authClient } from "@/lib/auth-client";

// interface InviteUserProps {
//   organizationId: string; // Pass the organizationId to this component
// }

// export default function InviteUser({ organizationId }: InviteUserProps) {
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState<"member" | "admin" | "owner">("member"); // Corrected: role is now string literal type
//   const [isInviting, setIsInviting] = useState(false);

//   const handleInviteUser = async () => {
//     setIsInviting(true);

//     try {
//       if (!email || !organizationId) {
//         toast.error("Please enter an email and have an organization");
//         return;
//       }

//       await authClient.organization.inviteMember({
//         email,
//         role, // Use the selected role
//         organizationId, // Pass the organization ID
//       });
//       toast.success("Invitation sent successfully!");
//       setEmail(""); // Clear the email field
//     } catch (error) {
//       console.error("Failed to send invitation:", error);
//       toast.error("Failed to send invitation. Please try again.");
//     } finally {
//       setIsInviting(false);
//     }
//   };

//   return (
//     <div>
//       <h3>Invite Users</h3>
//       <div>
//         <Input
//           type="email"
//           placeholder="Enter email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>
//       <div>
//         <Select value={role} onValueChange={setRole}>
//           <SelectTrigger className="w-[200px]">
//             <SelectValue placeholder="Select role" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="member">Co-editor</SelectItem>
//             <SelectItem value="admin">Admin</SelectItem>
//             <SelectItem value="owner">Owner</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <Button onClick={handleInviteUser} disabled={isInviting}>
//         {isInviting ? "Inviting..." : "Invite"}
//       </Button>
//     </div>
//   );
// }
