
export type TimeSeries = {
    validTime: string;
    airPressure: number;
    temp: number;
    visibility: number;
    summary: string;
    windSpeed: number;
}

export type Location = {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    category: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
};

export type WeatherData = {
    lat: number;
    lon: number;
    referenceTime: string;
    approvedTime: string;
    timeseries: TimeSeries[];
    location: Location[];
};




export async function getWeatherByLocation(location: string): Promise<WeatherData> {
    const response = await fetch(`https://weather.lexlink.se/forecast/location/${location}`);

    return response.json();
}

export async function getWeatherByPoint(
    lon: number, lat: number
): Promise<WeatherData> {
    const response = await fetch
        (`https://weather.lexlink.se/forecast/point/${lon}/${lat}`);

    return response.json();
}