"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  Loader2,
  Mail,
  AtSign,
  Lock,
  ArrowRight,
  ExternalLink,
  RefreshCw,
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { SignInFormValues, signInSchema } from "@/lib/validation/auth-schema";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignInProps {
  onSwitchTab?: () => void;
}

interface VerificationEmailResponse {
  status: boolean;
  previewUrl?: string;
}

export default function SignIn({ onSwitchTab }: SignInProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    try {
      setIsResendingVerification(true);

      const response = await authClient.sendVerificationEmail({
        email: unverifiedEmail,

        callbackURL: `/verify-email`,
      });

      // Response contains a preview URL Nodemailer
      const responseData = response as unknown as {
        data?: VerificationEmailResponse;
      };

      if (responseData.data?.previewUrl) {
        setPreviewUrl(responseData.data.previewUrl);
      }

      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsResendingVerification(false);
    }
  };

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setIsSubmitting(true);
      setUnverifiedEmail(null);
      setPreviewUrl(null);

      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
          callbackURL: "/",
        },
        {
          onRequest: () => {
            setIsSubmitting(true);
          },
          onResponse: () => {
            setIsSubmitting(false);
          },
          onError: (ctx) => {
            if (ctx.error.status === 401) {
              form.setError("email", {
                type: "server",
                message:
                  "We couldn’t find an account with that email. Check the address or Sign Up for a new account.",
              });
              form.setError("password", {
                type: "server",
                message: "Invalid email or password",
              });
              toast.error("Invalid email or password. Please try again.");
            } else if (ctx.error.status === 403) {
              // Email not verified -  403 - email verification is required
              setUnverifiedEmail(data.email);
              form.setError("email", {
                type: "server",
                message: "Please verify your email before signing in",
              });
              toast.error("Please verify your email before signing in.");

              handleResendVerification();
            } else if (ctx.error.code) {
              toast.error(`Error: ${ctx.error.code}`);
            } else {
              toast.error(ctx.error.message || "Failed to sign in");
            }
          },
          onSuccess: () => {
            toast.success("Signed in successfully!");
            router.push("/sign-in");
          },
        }
      );
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
          Sign In
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {unverifiedEmail && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>
              <div className="flex flex-col space-y-3">
                <p className="text-sm">
                  Your email address{" "}
                  <span className="font-medium">{unverifiedEmail}</span> is not
                  verified. Please verify your email before signing in.
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="w-full"
                  >
                    {isResendingVerification ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending verification email...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend verification email
                      </>
                    )}
                  </Button>

                  {previewUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open E-mailbox
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6 flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Mail className="h-6 w-6" />
          </div>
        </div>

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
                      aria-describedby="email-error"
                      icon={<AtSign />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      href="/forget-password"
                      className="text-sm text-primary hover:underline inline-flex items-center"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-describedby="password-error"
                      icon={<Lock />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel
                      htmlFor="rememberMe"
                      className="cursor-pointer inline-flex items-center"
                      onClick={() => field.onChange(!field.value)}
                    >
                      Remember me
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            onClick={onSwitchTab}
            className="text-primary hover:underline inline-flex items-center"
            type="button"
          >
            Sign Up
            <ArrowRight className="ml-1 h-3 w-3" />
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
