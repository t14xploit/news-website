"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { newsletterSchema } from "@/lib/validation/reset-password-newsletter";

interface NewsletterSettingsFormProps {
  userId: string;
}

export default function NewsletterSettingsForm({
  userId,
}: NewsletterSettingsFormProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mockSettings = {
      categories: ["news", "updates"],
      frequency: "daily" as "daily" | "weekly" | "monthly",
    };
    setCategories(mockSettings.categories);
    setFrequency(mockSettings.frequency);
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = { categories, frequency };
      newsletterSchema.parse(data);

      toast.success(
        `Newsletter settings saved: ${frequency}, categories = ${categories.join(
          ", "
        )}`
      );
    } catch (error) {
      console.error("Newsletter form error:", error);
      toast.error("Failed to save newsletter settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFrequencyChange = (value: string) => {
    if (value === "daily" || value === "weekly" || value === "monthly") {
      setFrequency(value);
    }
  };

  const isFormValid = categories.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Categories (comma-separated)"
        value={categories.join(",")}
        onChange={(e) =>
          setCategories(
            e.target.value
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          )
        }
        className="text-sm"
      />

      <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-700">
          Newsletter Frequency
        </Label>
        <RadioGroup
          value={frequency}
          onValueChange={handleFrequencyChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily" className="text-sm">
              Daily
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly" className="text-sm">
              Weekly
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly" className="text-sm">
              Monthly
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || !isFormValid} size="sm">
          {isLoading ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
