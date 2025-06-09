"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

const PAGE_SIZE = 10;

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
  role: string;
  banned: boolean;
  createdAt: string;
}

export default function ManageUsers() {
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
  const [banExpiresIn, setBanExpiresIn] = useState<number>(60 * 60 * 24 * 7); // default 7 days

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
        role: u.role,
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

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      const res = await authClient.admin.removeUser({ userId });
      if (res.error) {
        throw new Error(res.error.message || "Delete failed");
      }
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
      if (res.error) {
        throw new Error(res.error.message || "Role change failed");
      }
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
      if (res.error) {
        throw new Error(res.error.message || "Ban failed");
      }
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
      if (res.error) {
        throw new Error(res.error.message || "Unban failed");
      }
      toast.success("User unbanned");
      fetchUsers();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      toast.error(msg);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  const prevPage = () => {
    setOffset((prev) => Math.max(prev - PAGE_SIZE, 0));
  };
  const nextPage = () => {
    setOffset((prev) =>
      Math.min(prev + PAGE_SIZE, (totalPages - 1) * PAGE_SIZE)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>

        {/* <div className="flex justify-end"> */}
        <Button
          onClick={() => fetchUsers()}
          disabled={isLoading}
          variant={"outline"}
        >
          {isLoading ? "Loading..." : "Refresh Users"}
        </Button>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Ban Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="text-xs">{u.id}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.banned ? "Banned" : "Active"}</TableCell>
                <TableCell className="text-xs">{u.createdAt}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => openRoleDialog(u.id, u.role)}
                    className="btn-white"
                  >
                    Change Role
                  </Button>

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
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <Button
          size="sm"
          onClick={prevPage}
          variant={"secondary"}
          disabled={currentPage <= 1 || isLoading}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size="sm"
          onClick={nextPage}
          variant={"secondary"}
          disabled={currentPage >= totalPages || isLoading}
        >
          Next
        </Button>
      </div>

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
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
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
                placeholder="Spamming, policy violation..."
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
              <p className="text-xs text-muted-foreground">Default is 7 days</p>
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
    </div>
  );
}
