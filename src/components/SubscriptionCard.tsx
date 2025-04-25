import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
  } from "@/components/ui/card";
  import { CheckCircle } from "lucide-react";
  import { cn } from "@/lib/utils";
  
  type Props = {
    title: string;
    description: string;
    features: string[];
    price: string;
    bgColor: string;
    footerColor: string;
  };
  
  export default function SubscriptionCard({
    title,
    description,
    features,
    price,
    bgColor,
    footerColor,
  }: Props) {
    return (
      <Card className="flex flex-col h-full shadow-md">
        <CardHeader className={cn("text-md font-semibold", bgColor, "text-white")}>
          <CardTitle className="py-2">{title}</CardTitle>
        </CardHeader>
  
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start text-sm text-foreground">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
  
        <CardFooter className={cn("justify-end font-bold text-md py-2", footerColor)}>
          ${price}/month
        </CardFooter>
      </Card>
    );
  }
  