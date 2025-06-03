"use client";

import { useTransition, ReactNode, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUser } from "@/lib/context/user-context";

interface SignOutButtonProps {
  redirectUrl?: string;
  onSignOutSuccess?: () => void;
  children?: ReactNode;
}

export default function SignOutButton({
  redirectUrl = "/sign-in",
  onSignOutSuccess,
  children,
  ...props
}: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { refetchUser } = useUser();

  const handleSignOut = (e: MouseEvent) => {
    e.stopPropagation();

    e.preventDefault();

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));

      try {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              refetchUser();
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
