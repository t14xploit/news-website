"use client";

import { useRouter } from "next/navigation";

interface PlanSelectorProps {
  plan: { id: string; name: string; price: number };
}

export default function PlanSelector({ plan }: PlanSelectorProps) {
  const router = useRouter();

  const handleSelect = () => {
    router.push(`/payment?planId=${plan.id}&name=${encodeURIComponent(plan.name)}&price=${plan.price}`);
  };

  return (
    <button
      onClick={handleSelect}
      className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
    >
      Select Plan
    </button>
  );
}