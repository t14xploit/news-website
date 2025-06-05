"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlan } from "@/components/subscribe/plan-context";
import { RealisticCardPreview } from "@/components/payment-card";
import { CardBackground, CardType } from "@/components/payment-card/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  CreditCard,
  Plus,
  Edit3,
  Trash2,
  Receipt,
  Star,
  Shield,
  TrendingUp,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  Sparkles,
  MoreHorizontal,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardPreviewFormData, cardPreviewSchema } from "@/lib/validation/card-preview-schema";
import { toast } from "sonner";
import { format, parseISO, differenceInDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

interface EnhancedSavedCard {
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
  isDefault: boolean;
  securityLevel: "basic" | "premium" | "ultimate";
  transactionCount: number;
  totalSpent: number;
  isActive: boolean;
  tags: string[];
  nickname?: string;
}

interface ReceiptData {
  transactionId: string;
  date: string;
  plan: string;
  amount: number;
}

const PLAN_FEATURES = {
  Free: {
    features: ["Basic Support", "1 Project", "Community Access"],
    color: "bg-gray-500",
    icon: <Shield className="w-4 h-4" />,
  },
  Elite: {
    features: ["Priority Support", "10 Projects", "Advanced Analytics", "API Access"],
    color: "bg-blue-500",
    icon: <Star className="w-4 h-4" />,
  },
  Business: {
    features: [
      "24/7 Support",
      "Unlimited Projects",
      "Advanced Analytics",
      "API Access",
      "Custom Integrations",
    ],
    color: "bg-purple-500",
    icon: <Sparkles className="w-4 h-4" />,
  },
};

export default function EnhancedCardDetailsPage() {
  const { userId } = usePlan();
  const [savedCards, setSavedCards] = useState<EnhancedSavedCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"lastUsed" | "plan" | "spending">("lastUsed");
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [receiptCardId, setReceiptCardId] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<
    CardPreviewFormData & { nickname?: string }
  >({
    resolver: zodResolver(cardPreviewSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      cardBackground: "black",
      plan: "Free",
      nickname: "",
    },
  });

  // Enhanced filtering and sorting logic
  const filteredAndSortedCards = useMemo(() => {
    const filtered = savedCards.filter((card) => {
      const matchesSearch =
        card.cardHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.cardNumber.slice(-4).includes(searchTerm);
      const matchesPlan = filterPlan === "all" || card.plan === filterPlan;
      return matchesSearch && matchesPlan;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "lastUsed":
          return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
        case "plan":
          return a.plan.localeCompare(b.plan);
        case "spending":
          return b.totalSpent - a.totalSpent;
        default:
          return 0;
      }
    });
  }, [savedCards, searchTerm, filterPlan, sortBy]);

  // Statistics calculations
  const stats = useMemo(() => {
    const totalCards = savedCards.length;
    const totalSpent = savedCards.reduce((sum, card) => sum + card.totalSpent, 0);
    const activeCards = savedCards.filter((card) => card.isActive).length;
    const averageSpending = totalCards > 0 ? totalSpent / totalCards : 0;

    return { totalCards, totalSpent, activeCards, averageSpending };
  }, [savedCards]);

  // Load cards with enhanced data structure
  useEffect(() => {
    if (typeof window !== "undefined" && userId) {
      try {
        const cards = JSON.parse(localStorage.getItem(`enhanced_cards_${userId}`) || "[]");
        interface StoredCard {
          id?: string;
          cardNumber: string;
          cardHolder: string;
          expiryDate: string;
          cvv: string;
          cardType?: CardType;
          cardBackground: CardBackground;
          plan: string;
          price?: number;
          lastUsed?: string;
          isDefault?: boolean;
          securityLevel?: 'basic' | 'premium' | 'ultimate';
          transactionCount?: number;
          totalSpent?: number;
          isActive?: boolean;
          tags?: string[];
          nickname?: string;
        }

        const enhancedCards = cards.map((card: StoredCard) => ({
          ...card,
          isDefault: card.isDefault || false,
          securityLevel: card.securityLevel || "basic",
          transactionCount: card.transactionCount || Math.floor(Math.random() * 50),
          totalSpent: card.totalSpent || Math.floor(Math.random() * 1000),
          isActive: card.isActive !== false,
          tags: card.tags || [],
          nickname: card.nickname || "",
        }));
        setSavedCards(enhancedCards);
      } catch (error) {
        console.error("Error loading enhanced cards:", error);
        setSavedCards([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userId]);

  const handleAddOrEditCard = (data: CardPreviewFormData & { nickname?: string }) => {
    const priceMap: Record<string, number> = { Free: 0, Elite: 19.99, Business: 49.99 };

    const newCard: EnhancedSavedCard = {
      id: editingCardId || crypto.randomUUID(),
      cardNumber: data.cardNumber.replace(/\s/g, ""),
      cardHolder: data.cardHolder,
      expiryDate: data.expiryDate,
      cvv: data.cvv,
      cardType: detectCardType(data.cardNumber) as CardType,
      cardBackground: data.cardBackground as CardBackground,
      plan: data.plan,
      price: priceMap[data.plan] || 0,
      lastUsed: new Date().toISOString(),
      isDefault: editingCardId
        ? savedCards.find((c) => c.id === editingCardId)?.isDefault || false
        : savedCards.length === 0,
      securityLevel: data.plan === "Business" ? "ultimate" : data.plan === "Elite" ? "premium" : "basic",
      transactionCount: editingCardId
        ? savedCards.find((c) => c.id === editingCardId)?.transactionCount || 0
        : 0,
      totalSpent: editingCardId ? savedCards.find((c) => c.id === editingCardId)?.totalSpent || 0 : 0,
      isActive: true,
      tags: [],
      nickname: data.nickname || "",
    };

    let updatedCards: EnhancedSavedCard[];
    if (editingCardId) {
      updatedCards = savedCards.map((card) => (card.id === editingCardId ? newCard : card));
      toast.success("Card updated successfully!");
    } else {
      updatedCards = [...savedCards, newCard];
      toast.success("New card added successfully!");
    }

    setSavedCards(updatedCards);
    localStorage.setItem(`enhanced_cards_${userId}`, JSON.stringify(updatedCards));
    setIsModalOpen(false);
    setEditingCardId(null);
    reset();
  };

  const detectCardType = (cardNumber: string): CardType => {
    const cleaned = cardNumber.replace(/\D/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";
    return "generic";
  };

  const toggleCardDefault = (cardId: string) => {
    const updatedCards = savedCards.map((card) => ({
      ...card,
      isDefault: card.id === cardId,
    }));
    setSavedCards(updatedCards);
    localStorage.setItem(`enhanced_cards_${userId}`, JSON.stringify(updatedCards));
    toast.success("Default card updated!");
  };

  const handleEditCard = (card: EnhancedSavedCard) => {
    setEditingCardId(card.id);
    reset({
      cardNumber: card.cardNumber,
      cardHolder: card.cardHolder,
      expiryDate: card.expiryDate,
      cvv: card.cvv,
      cardBackground: card.cardBackground,
      plan: card.plan as "Free" | "Elite" | "Business",
      nickname: card.nickname,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = savedCards.filter((card) => card.id !== cardId);
    setSavedCards(updatedCards);
    localStorage.setItem(`enhanced_cards_${userId}`, JSON.stringify(updatedCards));
    toast.success("Card deleted successfully!");
  };

  const receiptData: ReceiptData | null = receiptCardId
    ? {
        transactionId: `TXN-${receiptCardId.slice(0, 8)}`,
        date: format(new Date(), "MMM d, yyyy"),
        plan: savedCards.find((card) => card.id === receiptCardId)?.plan || "Unknown",
        amount: savedCards.find((card) => card.id === receiptCardId)?.price || 0,
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/90 text-lg">Loading your card details...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 pt-20">
      {/* Enhanced Header with Statistics */}
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Payment Dashboard
          </h1>
          <p className="text-white/70 text-xl">Manage your cards and subscriptions with style</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Cards", value: stats.totalCards, icon: CreditCard, color: "blue" },
            { title: "Total Spent", value: `$${stats.totalSpent.toFixed(2)}`, icon: DollarSign, color: "green" },
            { title: "Active Cards", value: stats.activeCards, icon: TrendingUp, color: "purple" },
            { title: "Avg. Spending", value: `$${stats.averageSpending.toFixed(2)}`, icon: Star, color: "pink" },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/10 border-${stat.color}-500/20 backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Controls */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  placeholder="Search cards, holders, or last 4 digits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              {/* Filters */}
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Elite">Elite</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: "lastUsed" | "plan" | "spending") => setSortBy(value)}>
                <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  <SelectItem value="lastUsed">Last Used</SelectItem>
                  <SelectItem value="plan">Plan Type</SelectItem>
                  <SelectItem value="spending">Total Spent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="show-numbers" className="text-white/70">
                  Show Numbers
                </Label>
                <Switch id="show-numbers" checked={showCardNumbers} onCheckedChange={setShowCardNumbers} />
              </div>

              <Tabs value={viewMode} onValueChange={(value: string) => setViewMode(value as "grid" | "list")}>
                <TabsList className="bg-white/10">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-blue-500">
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="list" className="data-[state=active]:bg-blue-500">
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Add Card Button */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {editingCardId ? "Edit Payment Method" : "Add New Payment Method"}
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSubmit(handleAddOrEditCard)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nickname">Card Nickname</Label>
                        <Input
                          {...register("nickname")}
                          placeholder="My Main Card"
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardHolder">Cardholder Name</Label>
                        <Input
                          {...register("cardHolder")}
                          placeholder="John Doe"
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                        {errors.cardHolder && (
                          <p className="text-red-400 text-sm">{errors.cardHolder.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        {...register("cardNumber", {
                          onChange: (e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length > 16) value = value.slice(0, 16);
                            value = value.replace(/(\d{4})/g, "$1 ").trim();
                            e.target.value = value;
                          },
                        })}
                        placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      {errors.cardNumber && (
                        <p className="text-red-400 text-sm">{errors.cardNumber.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          {...register("expiryDate", {
                            onChange: (e) => {
                              let value = e.target.value.replace(/\D/g, "");
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + "/" + value.slice(2, 4);
                              }
                              e.target.value = value;
                            },
                          })}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                        {errors.expiryDate && (
                          <p className="text-red-400 text-sm">{errors.expiryDate.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          {...register("cvv")}
                          placeholder="123"
                          maxLength={4}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                        {errors.cvv && <p className="text-red-400 text-sm">{errors.cvv.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardBackground">Card Design</Label>
                        <Controller
                          name="cardBackground"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-600">
                                <SelectItem value="blue">Ocean Blue</SelectItem>
                                <SelectItem value="purple">Royal Purple</SelectItem>
                                <SelectItem value="black">Midnight Black</SelectItem>
                                <SelectItem value="gradient">Rainbow Gradient</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="plan">Subscription Plan</Label>
                        <Controller
                          name="plan"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-600">
                                <SelectItem value="Free">Free ($0/month)</SelectItem>
                                <SelectItem value="Elite">Elite ($19.99/month)</SelectItem>
                                <SelectItem value="Business">Business ($49.99/month)</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    {/* Live Card Preview */}
                    <div className="space-y-2">
                      <Label>Card Preview</Label>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                        <RealisticCardPreview
                          cardNumber={watch("cardNumber") || ""}
                          cardHolder={watch("cardHolder") || ""}
                          expiryDate={watch("expiryDate") || ""}
                          cvv={watch("cvv") || ""}
                          cardType={detectCardType(watch("cardNumber") || "")}
                          cardBackground={watch("cardBackground") as CardBackground}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      {editingCardId ? "Update Payment Method" : "Add Payment Method"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Enhanced Cards Display */}
        <AnimatePresence mode="wait">
          {filteredAndSortedCards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <CreditCard className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white/70 mb-2">No Payment Methods</h3>
              <p className="text-white/50 mb-6">Add your first payment method to get started</p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Card
              </Button>
            </motion.div>
          ) : (
            <div
              className={
                viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-4"
              }
            >
              {filteredAndSortedCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={viewMode === "list" ? "w-full" : ""}
                >
                  {viewMode === "grid" ? (
                    <EnhancedCardComponent
                      card={card}
                      showCardNumbers={showCardNumbers}
                      onEdit={handleEditCard}
                      onDelete={handleDeleteCard}
                      onToggleDefault={toggleCardDefault}
                      onGenerateReceipt={(cardId) => setReceiptCardId(cardId)}
                    />
                  ) : (
                    <EnhancedListCard
                      card={card}
                      showCardNumbers={showCardNumbers}
                      onEdit={handleEditCard}
                      onDelete={handleDeleteCard}
                      onToggleDefault={toggleCardDefault}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Advanced Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Spending Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-white/10">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {savedCards.map((card) => (
                      <div key={card.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-sm">
                            {card.nickname || `${card.cardType.toUpperCase()} •••• ${card.cardNumber.slice(-4)}`}
                          </span>
                          {card.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          ${card.totalSpent.toFixed(2)}
                        </div>
                        <div className="text-sm text-white/50">{card.transactionCount} transactions</div>
                        <Progress
                          value={(card.totalSpent / Math.max(...savedCards.map((c) => c.totalSpent))) * 100}
                          className="mt-2 h-2"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                  <div className="text-center py-8 text-white/50">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Spending trends visualization coming soon...</p>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedCards.map((card) => (
                      <div key={card.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-sm">
                            {card.nickname || `•••• ${card.cardNumber.slice(-4)}`}
                          </span>
                          <Badge
                            variant={
                              card.securityLevel === "ultimate"
                                ? "default"
                                : card.securityLevel === "premium"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {card.securityLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield
                            className={`w-4 h-4 ${
                              card.securityLevel === "ultimate"
                                ? "text-green-400"
                                : card.securityLevel === "premium"
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-white/70 text-sm">
                            Last used: {format(parseISO(card.lastUsed), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Receipt Modal */}
        <Dialog open={!!receiptCardId} onOpenChange={() => setReceiptCardId(null)}>
          <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Subscription Receipt
              </DialogTitle>
            </DialogHeader>
            {receiptData && (
              <SubscriptionReceipt
                receiptData={receiptData}
                onDownload={() => toast.success("Receipt downloaded successfully!")}
              />
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

// Enhanced Card Component
const EnhancedCardComponent = ({
  card,
  showCardNumbers,
  onEdit,
  onDelete,
  onToggleDefault,
  onGenerateReceipt,
}: {
  card: EnhancedSavedCard;
  showCardNumbers: boolean;
  onEdit: (card: EnhancedSavedCard) => void;
  onDelete: (cardId: string) => void;
  onToggleDefault: (cardId: string) => void;
  onGenerateReceipt: (cardId: string) => void;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovered, setIsHovered] = useState(false);
  const daysSinceLastUse = differenceInDays(new Date(), parseISO(card.lastUsed));

  return (
    <motion.div
      className="relative group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden">
        <CardContent className="p-0">
          {/* Card Preview */}
          <div className="relative p-6">
            <RealisticCardPreview
              cardNumber={showCardNumbers ? card.cardNumber : `****-****-****-${card.cardNumber.slice(-4)}`}
              cardHolder={card.cardHolder}
              expiryDate={card.expiryDate}
              cvv={showCardNumbers ? card.cvv : "***"}
              cardType={card.cardType}
              cardBackground={card.cardBackground}
            />
            
            {/* Status Badges */}
            <div className="absolute top-2 right-2 flex gap-2">
              {card.isDefault && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Default
                </Badge>
              )}
              <Badge className={`${PLAN_FEATURES[card.plan as keyof typeof PLAN_FEATURES].color}/20 border-white/20`}>
                {card.plan}
              </Badge>
            </div>
          </div>

          {/* Card Details */}
          <div className="px-6 pb-6 space-y-4">
            {/* Card Info */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">
                  {card.nickname || `${card.cardType.toUpperCase()} Card`}
                </h3>
                <p className="text-white/60 text-sm">
                  •••• {card.cardNumber.slice(-4)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">${card.price.toFixed(2)}/mo</p>
                <p className="text-white/60 text-sm">{card.plan} Plan</p>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-2 gap-4 py-3 border-t border-white/10">
              <div className="text-center">
                <p className="text-white/60 text-xs uppercase tracking-wide">Total Spent</p>
                <p className="text-white font-semibold">${card.totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-xs uppercase tracking-wide">Transactions</p>
                <p className="text-white font-semibold">{card.transactionCount}</p>
              </div>
            </div>

            {/* Last Used */}
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="w-4 h-4" />
              <span>
                Last used{" "}
                {daysSinceLastUse === 0
                  ? "today"
                  : daysSinceLastUse === 1
                  ? "yesterday"
                  : `${daysSinceLastUse} days ago`}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(card)}
                className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onGenerateReceipt(card.id)}
                className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <Receipt className="w-4 h-4 mr-2" />
                Receipt
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gray-900 text-white border-gray-700">
                  <SheetHeader>
                    <SheetTitle className="text-white">Card Settings</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="flex items-center justify-between">
                      <span>Set as Default</span>
                      <Switch checked={card.isDefault} onCheckedChange={() => onToggleDefault(card.id)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Active Status</span>
                      <Switch checked={card.isActive} />
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() => onDelete(card.id)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Card
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Enhanced List Card Component
const EnhancedListCard = ({
  card,
  showCardNumbers,
  onEdit,
  onDelete,
  onToggleDefault,
}: {
  card: EnhancedSavedCard;
  showCardNumbers: boolean;
  onEdit: (card: EnhancedSavedCard) => void;
  onDelete: (cardId: string) => void;
  onToggleDefault: (cardId: string) => void;
}) => {
  const [isPlanFeaturesOpen, setIsPlanFeaturesOpen] = useState(false);
  const [isNextStepsOpen, setIsNextStepsOpen] = useState(false);

  const planFeatures = {
    Free: ["Basic card management", "Up to 2 cards", "Standard support"],
    Elite: ["Advanced analytics", "Up to 10 cards", "Priority support", "Custom themes"],
    Business: ["Unlimited cards", "Team management", "API access", "White-label options"],
  };

  const nextSteps = [
    { icon: <CreditCard className="w-4 h-4" />, text: "Set up automatic payments" },
    { icon: <Shield className="w-4 h-4" />, text: "Enable security notifications" },
    { icon: <Settings className="w-4 h-4" />, text: "Configure spending limits" },
    { icon: <Bell className="w-4 h-4" />, text: "Subscribe to usage alerts" },
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-mono">{card.cardType.toUpperCase()}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {card.nickname || `${card.cardType.toUpperCase()} Card`}
            </h3>
            <p className="text-white/60 text-sm">
              •••• {showCardNumbers ? card.cardNumber.slice(-4) : "••••"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white font-semibold">${card.price.toFixed(2)}/mo</p>
            <p className="text-white/60 text-sm">{card.plan} Plan</p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(card)}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <Edit3 className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700">
                <DropdownMenuItem onClick={() => onToggleDefault(card.id)}>
                  {card.isDefault ? "Remove as Default" : "Set as Default"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(card.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Plan Features Dropdown */}
      <Collapsible open={isPlanFeaturesOpen} onOpenChange={setIsPlanFeaturesOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer py-3 border-t border-white/10">
            <div className="flex items-center gap-1 text-lg font-bold text-blue-400">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              Your <span className="text-blue-400 mx-1">{card.plan}</span> Plan Features
            </div>
            <ArrowRight
              className={`w-4 h-4 text-blue-400 transition-transform ${isPlanFeaturesOpen ? "rotate-90" : ""}`}
            />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent className="animate-slide-in">
          <CardContent className="grid grid-cols-2 gap-3 text-sm p-4 pt-0">
            {planFeatures[card.plan as keyof typeof planFeatures].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-white/80 p-1">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      {/* Next Steps Dropdown */}
      <Collapsible open={isNextStepsOpen} onOpenChange={setIsNextStepsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer py-3 border-t border-white/10">
            <div className="flex items-center gap-1 text-lg font-bold text-blue-400">
              <ArrowRight className="w-4 h-4 mr-1" />
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
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-transparent hover:bg-white/10 transition-all duration-300"
              >
                <div className="p-2 rounded-md bg-white/10">{step.icon}</div>
                <span className="text-sm text-white/90 flex-1">{step.text}</span>
                <ArrowRight className="w-3 h-3 text-blue-400" />
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

// Enhanced Receipt Component
const SubscriptionReceipt = ({
  receiptData,
  onDownload,
}: {
  receiptData: ReceiptData;
  onDownload: () => void;
}) => {
  return (
    <div className="space-y-6 p-6 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Subscription Receipt</h3>
        <Badge className="bg-blue-500/20 text-white">Paid</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-white/60">Transaction ID</p>
          <p className="text-white font-mono">{receiptData.transactionId}</p>
        </div>
        <div>
          <p className="text-white/60">Date</p>
          <p className="text-white">{receiptData.date}</p>
        </div>
        <div>
          <p className="text-white/60">Plan</p>
          <p className="text-white">{receiptData.plan}</p>
        </div>
        <div>
          <p className="text-white/60">Amount</p>
          <p className="text-white font-semibold">${receiptData.amount.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-white/10">
        <Button
          onClick={onDownload}
          className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-10 bg-white/10 hover:bg-white/10 border-white/20"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Email Receipt
        </Button>
      </div>
    </div>
  );
};