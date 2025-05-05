"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "Basic" || "Premium" || "Pro";
  const price = parseFloat(
    searchParams.get("price") || "9.99" || "19.99" || "29.99"
  );

  return (
    <div className="min-h-screen p-10 flex flex-col items-center justify-start gap-15">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-green-400">
          Thank You for Your Purchase!
        </h1>
        <p className="text-lg text-white/90">
          Your payment was processed successfully.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-20">
        <div className="text-center max-w-md">
          <div className="relative p-8 rounded-xl transform hover:scale-105 transition-transform duration-300 w-[500px] h-[260px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-white/20 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-xl" />
            <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl top-20 -left-10" />
            <div className="relative h-full flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-4 text-white/90">
                Subscription Details:
              </h2>
              <p className="mb-4 text-white/90">
                Plan:{" "}
                <span className="text-blue-400">
                  {decodeURIComponent(plan)}
                </span>
              </p>
              <p className="mb-4 text-white/90">
                Price: ${price.toFixed(2)}/month
              </p>
              <p className="text-white/60">
                You now have access to premium content.
              </p>
              <p className="text-white/60">Enjoy your subscription!</p>
            </div>
          </div>
        </div>
        <Link
          href="/"
          className="ml-10 inline-block bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
