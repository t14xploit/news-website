"use client";

import { useState, useCallback, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Copy, Trash2, User } from "lucide-react";
import { useUser } from "@/lib/context/user-context";
import { usePlan } from "@/components/subscribe/plan-context";
import { Skeleton } from "@/components/ui/skeleton";
import { inviteMemberAction } from "@/lib/organization/invite-members";

interface InvitationData {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  organizationId: string;
  inviterId: string;
  teamId?: string;
}

interface MemberData {
  id: string;
  role: string;
  userId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
}

interface OrganizationData {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: string;
  updatedAt: string;
  members: MemberData[];
  invitations?: InvitationData[];
}

interface InvitationRow {
  id: string;
  email: string;
  role: "member" | "admin" | "owner";
  status: "pending" | "accepted" | "rejected" | "canceled";
  createdAt: string;
  expiresAt: string;
}

interface MemberRow {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: "member" | "admin" | "owner";
  createdAt: string;
}

const PAGE_SIZE = 5;

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [isInviting, setIsInviting] = useState(false);
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { sessionUser, isLoading: isSessionLoading } = useUser();
  const { currentPlan, isLoading: isPlanLoading } = usePlan();

  const [invitations, setInvitations] = useState<InvitationRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const isLoadingData = isSessionLoading || isPlanLoading || isLoading;

  const fetchInvitationsAndMembers = useCallback(async () => {
    if (!activeOrganization?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      const invitationsResult = await authClient.organization.listInvitations({
        query: {
          organizationId: activeOrganization.id,
        },
      });
      if (invitationsResult.error) {
        throw new Error(
          invitationsResult.error.message || "Failed to load invitations"
        );
      }

      const invitationRows: InvitationRow[] = (
        (invitationsResult.data as unknown as InvitationData[]) || []
      ).map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role as "member" | "admin" | "owner",
        status: invitation.status as
          | "pending"
          | "accepted"
          | "rejected"
          | "canceled",
        createdAt: new Date(invitation.createdAt).toLocaleDateString(),
        expiresAt: new Date(invitation.expiresAt).toLocaleDateString(),
      }));

      const orgResult = await authClient.organization.getFullOrganization({
        query: { organizationId: activeOrganization.id },
      });
      if (orgResult.error) {
        throw new Error(
          orgResult.error.message || "Failed to load organization"
        );
      }

      const organizationData = orgResult.data as unknown as OrganizationData;
      const realMembers: MemberRow[] = (
        organizationData?.members as MemberData[]
      ).map((member: MemberData) => ({
        id: member.id,
        email: member.user.email,
        name: member.user.name || member.user.email,
        image: member.user.image,
        role: member.role as "member" | "admin" | "owner",
        createdAt: new Date(member.createdAt).toLocaleDateString(),
      }));

      const mockMembers: MemberRow[] = [
        {
          id: "mock-1",
          email: "monalisi@outlook.com",
          name: "Lisi MonaLisi",
          image: null,
          role: "admin",
          createdAt: "07/06/2025",
        },
        {
          id: "mock-2",
          email: "liam.williams@outlook.com",
          name: "Liam Williams",
          image: null,
          role: "admin",
          createdAt: "05/20/2025",
        },
        {
          id: "mock-3",
          email: "olivia.brown@yahoo.com",
          name: "Olivia Brown",
          image: null,
          role: "member",
          createdAt: "04/15/2025",
        },
        {
          id: "mock-4",
          email: "noah.jones@hotmail.com",
          name: "Noah Jones",
          image: null,
          role: "member",
          createdAt: "03/30/2025",
        },
        {
          id: "mock-5",
          email: "ava.garcia@icloud.com",
          name: "Ava Garcia",
          image: null,
          role: "member",
          createdAt: "02/25/2025",
        },
        {
          id: "mock-6",
          email: "elijah.martinez@protonmail.com",
          name: "Elijah Martinez",
          image: null,
          role: "member",
          createdAt: "12/10/2024",
        },
        {
          id: "mock-7",
          email: "isabella.rodriguez@live.com",
          name: "Isabella Rodriguez",
          image: null,
          role: "member",
          createdAt: "11/18/2024",
        },
        {
          id: "mock-8",
          email: "lucas.hernandez@aol.com",
          name: "Lucas Hernandez",
          image: null,
          role: "member",
          createdAt: "10/05/2024",
        },
        {
          id: "mock-9",
          email: "sophia.lopez@zoho.com",
          name: "Sophia Lopez",
          image: null,
          role: "member",
          createdAt: "08/22/2024",
        },
        {
          id: "mock-10",
          email: "mason.gonzalez@mail.com",
          name: "Mason Gonzalez",
          image: null,
          role: "member",
          createdAt: "07/14/2024",
        },
        {
          id: "mock-11",
          email: "mia.wilson@gmail.com",
          name: "Mia Wilson",
          image: null,
          role: "member",
          createdAt: "05/07/2024",
        },
        {
          id: "mock-12",
          email: "ethan.anderson@outlook.com",
          name: "Ethan Anderson",
          image: null,
          role: "member",
          createdAt: "03/12/2024",
        },
        {
          id: "mock-13",
          email: "charlotte.thomas@yahoo.com",
          name: "Charlotte Thomas",
          image: null,
          role: "member",
          createdAt: "01/28/2024",
        },
        {
          id: "mock-14",
          email: "logan.taylor@hotmail.com",
          name: "Logan Taylor",
          image: null,
          role: "member",
          createdAt: "11/02/2023",
        },
        {
          id: "mock-15",
          email: "amelia.moore@icloud.com",
          name: "Amelia Moore",
          image: null,
          role: "member",
          createdAt: "09/17/2023",
        },
        {
          id: "mock-16",
          email: "james.jackson@protonmail.com",
          name: "James Jackson",
          image: null,
          role: "member",
          createdAt: "07/09/2023",
        },
        {
          id: "mock-17",
          email: "harper.martin@live.com",
          name: "Harper Martin",
          image: null,
          role: "member",
          createdAt: "05/21/2023",
        },
        {
          id: "mock-18",
          email: "benjamin.lee@aol.com",
          name: "Benjamin Lee",
          image: null,
          role: "member",
          createdAt: "04/11/2023",
        },
        {
          id: "mock-19",
          email: "evelyn.perez@zoho.com",
          name: "Evelyn Perez",
          image: null,
          role: "member",
          createdAt: "03/29/2023",
        },
        {
          id: "mock-20",
          email: "jacob.thompson@mail.com",
          name: "Jacob Thompson",
          image: null,
          role: "member",
          createdAt: "02/13/2023",
        },
        {
          id: "mock-21",
          email: "abigail.white@gmail.com",
          name: "Abigail White",
          image: null,
          role: "member",
          createdAt: "12/05/2022",
        },
        {
          id: "mock-22",
          email: "michael.harris@outlook.com",
          name: "Michael Harris",
          image: null,
          role: "member",
          createdAt: "10/19/2022",
        },
        {
          id: "mock-23",
          email: "emily.sanchez@yahoo.com",
          name: "Emily Sanchez",
          image: null,
          role: "member",
          createdAt: "08/08/2022",
        },
        {
          id: "mock-24",
          email: "william.clark@hotmail.com",
          name: "William Clark",
          image: null,
          role: "member",
          createdAt: "06/14/2022",
        },
        {
          id: "mock-25",
          email: "elizabeth.ramirez@icloud.com",
          name: "Elizabeth Ramirez",
          image: null,
          role: "member",
          createdAt: "02/02/2022",
        },
      ];

      const memberRows: MemberRow[] = [...realMembers, ...mockMembers];

      setInvitations(invitationRows);
      setMembers(memberRows);
      setTotal(invitationRows.length + memberRows.length);
      setShareableLink(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/accept-invitation/${activeOrganization.id}`
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [activeOrganization?.id]);

  useEffect(() => {
    fetchInvitationsAndMembers();
  }, [fetchInvitationsAndMembers]);

  const handleCopyLink = () => {
    if (!shareableLink) return;
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Invitation link copied to clipboard!");
  };

  const canInviteMember = currentPlan === "Elite" || currentPlan === "Business";

  const handleInviteUserAction = async () => {
    if (!sessionUser) {
      toast.error("You must be logged in to invite users");
      return;
    }
    if (!activeOrganization?.id) {
      toast.error("No active organization found");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (role === "member" && !canInviteMember) {
      toast.error(
        "You need an Elite or Business subscription to invite members."
      );
      return;
    }
    setIsInviting(true);
    setPreviewUrl(null);

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("role", role);
    formData.append("organizationId", activeOrganization.id);

    const actionResult = await inviteMemberAction(formData);
    if (!actionResult.success) {
      toast.error(actionResult.error || "Failed to send invitation.");
    } else {
      toast.success("Invitation sent successfully!");
      setEmail("");
      if (
        "previewUrl" in actionResult &&
        typeof actionResult.previewUrl === "string"
      ) {
        setPreviewUrl(actionResult.previewUrl);
      }
      await fetchInvitationsAndMembers();
    }
    setIsInviting(false);
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      await authClient.organization.cancelInvitation({ invitationId });
      toast.success("Invitation revoked successfully!");
      fetchInvitationsAndMembers();
    } catch (error: unknown) {
      console.error("Failed to revoke invitation:", error);
      if (error instanceof Error) {
        toast.error(
          error.message || "Failed to revoke invitation. Please try again."
        );
      } else {
        toast.error("Failed to revoke invitation. Please try again.");
      }
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      await authClient.organization.updateMemberRole({
        memberId,
        role: newRole as "member" | "owner" | "admin",
      });
      toast.success("Member role updated successfully!");
      fetchInvitationsAndMembers();
    } catch (error: unknown) {
      console.error("Failed to update member role:", error);
      if (error instanceof Error) {
        toast.error(
          error.message || "Failed to update member role. Please try again."
        );
      } else {
        toast.error("Failed to update member role. Please try again.");
      }
    }
  };

  const handleRemoveMember = async (memberIdOrEmail: string) => {
    if (!confirm("Are you sure you want to remove this member?")) {
      return;
    }
    try {
      await authClient.organization.removeMember({
        memberIdOrEmail,
        organizationId: activeOrganization?.id,
      });
      toast.success("Member removed successfully!");
      fetchInvitationsAndMembers();
    } catch (error: unknown) {
      console.error("Failed to remove member:", error);
      if (error instanceof Error) {
        toast.error(
          error.message || "Failed to remove member. Please try again."
        );
      } else {
        toast.error("Failed to remove member. Please try again.");
      }
    }
  };

  // pagination calculations
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const prevPage = () => setOffset((prev) => Math.max(prev - PAGE_SIZE, 0));
  const nextPage = () =>
    setOffset((prev) =>
      Math.min(prev + PAGE_SIZE, (totalPages - 1) * PAGE_SIZE)
    );

  // slice data for current page
  const visibleMembers = members.slice(offset, offset + PAGE_SIZE);
  const visibleInvitations = invitations.slice(offset, offset + PAGE_SIZE);

  if (isSessionLoading) {
    return <div>Loading user session...</div>;
  }

  if (!sessionUser) {
    return <div>Please sign in to manage members.</div>;
  }

  if (
    !sessionUser ||
    (sessionUser.role !== "editor" && sessionUser.role !== "admin")
  ) {
    return <div>You are not authorized to manage members.</div>;
  }

  return (
    <Card className="max-w-4xl w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Manage Members
        </CardTitle>
        <CardDescription>
          Invite, manage, and view members of your organization{" "}
          {activeOrganization?.name}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingData ? (
          <>
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-6 w-full mb-1" />
            <Skeleton className="h-6 w-full mb-1" />
            <Skeleton className="h-6 w-full mb-1" />
          </>
        ) : !activeOrganization ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No active organization found.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Create an organization first to invite members.
            </p>
          </div>
        ) : (
          <>
            {/* Invite New Member  */}
            <div className="grid gap-2 mb-6">
              <h4 className="text-sm text-muted-foreground ">
                Invite New Member
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isInviting}
                />
                <Select
                  value={role}
                  onValueChange={(value) =>
                    setRole(value as "member" | "admin")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleInviteUserAction}
                  disabled={isInviting}
                  className="btn-white"
                >
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>

              {/* If we got a previewUrl back, show a link to view it */}
              {previewUrl && (
                <p className="text-sm text-blue-600 break-words">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    View invitation email preview
                  </a>
                </p>
              )}

              {/* Shareable Link */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Share this link to invite new members:
                </p>
                <div className="flex gap-2">
                  <Input value={shareableLink} readOnly className="flex-1" />
                  <Button
                    variant="secondary"
                    className="shrink-0"
                    onClick={handleCopyLink}
                    disabled={!shareableLink}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Members and Invitations List */}
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Current Members & Invitations
              </h4>
              {error && (
                <p className="text-sm text-destructive">Error: {error}</p>
              )}

              {isLoading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : (
                <div className="space-y-3">
                  {/*  Current Members */}
                  {visibleMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-md border"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${member.email}`}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.email} • Joined {member.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs  dark:bg-green-500/20  px-6 py-1 rounded-md">
                          Active
                        </span>
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            handleUpdateMemberRole(member.id, value)
                          }
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {/*  Pending Invitations */}
                  {visibleInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-3 rounded-md border bg-yellow-50 dark:bg-yellow-900/20"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage alt={invitation.email} />
                          <AvatarFallback>
                            {invitation.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {invitation.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Invited {invitation.createdAt} • Expires{" "}
                            {invitation.expiresAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                          {invitation.role}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            invitation.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100"
                              : invitation.status === "accepted"
                              ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                              : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
                          }`}
                        >
                          {invitation.status}
                        </span>
                        {invitation.status === "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRevokeInvitation(invitation.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Empty State */}
                  {visibleMembers.length === 0 && invitations.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No members or invitations yet.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Invite your first member to get started!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && total > PAGE_SIZE && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    size="sm"
                    onClick={prevPage}
                    disabled={currentPage <= 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} • Total: {total}
                  </p>
                  <Button
                    size="sm"
                    onClick={nextPage}
                    disabled={currentPage >= totalPages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
