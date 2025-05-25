"use client";

import { useEffect, useState } from "react";
import { usePlan } from "@/components/subscribe/plan-context";
import { RealisticCardPreview } from "@/components/payment-card";
import { CardBackground, CardType } from "@/components/payment-card/types";

interface SavedCard {
  cardNumber: string;
  cardHolder: string;
  cardType: CardType;
  cardBackground: CardBackground;
  plan: string;
  lastUsed: string;
}

export default function AccountPage() {
  const { userId } = usePlan();
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);

  useEffect(() => {
    if (userId) {
      const cards = JSON.parse(localStorage.getItem(`cards_${userId}`) || "[]");
      setSavedCards(cards);
    }
  }, [userId]);

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-start gap-8">
      <h1 className="text-4xl text-white/90">Your Account</h1>
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl text-white/90 mb-4">Saved Payment Methods</h2>
        {savedCards.length === 0 ? (
          <p className="text-white/60">No payment methods saved.</p>
        ) : (
          <div className="grid gap-6">
            {savedCards.map((card, index) => (
              <RealisticCardPreview
                key={index}
                cardNumber={`**** **** **** ${card.cardNumber.slice(-4)}`}
                cardHolder={card.cardHolder}
                expiryDate=""
                cvv=""
                cardType={card.cardType}
                cardBackground={card.cardBackground}
                isSubmitting={false}
                readOnly
              >
                <div className="relative flex flex-col h-full text-white/90 pt-2">
                  <h3 className="text-xl mb-4">Card Details</h3>
                  <p className="mb-2">
                    Plan: <span className="text-blue-400">{card.plan}</span>
                  </p>
                  <p className="text-white/60">
                    Last Used: {new Date(card.lastUsed).toLocaleDateString()}
                  </p>
                </div>
              </RealisticCardPreview>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
