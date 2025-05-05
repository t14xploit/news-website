import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SubscribePlanProps {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export default function SubscribePlan({
  id,
  name,
  price,
  features,
}: SubscribePlanProps) {
  const router = useRouter();

  const handleSelect = () => {
    router.push(
      `/payment?planId=${id}&name=${encodeURIComponent(name)}&price=${price}`
    );
  };

  return (
    <div className="relative rounded-lg p-6 flex flex-col h-[400px] transform hover:scale-105 transition-transform duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-white/20 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-lg" />
      <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl top-20 -left-10" />
      <div className="relative flex flex-col h-full text-white/90">
        <h3 className="text-xl font-bold mb-2">
          <span className="text-blue-400">{name}</span>
        </h3>
        <p className="text-2xl font-semibold mb-4">${price.toFixed(2)}/month</p>
        <ul className="mb-4 space-y-2 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {feature}
            </li>
          ))}
        </ul>
        <Button
          onClick={handleSelect}
          className="w-full bg-blue-500 text-white hover:bg-blue-600 mt-auto"
        >
          Select
        </Button>
      </div>
    </div>
  );
}
