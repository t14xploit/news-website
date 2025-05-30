import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { formatDate } from "./utils-receipt";
import { ReceiptData as SubscriptionReceiptData } from "./types";
import { Phone, Mail, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface BillTo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email?: string;
}

interface ReceiptItem {
  id: string;
  quantity: number;
  description: string;
  unitPrice: number;
  amount: number;
}

interface SubscriptionReceiptProps {
  receipt: SubscriptionReceiptData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrint?: () => void;
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

  const receiptData: {
    receiptNumber: string;
    receiptDate: Date;
    dueDate: Date;
    billTo: BillTo;
    items: ReceiptItem[];
    subtotal: number;
    total: number;
    paymentInstructions: { cardDetails: string };
    termsAndConditions: string;
    companyName: string;
    companyAddress: string;
    companyEmail: string;
    signature: string;
    qrCodeData: string;
  } = {
    receiptNumber: receipt.id,
    receiptDate: currentDate,
    dueDate: dueDate,
    billTo: {
      name: receipt.cardHolder,
      address: receipt.userAddress,
      city: "",
      state: "",
      zip: "",
      country: "",
      email: receipt.userEmail,
    },
    items: [
      {
        id: receipt.id,
        quantity: 1,
        description: `${receipt.plan} Subscription (Valid: ${formatDate(
          new Date(receipt.startDate)
        )} - ${formatDate(new Date(receipt.endDate))})`,
        unitPrice: receipt.price,
        amount: receipt.price,
      },
    ],
    subtotal: receipt.price,
    total: receipt.price,
    paymentInstructions: {
      cardDetails: `${receipt.cardType.toUpperCase()} ending in ${receipt.cardNumber.slice(
        -4
      )}`,
    },
    termsAndConditions:
      "Payment is due within 30 days. Late payments may incur additional fees.",
    companyName: "OpenNews",
    companyAddress: "639 News Street, Media City",
    companyEmail: "support@opennews.com",
    signature: "OpenNews Team",
    qrCodeData: qrCodeUrl,
  };

  const receiptTotal = useMemo(() => {
    return receiptData.total;
  }, [receiptData.total]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className=" max-w-md w-full rounded-xl p-0 border-none shadow-xl">
        <DialogHeader className="p-4 pb-0">
          <VisuallyHidden>
            <DialogTitle>Subscription Invoice</DialogTitle>
          </VisuallyHidden>
          <h2 className="text-xl font-semibold">SUBSCRIPTION INVOICE</h2>
        </DialogHeader>

        <Card className=" ">
          <CardHeader className="p-4 pt-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-xs">
                  {receiptData.companyName}
                </p>
                <p className="text-xs">{receiptData.companyAddress}</p>
              </div>
              <div className="text-right">
                <p className="text-xs">
                  <span className="font-medium">RECEIPT #:</span>{" "}
                  {receiptData.receiptNumber}
                </p>
                <p className="text-xs">
                  <span className="font-medium">RECEIPT DATE:</span>{" "}
                  {formatDate(receiptData.receiptDate)}
                </p>
                <p className="text-xs">
                  <span className="font-medium">Due Date:</span>{" "}
                  {formatDate(receiptData.dueDate)}
                </p>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between">
              <div>
                <p className="font-medium text-sm">BILL TO:</p>
                <p className="text-xs">{receiptData.billTo.name}</p>
                <p className="text-xs">{receiptData.billTo.address}</p>
                <p className="text-xs">{receiptData.billTo.email}</p>
              </div>
            </div>

            <Separator className="my-2" />
          </CardHeader>

          <CardContent className="p-2">
            <div className="">
              <table className=" text-sm">
                <thead>
                  <tr className="text-left font-medium bg-indigo-700/45 ">
                    <th className="py-1 px-2">QTY</th>
                    <th className="py-1 px-2">DESCRIPTION</th>
                    <th className="py-1 px-2 text-right">UNIT PRICE</th>
                    <th className="py-1 px-2 text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData.items.map((item) => (
                    <tr key={item.id} className="0">
                      <td className="py-1 px-2">{item.quantity}</td>
                      <td className="py-1 px-2 whitespace-normal">
                        {item.description}
                      </td>
                      <td className="py-1 px-2 text-right">
                        {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-1 px-2 text-right">
                        {item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>

          <CardContent className="p-4 pt-0">
            <div className="flex justify-end">
              <div className="w-full">
                <div className="text-right">
                  <p className="text-xs">Subtotal</p>
                  <p className="text-xs">Sales Tax 0%</p>
                  <p className="font-medium text-sm">RECEIPT Total</p>
                  <p className="text-xl font-bold">
                    ${receiptTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-1 mb-6">
              <p className="font-medium text-sm">PAYMENT INSTRUCTIONS</p>
              <p className="text-xs">
                Paid via: {receiptData.paymentInstructions.cardDetails}
              </p>
            </div>

            <Separator className="my-2 " />

            <div className="space-y-1 mb-5">
              <p className="font-medium text-sm">TERMS & CONDITIONS</p>
              <p className="text-xs">{receiptData.termsAndConditions}</p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs">
                  <br />
                  {receiptData.signature}
                </p>
              </div>
              <div className="flex items-end">
                <QRCodeSVG
                  value={receiptData.qrCodeData}
                  size={60}
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

          <CardContent className="  text-center text-[10px] text-muted-foreground">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="w-3 h-3" />
              <span>{receiptData.companyAddress}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Mail className="w-3 h-3" />
              <span>
                Email:{" "}
                <a
                  href={`mailto:${receiptData.companyEmail}`}
                  type="outline"
                  className="text-blue-500 hover:underline"
                >
                  {receiptData.companyEmail}
                </a>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Phone className="w-3 h-3" />
              <span>+1-800-555-1234</span>
            </div>
          </CardContent>
        </Card>

        {/* <DialogFooter className="p-">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs px-3 py-1"
          >
            Close
          </Button>
          {onPrint && (
            <Button
              variant="default"
              onClick={onPrint}
              className="text-xs px-3 py-1"
            >
              Print
            </Button>
          )}
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
