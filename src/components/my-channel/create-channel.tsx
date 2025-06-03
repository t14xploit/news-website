"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/lib/context/user-context";
import { Plus } from "lucide-react";

export default function CreateChannel() {
  const { sessionUser, isLoading, isEditor } = useUser();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const [channelName, setChannelName] = useState("");
  const [channelSlug, setChannelSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sessionUser) {
    return <div>Please sign in to create a channel.</div>;
  }

  if (!isEditor) {
    return <div>You are not authorized to create a channel.</div>;
  }

  const handleCreateChannel = async () => {
    setIsCreating(true);
    try {
      if (!channelName || !channelSlug) {
        toast.error("Please enter a channel name and slug.");
        return;
      }

      await authClient.organization.create({
        name: channelName,
        slug: channelSlug,
      });
      toast.success("Channel created successfully!");
      setChannelName("");
      setChannelSlug("");
    } catch (error) {
      console.error("Channel creation failed:", error);
      toast.error("Failed to create channel. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Create Channel
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Your Channel</SheetTitle>
          <SheetDescription>Enter your channel details.</SheetDescription>
        </SheetHeader>
        <div>
          {activeOrganization ? (
            <p>Current Channel: {activeOrganization.name}</p>
          ) : null}
          <div>
            <Input
              type="text"
              placeholder="Channel Name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Channel Slug"
              value={channelSlug}
              onChange={(e) => setChannelSlug(e.target.value)}
            />
          </div>
          <Button
            onClick={handleCreateChannel}
            disabled={isCreating}
            className="mt-4"
          >
            {isCreating ? "Creating..." : "Create Channel"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
