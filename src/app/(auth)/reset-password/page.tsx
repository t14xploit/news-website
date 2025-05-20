"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  KeyRound,
  CheckCircle,
  XCircle,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { sendEmailFromClient } from "@/lib/email/email-client";
import Link from "next/link";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/validation/auth-schema";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    try {
      setIsSubmitting(true);
      setResetError(null);

      await authClient.resetPassword(
        {
          newPassword: data.password,
          token,
        },
        {
          onSuccess: async (response) => {
            setResetSuccess(true);
            toast.success("Password reset successfully");

            const email = response?.data?.email;
            if (email) {
              try {
                await sendEmailFromClient({
                  to: email,
                  subject: "Your password has been reset",
                  html: `
                    <h1>Password Reset Successful</h1>
                    <p>Your password for OpenNews has been successfully reset.</p>
                    <p>If you did not request this change, please contact our support team immediately.</p>
                  `,
                });
              } catch (emailError) {
                console.error("Failed to send confirmation email:", emailError);
              }
            }
          },
          onError: (ctx) => {
            const errorMessage =
              ctx.error.message ||
              "Failed to reset password. The token may have expired.";
            setResetError(errorMessage);
            toast.error(errorMessage);
          },
        }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setResetError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="w-full max-w-md mx-auto py-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-success">
              Password Reset Successful
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Your password has been reset successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              You can now sign in with your new password.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/sign-in">Continue to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto py-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-destructive">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              The password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-destructive/20 text-destructive mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Please request a new password reset link to continue.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/forget-password">Request New Reset Link</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <KeyRound className="h-6 w-6" />
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="password">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="pl-10"
                          {...field}
                        />
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="confirmPassword">
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="pl-10"
                          {...field}
                        />
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {resetError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <XCircle className="h-4 w-4" />
                  <span>{resetError}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
