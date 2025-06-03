"use client";

import * as React from "react";
import { Eye, EyeOff, RefreshCw, Wifi } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CardType, CardBackground } from "../types";
import { JSX } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CardPreviewFormData } from "@/lib/validation/card-preview-schema";

interface RealisticCardPreviewProps {
  register?: UseFormRegister<CardPreviewFormData>;
  errors?: FieldErrors<CardPreviewFormData>;
  onCardNumberChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryDateChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCvvChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cardType: CardType;
  cardBackground: CardBackground;
  isSubmitting?: boolean;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  readOnly?: boolean;
  children?: React.ReactNode;
}

export function RealisticCardPreview({
  register,
  errors,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  cardType,
  cardBackground,
  isSubmitting = false,
  cardNumber = "",
  cardHolder = "",
  expiryDate = "",
  cvv = "",
  readOnly = false,
  children,
}: RealisticCardPreviewProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [showCvv, setShowCvv] = React.useState(false);
  const [cvvValue, setCvvValue] = React.useState("cvv");

  const getCardBgClass = () => {
    const bgClasses: Record<CardBackground, string> = {
      gradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
      blue: "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900",
      purple: "bg-gradient-to-br from-purple-400 via-purple-600 to-purple-900",
      black: "bg-gradient-to-br from-gray-900 via-black to-gray-900",
    };
    return bgClasses[cardBackground];
  };

  const getCardLogo = () => {
    const logos: Record<CardType, JSX.Element> = {
      visa: (
        <div className="text-white font-bold tracking-tighter text-4xl">
          <span className="italic">VISA</span>
        </div>
      ),
      mastercard: (
        <div className="flex">
          <div className="h-10 w-10 rounded-full bg-red-500 opacity-80"></div>
          <div className="h-10 w-10 -ml-4 rounded-full bg-yellow-500 opacity-80"></div>
        </div>
      ),
      amex: (
        <div className="text-white font-bold text-3xl">
          <span>AMERICAN EXPRESS</span>
        </div>
      ),
      discover: (
        <div className="text-white font-bold text-3xl">
          <span>DISCOVER</span>
        </div>
      ),
      generic: (
        <div className="text-white font-bold tracking-tighter text-4xl">
          <span className="italic">Bank</span>
        </div>
      ),
    };
    return logos[cardType];
  };

  React.useEffect(() => {
    const cvvInput = document.getElementById("cvv-input");
    if (isFlipped && cvvInput) {
      setTimeout(() => cvvInput.focus(), 500);
    }
  }, [isFlipped, readOnly]);

  const handleFlipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvvValue(e.target.value);
    if (onCvvChange) {
      onCvvChange(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCardNumberChangeWrapper = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length <= 16) {
      if (onCardNumberChange) {
        onCardNumberChange(e);
      }
    } else {
      e.target.value = rawValue
        .slice(0, 16)
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }
  };

  return (
    <div className="relative w-full max-w-[600px] h-[350px] max-h-[360px] perspective-1000 my-8">
      {!readOnly && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="absolute -top-13 right-0 z-10 mr-2"
                onClick={handleFlipClick}
                aria-label="Flip Card"
              >
                <RefreshCw className="size-5" />
                {/* Flip Card */}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              sideOffset={8}
              className="bg-white/5 text-white/90 backdrop-blur-md px-4 py-2 text-base rounded-lg"
            >
              Flip Card
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-3d",
          isFlipped && !readOnly ? "rotate-y-180" : ""
        )}

        // {/* <div
        //   className={cn(
        //     "relative w-full h-full transition-transform duration-700 transform-style-3d",
        //     isFlipped && !readOnly ? "rotate-y-180" : ""
        //   )} */}
      >
        <div
          className={cn(
            "absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col border border-gray-700/30 shadow-xl",
            isFlipped && !readOnly ? "pointer-events-none" : ""
          )}
        >
          <div
            className={cn(
              "absolute inset-0 backdrop-blur-md rounded-xl",
              getCardBgClass(),
              "before:absolute before:inset-0 before:rounded-xl before:bg-white/10 before:backdrop-blur-sm before:opacity-30"
            )}
          />
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute -inset-[500%] bg-gradient-to-r from-transparent via-white/20 to-transparent card-shine"></div>
          </div>

          <div className="relative flex flex-col h-full text-white/80 pt-3">
            {children ? (
              children
            ) : (
              <>
                <div className="flex justify-between items-start mb-14">
                  <div className="flex items-center gap-4">
                    <div className="w-15 h-12 ml-6 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-md border border-yellow-800/50 shadow-inner flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full relative">
                        <div className="absolute inset-1 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-sm border border-yellow-800/70">
                          <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-yellow-500 rounded-sm"></div>
                          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-500 rounded-sm"></div>
                          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-yellow-500 rounded-sm"></div>
                          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-yellow-500 rounded-sm"></div>
                          <div className="absolute inset-2 border border-dashed border-yellow-800/70 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <Wifi className="w-14 h-14 text-white/70 rotate-90" />
                  </div>
                  <div className="mr-6">{getCardLogo()}</div>
                </div>

                <div className="space-y-10 flex-grow px-1">
                  <div className="text-center">
                    {readOnly ? (
                      <div className="w-full h-12 text-center font-mono tracking-wider text-3xl text-white/90">
                        {cardNumber}
                      </div>
                    ) : register ? (
                      <Input
                        {...register("cardNumber")}
                        placeholder="•••• •••• •••• ••••"
                        maxLength={19}
                        className="w-full h-12 text-center font-mono tracking-wider text-3xl bg-transparent border-none focus-visible:ring-1 focus-visible:ring-white/30 placeholder:text-white/70 text-white/90"
                        onChange={onCardNumberChange}
                        disabled={isSubmitting}
                        defaultValue={cardNumber}
                      />
                    ) : null}
                    {errors?.cardNumber && (
                      <p className="text-red-300 text-xs mt-1">
                        {errors.cardNumber?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-1 w-1/2">
                      <div className="text-xs  text-white/70 uppercase mr-44">
                        Card Holder
                      </div>
                      {readOnly ? (
                        <div className="w-full h-12 text-sm text-white/90">
                          {cardHolder}
                        </div>
                      ) : register ? (
                        <Input
                          {...register("cardHolder")}
                          placeholder="CARD HOLDER"
                          className="w-full h-12 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-white/30 text-white/90 placeholder:text-white/70 text-sm"
                          disabled={isSubmitting}
                          defaultValue={cardHolder}
                        />
                      ) : null}
                      {errors?.cardHolder && (
                        <p className="text-red-300 text-xs">
                          {errors.cardHolder?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1 w-1/3">
                      <div className="text-xs text-white/70 uppercase mr-30">
                        Expires
                      </div>
                      {readOnly ? (
                        <div className="w-full h-12 text-sm text-white/90">
                          {expiryDate}
                        </div>
                      ) : register ? (
                        <Input
                          {...register("expiryDate")}
                          placeholder="MM/YY"
                          className="w-full h-12 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-white/30 text-white/90 placeholder:text-white/70 text-sm"
                          onChange={onExpiryDateChange}
                          disabled={isSubmitting}
                          defaultValue={expiryDate}
                        />
                      ) : null}
                      {errors?.expiryDate && (
                        <p className="text-red-300 text-xs">
                          {errors.expiryDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          className={cn(
            "absolute w-full h-full backface-hidden rounded-xl border border-gray-700/30 shadow-xl rotate-y-180",
            !isFlipped || readOnly ? "pointer-events-none" : ""
          )}
        >
          <div
            className={cn(
              "absolute inset-0 backdrop-blur-md rounded-xl",
              getCardBgClass(),
              "before:absolute before:inset-0 before:rounded-xl before:bg-white/10 before:backdrop-blur-sm before:opacity-30"
            )}
          />

          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute -inset-[500%] bg-gradient-to-r from-transparent via-white/20 to-transparent card-shine"></div>
          </div>

          <div className="relative h-full flex flex-col">
            <div className="w-full h-12 bg-black/90 mt-12 rounded-l"></div>
            <div className="flex flex-col items-end px-6 mt-8">
              <div className="w-3/4 h-12 bg-white/90 rounded-md flex items-center">
                <div className="w-3/4 h-8 mx-2 bg-gray-100 overflow-hidden rounded-l">
                  <div className="w-full h-full font-mono text-s text-gray-500 italic flex items-center px-4 overflow-hidden">
                    Signature
                  </div>
                </div>
                <div className="w-1/4 h-8 bg-white border  border-gray-200 rounded-r flex items-center justify-center">
                  {readOnly ? (
                    <div className="w-full h-full text-center font-mono text-sm text-black">
                      {cvv}
                    </div>
                  ) : register ? (
                    <>
                      <Input
                        id="cvv-input"
                        {...register("cvv")}
                        placeholder="***"
                        type={showCvv ? "text" : "password"}
                        className="w-full h-full text-center font-mono bg-transparent border-none focus-visible:ring-0 text-black placeholder:text-gray-400 text-sm"
                        onChange={handleCvvChange}
                        disabled={isSubmitting}
                        defaultValue={cvvValue}
                        aria-describedby={errors?.cvv ? "cvv-error" : undefined}
                      />
                      <button
                        type="button"
                        className="absolute right-1 text-gray-600 hover:text-gray-800"
                        onClick={() => setShowCvv(!showCvv)}
                        aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                        disabled={isSubmitting}
                      >
                        {showCvv ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              {errors?.cvv && (
                <p className="text-red-300 text-xs mt-1">
                  {errors.cvv.message}
                </p>
              )}
              <div className="text-sm text-white/70 mr-1 mt-1">CVV</div>
            </div>
            <div className="mt-auto p-5 text-white/80 text-[13px]">
              <p>This card is property of the issuing bank.</p>

              <p className="text-[13px] mt-1">
                Use of this card is subject to the terms and conditions of your
                agreement with the issuer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
