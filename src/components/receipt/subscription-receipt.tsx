import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { formatDate } from "./utils-receipt";
import { ReceiptData } from "./types";
import { Phone, Mail, MapPin } from "lucide-react";

interface SubscriptionReceiptProps {
  receipt: ReceiptData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionReceipt({
  receipt,
  isOpen,
  onOpenChange,
}: SubscriptionReceiptProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className=" max-w-md rounded-xl p-0 sm:p-0 border-none">
        <VisuallyHidden>
          <DialogTitle>Subscription Receipt</DialogTitle>
        </VisuallyHidden>
        <Card className="bg-transparent border-none shadow-none text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-white">
              Subscription Receipt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-blue-400">OpenNews</h2>
                <CardDescription className="text-sm text-gray-300">
                  Your Trusted News Source
                </CardDescription>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>639 News Street, Media City</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>support@opennews.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>+1-800-555-1234</span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-300">
                <p>
                  <span className="font-medium">Receipt No:</span> {receipt.id}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(new Date())}
                </p>
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {new Date().toLocaleTimeString("en-US", {
                    timeZone: "Europe/Paris",
                  })}
                </p>
              </div>
            </div>
            <Separator className="bg-gray-500" />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Customer Information:
              </h3>
              <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                <p>
                  <span className="font-medium">Name:</span> {receipt.cardHolder}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {receipt.userEmail}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {receipt.userAddress}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Subscription Details:
              </h3>
              <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                <p>
                  <span className="font-medium">Plan:</span> {receipt.plan}
                </p>
                <p>
                  <span className="font-medium">Price:</span> $
                  {receipt.price.toFixed(2)} / month
                </p>
                <p>
                  <span className="font-medium">Start Date:</span>{" "}
                  {formatDate(new Date(receipt.startDate))}
                </p>
                <p>
                  <span className="font-medium">End Date:</span>{" "}
                  {formatDate(new Date(receipt.endDate))}
                </p>
                <p>
                  <span className="font-medium">Duration:</span> 1 month
                  (auto-renews monthly)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Payment Details:
              </h3>
              <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                <p>
                  <span className="font-medium">Payment Method:</span> Credit Card
                </p>
                <p>
                  <span className="font-medium">Card Type:</span>{" "}
                  {receipt.cardType.toUpperCase()}
                </p>
                <p>
                  <span className="font-medium">Card Number:</span> **** **** ****{" "}
                  {receipt.cardNumber.slice(-4)}
                </p>
                <p>
                  <span className="font-medium">Cardholder Name:</span>{" "}
                  {receipt.cardHolder}
                </p>
                <p>
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {receipt.transactionId}
                </p>
                <p>
                  <span className="font-medium">Amount Paid:</span> $
                  {receipt.price.toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Payment Date:</span>{" "}
                  {formatDate(new Date())}
                </p>
              </div>
            </div>

            <Separator className="bg-gray-500" />
            <div className="text-center text-sm text-gray-400">
              <p className="font-medium">Thank you for choosing OpenNews!</p>
              <p>
                For inquiries, contact us at{" "}
                <a
                  href="mailto:support@opennews.com"
                  className="text-blue-400 hover:underline"
                >
                  support@opennews.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}