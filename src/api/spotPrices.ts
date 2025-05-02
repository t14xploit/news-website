
export type PriceEntry = {
    hour: number;
    price_eur: number;
    price_sek: number;
    kmeans: number;
  };
  
  export type SpotPriceData = {
    date: string;
    SE1: PriceEntry[];
    SE2: PriceEntry[];
    SE3: PriceEntry[];
    SE4: PriceEntry[];
  };
  
  export async function getSpotPrices(): Promise<SpotPriceData> {
    const response = await fetch("/api/spotprices"); 
    return response.json();
  }
  