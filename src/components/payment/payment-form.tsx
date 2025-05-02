import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { paymentSchema, PaymentFormData } from "@/lib/validation/payment-schema";
import CardPreview from "./card-preview";

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  selectedPlan: { name: string; price: number };
}

export default function PaymentForm({ onSubmit, selectedPlan }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const formData = watch();

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    e.target.value = value;
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    e.target.value = value;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
      <CardPreview
        formData={formData}
        register={register}
        errors={errors}
        onCardNumberChange={handleCardNumberChange}
        onExpiryDateChange={handleExpiryDateChange}
      />
      <Button type="submit" className="mt-6 w-[400px] bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
        Pay ${selectedPlan.price.toFixed(2)}
      </Button>
    </form>
  );
}