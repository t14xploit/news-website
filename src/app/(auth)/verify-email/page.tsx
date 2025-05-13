"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
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
import { sendEmailFromClient } from "@/lib/email/email-client";

interface VerificationStatus {
  attempted: boolean;
  success: boolean;
  error: string | null;
  loading: boolean;
  isResending: boolean;
  previewUrl: string | false | null;
  userNotFound: boolean;
}

interface SessionStatus {
  isLoading: boolean;
  isVerified: boolean;
  email: string | null;
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "";
  const callbackURL = searchParams.get("callbackURL") || "/sign-in";

  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>({
      attempted: false,
      success: false,
      error: null,
      loading: !!token,
      isResending: false,
      previewUrl: null,
      userNotFound: false,
    });

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    isLoading: true,
    isVerified: false,
    email: null,
  });

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus((prev) => ({
          ...prev,
          loading: false,
          attempted: true,
        }));
        return;
      }

      try {
        await authClient.verifyEmail(
          { query: { token } },
          {
            onSuccess: async (response) => {
              const userEmail = response.data?.user?.email || email;

              setVerificationStatus({
                loading: false,
                attempted: true,
                success: true,
                error: null,
                isResending: false,
                previewUrl: null,
                userNotFound: false,
              });

              toast.success("Email verified successfully!");

              if (userEmail) {
                try {
                  await sendEmailFromClient({
                    to: userEmail,
                    subject: "Email Verification Successful",
                    html: `
                      <h1>Email Verification Successful</h1>
                      <p>Your email address for UFO News has been successfully verified.</p>
                      <p>You can now enjoy full access to our platform.</p>
                    `,
                  });
                } catch (emailError) {
                  console.error(
                    "Failed to send confirmation email:",
                    emailError
                  );
                }
              }
            },
            onError: (ctx) => {
              const errorMessage =
                ctx.error.message || "Failed to verify email";

              const isUserNotFound =
                ctx.error.code === "USER_NOT_FOUND" ||
                errorMessage.toLowerCase().includes("not found") ||
                ctx.error.status === 404;

              setVerificationStatus({
                loading: false,
                attempted: true,
                success: false,
                error: errorMessage,
                isResending: false,
                previewUrl: null,
                userNotFound: isUserNotFound,
              });

              if (isUserNotFound) {
                toast.error("User not found. Please check your email address.");
              } else {
                toast.error(errorMessage);
              }
            },
          }
        );
      } catch (error) {
        console.error("Email verification error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";

        setVerificationStatus({
          loading: false,
          attempted: true,
          success: false,
          error: errorMessage,
          isResending: false,
          previewUrl: null,
          userNotFound: false,
        });

        toast.error(errorMessage);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, email]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await authClient.getSession(
          {
            query: { disableCookieCache: true },
          },
          {
            onSuccess: (response) => {
              setSessionStatus({
                isLoading: false,
                isVerified: response.data?.user?.emailVerified || false,
                email: response.data?.user?.email || null,
              });

              if (response.data?.user?.emailVerified) {
                setVerificationStatus((prev) => ({
                  ...prev,
                  success: true,
                  loading: false,
                  attempted: true,
                }));
              }
            },
            onError: () => {
              setSessionStatus({
                isLoading: false,
                isVerified: false,
                email: null,
              });
            },
          }
        );
      } catch (error) {
        console.error("Session check error:", error);
        setSessionStatus({
          isLoading: false,
          isVerified: false,
          email: null,
        });
      }
    };

    checkSession();
  }, [verificationStatus.success]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Email address is required to resend verification");
      return;
    }

    try {
      setVerificationStatus((prev) => ({ ...prev, isResending: true }));

      await authClient.sendVerificationEmail(
        {
          email,
          callbackURL: callbackURL || "/verify-email",
        },
        {
          onSuccess: (response) => {
            const previewUrl = response.data?.previewUrl ?? null;

            setVerificationStatus((prev) => ({
              ...prev,
              isResending: false,
              previewUrl,
              userNotFound: false,
            }));

            toast.success("Verification email sent successfully!");
          },
          onError: (ctx) => {
            if (
              ctx.error.code === "USER_NOT_FOUND" ||
              ctx.error.message?.toLowerCase().includes("not found") ||
              ctx.error.status === 404
            ) {
              setVerificationStatus((prev) => ({
                ...prev,
                isResending: false,
                userNotFound: true,
              }));
            } else {
              toast.error(
                ctx.error.message || "Failed to resend verification email"
              );
              setVerificationStatus((prev) => ({
                ...prev,
                isResending: false,
              }));
            }
          },
        }
      );
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error("An unexpected error occurred. Please try again.");

      setVerificationStatus((prev) => ({
        ...prev,
        isResending: false,
      }));
    }
  };

  if (verificationStatus.userNotFound) {
    return <EmailVerificationSent email={email} />;
  }

  if (verificationStatus.loading || sessionStatus.isLoading) {
    return (
      <div className="w-full max-w-md mx-auto py-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl ">
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

  if (verificationStatus.success || sessionStatus.isVerified) {
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
              access all features of UFO News.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild className="w-full">
              <Link href="/">Continue to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (verificationStatus.error) {
    return (
      <div className="w-full max-w-md mx-auto py-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-destructive">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {verificationStatus.error ||
                "We couldn't verify your email address"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              The verification link may have expired or is invalid. Please
              request a new verification link.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 flex-col">
            {email && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendVerification}
                disabled={verificationStatus.isResending}
              >
                {verificationStatus.isResending ? (
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
      previewUrl={verificationStatus.previewUrl}
      onResend={handleResendVerification}
    />
  );
}
