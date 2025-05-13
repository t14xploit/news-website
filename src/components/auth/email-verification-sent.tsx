"use client";

import { useState } from "react";
import { Mail, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface VerificationEmailResponse {
  status: boolean;
  previewUrl?: string | false;
}

interface EmailVerificationSentProps {
  email?: string;
  previewUrl?: string | null | false;
  onResend?: () => void;
}

export default function EmailVerificationSent({
  email = "",
  previewUrl,
  onResend,
}: EmailVerificationSentProps) {
  const [isResending, setIsResending] = useState(false);
  const [localEmail] = useState(email);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null | false>(
    previewUrl || null
  );

  const handleResend = async () => {
    if (!localEmail) {
      toast.error("Email address is required to resend verification");
      return;
    }

    setIsResending(true);
    try {
      if (onResend) {
        await onResend();
      } else {
        const response = await authClient.sendVerificationEmail({
          email: localEmail,
          callbackURL: `${window.location.origin}/verify-email`,
        });

        if (response.error) {
          toast.error(
            response.error.message || "Failed to send verification email"
          );
        } else {
          const data = response.data as VerificationEmailResponse;
          if (data?.previewUrl) {
            setLocalPreviewUrl(data.previewUrl);
          }
          toast.success("Verification email sent successfully!");
        }
      }
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto ">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-success">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            We&apos;ve sent a verification link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-4">
            <Mail className="h-6 w-6" />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-4">
            Please check your inbox at{" "}
            <span className="font-medium">{localEmail}</span> and click on the
            verification link to activate your account. If you don&apos;t see
            the email within a few minutes, check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {(localPreviewUrl || previewUrl) && (
            <Button asChild variant="outline" className="w-full">
              <a
                href={(localPreviewUrl || previewUrl)?.toString() || "#"}
                onClick={(e) => {
                  if (!(localPreviewUrl || previewUrl)) {
                    e.preventDefault();
                    toast.error("Email preview URL is not available");
                  }
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open E-mailbox
              </a>
            </Button>
          )}
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
          <p className="text-sm text-center text-muted-foreground pt-2">
            Already verified?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
