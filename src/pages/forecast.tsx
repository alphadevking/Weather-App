import { FormEvent, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Loading } from '@nextui-org/react';
import Link from 'next/link';

interface ForecastData {
    location: {
        name: string;
        country: string;
    };
    forecast: {
        forecastday: {
            date: string;
            day: {
                maxtemp_c: number;
                mintemp_c: number;
                condition: {
                    text: string;
                };
            };
        }[];
    };
}

export default function Forecast() {
    const [city, setCity] = useState<string>(''); // initialize state for the city name
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError<unknown> | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get<ForecastData>(
                'https://weatherapi-com.p.rapidapi.com/forecast.json',
                {
                    params: { q: city, days: 3 },
                    headers: {
                        'X-RapidAPI-Key': apiKey,
                        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
                    },
                }
            );
            setForecast(response.data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error);
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100">
            <h1 className="text-3xl font-bold mb-8">Weather Forecast</h1>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                    <label htmlFor="city" className="text-lg font-semibold mb-2">
                        City
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        className="py-2 px-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="py-2 px-4 rounded-lg shadow-md bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Get Forecast
                </button>
            </form>
            {isLoading && <p className="mt-4"><Loading /></p>}
            {error && (
                <p className="mt-4 text-red-500">
                    An error occurred: {error.message}
                </p>
            )}
            {forecast && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">
                        Forecast for {forecast.location.name}, {forecast.location.country}
                    </h2>
                    <div className="flex flex-col">
                        {forecast.forecast.forecastday.map((day) => (
                            <div
                                key={day.date}
                                className="my-2 p-2 border-2 border-blue-500 rounded-lg"
                            >
                                <p className="text-lg font-semibold">{day.date}</p>
                                <p className="text-md font-medium">{day.day.condition.text}</p>
                                <p className="text-md font-medium">
                                    High: {day.day.maxtemp_c}°C / Low: {day.day.mintemp_c}°C
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <Link className='opacity-70 py-3 text-sm hover:underline text-center' href={'/'}>Check out the current weather condition at any location!</Link>
        </div>
    );
}