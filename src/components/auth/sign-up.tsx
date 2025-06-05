"use client";

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
import { useState } from "react";
import { Loader2, User, Mail, Lock, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { signUpSchema } from "@/lib/validation/auth-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import EmailVerificationSent from "./email-verification-sent";

interface SignUpProps {
  onSwitchTab?: () => void;
}

interface SignUpResponseData {
  previewUrl?: string;
}

export default function SignUp({ onSwitchTab }: SignUpProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | undefined>(
    undefined
  );

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setIsSubmitting(true);

      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
          callbackURL: "/verify-email",
        },
        {
          onRequest: () => {
            setIsSubmitting(true);
          },
          onResponse: () => {
            setIsSubmitting(false);
          },
          onError: (ctx) => {
            toast.error(
              ctx.error.message ?? "An error occurred during sign up"
            );
            if (ctx.error.status === 401) {
              form.setError("email", {
                type: "server",
                message:
                  "We couldn’t find an account with that email. Check the address or Sign Up for a new account.",
              });
            }
          },
          onSuccess: (ctx) => {
            toast.success(
              "Account created successfully! Please verify your email."
            );
            setUserEmail(form.getValues("email"));

            const responseData = ctx.data as SignUpResponseData | undefined;
            setEmailPreviewUrl(responseData?.previewUrl);

            setVerificationSent(true);

            if (!responseData?.previewUrl) {
              sendVerificationEmail(data.email); // Trigger sendVerificationEmail after successful signup
            }
          },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Sign-up error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const response = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/verify-email",
      });

      if (response.data && "previewUrl" in response.data) {
        setEmailPreviewUrl(response.data.previewUrl as string);
      }
    } catch (error) {
      console.error("Failed to send verification email:", error);
      toast.error("Failed to send verification email");
    }
  };

  if (verificationSent) {
    return (
      <EmailVerificationSent email={userEmail} previewUrl={emailPreviewUrl} />
    );
  }
  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
          Sign Up
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>

      {/* Hz, posmotrim */}
      <div className="mb-6 flex justify-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
          <Mail className="h-6 w-6" />
        </div>
      </div>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="firstName">First name</FormLabel>
                    <FormControl>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Max"
                        autoComplete="given-name"
                        aria-describedby="firstName-error"
                        icon={<User />}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="lastName">Last name</FormLabel>
                    <FormControl>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Robinson"
                        autoComplete="family-name"
                        aria-describedby="lastName-error"
                        icon={<User />}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                      icon={<Mail />}
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
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
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
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="passwordConfirmation">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="passwordConfirmation"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      aria-describedby="passwordConfirmation-error"
                      icon={<Lock />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full btn-blue"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...{" "}
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            className="text-primary hover:underline inline-flex items-center"
            type="button"
            onClick={onSwitchTab}
          >
            Sign In
            <ArrowRight className="ml-1 h-3 w-3" />
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
