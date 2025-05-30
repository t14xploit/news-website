"use client";

import { SetStateAction, useEffect, useState } from "react";
import { usePlan } from "@/components/subscribe/plan-context";
import { RealisticCardPreview } from "@/components/payment-card";
import { CardBackground, CardType } from "@/components/payment-card/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CardPreviewFormData, cardPreviewSchema } from "@/lib/validation/card-preview-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, CircleFadingPlus, Receipt } from "lucide-react";
import { SubscriptionReceipt } from "@/components/receipt/subscription-receipt";
import { ReceiptData } from "@/components/receipt/types";
import { generateReceiptData } from "@/actions/receipt-action";

interface SavedCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  cardType: CardType;
  cardBackground: CardBackground;
  plan: string;
  price: number;
  lastUsed: string;
}

export default function AccountPage() {
  const { userId } = usePlan();
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [receiptCardId, setReceiptCardId] = useState<string | null>(null); 
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CardPreviewFormData>({
    resolver: zodResolver(cardPreviewSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      cardBackground: "black",
      plan: "Free",
    },
  });
  
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  
  useEffect(() => {
    if (typeof window !== "undefined" && userId) {
      try {
        const cards = JSON.parse(localStorage.getItem(`cards_${userId}`) || "[]");
        const seenIds = new Set<string>();
        interface RawCard {
          id?: string;
          cardNumber?: string;
          cardHolder?: string;
          expiryDate?: string;
          cvv?: string;
          cardType?: CardType;
          cardBackground?: CardBackground;
          plan?: string;
          price?: number;
          lastUsed?: string;
        }

        const sanitizedCards = cards
          .filter((card: RawCard) => card && typeof card === "object")
          .map((card: RawCard) => {
            const id = card.id && !seenIds.has(card.id) ? card.id : generateUUID();
            seenIds.add(id);
            return {
              id,
              cardNumber: card.cardNumber || "",
              cardHolder: card.cardHolder || "Unknown",
              expiryDate: card.expiryDate || "",
              cvv: card.cvv || "",
              cardType: card.cardType,
              cardBackground: card.cardBackground,
              plan: card.plan || "Free",
              price: typeof card.price === "number" ? card.price : 0,
              lastUsed: card.lastUsed || new Date().toISOString(),
            } as SavedCard;
          });
        setSavedCards(sanitizedCards);
      } catch (error) {
        console.error("Error loading saved cards:", error);
        setSavedCards([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userId]);


  useEffect(() => {
    if (receiptCardId && userId) {
      const card = savedCards.find((c) => c.id === receiptCardId);
      if (card) {
        generateReceiptData(card, userId)
          .then((data: SetStateAction<ReceiptData | null>) => setReceiptData(data))
          .catch((error: Error) => {
            console.error("Error fetching receipt data:", error);
            setReceiptData(null);
          });
      }
    } else {
      setReceiptData(null);
    }
  }, [receiptCardId, savedCards, userId]);

  const handleAddOrEditCard = (data: CardPreviewFormData) => {
    const priceMap: Record<string, number> = {
      Free: 0,
      Elite: 19.99,
      Business: 49.99,
    };

    const newCard: SavedCard = {
      id: editingCardId || generateUUID(),
      cardNumber: data.cardNumber.replace(/\s/g, ""),
      cardHolder: data.cardHolder,
      expiryDate: data.expiryDate,
      cvv: data.cvv,
      cardType: detectCardType(data.cardNumber),
      cardBackground: data.cardBackground as CardBackground,
      plan: data.plan,
      price: priceMap[data.plan] || 0,
      lastUsed: new Date().toISOString(),
    };

    let updatedCards: SavedCard[];
    if (editingCardId) {
      updatedCards = savedCards.map((card) =>
        card.id === editingCardId ? newCard : card
      );
    } else {
      updatedCards = [...savedCards, newCard];
    }

    setSavedCards(updatedCards);
    if (typeof window !== "undefined") {
      localStorage.setItem(`cards_${userId}`, JSON.stringify(updatedCards));
    }
    setIsModalOpen(false);
    setEditingCardId(null);
    reset();
  };

  const handleEditCard = (card: SavedCard) => {
    setEditingCardId(card.id);
    reset({
      cardNumber: card.cardNumber.replace(/(\d{4})(?=\d)/g, "$1 "),
      cardHolder: card.cardHolder,
      expiryDate: card.expiryDate,
      cvv: card.cvv,
      cardBackground: card.cardBackground,
      plan: card.plan as "Free" | "Elite" | "Business",
    });
    setIsModalOpen(true);
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = savedCards.filter((card) => card.id !== cardId);
    setSavedCards(updatedCards);
    if (typeof window !== "undefined") {
      localStorage.setItem(`cards_${userId}`, JSON.stringify(updatedCards));
    }
  };

  const detectCardType = (cardNumber: string): CardType => {
    const cleaned = cardNumber.replace(/\D/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";
    return "generic";
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return <div className="text-white/90">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-start gap-4">
      <h2 className="text-4xl font-medium">Card and Subscription Details</h2>
      <p className="text-gray-400 mb-10">Saved Payment Methods and Plans</p>
      <div className="w-full max-w-3xl">
        <div className="flex justify-end items-center mb-4">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className=" bg-blue-500 hover:bg-blue-600 text-white/90 font-semibold">
                <CircleFadingPlus className="w-10 h-10 mr-2" /> Add New Card
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white/90">
              <DialogHeader>
                <DialogTitle>{editingCardId ? "Edit Card" : "Add New Card"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleAddOrEditCard)} className="space-y-4">
                <div>
                  <Input
                    {...register("cardNumber", {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 16) value = value.slice(0, 16);
                        value = value.replace(/(\d{4})/g, "$1 ").trim();
                        e.target.value = value;
                      },
                    })}
                    placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                    className="bg-gray-800 text-white/90 border-gray-700"
                  />
                  {errors.cardNumber && (
                    <p className="text-red-400 text-xs mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    {...register("cardHolder")}
                    placeholder="Cardholder Name"
                    className="bg-gray-800 text-white/90 border-gray-700"
                  />
                  {errors.cardHolder && (
                    <p className="text-red-400 text-xs mt-1">{errors.cardHolder.message}</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Input
                      {...register("expiryDate")}
                      placeholder="MM/YY"
                      className="bg-gray-800 text-white/90 border-gray-700"
                    />
                    {errors.expiryDate && (
                      <p className="text-red-400 text-xs mt-1">{errors.expiryDate.message}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <Input
                      {...register("cvv")}
                      placeholder="CVV"
                      className="bg-gray-800 text-white/90 border-gray-700"
                    />
                    {errors.cvv && (
                      <p className="text-red-400 text-xs mt-1">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <select
                    {...register("cardBackground")}
                    className="w-full bg-gray-800 text-white/90 border-gray-700 rounded-md p-2"
                  >
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="black">Black</option>
                    <option value="gradient">Gradient</option>
                  </select>
                  {errors.cardBackground && (
                    <p className="text-red-400 text-xs mt-1">{errors.cardBackground.message}</p>
                  )}
                </div>
                <div>
                  <select
                    {...register("plan")}
                    className="w-full bg-gray-800 text-white/90 border-gray-700 rounded-md p-2"
                  >
                    <option value="Free">Free ($0)</option>
                    <option value="Elite">Elite ($19.99)</option>
                    <option value="Business">Business ($49.99)</option>
                  </select>
                  {errors.plan && (
                    <p className="text-red-400 text-xs mt-1">{errors.plan.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  {editingCardId ? "Update Card" : "Add Card"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {savedCards.length === 0 ? (
          <p className="text-white/60 text-center">No payment methods saved.</p>
        ) : (
          <div className="grid gap-6">
            {savedCards.map((card, index) => (
              <div key={card.id || `card-${index}`} className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="text-white/90">
                    <h3 className="text-xl mb-2">Card Details</h3>
                    <p className="mb-2">
                      Plan: <span className="text-blue-400">{card.plan}</span>
                    </p>
                    <p className="mb-2">
                      Price: <span className="text-blue-400">${(card.price || 0).toFixed(2)}</span>
                    </p>
                    <p className="text-white/60">
                      Last Used: {formatDate(new Date(card.lastUsed))}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCard(card)}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReceiptCardId(card.id)}
                    >
                      <Receipt className="w-4 h-4 mr-2" /> View Receipt
                    </Button>
                  </div>
                </div>
                <RealisticCardPreview
                  cardNumber={`**** **** **** ${card.cardNumber.slice(-4)}`}
                  cardHolder={card.cardHolder}
                  expiryDate={card.expiryDate}
                  cvv={card.cvv}
                  cardType={card.cardType}
                  cardBackground={card.cardBackground}
                  isSubmitting={false}
                  readOnly={true}
                />
                {receiptCardId === card.id && receiptData && (
                  <SubscriptionReceipt
                    receipt={receiptData}
                    isOpen={receiptCardId === card.id}
                    onOpenChange={(open) => !open && setReceiptCardId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}