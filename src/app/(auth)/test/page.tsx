"use client";

import CreateChannel from "@/components/my-channel/create-channel";

export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="text-lg">This is a test page.</p>
      <CreateChannel />
    </div>
  );
}
