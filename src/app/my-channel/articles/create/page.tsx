"use client";

import { useUser } from "@/lib/context/user-context";
import { usePlan } from "@/components/subscribe/plan-context";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import CreateArticleForm from "@/components/my-channel/create-article-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default function CreateArticlePage() {
  const { sessionUser, isLoading } = useUser();
  const { currentPlan } = usePlan();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  if (isLoading) {
    return (
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!sessionUser || sessionUser.role !== "editor") {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You are not authorized to create an article. Please upgrade to a
            Business subscription.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!activeOrganization) {
    return redirect("/my-channel/create-channel");
  }

  if (currentPlan !== "Business") {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Upgrade Required</AlertTitle>
          <AlertDescription>
            You need a Business subscription to create articles .
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Create Article</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateArticleForm
            organizationId={activeOrganization.id}
            channelName={activeOrganization.name}
          />
        </CardContent>
      </Card>
    </div>
  );
}
