import { useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { formatDate } from "./utils-receipt";
import { ReceiptData } from "./types";
import { Phone, Mail, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

interface SubscriptionReceiptProps {
  receipt: ReceiptData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrint?: () => void;
}

export function SubscriptionReceipt({
  receipt,
  isOpen,
  onOpenChange,
  onPrint,
}: SubscriptionReceiptProps) {
  const currentDate = new Date();
  const dueDate = new Date(currentDate);
  dueDate.setMonth(dueDate.getMonth() + 1);
  const qrCodeUrl = `https://opennews.com/subscription/receipt?id=${receipt.id}`;

  const totalAmount = useMemo(() => {
    return receipt.price;
  }, [receipt.price]);

  const billTo = {
    name: receipt.cardHolder,
    address: receipt.userAddress,
    city: "",
    state: "",
    zip: "",
    country: "",
    email: receipt.userEmail,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-gray-900 to-gray-950 max-w-4xl w-full rounded-xl p-0 border-none shadow-xl">
        <DialogHeader className="p-6 pb-0">
          <VisuallyHidden>
            <DialogTitle>Subscription Receipt</DialogTitle>
          </VisuallyHidden>
          <h2 className="text-2xl font-semibold text-blue-300">SUBSCRIPTION RECEIPT</h2>
        </DialogHeader>

        <Card className="bg-gray-950/70 backdrop-blur-sm border border-gray-800 text-gray-100">
          <CardHeader className="p-6 pt-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm text-blue-400">OpenNews</p>
                <p className="text-sm">639 News Street, Media City</p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  <span className="font-medium">Receipt No.:</span> {receipt.id}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Issue Date:</span>{" "}
                  {formatDate(currentDate)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Due Date:</span>{" "}
                  {formatDate(dueDate)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Reference:</span>{" "}
                  SUB-{receipt.transactionId.slice(-8)}
                </p>
              </div>
            </div>

            <Separator className="my-4 bg-gray-700" />

            <div className="flex justify-between">
              <div>
                <p className="font-medium">Bill To:</p>
                <p className="text-sm">{billTo.name}</p>
                <p className="text-sm">{billTo.address}</p>
                <p className="text-sm">{billTo.email}</p>
              </div>
            </div>

            <Separator className="my-4 bg-gray-700" />
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="text-left font-medium bg-gray-800">
                    <th className="py-2 pr-4">Description</th>
                    <th className="py-2 pr-4 text-right">Quantity</th>
                    <th className="py-2 pr-4 text-right">Unit Price (USD)</th>
                    <th className="py-2 text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-2 pr-4">
                      {receipt.plan} Subscription (Valid: {formatDate(new Date(receipt.startDate))} - {formatDate(new Date(receipt.endDate))})
                    </td>
                    <td className="py-2 pr-4 text-right">1</td>
                    <td className="py-2 pr-4 text-right">{receipt.price.toFixed(2)}</td>
                    <td className="py-2 text-right">{receipt.price.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>

          <CardContent className="p-6 pt-0">
            <div className="flex justify-end">
              <div className="w-1/3">
                <div className="text-right">
                  <p className="font-medium">TOTAL (USD):</p>
                  <p className="text-2xl font-bold text-white">
                    {totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-4 bg-gray-700" />

            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm">
                  Issued by, signature:
                  <br />
                  OpenNews Team
                </p>
              </div>
              <div className="flex items-end">
                <QRCodeSVG
                  value={qrCodeUrl}
                  size={75}
                  bgColor="#2D3748"
                  fgColor="#FFFFFF"
                  level="H"
                  marginSize={2}
                  title="Scan to view receipt"
                  className="rounded-md"
                />
              </div>
            </div>
          </CardContent>

          <CardContent className="p-6 pt-0 text-center text-xs text-gray-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              <span>639 News Street, Media City</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span>
                Email:{" "}
                <a href="mailto:support@opennews.com" className="text-blue-400 hover:underline">
                  support@opennews.com
                </a>
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Phone className="w-4 h-4" />
              <span>+1-800-555-1234</span>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-gray-300 border-gray-600 hover:bg-gray-700">
            Close
          </Button>
          {onPrint && (
            <Button variant="default" onClick={onPrint} className="bg-blue-500 hover:bg-blue-600 text-white">
              Print
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}