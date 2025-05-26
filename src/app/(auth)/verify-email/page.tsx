"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Inbox,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";

type Status = "verifying" | "success" | "error" | "pending";

export default function VerifyEmailPage() {
  const params = useSearchParams();

  const token = params.get("token");
  const emailParam = params.get("email") || "";
  const [status, setStatus] = useState<Status>(token ? "verifying" : "pending");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) return;

    authClient.verifyEmail(
      { query: { token } },
      {
        onSuccess: () => {
          setStatus("success");
          toast.success("Email verified successfully!");
        },
        onError: (ctx) => {
          setStatus("error");
          toast.error(
            ctx.error.message ||
              "Verification failed. The link may be invalid or expired."
          );
        },
      }
    );
  }, [token]);

  const handleResend = async () => {
    const email = emailParam;
    if (!email) {
      toast.error("Email is required to resend verification");
      return;
    }

    setIsResending(true);
    authClient.sendVerificationEmail(
      { email, callbackURL: "/verify-email" },
      {
        onSuccess: (res) => {
          setIsResending(false);
          setStatus("pending");
          setPreviewUrl(res.data?.previewUrl ?? null);
          toast.success("Verification email sent!");
        },
        onError: (ctx) => {
          setIsResending(false);
          toast.error(ctx.error.message || "Failed to resend email");
        },
      }
    );
  };

  if (status === "pending") {
    return (
      <div className="w-full max-w-md mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We’ve sent a verification link to{" "}
              <span className="font-medium">{emailParam}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <Inbox className="h-12 w-12 text-blue-600 mb-4" />
            <p className="text-center text-sm text-muted-foreground">
              Please click the link in your inbox to verify your email.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {previewUrl && (
              <Button asChild variant="outline" className="w-full">
                <a
                  href={previewUrl}
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
                  Resending…
                </>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (status === "verifying") {
    return (
      <div className="w-full max-w-md mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Verifying Your Email</CardTitle>
            <CardDescription>Please wait…</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-md mx-auto py-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-success">
              Email Verified Successfully!
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Thank you for confirming your email. You&apos;re fully connected
              now.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              You&apos;ve successfully verified your email address and can now
              access all features of OpenNews.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/">Continue to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">
            Verification Failed
          </CardTitle>
          <CardDescription>The link may be invalid or expired.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <XCircle className="h-12 w-12 text-red-600" />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={() => {
              if (!token) return;
              setStatus("verifying");
              authClient.verifyEmail(
                { query: { token } },
                {
                  onSuccess: () => setStatus("success"),
                  onError: () => setStatus("error"),
                }
              );
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Retry Verification
          </Button>
          <Button asChild className="w-full">
            <Link href="/sign-in">
              Back to Sign In <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
