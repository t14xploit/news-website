"use client";
import InviteUser from "@/components/my-channel/invite-users";
import { useUser } from "@/lib/context/user-context";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvitePage() {
  const { sessionUser, isLoading, isEditor } = useUser();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (!sessionUser || !isEditor || !activeOrganization) {
    return (
      <div>
        You have to create an channel first or have the Business subscription.
      </div>
    );
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
// "use client";

// import ShareOrganizationCard from "@/components/my-channel/invite-usr";

// export default function Page() {
//   return <ShareOrganizationCard />;
// }
