"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast"; // Import toast
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { newsletterSchema } from "@/lib/validation/reset-password-newsletter"; //Keep the validation for future.

export default function NewsletterSettingsForm({ userId }: { userId: string }) {
  const [categories, setCategories] = useState<string[]>(["news", "updates"]);
  const [frequency, setFrequency] = useState("daily");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mockSettings = {
      categories: ["news", "updates"],
      frequency: "daily",
    };
    setCategories(mockSettings.categories);
    setFrequency(mockSettings.frequency);
    console.log("Initial settings:", mockSettings);
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { userId, categories, frequency });
    setIsLoading(true);
    try {
      const data = { categories, frequency };
      newsletterSchema.parse(data);
      toast.success(
        `Settings saved successfully: ${frequency}, ${categories.join(", ")}`
      );
    } catch (error) {
      console.error("Form submission error:", error);

      toast.error("Failed to save settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFrequencyChange = (value: string) => {
    console.log("Selected frequency:", value);
    setFrequency(value);
  };

  const isFormValid = categories.length > 0;

  console.log("Form valid:", isFormValid, "Categories:", categories);

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-3">
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
          className="flex flex-col space-y-1"
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
      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          size="sm"
          className="text-sm"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
