"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { Loader2 } from "lucide-react";
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
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/validation/auth-schema";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

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
            toast.error(
              ctx.error.message ||
                "Failed to reset password. The token may have expired."
            );
          },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto py-6">
        <CardHeader>
          <CardTitle>Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been reset successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You can now sign in with your new password.</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push("/sign-in")}>
            Continue to Sign In
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Card className="z-50 rounded-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <div className="text-center text-red-500">
              Invalid or expired reset token. Please request a new password
              reset.
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">New Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          {...field}
                        />
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
                        <Input
                          id="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
