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
import { Input } from "@/components/ui/input";
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
import { User } from "lucide-react";
import { usePlan } from "@/components/subscribe/plan-context";

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin" | "owner">("member");
  const [isInviting, setIsInviting] = useState(false);
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { sessionUser, isLoading: isSessionLoading } = useUser();
  const { currentPlan, isLoading: isPlanLoading } = usePlan();

  const isLoading = isSessionLoading || isPlanLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sessionUser || sessionUser.role !== "editor" || !activeOrganization) {
    return <div>You are not authorized to view this page.</div>;
  }

  const canInviteMember = currentPlan === "Elite" || currentPlan === "Business";
  const handleInviteUser = async () => {
    setIsInviting(true);

    try {
      if (!email || !activeOrganization?.id) {
        toast.error("Please enter an email and select an organization");
        return;
      }

      if (role === "member" && !canInviteMember) {
        toast.error(
          "You need an Elite or Business subscription to invite members."
        );
        setIsInviting(false);
        return;
      }

      await authClient.organization.inviteMember({
        email,
        role,
        organizationId: activeOrganization.id,
      });
      toast.success("Invitation sent successfully!");
      setEmail("");
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
            <Select
              value={role}
              onValueChange={(value) => setRole(value as "member" | "admin")} // Corrected Type Assertion
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
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
