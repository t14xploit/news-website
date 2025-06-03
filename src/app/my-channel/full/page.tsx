"use client";

import { useUser } from "@/lib/context/user-context";

export default function MyChannelFull() {
  const { sessionUser } = useUser();

  if (!sessionUser?.subscriptionId) {
    return (
      <div className="p-4">
        <p>You must have a subscription to view the full content.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Channel (Full Access)</h2>
      <p>Full article content goes here.</p>
    </div>
  );
}
