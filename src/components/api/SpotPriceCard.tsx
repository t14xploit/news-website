"use client";

import React, { useEffect, useState } from "react";
import { getSpotPrices, SpotPriceData, PriceEntry } from "@/api/spotPrices";
import { Card, CardContent } from "@/components/ui/card";
import { TbClockHour1, TbCurrencyKroneSwedish } from "react-icons/tb";
import { SiThealgorithms } from "react-icons/si";
import { FaEuroSign } from "react-icons/fa";
import Image from "next/image";

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

  if (error) return <div>{error}</div>;
  if (!spotPrices) return <div>Loading...</div>;

  const regions: { [key: string]: string } = {
    SE1: "South Sweden (e.g., Stockholm)",
    SE2: "Middle Sweden (e.g., Uppsala)",
    SE3: "Central Sweden (e.g., Gävle)",
    SE4: "North Sweden (e.g., Luleå)",
  };

  return (
    <Card className="text-sm bg-background border-none shadow-none">
      <CardContent className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["SE1", "SE2", "SE3", "SE4"].map((region) => {
            const regionData = spotPrices[region as keyof SpotPriceData] as PriceEntry[];

            return (
              <div key={region} >
                <div className="flex items-center gap-2 font-semibold text-sm mb-2">
                  <Image
                    src="/sverige-flag.png"
                    alt="Flag"
                    width={16}
                    height={16}
                    className="inline-block"
                  />
                  {region} - {regions[region]}
                </div>
                <div className="space-y-1 max-h-[250px] overflow-y-auto text-xs">
                  {regionData.map((entry, index) => (
                    <div key={index} className="flex flex-col border-b py-1">
                      <span className="flex items-center gap-1">
                        <TbClockHour1 /> {entry.hour}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEuroSign /> {entry.price_eur}
                      </span>
                      <span className="flex items-center gap-1">
                        <TbCurrencyKroneSwedish /> {entry.price_sek}
                      </span>
                      <span className="flex items-center gap-1">
                        <SiThealgorithms /> {entry.kmeans}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
