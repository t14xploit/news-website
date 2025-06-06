"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
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
  User,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  Zap,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import {
  SignInFormValues,
  signInSchema,
  signUpSchema,
} from "@/lib/validation/auth-schema";
import { useUser } from "@/lib/context/user-context";
import { z } from "zod";

// Компонент EmailVerificationSent
const EmailVerificationSent = ({
  email,
  previewUrl,
}: {
  email: string;
  previewUrl?: string;
}) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
        <Mail className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
        <p className="text-white/70">
          We&apos;ve sent a verification link to{" "}
          <span className="font-medium text-white">{email}</span>
        </p>
      </div>
      {previewUrl && (
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Email Preview
          </a>
        </Button>
      )}
    </div>
  );
};

// Animated Background Component
const AnimatedBackground = ({ isSignUp }: { isSignUp: boolean }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ${
          isSignUp
            ? "from-purple-600 via-blue-600 to-indigo-800"
            : "from-blue-600 via-indigo-600 to-purple-800"
        }`}
      />
      <div className="absolute inset-0">
        <div
          className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10 animate-pulse transition-all duration-1000 ${
            isSignUp ? "animate-bounce" : ""
          }`}
        />
        <div
          className={`absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-white/5 animate-pulse delay-300 transition-all duration-1000 ${
            isSignUp ? "animate-ping" : ""
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-white/15 animate-pulse delay-700 transition-all duration-1000 ${
            isSignUp ? "animate-spin" : ""
          }`}
        />
      </div>
      <div
        className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30`}
      />
      <div className="absolute inset-0">
        <Shield className="absolute top-1/3 left-1/6 w-8 h-8 text-white/20 animate-float" />
        <Sparkles className="absolute top-2/3 right-1/6 w-6 h-6 text-white/15 animate-float-delayed" />
        <Zap className="absolute top-1/6 right-1/3 w-7 h-7 text-white/10 animate-float-slow" />
        <Globe className="absolute bottom-1/4 left-1/2 w-9 h-9 text-white/25 animate-float" />
      </div>
    </div>
  );
};

// Enhanced Sign In Component
const EnhancedSignIn = ({ onSwitchTab }: { onSwitchTab?: () => void }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { sessionUser, refetchUser } = useUser();

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
    setIsResendingVerification(true);
    try {
      const response = await authClient.sendVerificationEmail({
        email: unverifiedEmail,
        callbackURL: "/verify-email",
      });
      const responseData = response as unknown as {
        data?: { previewUrl?: string };
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
        },
        {
          onRequest: () => setIsSubmitting(true),
          onResponse: () => setIsSubmitting(false),
          onError: (ctx) => {
            if (ctx.error.status === 401) {
              form.setError("email", {
                type: "server",
                message:
                  "We couldn't find an account with that email. Check the address or Sign Up for a new account.",
              });
              form.setError("password", {
                type: "server",
                message: "Invalid email or password",
              });
              toast.error("Invalid email or password. Please try again.");
            } else if (ctx.error.status === 403) {
              setUnverifiedEmail(data.email);
              form.setError("email", {
                type: "server",
                message: "Please verify your email before signing in",
              });
              toast.error("Please verify your email before signing in.");
              handleResendVerification();
            } else {
              toast.error(ctx.error.message || "Failed to sign in");
            }
          },
          onSuccess: async () => {
            toast.success("Signed in successfully!");
            await refetchUser();
            if (sessionUser?.role === "admin") {
              router.push("/admin");
            } else {
              router.push("/");
            }
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
    <div className="space-y-6">
      {unverifiedEmail && (
        <Alert
          variant="destructive"
          className="bg-red-500/10 border-red-500/20"
        >
          <AlertDescription>
            <div className="flex flex-col space-y-3">
              <p className="text-sm">
                Your email address{" "}
                <span className="font-medium">{unverifiedEmail}</span> is not
                verified.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={isResendingVerification}
                  className="w-full bg-white/5 border-white/20 hover:bg-white/10"
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
                    className="w-full bg-white/5 border-white/20 hover:bg-white/10"
                  >
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Email Preview
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-white/70">Sign in to your account to continue</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="m@example.com"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-white">Password</FormLabel>
                  <Link
                    href="/forget-password"
                    className="text-sm text-blue-300 hover:text-blue-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-white/30 data-[state=checked]:bg-blue-600"
                  />
                </FormControl>
                <FormLabel className="text-white/80 cursor-pointer">
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-white/70">
          Don&apos;t have an account?{" "}
          <button
            onClick={onSwitchTab}
            className="text-blue-300 hover:text-blue-200 font-medium underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

// Enhanced Sign Up Component
const EnhancedSignUp = ({ onSwitchTab }: { onSwitchTab?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | undefined>();

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
          onRequest: () => setIsSubmitting(true),
          onResponse: () => setIsSubmitting(false),
          onError: (ctx) => {
            toast.error(
              ctx.error.message ?? "An error occurred during sign up"
            );
            if (ctx.error.status === 401) {
              form.setError("email", {
                type: "server",
                message:
                  "We couldn't find an account with that email. Check the address or Sign Up for a new account.",
              });
            }
          },
          onSuccess: (ctx) => {
            toast.success(
              "Account created successfully! Please verify your email."
            );
            setUserEmail(form.getValues("email"));
            const responseData = ctx.data as
              | { previewUrl?: string }
              | undefined;
            setEmailPreviewUrl(responseData?.previewUrl);
            setVerificationSent(true);
          },
        }
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      console.error("Sign-up error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationSent) {
    return (
      <EmailVerificationSent email={userEmail} previewUrl={emailPreviewUrl} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="text-white/70">Sign up to get started with our service</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">First Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <Input
                        {...field}
                        placeholder="John"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Last Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <Input
                        {...field}
                        placeholder="Doe"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                      />
                    </div>
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
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="m@example.com"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Sign Up
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-white/70">
          Already have an account?{" "}
          <button
            onClick={onSwitchTab}
            className="text-blue-300 hover:text-blue-200 font-medium underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

// Main Auth Page Component
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("sign-in");
  const { sessionUser, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isSignUp = activeTab === "sign-up";

  useEffect(() => {
    if (!isLoading && sessionUser) {
      console.log("AuthPage: User authenticated, redirecting to /");
      router.replace(sessionUser.role === "admin" ? "/admin" : "/");
    }
  }, [sessionUser, isLoading, router]);

  useEffect(() => {
    if (pathname) {
      setActiveTab(pathname.includes("sign-up") ? "sign-up" : "sign-in");
    }
  }, [pathname]);

  return (
    <>
      <AnimatedBackground isSignUp={isSignUp} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto overflow-hidden bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-white/10 rounded-none">
              <TabsTrigger
                value="sign-in"
                className="data-[state=active]:bg-white/10 text-white data-[state=active]:shadow-none rounded-none"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="sign-up"
                className="data-[state=active]:bg-white/10 text-white data-[state=active]:shadow-none rounded-none"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <CardContent className="p-6">
              <TabsContent value="sign-in" className="mt-0">
                <EnhancedSignIn onSwitchTab={() => setActiveTab("sign-up")} />
              </TabsContent>
              <TabsContent value="sign-up" className="mt-0">
                <EnhancedSignUp onSwitchTab={() => setActiveTab("sign-in")} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </>
  );
}

export { AuthPage };
