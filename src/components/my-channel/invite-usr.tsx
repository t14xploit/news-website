"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Copy, Trash2 } from "lucide-react";

type Permission = "member" | "admin" | "owner";

interface Row {
  id: string;
  name: string;
  email: string;
  initials: string;
  type: "member" | "invitation";
  permission: Permission;
  createdAt: string;
}

export default function ShareOrganizationCard() {
  const [copied, setCopied] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [link, setLink] = useState("");
  const { data: org } = authClient.useActiveOrganization();

  const mockExtras = useMemo<Row[]>(
    () => [
      {
        id: "mock-1",
        name: "Jane Doe",
        email: "jane.doe@mock.com",
        initials: "JD",
        type: "member",
        permission: "member",
        createdAt: "01/01/2023",
      },
      {
        id: "mock-2",
        name: "Bob Smith",
        email: "bob.smith@mock.com",
        initials: "BS",
        type: "member",
        permission: "admin",
        createdAt: "02/15/2023",
      },
      {
        id: "mock-3",
        name: "Alice Johnson",
        email: "alice.johnson@mock.com",
        initials: "AJ",
        type: "member",
        permission: "owner",
        createdAt: "03/10/2023",
      },
    ],
    []
  );

  const fetchRows = useCallback(async () => {
    if (!org?.id) return;
    setLink(
      `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/accept-invitation/${org.id}`
    );

    const invRes = await authClient.organization.listInvitations({
      query: { organizationId: org.id },
    });
    const invs = invRes.data ?? [];

    const fullRes = await authClient.organization.getFullOrganization({
      query: { organizationId: org.id },
    });
    const mems = fullRes.data?.members ?? [];

    const fetchedRows: Row[] = [
      ...invs.map((i) => ({
        id: i.id,
        name: i.email,
        email: i.email,
        initials: i.email[0].toUpperCase(),
        type: "invitation" as const,
        permission: i.role as Permission,
        createdAt: new Date(i.expiresAt).toLocaleDateString(),
      })),
      ...mems.map((m) => ({
        id: m.id,
        name: m.user.name || m.user.email,
        email: m.user.email,
        initials: (m.user.name || m.user.email)[0].toUpperCase(),
        type: "member" as const,
        permission: m.role as Permission,
        createdAt: new Date(m.createdAt).toLocaleDateString(),
      })),
    ];

    setRows([...fetchedRows, ...mockExtras]);
  }, [org?.id, mockExtras]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = async (
    id: string,
    newRole: Permission,
    type: Row["type"],
    email?: string
  ) => {
    try {
      if (type === "invitation" && email) {
        await authClient.organization.inviteMember({
          email,
          role: newRole,
          organizationId: org!.id,
          resend: true,
        });
      } else {
        await authClient.organization.updateMemberRole({
          memberId: id,
          role: newRole,
        });
      }
      toast.success("Updated");
      fetchRows();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    }
  };

  const handleRevoke = async (id: string, type: Row["type"]) => {
    try {
      if (type === "invitation") {
        await authClient.organization.cancelInvitation({ invitationId: id });
      } else {
        await authClient.organization.removeMember({
          memberIdOrEmail: id,
          organizationId: org!.id,
        });
      }
      toast.success("Removed");
      fetchRows();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Share this organization</CardTitle>
          <CardDescription>
            Anyone with the link can join as invited.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={link} readOnly className="flex-1" />
            <Button variant="secondary" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">People with access</h4>
            <div className="space-y-4">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={undefined} alt={r.name} />
                      <AvatarFallback className="text-xs">
                        {r.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">
                        {r.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{r.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={r.permission}
                      onValueChange={(v) =>
                        handleChange(r.id, v as Permission, r.type, r.email)
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
                      onClick={() => handleRevoke(r.id, r.type)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
