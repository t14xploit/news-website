import SpotPriceCard from "@/components/api/SpotPriceCard";
import WeatherCard from "@/components/api/WeatherCard";

export default function WeatherPage() {
  return (
    <div>
      <div>
        <WeatherCard />
      </div>
      <SpotPriceCard/>
    </div>
  );
}
