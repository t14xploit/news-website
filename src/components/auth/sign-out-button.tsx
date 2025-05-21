"use client";

import { useTransition, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface SignOutButtonProps {
  redirectUrl?: string;
  onSignOutSuccess?: () => void;
  children?: ReactNode;
}

export default function SignOutButton({
  redirectUrl,
  onSignOutSuccess,
  children,
  ...props
}: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();

              if (redirectUrl) {
                router.push(redirectUrl);
              }

              if (onSignOutSuccess) {
                onSignOutSuccess();
              }
            },
          },
        });
      } catch (error) {
        console.error("Sign out failed:", error);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      disabled={isPending}
      {...props}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        children || "Sign Out"
      )}
    </Button>
  );
}
