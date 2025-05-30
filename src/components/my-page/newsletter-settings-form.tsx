"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { newsletterSchema } from "@/lib/validation/reset-password-newsletter";

export default function NewsletterSettingsForm({ userId }: { userId: string }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("daily");

  useEffect(() => {
    const fetchSettings = async () => {
      //   const response = await fetch(`/api/newsletter?userId=${userId}`);
      //   const data = await response.json();
      //   setCategories(data.categories || []);
      //   setFrequency(data.frequency || 'daily');
    };
    fetchSettings();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      newsletterSchema.parse({ categories, frequency });
      //   const response = await fetch('/api/newsletter', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ userId, categories, frequency }),
      //   });
      //   if (response.ok) {
      console.log(
        `Newsletter settings saved: ${JSON.stringify({
          userId,
          categories,
          frequency,
        })}`
      );
      toast.success("Newsletter settings updated.");
      // //   } else {
      //     toast.error('Failed to update settings.');
      //   }
    } catch {
      toast.error("Invalid settings.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Categories (comma-separated)"
        value={categories.join(",")}
        onChange={(e) =>
          setCategories(e.target.value.split(",").map((c) => c.trim()))
        }
      />
      <Select value={frequency} onValueChange={setFrequency}>
        <SelectTrigger className="border rounded p-2">
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent className="border rounded p-6">
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
      <div className="mt-40 ml-40 flex-justify-end">
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
}
