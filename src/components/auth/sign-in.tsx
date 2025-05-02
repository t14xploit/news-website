"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
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
import {
  signInSchema,
  type SignInFormValues,
} from "@/lib/validation/auth-schema";

interface SignInProps {
  switchToTab?: string;
  onSwitchTab?: () => void;
}

export default function SignIn({ switchToTab, onSwitchTab }: SignInProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSwitch = () => {
    if (onSwitchTab) {
      onSwitchTab();
    }
  };

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema) as any,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setIsSubmitting(true);

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
                message: "Invalid email or password",
              });
              form.setError("password", {
                type: "server",
                message: "Invalid email or password",
              });
              toast.error("Invalid email or password. Please try again.");
            } else if (ctx.error.status === 403) {
              form.setError("email", {
                type: "server",
                message: "Please verify your email before signing in",
              });
              toast.error("Please verify your email before signing in.");
            } else {
              toast.error(ctx.error.message || "Failed to sign in");
            }
          },
          onSuccess: () => {
            toast.success("Signed in successfully!");
            router.push("/");
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
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
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
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="rememberMe">Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
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
            className="text-primary hover:underline"
            type="button"
          >
            Sign Up
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
