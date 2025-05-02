import { Card, CardContent } from "@/components/ui/card";
import { PaymentFormData } from "@/lib/validation/payment-schema";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface CardPreviewProps {
  formData: Partial<PaymentFormData>;
  register: UseFormRegister<PaymentFormData>;
  errors: FieldErrors<PaymentFormData>;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CardPreview({register, errors, onCardNumberChange, onExpiryDateChange }: CardPreviewProps) {
  return (
    <Card className="w-[400px] h-[240px] bg-transparent border-none shadow-lg glass-card">
      <CardContent className="p-6 flex flex-col justify-between h-full relative bg-white dark:bg-gray-800 bg-opacity-90">

        <div className="w-12 h-8 bg-yellow-400 rounded-lg shadow-md absolute top-6 left-6 transform translate-y-1"></div>

        <div className="absolute top-6 right-6 w-16 h-10 bg-gray-200 rounded flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200">
          VISA
        </div>

        <div className="text-center">
          <Input
            {...register("cardNumber")}
            placeholder="1234 5678 9012 3456"
            className="w-full text-center p-1 border-none rounded text-xl font-mono tracking-widest text-gray-800 dark:text-gray-100 bg-transparent focus:ring-0 focus:border-none placeholder-gray-400 dark:placeholder-gray-500"
            onChange={onCardNumberChange}
          />
          {errors.cardNumber && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.cardNumber.message}</p>}
        </div>

        <div className="flex justify-between items-end">
          <div className="w-1/2">
            <Input
              {...register("cardHolder")}
              placeholder="YOUR NAME"
              className="w-full p-1 border-none rounded text-sm uppercase text-gray-800 dark:text-gray-100 bg-transparent focus:ring-0 focus:border-none placeholder-gray-400 dark:placeholder-gray-500"
            />
            {errors.cardHolder && <p className="text-red-500 dark:text-red-400 text-xs">{errors.cardHolder.message}</p>}
          </div>
          <div className="w-1/4">
            <Input
              {...register("expiryDate")}
              placeholder="MM/YY"
              className="w-full p-1 border-none rounded text-sm text-gray-800 dark:text-gray-100 bg-transparent focus:ring-0 focus:border-none placeholder-gray-400 dark:placeholder-gray-500"
              onChange={onExpiryDateChange}
            />
            {errors.expiryDate && <p className="text-red-500 dark:text-red-400 text-xs">{errors.expiryDate.message}</p>}
          </div>
        </div>

        <div className="w-1/4">
          <Input
            {...register("cvv")}
            placeholder="CVV"
            className="w-full p-1 border-none rounded text-sm text-gray-800 dark:text-gray-100 bg-transparent focus:ring-0 focus:border-none placeholder-gray-400 dark:placeholder-gray-500"
          />
          {errors.cvv && <p className="text-red-500 dark:text-red-400 text-xs">{errors.cvv.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}