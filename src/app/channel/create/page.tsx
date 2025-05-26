"use client";

import CreateChannel from "@/components/my-channel/create-channel";
import { useUser } from "@/lib/context/user-context";

export default function CreateChannelPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "editor") {
    return <div>You are not authorized to create a channel.</div>;
  }

  return (
    <div>
      <CreateChannel />
    </div>
  );
}
