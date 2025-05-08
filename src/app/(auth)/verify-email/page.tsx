"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import EmailVerificationSent from "@/components/auth/email-verification-sent";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "";
  const callbackURL = searchParams.get("callbackURL") || "/sign-in";

  const [isVerifying, setIsVerifying] = useState(!!token);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [autoRedirecting, setAutoRedirecting] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        return;
      }

      try {
        await authClient.verifyEmail(
          { query: { token } },
          {
            onError: (ctx) => {
              setError(ctx.error.message || "Failed to verify email");
              setIsVerifying(false);
            },
            onSuccess: (response) => {
              setIsSuccess(true);
              setIsVerifying(false);

              if (response.data?.session) {
                setAutoRedirecting(true);

                setTimeout(() => {
                  router.push(callbackURL);
                }, 3000);
              }
            },
          }
        );
      } catch (error) {
        console.error("Email verification error:", error);
        setError("An unexpected error occurred. Please try again.");
        setIsVerifying(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setIsVerifying(false);
    }
  }, [token, callbackURL, router]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Email address is required to resend verification");
      return;
    }

    try {
      setIsResending(true);
      await authClient.sendVerificationEmail(
        {
          email,
          callbackURL: callbackURL || "/sign-in",
        },
        {
          onError: (ctx) => {
            toast.error(
              ctx.error.message || "Failed to resend verification email"
            );
          },
          onSuccess: (response) => {
            if (response.data?.previewUrl) {
              setPreviewUrl(response.data.previewUrl);
            }
            toast.success("Verification email sent successfully!");
          },
        }
      );
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Verifying Your Email
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Email Verified</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Your email address has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              You can now access all features of our platform.
            </p>
            {autoRedirecting && (
              <p className="text-center text-sm mt-2 text-muted-foreground animate-pulse">
                You&apos;re being signed in automatically...
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {!autoRedirecting && (
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-destructive">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {error || "We couldn't verify your email address"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              The verification link may have expired or is invalid.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 flex-col">
            {email && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendVerification}
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
            )}
            <Button asChild className="w-full">
              <Link href="/sign-in">Return to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <EmailVerificationSent
      email={email}
      previewUrl={previewUrl}
      onResend={handleResendVerification}
    />
  );
}
