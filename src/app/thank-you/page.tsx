"use client";

import { CheckCircle, Wifi, ArrowRight, Download, Mail, Home, Star, Gift } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { RealisticCardPreview } from "@/components/payment-card";
import { CardBackground, CardType } from "@/components/payment-card";
import { SubscriptionReceipt } from "@/components/receipt/subscription-receipt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


const validPlans = ["Free", "Elite", "Business"];

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextStepsOpen, setIsNextStepsOpen] = useState(false);
  const [isPlanFeaturesOpen, setIsPlanFeaturesOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const rawPlan = searchParams.get("plan") || "Free";
  const plan = validPlans.includes(rawPlan) ? rawPlan : "Free";
  const priceMap: Record<string, number> = {
    Free: 0,
    Elite: 19.99,
    Business: 49.99,
  };
  const rawCardHolder = searchParams.get("cardHolder") || "User";
  const cardHolder = rawCardHolder.replace(/[<>]/g, "");
  const rawCardNumber = searchParams.get("cardNumber") || "";
  const cardNumber = rawCardNumber.replace(/\s/g, "");
  const cardBackground = (searchParams.get("cardBackground") || "gradient") as CardBackground;
  const price = parseFloat(searchParams.get("price") || priceMap[plan].toString());

  const detectCardType = (cardNumber: string): CardType => {
    const cleaned = cardNumber.replace(/\D/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";
    return "generic";
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

  const cardType = detectCardType(cardNumber);
  const maskedCardNumber = cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : "**** **** **** ****";

  const planFeatures = {
    Free: ["Basic news access", "Limited articles per day", "Standard support"],
    Elite: ["Unlimited news access", "Premium articles", "Ad-free experience", "Priority support", "Mobile app access"],
    Business: [
      "All Elite features",
      "Team collaboration",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated account manager",
      "API access",
    ],
  };

  const nextSteps = [
    { icon: <Mail className="w-4 h-4" />, text: "Check your email for receipt and welcome guide" },
    { icon: <Download className="w-4 h-4" />, text: "Download our mobile app for on-the-go access" },
    { icon: <Star className="w-4 h-4" />, text: "Explore premium features in your dashboard" },
    { icon: <Gift className="w-4 h-4" />, text: "Share with friends and get bonus credits" },
  ];

  const receiptData = {
    id: `INV-${Date.now().toString().slice(-6)}`,
    cardHolder,
    cardNumber,
    cardType,
    plan,
    price,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    transactionId: `TRX-${Date.now().toString().slice(-8)}`,
    userEmail: `${cardHolder.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    userAddress: "123 Subscriber St, News City, NC 12345, USA",
  };

  useEffect(() => {
    if (!validPlans.includes(rawPlan) || !rawCardHolder || !rawCardNumber) {
      console.log("ThankYouPage: Invalid params, redirecting to /", {
        rawPlan,
        rawCardHolder,
        rawCardNumber,
      });
      router.push("/");
    }
  }, [rawPlan, rawCardHolder, rawCardNumber, router]);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % nextSteps.length);
    }, 3000);
    return () => {
      clearTimeout(timer);
      clearInterval(stepTimer);
    };
  }, [nextSteps.length]);

  const printReceipt = () => {
    setIsReceiptOpen(true);
    setTimeout(() => {
      window.print();
      setIsReceiptOpen(false);
    }, 300);
  };

  const ConfettiAnimation = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              ["bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400"][
                Math.floor(Math.random() * 5)
              ]
            }`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full relative z-10">
      {showConfetti && <ConfettiAnimation />}

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2F%3E%3C%2F%3E%3C%2Fsvg%3E')] opacity-20"></div>

      {/* Success Header */}
      <div className="text-center mb-2 relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 animate-pulse">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <h1 className="text-4xl text-white/90 mb-2">
          Welcome to <span className="font-bold text-blue-400">{plan}</span>, {cardHolder}!
        </h1>
        <p className="text-lg text-white/70">Your subscription is now active and ready to use</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full relative z-10">
        {/* Card Preview Section */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-[600px] max-h-[400px] perspective-1000 my-8">
            <RealisticCardPreview
              cardNumber={maskedCardNumber}
              cardHolder={cardHolder}
              expiryDate=""
              cvv=""
              cardType={cardType}
              cardBackground={cardBackground}
              isSubmitting={false}
              readOnly
            >
              <div className="relative flex flex-col h-full text-white/80 pt-3">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-14 ml-6 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-md border-2 border-yellow-800/50 shadow-lg flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full relative">
                        <div className="absolute inset-1 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-sm border-2 border-yellow-800/70">
                          <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-500 rounded-sm"></div>
                          <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-sm"></div>
                          <div className="absolute bottom-1 left-1 w-2 h-2 bg-yellow-500 rounded-sm"></div>
                          <div className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-500 rounded-sm"></div>
                          <div className="absolute inset-2 border-2 border-dashed border-yellow-800/70 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <Wifi className="w-16 h-16 text-white/70 rotate-90" />
                  </div>
                  <div className="mr-6">{getCardLogo()}</div>
                </div>
                <div className="mb-10 mt-8 text-white/90">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-white/10">
                      <span className="text-sm opacity-80">Plan:</span>
                      <span className="font-semibold text-blue-400">{plan}</span>
                    </div>
                    <div className="flex justify-between items-center border-white/10">
                      <span className="text-sm opacity-80">Amount:</span>
                      <span className="font-medium">${price.toFixed(2)}/month</span>
                    </div>
                    <div className="flex justify-between items-center border-white/10">
                      <span className="text-sm opacity-80">Payment Method:</span>
                      <span className="font-medium">{maskedCardNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">Status:</span>
                      <span className="flex items-center gap-2 text-green-400 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </RealisticCardPreview>
          </div>
        </div>

        {/* Features and Next Steps Section */}
        <div className="space-y-4 mt-8 max-w-2xl w-lg mx-auto">
          {/* Plan Features */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-blue-500/20">
            <Collapsible open={isPlanFeaturesOpen} 
            onOpenChange={setIsPlanFeaturesOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-1 text-lg font-bold text-blue-400">
                    Your <span className="text-blue-400">{plan}</span> Plan Features
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 text-blue-400 transition-transform ${isPlanFeaturesOpen ? "rotate-90" : ""}`}
                  />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="animate-slide-in">
                <CardContent className="grid grid-cols-2 gap-3 text-xs p-4 pt-0">
                  {planFeatures[plan as keyof typeof planFeatures].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/80">
                      <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-blue-500/20">
            <Collapsible open={isNextStepsOpen} onOpenChange={setIsNextStepsOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-1 text-lg font-bold text-blue-400">
                    What&apos;s Next?
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 text-blue-400 transition-transform ${isNextStepsOpen ? "rotate-90" : ""}`}
                  />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="animate-slide-in">
                <CardContent className="space-y-3 p-4 pt-0">
                  {nextSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        currentStep === index
                          ? "bg-blue-500/20 border border-blue-400/30"
                          : "bg-white/5 border border-transparent hover:bg-white/10"
                      }`}
                    >
                      <div className={`p-2 rounded-md ${currentStep === index ? "bg-blue-500/30" : "bg-white/10"}`}>
                        {step.icon}
                      </div>
                      <span className="text-xs text-white/90 flex-1">{step.text}</span>
                      {currentStep === index && <ArrowRight className="w-3 h-3 text-blue-400 animate-pulse" />}
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              onClick={() => router.push("/")}
              className="flex-1 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={printReceipt}
              className="flex-1 h-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 border-white/20 rounded-full px-4 py-2"
            >
              <Download className="w-4 h-4" />
              Receipt
            </Button>
          </div>
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="dialog-content max-w-md p-6 bg-gray-900 text-white/90">
          <VisuallyHidden>
            <DialogTitle>Subscription Receipt</DialogTitle>
          </VisuallyHidden>
          <SubscriptionReceipt
            receipt={receiptData}
            isOpen={isReceiptOpen}
            onOpenChange={setIsReceiptOpen}
            onPrint={printReceipt}
          />
        </DialogContent>
      </Dialog>

      <section className="text-center pt-8 border-t mt-10">
        <p className="text-sm text-gray-400">
          Need help? Contact our support team at{" "}
          <a href="mailto:support@opennews.com" className="text-blue-400 hover:text-blue-300 underline">
            support@opennews.com
          </a>
        </p>
        <section/>
        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slide-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes gradient {
            0%,
            100% {
              background-size: 200% 200%;
              background-position: left center;
            }
            50% {
              background-size: 200% 200%;
              background-position: right center;
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out;
          }
          .animate-slide-in {
            animation: slide-in 0.6s ease-out;
          }
          .animate-gradient {
            animation: gradient 3s ease infinite;
          }
          @media print {
            body * {
              visibility: hidden;
            }
            .dialog-content,
            .dialog-content * {
              visibility: visible;
            }
            .dialog-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white;
              color: black;
            }
          }
        `}</style>
      </section>
    </div>
  );
}