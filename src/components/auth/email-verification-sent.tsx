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
import Link from "next/link";

interface EmailVerificationSentProps {
  email: string;
  previewUrl?: string | null;
  onResend?: () => void;
}

export default function EmailVerificationSent({
  email,
  previewUrl,
  onResend,
}: EmailVerificationSentProps) {
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!onResend) return;

    setIsResending(true);
    try {
      await onResend();
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-primary">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            We&apos;ve sent a verification link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
            <Mail className="h-6 w-6" />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-4">
            Please check your inbox at{" "}
            <span className="font-medium">{email}</span> and click on the
            verification link to activate your account. If you don&apos;t see
            the email within a few minutes, check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {previewUrl && (
            <Button asChild variant="outline" className="w-full">
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open E-mailbox
              </a>
            </Button>
          )}
          {onResend && (
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
          )}
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
