"use client";

import ManageUsers from "@/components/admin/user/manage-users";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await authClient.getSession();
      const currentUser = session.data?.user;
      if (!currentUser) {
        router.replace("/sign-in");
        return;
      }

      if (currentUser.role !== "admin") {
        router.replace("/sign-in");
        return;
      }

      const permResult = await authClient.admin.hasPermission({
        permissions: {
          user: ["list"],
        },
      });

      if (permResult.error || !permResult.data?.success) {
        router.replace("/sign-in");
        return;
      }

      setIsChecking(false);
    })();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ManageUsers />
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";
// import { authClient } from "@/lib/auth-client";

// // ← Import our new combined component:
// import ShareUsersCard from "@/components/admin/user/share-users-card";

// export default function AdminUsersPage() {
//   const router = useRouter();
//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const session = await authClient.getSession();
//       const currentUser = session.data?.user;
//       if (!currentUser) {
//         router.replace("/sign-in");
//         return;
//       }
//       if (currentUser.role !== "admin") {
//         router.replace("/sign-in");
//         return;
//       }
//       const permResult = await authClient.admin.hasPermission({
//         permissions: { user: ["list"] },
//       });
//       if (permResult.error || !permResult.data?.success) {
//         router.replace("/sign-in");
//         return;
//       }
//       setIsChecking(false);
//     })();
//   }, [router]);

//   if (isChecking) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <ShareUsersCard />
//     </div>
//   );
// }
