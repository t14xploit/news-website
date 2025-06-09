"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Inbox,
  ExternalLink,
  Check,
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
import Component from "@/components/auth/3D-earth";

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

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md mx-auto py-6">
            {status === "pending" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Check Your Email</CardTitle>
                  <CardDescription>
                    We’ve sent a verification link to{" "}
                    <span className="font-medium">{emailParam}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8">
                  <div className="mb-6 mt-6 flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                      <Inbox className="h-6 w-6" />
                    </div>
                  </div>
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
                        className="flex items-center justify-center btn-blue"
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
            ) : status === "verifying" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Verifying Your Email</CardTitle>
                  <CardDescription>Please wait…</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            ) : status === "success" ? (
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-success">
                    Email Verified Successfully!
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Thank you for confirming your email. You&apos;re fully
                    connected now.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <div className="mb-8 flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                      <Check className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    You&apos;ve successfully verified your email address and can
                    now access all features of OpenNews.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="btn-blue w-full">
                    <Link href="/">Continue to Home</Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Verification Failed
                  </CardTitle>
                  <CardDescription>
                    The link may be invalid or expired.
                  </CardDescription>
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
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-full h-full">
        <div className="relative w-full h-full">
          <Component />
        </div>
      </div>
    </div>
  );
}
