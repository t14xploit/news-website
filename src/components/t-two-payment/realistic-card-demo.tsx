"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RealisticCardPreview from "./realistic-card-preview";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cardPreviewSchema, CardPreviewFormData } from "@/lib/validation/card-preview-schema";

export function RealisticCardDemo() {
  const [cardType, setCardType] = React.useState<"visa" | "mastercard" | "amex" | "discover" | "generic">("visa");
  const [cardBackground, setCardBackground] = React.useState<"blue" | "purple" | "black" | "gradient">("gradient");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CardPreviewFormData>({
    resolver: zodResolver(cardPreviewSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const onSubmit = (data: CardPreviewFormData) => {
    console.log(data);
    toast.success("Payment method added successfully!");
    reset();
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);

    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setValue("cardNumber", formatted);

    if (value.startsWith("4")) {
      setCardType("visa");
    } else if (value.startsWith("5")) {
      setCardType("mastercard");
    } else if (value.startsWith("34") || value.startsWith("37")) {
      setCardType("amex");
    } else if (value.startsWith("6")) {
      setCardType("discover");
    } else {
      setCardType("generic");
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    setValue("expiryDate", value);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Enter your card information to complete the payment.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center">
            <RealisticCardPreview
              register={register}
              errors={errors}
              onCardNumberChange={handleCardNumberChange}
              onExpiryDateChange={handleExpiryDateChange}
              cardType={cardType}
              cardBackground={cardBackground}
            />
          </div>

          <div className="grid gap-4 pt-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Card Theme</h3>
              <RadioGroup
                defaultValue="gradient"
                value={cardBackground}
                onValueChange={(value: "blue" | "purple" | "black" | "gradient") => setCardBackground(value)}
                className="grid grid-cols-4 gap-2"
              >
                <div>
                  <RadioGroupItem value="gradient" id="gradient" className="peer sr-only" />
                  <Label
                    htmlFor="gradient"
                    className="flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-xs text-white peer-data-[state=checked]:border-primary"
                  >
                    Gradient
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="blue" id="blue" className="peer sr-only" />
                  <Label
                    htmlFor="blue"
                    className="flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-blue-600 text-xs text-white peer-data-[state=checked]:border-primary"
                  >
                    Blue
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="purple" id="purple" className="peer sr-only" />
                  <Label
                    htmlFor="purple"
                    className="flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-purple-600 text-xs text-white peer-data-[state=checked]:border-primary"
                  >
                    Purple
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="black" id="black" className="peer sr-only" />
                  <Label
                    htmlFor="black"
                    className="flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-black text-xs text-white peer-data-[state=checked]:border-primary"
                  >
                    Black
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Pay Now</Button>
      </CardFooter>
    </Card>
  );
}