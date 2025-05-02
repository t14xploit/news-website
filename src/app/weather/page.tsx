import SpotPriceCard from "@/components/SpotPriceCard";
import WeatherCard from "@/components/WeatherCard";

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
