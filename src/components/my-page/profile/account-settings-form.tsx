"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { usePlan } from "@/components/subscribe/plan-context";
import {
  profileSchema as baseProfileSchema,
  passwordChangeSchema,
} from "@/lib/validation/reset-password-newsletter";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const extendedProfileSchema = z.object({
  firstName: baseProfileSchema.shape.firstName,
  lastName: baseProfileSchema.shape.lastName,
  avatarUrl: z.string().url("Avatar must be a valid URL").or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof extendedProfileSchema>;
type PasswordFormValues = z.infer<typeof passwordChangeSchema>;

export default function AccountSettingsForm() {
  const { userData, setUserData, isLoading: contextLoading } = usePlan();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(extendedProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      avatarUrl: "",
    },
  });

  const {
    control: profileControl,
    setValue: setProfileValue,
    formState: {
      errors: profileErrors,
      isDirty: isProfileDirty,
      isSubmitting: isProfileSubmitting,
    },
    handleSubmit: handleProfileSubmit,
  } = profileForm;

  const [showProfileSuccess, setShowProfileSuccess] = useState(false);

  useEffect(() => {
    if (userData && userData.name) {
      const [firstName = "", lastName = ""] = userData.name.split(" ");
      setProfileValue("firstName", firstName);
      setProfileValue("lastName", lastName);
      setProfileValue("avatarUrl", userData.avatar || "");
    }
  }, [userData, setProfileValue]);

  const [avatarPreview, setAvatarPreview] = useState<string>(
    userData.avatar || ""
  );
  useEffect(() => {
    setAvatarPreview(userData.avatar || "");
  }, [userData.avatar]);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    control: passwordControl,
    reset: resetPasswordForm,
    formState: {
      errors: passwordErrors,
      isDirty: isPasswordDirty,
      isSubmitting: isPasswordSubmitting,
    },
    handleSubmit: handlePasswordSubmit,
  } = passwordForm;

  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  const onSubmitProfile: SubmitHandler<ProfileFormValues> = async (values) => {
    try {
      const fullName =
        `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
      const avatarToSet =
        values.avatarUrl.trim().length > 0
          ? values.avatarUrl.trim()
          : undefined;

      await authClient.updateUser({
        name: fullName,
        image: avatarToSet,
      });

      toast.success("Profile updated");
      setShowProfileSuccess(true);
      setTimeout(() => setShowProfileSuccess(false), 3000);

      setUserData({
        ...userData,
        name: fullName,
        avatar: avatarToSet || "",
      });
      setAvatarPreview(avatarToSet || "");
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    }
  };

  const onSubmitPassword: SubmitHandler<PasswordFormValues> = async (
    values
  ) => {
    try {
      await authClient.changePassword({
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });

      toast.success("Password changed");
      setShowPasswordSuccess(true);
      setTimeout(() => setShowPasswordSuccess(false), 3000);

      resetPasswordForm();
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to change password";
      toast.error(message);
    }
  };

  const isProfileFormValid =
    isProfileDirty && Object.keys(profileErrors).length === 0;
  const isPasswordFormValid =
    isPasswordDirty && Object.keys(passwordErrors).length === 0;

  if (contextLoading) {
    return <p className="text-gray-500">Loading account settings…</p>;
  }

  return (
    <div className=" mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Account Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-16 w-16">
            {avatarPreview ? (
              <AvatarImage src={avatarPreview} alt="Avatar" />
            ) : (
              <AvatarFallback>
                {(userData.name || "U")[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{userData.name}</p>
            <p className="text-sm text-gray-600">{userData.email}</p>
          </div>
        </div>

        <Form {...profileForm}>
          <form
            onSubmit={handleProfileSubmit(onSubmitProfile)}
            className="space-y-4"
          >
            <FormField
              control={profileControl}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileControl}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileControl}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/avatar.png"
                      {...field}
                      onBlur={(e) => {
                        setAvatarPreview(e.target.value.trim());
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isProfileFormValid || isProfileSubmitting}
              >
                {isProfileSubmitting ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>

        {showProfileSuccess && (
          <div className="relative">
            <CheckCircle className="absolute top-0 right-0 h-6 w-6 text-green-500 animate-pulse" />
          </div>
        )}

        <Separator />

        <div className="pt-4">
          <h3 className="text-xl font-medium mb-4">Change Password</h3>
          <Form {...passwordForm}>
            <form
              onSubmit={handlePasswordSubmit(onSubmitPassword)}
              className="space-y-4"
            >
              <FormField
                control={passwordControl}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Current Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordControl}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordControl}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm New Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!isPasswordFormValid || isPasswordSubmitting}
                >
                  {isPasswordSubmitting ? "Changing…" : "Change Password"}
                </Button>
              </div>
            </form>
          </Form>

          {showPasswordSuccess && (
            <div className="relative">
              <CheckCircle className="absolute top-0 right-0 h-6 w-6 text-green-500 animate-pulse" />
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}
