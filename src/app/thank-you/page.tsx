"use client";

import { CheckCircle, Wifi } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { JSX, useEffect } from "react";
import { RealisticCardPreview } from "@/components/payment-card";
import { CardBackground, CardType } from "@/components/payment-card";

const validPlans = ["Free", "Elite", "Business"];

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const cardBackground = (searchParams.get("cardBackground") ||
    "gradient") as CardBackground;
  const price = parseFloat(
    searchParams.get("price") || priceMap[plan].toString()
  );

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
  const maskedCardNumber = cardNumber
    ? `**** **** **** ${cardNumber.slice(-4)}`
    : "**** **** **** ****";

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

  return (
    <div className=" flex items-center justify-center">
      <div className="relative w-full max-w-[600px] max-h-[400px] perspective-1000 my-8">
        <div className="text-center mb-15">
          <h1 className="text-4xl mb-6 text-white/90">
            Thank You for Your <span className="text-blue-400">{plan}</span>{" "}
            Subscription, <span className="text-white/90">{cardHolder}</span>!
          </h1>
          <p className="text-lg text-white/90">
            Your payment was processed successfully
            <CheckCircle className="inline-block text-green-600 opacity-70 w-5 h-5" />
          </p>
        </div>
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
            <div className="mt-4 p-4 text-white/90">
              <h2 className="text-xl font-semibold mb-3">
                Subscription Details:
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Plan:</span>
                  <span className="font-medium text-blue-400">{plan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Price:</span>
                  <span className="font-medium">${price.toFixed(2)}/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Card:</span>
                  <span className="font-medium">{maskedCardNumber}</span>
                </div>
                {/* <div className="mt-3 text-white/60 text-sm">
                  <p>You now have access to {plan} content.</p>
                  <p className="mt-1">Enjoy your subscription!</p>
                </div> */}
              </div>
            </div>
          </div>
        </RealisticCardPreview>
      </div>
    </div>
  );
}

// "use client";

// import { CheckCircle, Wifi } from "lucide-react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { JSX, useEffect } from "react";
// import { RealisticCardPreview } from "@/components/payment-card";
// import { CardBackground, CardType } from "@/components/payment-card";
// import { motion } from "framer-motion";

// const validPlans = ["Free", "Elite", "Business"];

// export default function ThankYouPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const rawPlan = searchParams.get("plan") || "Free";
//   const plan = validPlans.includes(rawPlan) ? rawPlan : "Free";
//   const priceMap: Record<string, number> = {
//     Free: 0,
//     Elite: 19.99,
//     Business: 49.99,
//   };
//   const rawCardHolder = searchParams.get("cardHolder") || "User";
//   const cardHolder = rawCardHolder.replace(/[<>]/g, "");
//   const rawCardNumber = searchParams.get("cardNumber") || "";
//   const cardNumber = rawCardNumber.replace(/\s/g, "");
//   const cardBackground = (searchParams.get("cardBackground") ||
//     "gradient") as CardBackground;
//   const price = parseFloat(
//     searchParams.get("price") || priceMap[plan].toString()
//   );

//   const detectCardType = (cardNumber: string): CardType => {
//     const cleaned = cardNumber.replace(/\D/g, "");
//     if (/^4/.test(cleaned)) return "visa";
//     if (/^5[1-5]/.test(cleaned)) return "mastercard";
//     if (/^3[47]/.test(cleaned)) return "amex";
//     if (/^6(?:011|5)/.test(cleaned)) return "discover";
//     return "generic";
//   };

//   const getCardLogo = () => {
//     const logos: Record<CardType, JSX.Element> = {
//       visa: (
//         <div className="text-white font-bold tracking-tighter text-4xl">
//           <span className="italic">VISA</span>
//         </div>
//       ),
//       mastercard: (
//         <div className="flex">
//           <div className="h-10 w-10 rounded-full bg-red-500 opacity-80"></div>
//           <div className="h-10 w-10 -ml-4 rounded-full bg-yellow-500 opacity-80"></div>
//         </div>
//       ),
//       amex: (
//         <div className="text-white font-bold text-3xl">
//           <span>AMERICAN EXPRESS</span>
//         </div>
//       ),
//       discover: (
//         <div className="text-white font-bold text-3xl">
//           <span>DISCOVER</span>
//         </div>
//       ),
//       generic: (
//         <div className="text-white font-bold tracking-tighter text-4xl">
//           <span className="italic">Bank</span>
//         </div>
//       ),
//     };
//     return logos[cardType];
//   };

//   const cardType = detectCardType(cardNumber);
//   const maskedCardNumber = cardNumber
//     ? `**** **** **** ${cardNumber.slice(-4)}`
//     : "**** **** **** ****";

//   useEffect(() => {
//     if (!validPlans.includes(rawPlan) || !rawCardHolder || !rawCardNumber) {
//       console.log("ThankYouPage: Invalid params, redirecting to /", {
//         rawPlan,
//         rawCardHolder,
//         rawCardNumber,
//       });
//       router.push("/");
//     }
//   }, [rawPlan, rawCardHolder, rawCardNumber, router]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-center mb-8"
//       >
//         <h1 className="text-4xl font-bold mb-4 text-white/90 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
//           Thank You for Your Subscription!
//         </h1>
//         <div className="flex items-center justify-center gap-2 mb-2">
//           <CheckCircle className="text-green-500 w-6 h-6" />
//           <p className="text-lg text-white/90">
//             Payment processed successfully
//           </p>
//         </div>
//         <p className="text-xl text-white/80 mt-2">
//           Welcome to <span className="font-semibold text-blue-400">{plan}</span>,{" "}
//           <span className="font-semibold">{cardHolder}</span>!
//         </p>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         className="relative w-full max-w-[600px] perspective-1000 my-4"
//       >
//         <RealisticCardPreview
//           cardNumber={maskedCardNumber}
//           cardHolder={cardHolder}
//           expiryDate=""
//           cvv=""
//           cardType={cardType}
//           cardBackground={cardBackground}
//           isSubmitting={false}
//           readOnly
//         >
//           <div className="relative flex flex-col h-full text-white/80 pt-3">
//             <div className="flex justify-between items-start mb-10">
//               <div className="flex items-center gap-6">
//                 <div className="w-16 h-14 ml-6 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-md border-2 border-yellow-800/50 shadow-lg flex items-center justify-center overflow-hidden">
//                   <div className="w-full h-full relative">
//                     <div className="absolute inset-1 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-sm border-2 border-yellow-800/70">
//                       <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-500 rounded-sm"></div>
//                       <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-sm"></div>
//                       <div className="absolute bottom-1 left-1 w-2 h-2 bg-yellow-500 rounded-sm"></div>
//                       <div className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-500 rounded-sm"></div>
//                       <div className="absolute inset-2 border-2 border-dashed border-yellow-800/70 rounded-sm"></div>
//                     </div>
//                   </div>
//                 </div>
//                 <Wifi className="w-16 h-16 text-white/70 rotate-90" />
//               </div>
//               <div className="mr-6">{getCardLogo()}</div>
//             </div>
//             <div className="mt-4 p-4 text-white/90">
//               <h2 className="text-xl font-semibold mb-3">
//                 Subscription Details:
//               </h2>
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm">Plan:</span>
//                   <span className="font-medium text-blue-400">{plan}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm">Price:</span>
//                   <span className="font-medium">${price.toFixed(2)}/month</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm">Card:</span>
//                   <span className="font-medium">{maskedCardNumber}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </RealisticCardPreview>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.4 }}
//         className="mt-8 bg-blue-500/10 rounded-xl p-6 max-w-[600px] border border-blue-500/20"
//       >
//         <h3 className="text-xl font-medium text-blue-400 mb-3">What's Next?</h3>
//         <ul className="space-y-2 text-white/80">
//           <li className="flex items-center gap-2">
//             <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
//               <span className="text-xs text-blue-400">1</span>
//             </div>
//             <span>You now have full access to all {plan} plan features</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
//               <span className="text-xs text-blue-400">2</span>
//             </div>
//             <span>Your first billing cycle starts today</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
//               <span className="text-xs text-blue-400">3</span>
//             </div>
//             <span>Check your email for receipt and subscription details</span>
//           </li>
//         </ul>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.6 }}
//         className="mt-8 mb-12"
//       >
//         <button
//           onClick={() => router.push("/")}
//           className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
//         >
//           Continue to OpenNews
//         </button>
//       </motion.div>
//     </div>
//   );
// }
