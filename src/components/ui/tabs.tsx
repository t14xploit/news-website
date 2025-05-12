import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import WeatherCard from "@/components/api/WeatherCard";
import SpotPriceCard from "@/components/api/SpotPriceCard";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("flex flex-wrap justify-center", className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "flex flex-col items-center justify-center bg-muted w-48 h-20 hover:shadow-lg transition cursor-pointer rounded-lg border p-4",
        "text-sm font-medium hover:underline text-center gap-2",
        // Active tab styles
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-2 data-[state=active]:border-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

// Memoizing the SpotPriceCard and WeatherCard components to avoid re-rendering
const MemoizedWeatherCard = React.memo(WeatherCard);
const MemoizedSpotPriceCard = React.memo(SpotPriceCard);

export { Tabs, TabsList, TabsTrigger, TabsContent, MemoizedWeatherCard, MemoizedSpotPriceCard };
