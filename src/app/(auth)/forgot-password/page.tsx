"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Mail, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/lib/validation/auth-schema";

interface AuthError extends Error {
  code?: string;
  status?: number;
  message: string;
}

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [emailAttempted, setEmailAttempted] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetState = () => {
    setIsEmailSent(false);
    setUserNotFound(false);
    setEmailAttempted("");
    setPreviewUrl(null);
    form.reset();
  };

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsSubmitting(true);
      setEmailAttempted(data.email);

      await authClient.forgetPassword(
        {
          email: data.email,
          redirectTo: `${window.location.origin}/reset-password`,
        },
        {
          onRequest: () => {
            setIsSubmitting(true);
          },
          onResponse: () => {
            setIsSubmitting(false);
          },
          onError: (ctx) => {
            const errorMessage =
              ctx.error.message || "Failed to send reset email";
            const errorCode = ctx.error.code || "";

            if (
              errorMessage.includes("not found") ||
              errorCode === "USER_NOT_FOUND" ||
              ctx.error.status === 404
            ) {
              setUserNotFound(true);
            } else {
              toast.error(errorMessage);
            }
          },
          onSuccess: (response) => {
            setIsEmailSent(true);

            if (response.data?.previewUrl) {
              setPreviewUrl(response.data.previewUrl);
            }
            toast.success("Password reset link sent successfully!");
          },
        }
      );
    } catch (error: unknown) {
      console.error("Password reset error:", error);

      const authError = error as AuthError;

      if (
        authError?.message?.includes("not found") ||
        authError?.code === "USER_NOT_FOUND" ||
        authError?.status === 404
      ) {
        setUserNotFound(true);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userNotFound) {
    return (
      <div className="w-full max-w-md mx-auto py-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-destructive">
              No Account Found
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              We couldn&apos;t find an account with this email address
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-destructive/20 text-destructive mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-center text-sm text-muted-foreground mb-4">
              The email <span className="font-medium">{emailAttempted}</span>{" "}
              doesn&apos;t seem to be registered in our system. Please check for
              typos or use a different email address.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button variant="default" className="w-full" onClick={resetState}>
              Try with a different email
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isEmailSent) {
    return (
      <div className="w-full max-w-md mx-auto py-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-success">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              We&apos;ve sent a password reset link to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Please check your inbox at{" "}
              <span className="font-medium">{emailAttempted}</span>. If the
              email doesn&apos;t appear within a few minutes, check your spam
              folder.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {previewUrl && (
              <Button asChild variant="outline" className="w-full">
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open E-mailbox
                </a>
              </Button>
            )}
            <Button variant="secondary" className="w-full" onClick={resetState}>
              Try with a different email
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Remember your password?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Forgot Password</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
