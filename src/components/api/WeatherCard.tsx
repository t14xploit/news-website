"use client";

import { getWeatherByPoint, WeatherData } from "@/api/weather";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";

type State = "pending" | "success" | "error";

const getWeatherEmoji = (summary: string) => {
    const lower = summary.toLowerCase();
    if (lower.includes("sun")) return "☀️";
    if (lower.includes("cloud")) return "☁️";
    if (lower.includes("rain")) return "🌧️";
    if (lower.includes("snow")) return "❄️";
    if (lower.includes("fog")) return "🌫️";
    return "🌤️";
};

// 🔁 Reverse geocode function
const getCityNameFromCoords = async (lat: number, lon: number) => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    lat,
                    lon,
                    format: "json",
                },
                headers: {
                    "Accept-Language": "en", // force English results
                },
            }
        );

        const address = response.data.address;
        return (
            address.city ||
            address.town ||
            address.village ||
            address.hamlet ||
            "Unknown location"
        );
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return "Unknown location";
    }
};

export default function WeatherCard() {
    const [state, setState] = useState<State>("pending");
    const [weatherData, setWeatherData] = useState<WeatherData>();
    const [city, setCity] = useState<string>("");

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // 1. Get weather
                    const weather = await getWeatherByPoint(longitude, latitude);
                    setWeatherData(weather);

                    // 2. Get city name via reverse geocoding
                    const cityName = await getCityNameFromCoords(latitude, longitude);
                    setCity(cityName);

                    setState("success");
                } catch (error) {
                    console.error("Error loading weather or location:", error);
                    setState("error");
                }
            },
            (err) => {
                console.error(`Could not get location: ${err.message}`);
                setState("error");
            }
        );
    }, []);

    if (state === "pending") {
        return (
            <div className="text-center text-lg  mt-6">
                Loading weather data...
            </div>
        );
    }

    if (state === "error") {
        return (
            <div className="text-center text-lg text-red-600 mt-6">
                Something went wrong! Please try again later.
            </div>
        );
    }

    if (state === "success" && weatherData) {
        const currentWeather = weatherData.timeseries[0];
        const date = new Date(currentWeather.validTime);

        return (
            <Card className="w-full max-w-xs mx-auto shadow-lg border rounded-xl">
                <CardHeader className="flex justify-between items-center ">
                    {/* Left: Temp & Emoji */}
                    <div className="text-center">
                        <div className="text-4xl font-bold text-foreground">
                            {Math.round(currentWeather.temp)}°C
                        </div>
                        <div className="text-2xl mt-2">
                            {getWeatherEmoji(currentWeather.summary)}
                        </div>
                    </div>

                    {/* Right: Date, City, Summary */}
                    <div className="text-right">
                        <CardTitle className="text-sm font-semibold text-foreground">
                            {date.toLocaleDateString(undefined, {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                            })}
                        </CardTitle>
                        <p className="flex items-center justify-end text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {city}
                        </p>
                        <p className="mt-2 text-sm font-medium text-foreground">
                            {currentWeather.summary}
                        </p>
                    </div>
                </CardHeader>

                <CardContent >
                    <div className="text-xs text-muted-foreground">
                        Wind: {currentWeather.windSpeed} m/s | Pressure:{" "}
                        {currentWeather.airPressure} hPa
                    </div>
                </CardContent>
            </Card>
        );
    }

    return null;
}
