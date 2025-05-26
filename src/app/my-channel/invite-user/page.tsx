// src/components/my-channel/invite-user.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, User } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/lib/context/user-context";

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member"); // Corrected: role is now string literal type
  const [isInviting, setIsInviting] = useState(false);
  const { data: activeOrganization } = authClient.useActiveOrganization(); // Get active organization
  const { user, isLoading: isSessionLoading } = useUser(); // Get user role

  if (isSessionLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "editor" || !activeOrganization) {
    return <div>You are not authorized to view this page.</div>;
  }

  const handleInviteUser = async () => {
    setIsInviting(true);

    try {
      if (!email || !activeOrganization?.id) {
        toast.error("Please enter an email and select an organization");
        return;
      }

      await authClient.organization.inviteMember({
        email,
        role, // Use the selected role
        organizationId: activeOrganization.id, // Pass the active organization ID
      });
      toast.success("Invitation sent successfully!");
      setEmail(""); // Clear the email field
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <User className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Invite a new member to your organization.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Co-editor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              onClick={handleInviteUser}
              disabled={isInviting}
              className="mt-4"
            >
              {isInviting ? "Inviting..." : "Invite"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
