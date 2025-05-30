export interface Subscription {
  id: string;
  plan: "Free" | "Elite" | "Business";
  status: string;
  price: number;
  expiresAt: string;
}

export interface NewsletterSettings {
  id: string;
  userId: string;
  categories: string[];
  frequency: string;
}
