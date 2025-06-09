"use client";

import CreateChannel from "@/components/my-channel/create-channel";
import { useUser } from "@/lib/context/user-context";

export default function CreateChannelPage() {
  const { sessionUser, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (
    !sessionUser ||
    (sessionUser.role !== "editor" && sessionUser?.role !== "admin")
  ) {
    return <div>You are not authorized to create a channel.</div>;
  }

  return (
    <div className="p-4">
      <CreateChannel />
    </div>
  );
}
