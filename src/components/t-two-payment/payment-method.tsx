"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePayment } from "./payment-context";


const paymentMethodSchema = z
  .object({
    paymentType: z.enum(["card", "paypal", "apple"]),
    name: z.string().min(1, "Name is required"),
    city: z.string().min(1, "City is required"),
    cardNumber: z
      .string()
      .refine((val) => val.replace(/\D/g, "").length === 16, "Card number must be 16 digits")
      .refine((val) => /^\d+$/.test(val.replace(/\D/g, "")), "Card number must contain only digits"),
    month: z.string().refine((val) => {
      const num = parseInt(val, 10);
      return num >= 1 && num <= 12;
    }, "Invalid month"),
    year: z.string().refine((val) => {
      const num = parseInt(val, 10);
      const currentYear = new Date().getFullYear(); // May 15, 2025
      return num >= currentYear && num <= currentYear + 10;
    }, "Invalid year"),
    cvc: z.string().min(3, "CVC must be at least 3 digits").max(4, "CVC must be at most 4 digits").regex(/^\d+$/, "CVC must contain only digits"),
  })
  .refine((data) => {
    if (data.paymentType === "card") return true;
    return !data.cardNumber && !data.month && !data.year && !data.cvc;
  }, {
    message: "Card details are only required for card payments",
    path: ["cardNumber"],
  });

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

export function PaymentMethod({ onSuccess }: { onSuccess?: () => void }) {
  const { addMethod } = usePayment();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      paymentType: "card",
      name: "",
      city: "",
      cardNumber: "",
      month: "",
      year: "",
      cvc: "",
    },
  });

  const handleSubmitForm = (data: PaymentMethodFormData) => {
    const lastFour = data.cardNumber.slice(-4);
    const maskedCardNumber = `•••• •••• •••• ${lastFour}`;
    const cardExpiry = `${data.month}/${data.year.slice(-2)}`;

    addMethod({
      type: data.paymentType,
      name: data.name,
      city: data.city,
      cardNumber: maskedCardNumber,
      cardExpiry,
      isDefault: false,
    });

    toast.success("Payment method added successfully");
    if (onSuccess) onSuccess();
  };


  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setValue("cardNumber", formatted);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Card className="border-0 shadow-none">
        <CardContent className="grid gap-6 p-0">
          <RadioGroup
            defaultValue="card"
            className="grid grid-cols-3 gap-4"
            {...register("paymentType")}
            onValueChange={(value) => setValue("paymentType", value as "card" | "paypal" | "apple")}
          >
            <div>
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CreditCard className="mb-3 h-6 w-6" />
                Card
              </Label>
            </div>
            <div>
              <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
              <Label
                htmlFor="paypal"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg role="img" viewBox="0 0 24 24" className="mb-3 h-6 w-6 fill-current">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                </svg>
                PayPal
              </Label>
            </div>
            <div>
              <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
              <Label
                htmlFor="apple"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg role="img" viewBox="0 0 24 24" className="mb-3 h-6 w-6 fill-current">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                Apple
              </Label>
            </div>
          </RadioGroup>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="First Last"
              {...register("name")}
              onChange={(e) => setValue("name", e.target.value)}
              required
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter your city"
              {...register("city")}
              onChange={(e) => setValue("city", e.target.value)}
              required
            />
            {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="number">Card number</Label>
            <Input
              id="number"
              placeholder="1234 5678 9012 3456"
              {...register("cardNumber")}
              onChange={handleCardNumberChange}
              required
            />
            {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="month">Expires</Label>
              <Select {...register("month")} onValueChange={(value) => setValue("month", value)} required>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, "0");
                    return (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.month && <p className="text-xs text-red-500">{errors.month.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Select {...register("year")} onValueChange={(value) => setValue("year", value)} required>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = (new Date().getFullYear() + i).toString();
                    return <SelectItem key={year} value={year}>{year}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
              {errors.year && <p className="text-xs text-red-500">{errors.year.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="CVC"
                {...register("cvc")}
                onChange={(e) => setValue("cvc", e.target.value.replace(/\D/g, ""))}
                maxLength={4} 
                required
              />
              {errors.cvc && <p className="text-xs text-red-500">{errors.cvc.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-0 pt-6">
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}