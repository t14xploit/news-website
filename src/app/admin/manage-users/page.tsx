"use client";
import { authClient } from "@/lib/auth-client";
import { User } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState,  useTransition, useEffect } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdmin } from "@/actions/admin/create-admin"; // Import the server action
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { createAdminSchema } from "@/lib/validation/auth-schema"; // Import the Zod schema

type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterRole, setFilterRole] = useState('');
  const [isUpdating, startTransition] = useTransition();
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false); // State for the create admin form
  const [createAdminSuccess, setCreateAdminSuccess] = useState(false);
  const [createAdminError, setCreateAdminError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateAdminFormValues>({
      resolver: zodResolver(createAdminSchema),
      defaultValues: {
          email: '',
          password: '',
          name: '',
      },
  });

  // Check user role on the server side to protect route [AI KNOWLEDGE]({})
    const [session, setSession] = useState(null);
  useEffect(() => {
    const getSessionData = async () => {
        const sessionData = await auth.api.getSession({ headers: {} });
        setSession(sessionData);
    };
    getSessionData();
  }, []);

  useEffect(() => {
      if (session && (!session || session.data?.user?.role !== 'admin')) {
        redirect("/sign-in"); // Redirect to sign-in if not admin [AI KNOWLEDGE]({})
      }
  }, [session]);

  useEffect(() => {
      fetchUsers();
  }, [searchQuery, sortBy, sortDirection, filterRole]);

  const fetchUsers =  () => {
      setIsFetching(true);
       authClient.admin.listUsers({
              query: {
                  searchField: "email",
                  searchOperator: "contains",
                  searchValue: searchQuery,
                  sortBy,
                  sortDirection,
                  filterField: "role",
                  filterOperator: "eq",
                  filterValue: filterRole,
              },
          }).then((data) => {
              setUsers(data.data);
          }).catch((error) => {
               toast.error("Failed to fetch users");
              console.error("Failed to fetch users:", error);
          }).finally(() => {
              setIsFetching(false);
          });
  };

  const handleRoleChange =  (userId: string, newRole: string) => {
    startTransition(async () => {
      try {
        await authClient.admin.setRole({ userId, role: newRole });
        toast.success(`Role updated for user`);
         fetchUsers(); // Refresh the user list after role change
      } catch (error) {
        toast.error("Failed to update role");
        console.error("Failed to update role:", error);
      }
    });
  };
  const handleBanUser =  (userId: string) => {
      startTransition(async () => {
          try {
              await authClient.admin.banUser({ userId, banReason: "Admin Ban" });
              toast.success("User banned successfully.");
               fetchUsers();
          } catch (error) {
              toast.error("Failed to ban user.");
              console.error("Failed to ban user:", error);
          }
      });
  };

  const handleUnbanUser =  (userId: string) => {
      startTransition(async () => {
          try {
              await authClient.admin.unbanUser({ userId });
              toast.success("User unbanned successfully.");
               fetchUsers();
          } catch (error) {
              toast.error("Failed to unban user.");
              console.error("Failed to unban user:", error);
          }
      });
  };

  const handleImpersonateUser =  (userId: string) => {
      try {
          const { data, error } =  authClient.admin.impersonateUser({ userId });
          if(error){
              toast.error("Failed to impersonate user.");
              return;
          }
          window.location.href = "/";
      } catch (error) {
          toast.error("Failed to impersonate user.");
          console.error("Failed to impersonate user:", error);
      }
  };

  const onSubmit =  (data: CreateAdminFormValues) => {
    setIsCreatingAdmin(true);
    setCreateAdminSuccess(false);
    setCreateAdminError(null);

    createAdmin(data.email, data.password, data.name)
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          fetchUsers(); // Refresh the user list
          reset();
        } else {
          setCreateAdminError(result.message);
          toast.error(result.message);
        }
      })
      .catch((error: any) => {
        console.error("Error creating admin user:", error);
        setCreateAdminError(error?.message || "An unexpected error occurred.");
        toast.error(error?.message || "An unexpected error occurred.");
      })
      .finally(() => {
        setIsCreatingAdmin(false);
      });
  };

  return (
      <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
          {/* Add search and filter controls here */}
          <Input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
          />
          <Select
              onValueChange={(value) => setFilterRole(value)}
          >
              <SelectTrigger className="w-[180px] mb-2">
                  <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
          </Select>

          {/* Add Create Admin Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="flex space-x-2">
              <Input type="email" name="email" placeholder="Admin Email" {...register("email")} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              <Input type="text" name="name" placeholder="Admin Name" {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              <Input type="password" name="password" placeholder="Password" {...register("password")} />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              <Button type="submit" disabled={isCreatingAdmin}>
                {isCreatingAdmin ? 'Creating...' : 'Create Admin'}
              </Button>
            </div>
              {createAdminError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{createAdminError}</AlertDescription>
                </Alert>
              )}
              {createAdminSuccess && (
                <Alert variant="success" className="mt-2">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Admin user created successfully!</AlertDescription>
                </Alert>
              )}
          </form>

          <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead>Status</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {isFetching ? (
                      <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
                  ) : (
                      users.map((user) => (
                          <TableRow key={user.id}>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                              <Select onValueChange={(newRole) => handleRoleChange(user.id, newRole)}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue value={user.role} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">user</SelectItem>
                                    <SelectItem value="editor">editor</SelectItem>
                                    <SelectItem value="admin">admin</SelectItem>
                                </SelectContent>
                              </Select>
                              </TableCell>
                              <TableCell>
                                  <Button variant="outline" onClick={() => handleImpersonateUser(user.id)} disabled={isUpdating}>Impersonate</Button>
                                  {user.banned ? (
                                      <Button variant="secondary" onClick={() => handleUnbanUser(user.id)} disabled={isUpdating}>Unban</Button>
                                  ) : (
                                      <Button variant="destructive" onClick={() => handleBanUser(user.id)} disabled={isUpdating}>Ban</Button>
                                  )}

                              </TableCell>
                              <TableCell>
                                {user.banned ? "Banned" : "Active"}
                              </TableCell>
                          </TableRow>
                      ))
                  )}
              </TableBody>
          </Table>
      </div>
  );
}
