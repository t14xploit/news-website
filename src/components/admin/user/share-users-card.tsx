"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Copy, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RawUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  banned?: boolean | null;
  createdAt: string;
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: "user" | "editor" | "admin";
  banned: boolean;
  createdAt: string;
}

const PAGE_SIZE = 10;

export default function ShareUsersCard() {
  const [copied, setCopied] = useState(false);
  const shareableLink =
    typeof window !== "undefined"
      ? window.location.href.replace("/admin/users", "/invite") // example: adjust to your “invite” or sharing path
      : "https://example.com/invite";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<"user" | "editor" | "admin">("user");

  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banUserId, setBanUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState<string>("");
  const [banExpiresIn, setBanExpiresIn] = useState<number>(60 * 60 * 24 * 7);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.admin.listUsers({
        query: {
          limit: PAGE_SIZE,
          offset,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to load users");
      }

      const rawUsers: RawUser[] = Array.isArray(result.data?.users)
        ? (result.data.users as RawUser[])
        : [];

      const rows: UserRow[] = rawUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name ?? "",
        role: u.role as "user" | "editor" | "admin",
        banned: !!u.banned,
        createdAt: new Date(u.createdAt).toLocaleString(),
      }));

      setUsers(rows);
      setTotal(result.data.total ?? 0);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const prevPage = () => setOffset((prev) => Math.max(prev - PAGE_SIZE, 0));
  const nextPage = () =>
    setOffset((prev) =>
      Math.min(prev + PAGE_SIZE, (totalPages - 1) * PAGE_SIZE)
    );

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      const res = await authClient.admin.removeUser({ userId });
      if (res.error) throw new Error(res.error.message || "Delete failed");
      toast.success("User deleted");
      fetchUsers();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      toast.error(msg);
    }
  };

  const openRoleDialog = (userId: string, currentRole: string) => {
    setSelectedUserId(userId);
    setNewRole(currentRole as "user" | "editor" | "admin");
    setRoleDialogOpen(true);
  };

  const handleSetRole = async () => {
    if (!selectedUserId) return;
    try {
      const res = await authClient.admin.setRole({
        userId: selectedUserId,
        role: newRole,
      });
      if (res.error) throw new Error(res.error.message || "Role change failed");
      toast.success("Role updated");
      setRoleDialogOpen(false);
      fetchUsers();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      toast.error(msg);
    }
  };

  const openBanDialog = (userId: string) => {
    setBanUserId(userId);
    setBanReason("");
    setBanExpiresIn(60 * 60 * 24 * 7);
    setBanDialogOpen(true);
  };

  const handleBan = async () => {
    if (!banUserId) return;
    try {
      const res = await authClient.admin.banUser({
        userId: banUserId,
        banReason: banReason || undefined,
        banExpiresIn,
      });
      if (res.error) throw new Error(res.error.message || "Ban failed");
      toast.success("User banned");
      setBanDialogOpen(false);
      fetchUsers();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      toast.error(msg);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      const res = await authClient.admin.unbanUser({ userId });
      if (res.error) throw new Error(res.error.message || "Unban failed");
      toast.success("User unbanned");
      fetchUsers();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      toast.error(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Copy “Invite” link to share. Below is your current user list.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={shareableLink} readOnly className="flex-1" />
            <Button
              variant="secondary"
              className="shrink-0"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "Copied!" : "Copy Invite Link"}
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">People with Access</h4>
            {error && (
              <p className="text-sm text-destructive">Error: {error}</p>
            )}
            <div className="space-y-2">
              {isLoading && (
                <p className="text-sm text-muted-foreground">Loading...</p>
              )}

              {!isLoading && users.length === 0 && (
                <p className="text-sm text-muted-foreground">No users found.</p>
              )}

              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-4 border rounded-lg p-3 bg-white"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={undefined} alt={u.name || u.email} />
                      <AvatarFallback className="text-xs">
                        {u.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()
                          .padEnd(2, " ")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">
                        {u.name || "Unnamed"}
                      </p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      onValueChange={() => openRoleDialog(u.id, u.role)}
                      value={u.role}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    {u.banned ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnban(u.id)}
                      >
                        Unban
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openBanDialog(u.id)}
                      >
                        Ban
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {!isLoading && users.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <Button
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <Button
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>

        <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
          <DialogTrigger asChild>
            <div />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <label className="text-sm font-medium">Select New Role</label>
              <Select
                onValueChange={(val) =>
                  setNewRole(val as "user" | "editor" | "admin")
                }
                value={newRole}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRoleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSetRole}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
          <DialogTrigger asChild>
            <div />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Ban User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div>
                <label className="block text-sm font-medium">Ban Reason</label>
                <Input
                  type="text"
                  placeholder="Spamming, policy violation…"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Ban Duration (seconds)
                </label>
                <Input
                  type="number"
                  value={banExpiresIn}
                  onChange={(e) => setBanExpiresIn(Number(e.target.value))}
                  className="mt-1 w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Default is 7 days
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBan}>
                Ban User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <CardFooter className="text-xs text-muted-foreground">
          Total users: {total} (page {currentPage} of {totalPages})
        </CardFooter>
      </Card>
    </div>
  );
}
