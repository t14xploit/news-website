"use client";
import InviteUser from "@/components/my-channel/invite-user";
import { useUser } from "@/lib/context/user-context";
import { authClient } from "@/lib/auth-client";

export default function InvitePage() {
  const { sessionUser, isLoading, isEditor } = useUser();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sessionUser || !isEditor || !activeOrganization) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Invite Members to {activeOrganization.name}
      </h2>
      <InviteUser />
    </div>
  );
}
