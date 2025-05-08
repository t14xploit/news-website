"use client";

import { Mail } from "lucide-react";
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
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
      <Card className="max-w-md w-full">
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
            <span className="font-medium">{email}</span>. Please check your
            inbox and click on the verification link to activate your account.
            If you don&apos;t see the email within a few minutes, check your
            spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {previewUrl && (
            <Button asChild variant="outline" className="w-full">
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <Mail className="mr-2 h-4 w-4" />
                Open E-mailbox
              </a>
            </Button>
          )}
          {onResend && (
            <Button variant="secondary" className="w-full" onClick={onResend}>
              Resend verification email
            </Button>
          )}
          <p className="text-sm text-center text-muted-foreground">
            Already verified?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
