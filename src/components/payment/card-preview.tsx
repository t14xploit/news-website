import { CreditCard } from "lucide-react";
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

export default function CardPreview({
  register,
  errors,
  onCardNumberChange,
  onExpiryDateChange,
}: CardPreviewProps) {
  return (
    <div className="relative w-[450px] h-[280px] rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-white/20 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]" />
      <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl top-20 -left-10" />
      <div className="relative p-8 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-10 bg-gradient-to-br from-silver-300 to-silver-500 rounded-md border border-silver-600 shadow-sm" />
            <CreditCard className="w-8 h-8 text-white/80 rotate-90" />
          </div>
          <div className="text-white font-bold text-2xl tracking-wider">
            NORDEA
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <Input
              {...register("cardNumber")}
              placeholder="•••• •••• •••• ••••"
              className="w-full text-center font-mono tracking-wider text-2xl bg-transparent border-none focus:ring-1 focus:ring-white/30 placeholder-white/60 text-white/90"
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
              <div className="text-xs text-white/60 uppercase">Card Holder</div>
              <Input
                {...register("cardHolder")}
                placeholder="CARD HOLDER"
                className="w-full uppercase bg-transparent border-none focus:ring-1 focus:ring-white/30 text-white/90 placeholder-white/60 text-sm"
              />
              {errors.cardHolder && (
                <p className="text-red-400 text-xs">
                  {errors.cardHolder.message}
                </p>
              )}
            </div>
            <div className="space-y-1 w-1/3">
              <div className="text-xs text-white/60 uppercase">Expires</div>
              <Input
                {...register("expiryDate")}
                placeholder="MM/YY"
                className="w-full bg-transparent border-none focus:ring-1 focus:ring-white/30 text-white/90 placeholder-white/60 text-sm"
                onChange={onExpiryDateChange}
              />
              {errors.expiryDate && (
                <p className="text-red-400 text-xs">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/4">
          <div className="text-xs text-white/60 uppercase">CVV</div>
          <Input
            {...register("cvv")}
            placeholder="***"
            className="w-full bg-transparent border-none focus:ring-1 focus:ring-white/30 text-white/90 placeholder-white/60 text-sm"
          />
          {errors.cvv && (
            <p className="text-red-400 text-xs">{errors.cvv.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
