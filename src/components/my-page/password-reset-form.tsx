"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { passwordResetSchema } from "@/lib/validation/reset-password-newsletter";

export default function PasswordResetForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      passwordResetSchema.parse({ email });
      //   const response = await fetch('/api/auth/reset-password', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ email }),
      //   });
      //   if (response.ok) {
      console.log(`Password reset requested for: ${email}`);
      toast.success("Password reset link sent to your email.");
      //   } else {
      //     toast({ title: 'Error', description: 'Failed to send reset link.' });
      //   }
    } catch {
      toast.error("Invalid email address.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="flex justify-end mt-40">
        <Button type="submit">Send Reset Link</Button>
      </div>
    </form>
  );
}
