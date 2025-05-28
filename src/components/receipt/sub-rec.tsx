import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { formatDate } from "./utils-receipt";
import { ReceiptData } from "./types";
import { Phone, Mail, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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
  const currentDate = new Date(); 
  const dueDate = new Date(currentDate);
  dueDate.setMonth(dueDate.getMonth() + 1); 
  const qrCodeUrl = `https://opennews.com/subscription/receipt?id=${receipt.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-gray-900 to-gray-950 max-w-md rounded-xl p-0 sm:p-0 border-none shadow-xl">
        <VisuallyHidden>
          <DialogTitle>Subscription Invoice</DialogTitle>
        </VisuallyHidden>
        <Card className="bg-gray-950/70 backdrop-blur-sm border border-gray-800 text-gray-100 rounded-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-blue-300">
              OpenNews Subscription Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start text-sm">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-blue-400">OpenNews</h2>
                <p className="text-xs text-gray-400">Your Premier News Platform</p>
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>639 News Street, Media City</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="w-4 h-4" />
                  <span>support@opennews.com</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-4 h-4" />
                  <span>+1-800-555-1234</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-xs">
                  <span className="font-medium">Invoice No.:</span> {receipt.id}
                </p>
                <p className="text-xs">
                  <span className="font-medium">Issue Date:</span>{" "}
                  {formatDate(currentDate)}
                </p>
                <p className="text-xs">
                  <span className="font-medium">Due Date:</span>{" "}
                  {formatDate(dueDate)}
                </p>
                <p className="text-xs">
                  <span className="font-medium">Reference:</span>{" "}
                  SUB-{receipt.transactionId.slice(-8)}
                </p>
              </div>
            </div>
            <Separator className="bg-gray-700" />

            <div className="text-xs text-gray-300">
              <p className="font-medium">Bill To:</p>
              <p>{receipt.cardHolder}</p>
              <p>{receipt.userAddress}</p>
              <p>{receipt.userEmail}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 text-left font-medium">Description</th>
                    <th className="py-2 text-center font-medium">Qty</th>
                    <th className="py-2 text-right font-medium">Unit Price ($)</th>
                    <th className="py-2 text-right font-medium">Amount ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">
                      {receipt.plan} Subscription (Valid: {formatDate(new Date(receipt.startDate))} - {formatDate(new Date(receipt.endDate))})
                    </td>
                    <td className="py-2 text-center">1</td>
                    <td className="py-2 text-right">{receipt.price.toFixed(2)}</td>
                    <td className="py-2 text-right">{receipt.price.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-right text-sm text-gray-300">
              <p className="mt-2">
                <span className="font-medium">Subtotal ($):</span>{" "}
                {receipt.price.toFixed(2)}
              </p>
              <p className="font-bold text-white mt-1">
                <span className="font-medium">Total Due ($):</span>{" "}
                {receipt.price.toFixed(2)}
              </p>
            </div>

            <div className="text-right text-sm text-gray-300">
              <p>Issued by:</p>
              <p className="font-italic">OpenNews Team</p>
            </div>

            <Separator className="bg-gray-700" />
            <div className="text-center text-sm text-gray-400">
              <p>OpenNews, 639 News Street, Media City</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:support@opennews.com"
                  className="text-blue-400 hover:underline"
                >
                  support@opennews.com
                </a>
              </p>
              <div className="flex justify-center mt-4">
                <QRCodeSVG
                  value={qrCodeUrl}
                  size={80}
                //   bgColor="#2D3748"
                //   fgColor="#FFFFFF"
                  level="H"
                //   marginSize={1}
                  title="Scan to view receipt"
                  className="rounded-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}