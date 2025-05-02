"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "Basic";
  const price = parseFloat(searchParams.get("price") || "9.99");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-green-400">Thank You for Your Purchase!</h1>
        <p className="text-lg mb-6">Your payment was processed successfully.</p>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Subscription Details:</h2>
          <p className="mb-2">Plan: {decodeURIComponent(plan)}</p>
          <p className="mb-2">Price: ${price.toFixed(2)}/month</p>
          <p className="text-gray-400">You now have access to premium content.</p>
          <p className="text-gray-400">Enjoy your subscription!</p>
        </div>
        <Link href="/" className="mt-6 inline-block bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}