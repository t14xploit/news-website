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
import { Label } from "@/components/ui/label";
import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      image: null,
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    form.setValue("image", null);
    setImagePreview(null);
  };

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setIsSubmitting(true);
      let imageBase64 = "";

      if (data.image) {
        imageBase64 = await convertImageToBase64(data.image);
      }

      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
          image: imageBase64,
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
            toast.error(
              ctx.error.message ?? "An error occurred during sign up"
            );
            if (ctx.error.status === 401) {
              form.setError("email", {
                type: "server",
                message: "Invalid credentials",
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
              sendVerificationEmail(data.email);
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
        callbackURL: "/",
      });

      if (response.data && "previewUrl" in response.data) {
        setEmailPreviewUrl(response.data.previewUrl as string);
      }
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  };

  if (verificationSent) {
    return (
      <EmailVerificationSent email={userEmail} previewUrl={emailPreviewUrl} />
    );
  }

  return (
    <Card className="z-50 rounded-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
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
                        placeholder="Max"
                        {...field}
                        aria-describedby="firstName-error"
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
                        placeholder="Robinson"
                        {...field}
                        aria-describedby="lastName-error"
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
                      {...field}
                      aria-describedby="email-error"
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
                      {...field}
                      aria-describedby="password-error"
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
                      {...field}
                      aria-describedby="passwordConfirmation-error"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-2">
              <Label htmlFor="image">Profile Image (optional)</Label>
              <div className="flex items-end gap-4">
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 w-full">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                    aria-label="Profile image upload"
                  />
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clearImage}
                      aria-label="Clear image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={onSwitchTab}
          >
            Sign In
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
