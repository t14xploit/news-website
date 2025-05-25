"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RealisticCardPreview } from "./realistic-card-preview";
import { CardBackground, CardType } from "../types";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { UseFormRegister, FieldErrors, SubmitHandler } from "react-hook-form";
import { CardPreviewFormData } from "@/lib/validation/card-preview-schema";
import { useRouter } from "next/navigation";

interface CardPreviewProps {
  defaultTheme?: CardBackground;
  register: UseFormRegister<CardPreviewFormData>;
  errors: FieldErrors<CardPreviewFormData>;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCvvChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedPlan: { id: string; name: string; price: number };
  isSubmitting?: boolean;
  handleSubmit: (
    handler: SubmitHandler<CardPreviewFormData>
  ) => (e: React.FormEvent) => void;
  onSubmit: (data: CardPreviewFormData) => Promise<{
    success: boolean;
    plan: string;
    price: number;
    error?: string;
  }>;
}

export function CardPreview({
  defaultTheme = "gradient",
  register,
  errors,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  selectedPlan,
  isSubmitting = false,
  handleSubmit,
  onSubmit,
}: CardPreviewProps) {
  const [cardBackground, setCardBackground] =
    useState<CardBackground>(defaultTheme);
  const [cardType, setCardType] = useState<CardType>("generic");

  const router = useRouter();

  const detectCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\D/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";
    return "generic";
  };

  const handleCardNumberChangeWrapper = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onCardNumberChange(e);
    setCardType(detectCardType(e.target.value));
  };

  const handleFormSubmit: SubmitHandler<CardPreviewFormData> = async (data) => {
    try {
      console.log("CardPreview: Submitting form", {
        data,
        selectedPlan,
        cardBackground,
      });
      const result = await onSubmit(data);
      console.log("CardPreview: onSubmit result", result);
      if (result.success) {
        const queryParams = new URLSearchParams({
          plan: selectedPlan.name,
          price: selectedPlan.price.toFixed(2),
          cardHolder: data.cardHolder,
          cardNumber: data.cardNumber,
          cardBackground,
        });
        const url = `/thank-you?${queryParams.toString()}`;
        console.log("CardPreview: Redirecting to", url);
        router.push(url);
      } else {
        console.error("CardPreview: Submission failed", result.error);
      }
    } catch (error) {
      console.error("CardPreview: Submission error", error);
    }
  };

  const handleCancel = () => {
    console.log("CardPreview: Cancel clicked, redirecting to /subscribe");
    router.push(
      `/subscribe?cardBackground=${encodeURIComponent(cardBackground)}`
    );
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <Toaster position="top-right" />
      {/* <Card className="w-full h-auto"> */}
      <CardHeader>
        {/* <CardTitle className="text-2xl">Enter Card</CardTitle> */}
        {/* <CardDescription className="text-lg">Enter your card details to complete the payment.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-center">
            <RealisticCardPreview
              register={register}
              errors={errors}
              onCardNumberChange={handleCardNumberChangeWrapper}
              onExpiryDateChange={onExpiryDateChange}
              onCvvChange={onCvvChange}
              cardType={cardType}
              cardBackground={cardBackground}
              isSubmitting={isSubmitting}
            />
          </div>
          <div className="grid gap-4 pt-4">
            <div>
              <h3 className="mb-2 text-lg font-medium">Card Theme</h3>
              <RadioGroup
                defaultValue={defaultTheme}
                value={cardBackground}
                onValueChange={(value: string) =>
                  setCardBackground(value as CardBackground)
                }
                aria-label="Select card theme"
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {["gradient", "blue", "purple", "black"].map((theme) => (
                  <div key={theme}>
                    <RadioGroupItem
                      value={theme}
                      id={theme}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={theme}
                      className={`flex h-12 cursor-pointer items-center justify-center rounded-md border-2 border-muted text-sm text-white peer-data-[state=checked]:border-primary ${
                        theme === "gradient"
                          ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
                          : theme === "blue"
                          ? "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900"
                          : theme === "purple"
                          ? "bg-gradient-to-br from-purple-400 via-purple-600 to-purple-900"
                          : "bg-gradient-to-br from-gray-900 via-black to-gray-900"
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-full max-w-[150px]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="payment-form"
          onClick={handleSubmit(handleFormSubmit)}
          disabled={isSubmitting}
          className="w-full max-w-[150px] relative"
        >
          {isSubmitting && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          )}
          <span className={isSubmitting ? "pl-6" : ""}>
            Pay ${selectedPlan?.price.toFixed(2)}
          </span>
        </Button>
      </CardFooter>
      {/* </Card> */}
    </div>
  );
}
