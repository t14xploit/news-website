"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RealisticCardPreview } from "./realistic-card-preview";
import { CardBackground, CardType } from "../types";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { UseFormRegister, FieldErrors, SubmitHandler } from "react-hook-form";
import { CardPreviewFormData } from "@/lib/validation/card-preview-schema";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLock, FaShieldAlt, FaCreditCard, FaCheck } from "react-icons/fa";

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
  currentStep: number;
  setCurrentStep: (step: number) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

export function CardPreview({
  defaultTheme,
  register,
  errors,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  selectedPlan,
  isSubmitting = false,
  handleSubmit,
  onSubmit,
  currentStep,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setCurrentStep,
  handleNextStep,
  handlePreviousStep,
}: CardPreviewProps) {
  const [cardBackground, setCardBackground] = useState<CardBackground>(
    defaultTheme ?? "gradient"
  );
  const [cardType, setCardType] = useState<CardType>("generic");
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setShowSecurityInfo(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
        handleNextStep();
        if (currentStep === 2) {
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
        }
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

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const scaleVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
  };

  if (!isClient) {
    return (
      <div className="w-full max-w-3xl space-y-6">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-3xl"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
    >
      <Toaster position="top-right" />

      {/* <div className="mb-8 px-4 ">
        <div className="flex justify-between items-center ">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep > index + 1
                    ? "bg-green-600 text-white"
                    : currentStep === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > index + 1 ? <FaCheck /> : index + 1}
              </div>
              <span className="text-xs mt-2">
                {index === 0 ? "Card Details" : "Confirm"}
              </span>
            </div>
          ))}
          <div className="absolute top-0 left-0 w-full h-2 z-0">
            <div
              className="h-2 bg-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>
      </div> */}

      <div className="w-full max-w-3xl space-y-6"></div>
      <CardHeader className="text-center">
        <motion.h2
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
          variants={scaleVariants}
        >
          {currentStep === 1 ? "" : ""}
        </motion.h2>
        <motion.p
          className={`text-gray-500 ${currentStep === 2 ? "mb-8" : ""}`}
          variants={fadeInVariants}
        >
          {currentStep === 1
            ? "Your card details are secure and encrypted"
            : `Confirm your ${
                selectedPlan.name
              } subscription for $${selectedPlan.price.toFixed(2)}`}
        </motion.p>
      </CardHeader>

      <CardContent>
        {/* <div className="space-y-6">
          <div className="flex justify-center"> */}
        <motion.div
          className="space-y-8"
          variants={fadeInVariants}
          transition={{ staggerChildren: 0.1 }}
        >
          {currentStep === 1 ? (
            <>
              <div className="flex justify-center bg-center">
                {/* <motion.div
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                > */}
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
                {/* </motion.div> */}
              </div>

              <motion.div className="grid gap-4 pt-6" variants={fadeInVariants}>
                <div>
                  <h3 className="mb-10 text-lg font-medium">
                    Select Card Theme
                  </h3>
                  <RadioGroup
                    defaultValue={defaultTheme}
                    value={cardBackground}
                    onValueChange={(value: string) =>
                      setCardBackground(value as CardBackground)
                    }
                    aria-label="Select card theme"
                    className="grid grid-cols-2 sm:grid-cols-4 justify-center gap-4"
                  >
                    {[
                      { name: "gradient", label: "Gradient" },
                      { name: "blue", label: "Blue" },
                      { name: "purple", label: "Purple" },
                      { name: "black", label: "Black" },
                    ].map((theme) => (
                      <motion.div
                        key={theme.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RadioGroupItem
                          value={theme.name}
                          id={theme.name}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={theme.name}
                          className={`mx-auto flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-muted text-sm text-white peer-data-[state=checked]:border-black  ${
                            theme.name === "gradient"
                              ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
                              : theme.name === "blue"
                              ? "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900"
                              : theme.name === "purple"
                              ? "bg-gradient-to-br from-purple-400 via-purple-600 to-purple-900"
                              : "bg-gradient-to-br from-gray-900 via-black to-gray-900"
                          } shadow-md hover:shadow-lg transition-shadow duration-300`}
                        >
                          {/* {theme.label} */}
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Order Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600 dark:text-gray-400">Plan</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {selectedPlan.name}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600 dark:text-gray-400">
                    Billing Period
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Monthly
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600 dark:text-gray-400">
                    Card Type
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600 dark:text-gray-400">
                    Amount
                  </span>
                  <span className="font-semibold text-xl text-blue-600 dark:text-blue-400">
                    ${selectedPlan.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                  <FaCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  By confirming your subscription, you agree to our Terms of
                  Service and Privacy Policy. You can cancel anytime from your
                  account settings.
                </p>
              </div>

              <motion.div
                className="mt-8 border-t pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  showSecurityInfo
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                      <FaLock className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      Secure Encryption
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your data is protected with 256-bit SSL
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                      <FaShieldAlt className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      Fraud Protection
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Advanced fraud monitoring systems
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                      <FaCreditCard className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      PCI Compliant
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Adhering to security standards
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </CardContent>

      <CardFooter className="flex justify-between pt-8">
        {currentStep === 1 ? (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full max-w-[150px] border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="w-full max-w-[150px] bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:shadow-lg"
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={isSubmitting}
              className="w-full max-w-[150px] border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              Back
            </Button>
            <Button
              type="submit"
              form="payment-form"
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting}
              className="w-full max-w-[150px] relative bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md transition-all duration-300 group"
            >
              {isSubmitting ? (
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
              ) : (
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-60 group-hover:scale-110 transition-transform" />
              )}
              <span className={isSubmitting ? "pl-6" : "pl-6"}>
                Pay ${selectedPlan?.price.toFixed(2)}
              </span>
            </Button>
          </>
        )}
      </CardFooter>
    </motion.div>
  );
}
