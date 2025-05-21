import { PlanType } from "@/components/subscribe/plan-context";

export interface Plan {
  id: string;
  name: PlanType;
  price: number;
  description: string;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: "1",
    name: "Free",
    price: 0,
    description: "Stay informed with public news and community tools",
    features: [
      "Read all public news articles",
      "Create and organize your personal news feed",
      "Daily headlines digest with top stories",
      "Free email newsletter of breaking news",
      "Join community discussions on current events",
      "Basic news search and filtering",
    ],
  },
  {
    id: "2",
    name: "Elite",
    price: 19.99,
    description: "Unlock Elite content and support your favorite writers",
    features: [
      "Unlimited access to member-only news stories",
      "Ad-free reading across all channels",
      "Weekly curated news highlights & deep dives",
      "Breaking-news alerts for hot topics",
      "Support your favorite journalists",
      "Share exclusive stories to boost writers’ earnings",
    ],
  },
  {
    id: "3",
    name: "Business",
    price: 49.99,
    description:
      "Own your news channel, lead a team of editors, and drive revenue",
    features: [
      "All Elite benefits for news consumption",
      "Create, edit & publish your own news articles",
      "Launch your own channel organization with subscription tiers",
      "Invite up to 5 co-editors (reader or co-editor roles)",
      "Collect subscription revenue directly on your channel",
      "Advanced scheduling and bulk-publish tools for news",
      "Priority support to scale your news operation",
    ],
  },
];
