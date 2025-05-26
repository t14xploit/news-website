"use client";

import { useUser } from "@/lib/context/user-context";

export default function MyChannelFull() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user?.subscriptionId) {
    return <div>You must have a subscription to view the full content.</div>;
  }

  return (
    <div>
      <h2>My Channel (Full Access)</h2>
      <p>Full article content goes here.</p>
    </div>
  );
}
