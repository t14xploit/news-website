"use client";

import React, { useEffect, useState } from "react";
import { getSpotPrices, SpotPriceData, PriceEntry } from "@/api/spotPrices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TbClockHour1, TbCurrencyKroneSwedish } from "react-icons/tb";
import { SiThealgorithms } from "react-icons/si";
import { FaEuroSign } from "react-icons/fa";

export default function SpotPriceCard() {
  const [spotPrices, setSpotPrices] = useState<SpotPriceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSpotPrices();
        setSpotPrices(data);
        setError(null); 
      } catch (error) {
        console.error("Failed to fetch spot prices", error);
        setError("Failed to fetch spot prices. Please try again later.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>; 
  }

  if (!spotPrices) {
    return <div>Loading...</div>;
  }

  // SE1,2,3,4 are like regions? google says
  const regions: { [key: string]: string } = {
    SE1: "Southern Sweden (e.g., Stockholm)",
    SE2: "Middle Sweden (e.g., Uppsala)",
    SE3: "Central Sweden (e.g., Gävle)",
    SE4: "Northern Sweden (e.g., Luleå)",
  };

  return (
    <div>
   <h1>Spot Prices for {spotPrices.date}</h1>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4"> 
  {["SE1", "SE2", "SE3", "SE4"].map((region) => {
    const regionData = spotPrices[region as keyof SpotPriceData] as PriceEntry[];

    return (
      <Card key={region} className="p-4 shadow-md rounded-md text-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <img src="/sverige-flag.png" alt="Sweden Flag" className="mr-2 w-5 h-5" />
            {region} - {regions[region]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 max-h-64 overflow-y-auto">
  {regionData.map((entry: PriceEntry, index: number) => (
    <div key={index} className="flex items-center justify-between text-md border-b py-1">
      <span className="flex items-center gap-1"><TbClockHour1 /> {entry.hour}</span>
      <span className="flex items-center gap-1"><FaEuroSign /> {entry.price_eur}</span>
      <span className="flex items-center gap-1"><TbCurrencyKroneSwedish /> {entry.price_sek}</span>
      <span className="flex items-center gap-1"><SiThealgorithms />
      {entry.kmeans}</span> 
      {/* Kmeans i don't understand what it is ??? /// decided to make algorithm  */}
    </div>
  ))}
</CardContent>

      </Card>
    );
  })}
</div>

    </div>
  );
}
