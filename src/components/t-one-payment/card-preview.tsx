import { CreditCard } from "lucide-react";
import { PaymentFormData } from "@/lib/validation/payment-schema";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface CardPreviewProps {
  register: UseFormRegister<PaymentFormData>;
  errors: FieldErrors<PaymentFormData>;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CardPreview({
  register,
  errors,
  onCardNumberChange,
  onExpiryDateChange,
}: CardPreviewProps) {
  return (
    <div className="relative rounded-lg p-6 flex flex-col h-[300px] w-120 transform hover:scale-105 transition-transform duration-300  border border-gray-700 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br  backdrop-blur-md rounded-lg" />
      {/* <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl top-20 -left-10" /> */}
      <div className="relative flex flex-col h-full text-white/90 pt-2">

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-md border border-gray-600 shadow-sm" />
            <CreditCard className="w-8 h-8 text-white/90 rotate-90" />
          </div>
          <div className="text-white font-bold text-2xl tracking-wider">
            NORDEA
          </div>
        </div>

        <div className="space-y-4 flex-grow">
          <div className="text-center">
            <Input
              {...register("cardNumber")}
              placeholder="•••• •••• •••• ••••"
              className="w-full text-center font-mono tracking-wider text-2xl bg-transparent border-none focus:ring-1 focus:ring-blue-400/50 placeholder-white/70 text-white/90"
              onChange={onCardNumberChange}
            />
            {errors.cardNumber && (
              <p className="text-red-400 text-xs mt-1">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-1 w-1/2">
              <div className="text-xs text-white/70 uppercase">Card Holder</div>
              <Input
                {...register("cardHolder")}
                placeholder="CARD HOLDER"
                className="w-full bg-transparent border-none focus:ring-1 text-white/90 placeholder-white/70 text-sm"
              />
              {errors.cardHolder && (
                <p className="text-red-400 text-xs">
                  {errors.cardHolder.message}
                </p>
              )}
            </div>
            <div className="space-y-1 w-1/3">
              <div className="text-xs text-white/70 uppercase">Expires</div>
              <Input
                {...register("expiryDate")}
                placeholder="MM/YY"
                className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-400/50 text-white/90 placeholder-white/70 text-sm"
                onChange={onExpiryDateChange}
              />
              {errors.expiryDate && (
                <p className="text-red-400 text-xs">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-1/4">
            <div className="text-xs text-white/70 uppercase">CVV</div>
            <Input
              {...register("cvv")}
              placeholder="***"
              type="password"
              className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-400/50 text-white/90 placeholder-white/70 text-sm"
            />
            {errors.cvv && <p className="text-red-400 text-xs">{errors.cvv.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}