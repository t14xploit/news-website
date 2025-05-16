"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMethod } from "./payment-method";
import { usePayment } from "./payment-context";

interface PaymentMethodType {
  id: string;
  type: "card" | "paypal" | "apple";
  name?: string;
  city?: string;
  cardNumber?: string;
  cardExpiry?: string;
  isDefault: boolean;
}

export function PaymentMethodList() {
  const { methods, setDefaultMethod } = usePayment() as {
    methods: PaymentMethodType[];
    setDefaultMethod: (id: string) => void;
  };
  const [selectedMethod, setSelectedMethod] = React.useState<string>(
    methods.find((m) => m.isDefault)?.id || methods[0]?.id || ""
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const defaultMethod = methods.find((m) => m.isDefault);
    if (defaultMethod) {
      setSelectedMethod(defaultMethod.id);
    } else if (methods.length > 0 && !methods.some((m) => m.id === selectedMethod)) {
      setSelectedMethod(methods[0].id);
    }
  }, [methods, selectedMethod]);

  const handleValueChange = (value: string) => {
    setSelectedMethod(value);
    setDefaultMethod(value);
  };

  const handleAddSuccess = () => {
    setDialogOpen(false);
    if (methods.length > 0) {
      setSelectedMethod(methods[methods.length - 1].id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Select your default payment method.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {methods.length > 0 ? (
          <RadioGroup value={selectedMethod} onValueChange={handleValueChange} className="grid gap-4">
            {methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between space-x-4 rounded-md border border-muted p-4"
              >
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex flex-col space-y-1 font-normal">
                    <span>
                      {method.type === "card"
                        ? `Card ending in ${method.cardNumber?.slice(-4)}`
                        : `${method.type}`}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {method.type === "card" ? `Expires ${method.cardExpiry}` : ""}
                      {method.city ? ` • ${method.city}` : ""}
                    </span>
                  </Label>
                </div>
                <div className="flex h-5 w-10 items-center justify-center rounded-full bg-primary/5">
                  {method.type === "card" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  )}
                  {method.type === "paypal" && (
                    <svg role="img" viewBox="0 0 24 24" className="h-5 w-5 text-primary">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                    </svg>
                  )}
                  {method.type === "apple" && (
                    <svg role="img" viewBox="0 0 24 24" className="h-5 w-5 text-primary">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-center py-4 text-muted-foreground">No payment methods added yet.</div>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add payment method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add payment method</DialogTitle>
              <DialogDescription>Add a new payment method to your account.</DialogDescription>
            </DialogHeader>
            <PaymentMethod onSuccess={handleAddSuccess} />
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Cancel</Button>
        <Button
          onClick={() => {
            try {
              setDefaultMethod(selectedMethod);
              toast.success("Payment method saved successfully");
            } catch  {
              toast.error("Failed to save payment method");
            }
          }}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}