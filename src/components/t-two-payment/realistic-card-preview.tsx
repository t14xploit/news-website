"use client";

import * as React from "react";
import { Wifi } from "lucide-react";
import { CardPreviewFormData } from "@/lib/validation/card-preview-schema";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const combineRefs = (
  ref1: React.Ref<HTMLInputElement>,
  ref2: React.Ref<HTMLInputElement>
) => (element: HTMLInputElement) => {
  if (typeof ref1 === "function") ref1(element);
  else if (ref1) ref1.current = element;
  if (typeof ref2 === "function") ref2(element);
  else if (ref2) ref2.current = element;
};

interface CardPreviewProps {
  register?: UseFormRegister<CardPreviewFormData>;
  errors?: FieldErrors<CardPreviewFormData>;
  onCardNumberChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryDateChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  cardType?: "visa" | "mastercard" | "amex" | "discover" | "generic";
  cardBackground?: "blue" | "purple" | "black" | "gradient";
}

export default function RealisticCardPreview({
  register,
  errors = {},
  onCardNumberChange,
  onExpiryDateChange,
  className,
  cardType = "visa",
  cardBackground = "gradient",
}: CardPreviewProps) {
  const [focused, setFocused] = React.useState<string | null>(null);
  const [flipped, setFlipped] = React.useState(false);
  const [cvvValue, setCvvValue] = React.useState("");

  const cvvInputRef = React.useRef<HTMLInputElement>(null);

 // const safeRegister = (field: keyof CardPreviewFormData) => (register ? register(field) : {});

  const cvvRegister: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string | undefined;
    ref?: React.RefCallback<HTMLInputElement> | React.RefObject<HTMLInputElement> | null;
  } = register
    ? {
        ...register("cvv"),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value.replace(/\D/g, "").slice(0, 4);
          setCvvValue(value); 
          if (register("cvv").onChange) {
            const syntheticEvent = { ...e, target: { ...e.target, value } } as React.ChangeEvent<HTMLInputElement>;
            register("cvv").onChange(syntheticEvent); 
          }
        },
        value: undefined, 
      }
    : {
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value.replace(/\D/g, "").slice(0, 4);
          setCvvValue(value);
        },
        value: cvvValue,
      };

  const getBackgroundStyle = () => {
    switch (cardBackground) {
      case "blue":
        return "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900";
      case "purple":
        return "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900";
      case "black":
        return "bg-gradient-to-br from-gray-700 via-gray-800 to-black";
      case "gradient":
      default:
        return "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500";
    }
  };

  const getCardLogo = () => {
    switch (cardType) {
      case "visa":
        return (
          <div className="text-white font-bold tracking-tighter text-2xl">
            <span className="italic">VISA</span>
          </div>
        );
      case "mastercard":
        return (
          <div className="flex">
            <div className="h-8 w-8 rounded-full bg-red-500 opacity-80"></div>
            <div className="h-8 w-8 -ml-4 rounded-full bg-yellow-500 opacity-80"></div>
          </div>
        );
      case "amex":
        return (
          <div className="text-white font-bold text-xl">
            <span>AMERICAN EXPRESS</span>
          </div>
        );
      case "discover":
        return (
          <div className="text-white font-bold text-xl">
            <span>DISCOVER</span>
          </div>
        );
      default:
        return (
          <div className="text-white font-bold tracking-wider text-2xl">
            <span>BANK</span>
          </div>
        );
    }
  };

  const handleCvvFocus = () => {
    setFlipped(true);
    setFocused("cvv");
  };

  function handleCvvBlur() {
    setFocused(null);
  }

  return (
    <div className={cn("relative perspective-1000", className)}>
      <div
        className={cn(
          "relative h-[220px] w-[350px] rounded-xl transition-all duration-500",
          flipped ? "rotate-y-180" : "rotate-y-0",
        )}
      >
        <div className={cn("absolute inset-0 rounded-xl shadow-xl backface-hidden", getBackgroundStyle())}>
          <div className="absolute top-0 left-0 right-0 h-20 bg-white/5 rounded-t-xl"></div>
          <div className="absolute bottom-10 right-10 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute top-10 left-10 h-10 w-10 rounded-full bg-white/10 blur-md"></div>

          <div className="relative flex h-full flex-col p-6 text-white">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-12 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 shadow-sm">
                  <div className="grid h-full w-full grid-cols-2 p-1">
                    <div className="border-b border-r border-yellow-600/30"></div>
                    <div className="border-b border-yellow-600/30"></div>
                    <div className="border-r border-yellow-600/30"></div>
                    <div></div>
                  </div>
                </div>
                <Wifi className="h-6 w-6 rotate-90 text-white/70" />
              </div>
              <div className="pt-1">{getCardLogo()}</div>
            </div>

            <div className="flex-grow space-y-6">
              <div>
                <Input
                  {...(register ? register("cardNumber") : {})}
                  placeholder="•••• •••• •••• ••••"
                  className={cn(
                    "border-none bg-transparent font-mono text-xl tracking-widest text-white placeholder:text-white/60 focus:ring-1 focus:ring-white/20",
                    focused === "cardNumber" ? "ring-1 ring-white/50" : "",
                  )}
                  onChange={onCardNumberChange}
                  onFocus={() => setFocused("cardNumber")}
                  onBlur={() => setFocused(null)}
                />
                {errors?.cardNumber && <p className="mt-1 text-xs text-red-300">{errors.cardNumber.message}</p>}
              </div>

              <div className="flex items-end justify-between">
                <div className="w-2/3 space-y-1">
                  <div className="text-xs uppercase text-white/70">Card Holder</div>
                  <Input
                    {...(register ? register("cardHolder") : {})}
                    placeholder="FULL NAME"
                    className={cn(
                      "border-none bg-transparent uppercase text-sm text-white placeholder:text-white/60 focus:ring-1 focus:ring-white/20",
                      focused === "cardHolder" ? "ring-1 ring-white/50" : "",
                    )}
                    onFocus={() => setFocused("cardHolder")}
                    onBlur={() => setFocused(null)}
                  />
                  {errors?.cardHolder && <p className="text-xs text-red-300">{errors.cardHolder.message}</p>}
                </div>

                <div className="w-1/3 space-y-1">
                  <div className="text-xs uppercase text-white/70">Expires</div>
                  <Input
                    {...(register ? register("expiryDate") : {})}
                    placeholder="MM/YY"
                    className={cn(
                      "border-none bg-transparent text-sm text-white placeholder:text-white/60 focus:ring-1 focus:ring-white/20",
                      focused === "expiryDate" ? "ring-1 ring-white/50" : "",
                    )}
                    onChange={onExpiryDateChange}
                    onFocus={() => setFocused("expiryDate")}
                    onBlur={() => setFocused(null)}
                  />
                  {errors?.expiryDate && <p className="text-xs text-red-300">{errors.expiryDate.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn("absolute inset-0 rounded-xl shadow-xl backface-hidden rotate-y-180", getBackgroundStyle())}>
          <div className="absolute top-8 h-12 w-full bg-black/80"></div>

          <div className="absolute top-28 right-6 left-6 h-12 bg-white/90 rounded-md">
            <div className="h-full w-2/3 overflow-hidden">
              <div className="h-full w-full bg-[repeating-linear-gradient(45deg,#303030,#303030_10px,#404040_10px,#404040_20px)]"></div>
            </div>

            <div className="absolute right-3 top-3 bottom-3 w-16 bg-white rounded flex items-center justify-center">
              <div className="absolute -top-5 left-0 text-xs text-white font-medium">CVV</div>
              <Input
                ref={combineRefs(cvvInputRef, cvvRegister.ref ?? null)}
                onChange={cvvRegister.onChange}
                value={cvvValue}
                placeholder="CVV"
                type="text"
                maxLength={4}
                className="h-full w-full border-none bg-transparent text-center text-lg font-bold text-black placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400"
                onFocus={handleCvvFocus}
                onBlur={handleCvvBlur}
              />
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-xs text-white/70">
            <p>This card is property of the issuing bank. Use subject to cardholder agreement.</p>
          </div>
        </div>
      </div>

      {/* Removed separate CVV input */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <Button type="button" variant="outline" size="sm" className="mt-6" onClick={() => setFlipped(!flipped)}>
          {flipped ? "Show Front" : "Show Back"}
        </Button>
      </div>
    </div>
  );
}