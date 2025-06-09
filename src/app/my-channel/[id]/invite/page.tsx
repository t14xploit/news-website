"use client";

import { useUser } from "@/lib/context/user-context";
import { authClient } from "@/lib/auth-client";
import InviteUser from "@/components/my-channel/invite-users";
import { Skeleton } from "@/components/ui/skeleton";

import { redirect } from "next/navigation";
import { use, useEffect } from "react";

export default function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { sessionUser, isLoading, isEditor } = useUser();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { id } = use(params); // Unwrap params with React.use()

  // Debugging logs
  useEffect(() => {
    console.log("InvitePage State:", {
      sessionUser: sessionUser
        ? {
            id: sessionUser.id,
            role: sessionUser.role,
            email: sessionUser.email,
          }
        : null,
      isLoading,
      isEditor,
      activeOrganization: activeOrganization
        ? { id: activeOrganization.id, name: activeOrganization.name }
        : null,
      paramsId: id,
    });
  }, [sessionUser, isLoading, isEditor, activeOrganization, id]);

  if (isLoading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (!sessionUser) {
    console.warn("Redirecting: No session user");
    return redirect("/sign-in");
  }

  if (!isEditor) {
    console.warn("Redirecting: User is not an editor", {
      role: sessionUser.role,
    });
    return redirect("/my-channel");
  }

  if (!activeOrganization) {
    console.warn("Redirecting: No active organization");
    return redirect("/my-channel/create-channel");
  }

  if (activeOrganization.id !== id) {
    console.warn("Redirecting: Organization ID mismatch", {
      activeOrgId: activeOrganization.id,
      paramsId: id,
    });
    return redirect(`/my-channel/${activeOrganization.id}/invite`);
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">
        Invite Members to {activeOrganization.name} Channel
      </h2>
      <InviteUser />
    </div>
  );
}
