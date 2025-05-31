"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import {
  profileSchema,
  passwordChangeSchema,
} from "@/lib/validation/reset-password-newsletter";
import { usePlan } from "@/components/subscribe/plan-context";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export default function AccountSettingsForm() {
  const { userData, setUserData, isLoading: contextLoading } = usePlan();

  const [user, setUser] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState<"profile" | "password" | null>(
    null
  );
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [passwordErrors, setPasswordErrors] = useState<{
    [key: string]: string;
  }>({});

  // Pre-fill form with userData from PlanProvider
  useEffect(() => {
    if (userData && userData.name && userData.email) {
      try {
        // Split name into firstName and lastName (assuming name is "First Last")
        const [firstName = "", lastName = ""] = userData.name.split(" ");
        const profileData = {
          firstName: firstName || "",
          lastName: lastName || "",
          email: userData.email || "",
        };
        profileSchema.parse(profileData); // Validate data
        setUser(profileData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Failed to load user data");
        setUser({
          firstName: "",
          lastName: "",
          email: "",
        });
      }
    }
  }, [userData]);

  // Real-time validation for profile form
  useEffect(() => {
    if (isEditingProfile) {
      try {
        profileSchema.parse(user);
        setProfileErrors({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: { [key: string]: string } = {};
          error.errors.forEach((err) => {
            if (err.path[0]) errors[err.path[0]] = err.message;
          });
          setProfileErrors(errors);
        }
      }
    }
  }, [user, isEditingProfile]);

  // Real-time validation for password form
  useEffect(() => {
    if (
      passwordData.oldPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      try {
        passwordChangeSchema.parse(passwordData);
        setPasswordErrors({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: { [key: string]: string } = {};
          error.errors.forEach((err) => {
            if (err.path[0]) errors[err.path[0]] = err.message;
          });
          setPasswordErrors(errors);
        }
      }
    }
  }, [passwordData]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting profile:", user);
    try {
      profileSchema.parse(user);
      setIsLoading(true);
      // Simulate profile update (no API)
      setUserData({
        ...userData,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      });
      toast.success("Profile updated successfully");
      setShowSuccess("profile");
      setTimeout(() => setShowSuccess(null), 3000);
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Profile submission error:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting password change:", passwordData);
    try {
      passwordChangeSchema.parse(passwordData);
      setIsLoading(true);
      // Simulate password update (no API)
      toast.success("Password changed successfully");
      setShowSuccess("password");
      setTimeout(() => setShowSuccess(null), 3000);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password change error:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isProfileFormValid =
    Object.keys(profileErrors).length === 0 && isEditingProfile;
  const isPasswordFormValid =
    Object.keys(passwordErrors).length === 0 &&
    passwordData.oldPassword !== "" &&
    passwordData.newPassword !== "" &&
    passwordData.confirmPassword !== "";

  return (
    <div className="relative space-y-6">
      {/* Profile Section */}
      <div className="relative">
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        {contextLoading && <p className="text-gray-500">Loading profile...</p>}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <Input
              type="text"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              disabled={!isEditingProfile || isLoading || contextLoading}
              className="mt-1"
            />
            {profileErrors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {profileErrors.firstName}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <Input
              type="text"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              disabled={!isEditingProfile || isLoading || contextLoading}
              className="mt-1"
            />
            {profileErrors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {profileErrors.lastName}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              disabled={!isEditingProfile || isLoading || contextLoading}
              className="mt-1"
            />
            {profileErrors.email && (
              <p className="text-red-500 text-sm mt-1">{profileErrors.email}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            {isEditingProfile ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  disabled={isLoading || contextLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || contextLoading || !isProfileFormValid}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                disabled={isLoading || contextLoading}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>
        {showSuccess === "profile" && (
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* Password Change Section */}
      <div className="relative">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <Input
              type="password"
              placeholder="Enter current password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
              disabled={isLoading || contextLoading}
              className="mt-1"
            />
            {passwordErrors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.oldPassword}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              disabled={isLoading || contextLoading}
              className="mt-1"
            />
            {passwordErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              disabled={isLoading || contextLoading}
              className="mt-1"
            />
            {passwordErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || contextLoading || !isPasswordFormValid}
            >
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
        {showSuccess === "password" && (
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
