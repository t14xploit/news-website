// import { useState } from "react";
// import { authClient } from "@/lib/auth-client";

// export default function CreateUserForm() {
//   const [email, setEmail]     = useState("");
//   const [name, setName]       = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole]       = useState<"user"|"editor"|"admin">("user");
//   const [error, setError]     = useState<string|null>(null);
//   const [success, setSuccess] = useState<string|null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     const { data, error } = await authClient.admin.createUser({
//       name,
//       email,
//       password,
//       role,
//       data: { /* any custom fields */ },
//     });

//     if (error) {
//       setError(error.message);
//     } else {
//       setSuccess(`User created: ${data.user.id}`);
//       setName("");
//       setEmail("");
//       setPassword("");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg">
//       <h2 className="text-xl font-semibold">Create New User</h2>

//       {error && <p className="text-destructive">{error}</p>}
//       {success && <p className="text-success">{success}</p>}

//       <div>
//         <label>Name</label>
//         <input
//           type="text" required
//           value={name} onChange={e => setName(e.target.value)}
//           className="w-full input"
//         />
//       </div>

//       <div>
//         <label>Email</label>
//         <input
//           type="email" required
//           value={email} onChange={e => setEmail(e.target.value)}
//           className="w-full input"
//         />
//       </div>

//       <div>
//         <label>Password</label>
//         <input
//           type="password" required minLength={8}
//           value={password} onChange={e => setPassword(e.target.value)}
//           className="w-full input"
//         />
//       </div>

//       <div>
//         <label>Role</label>
//         <select
//           value={role} onChange={e => setRole(e.target.value as any)}
//           className="w-full input"
//         >
//           <option value="user">User</option>
//           <option value="editor">Editor</option>
//           <option value="admin">Admin</option>
//         </select>
//       </div>

//       <button type="submit" className="btn-primary">
//         Create User
//       </button>
//     </form>
//   );
// }
