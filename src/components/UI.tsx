import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Loading } from "@nextui-org/react";
import axios, { AxiosError, AxiosResponse } from 'axios';
import Link from 'next/link';

interface WeatherData {
    location: {
        name: string;
        country: string;
    };
    current: {
        temp_c: number;
        condition: {
            text: string;
        }
    }
}

export default function UIPage() {
    const router = useRouter();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError<unknown> | null>(null);
    const [city, setCity] = useState<string>('');

    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

    const fetchWeatherData = async (cityName: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const options = {
                method: 'GET',
                url: 'https://weatherapi-com.p.rapidapi.com/current.json',
                params: { q: cityName },
                headers: {
                    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
                }
            };

            const response: AxiosResponse<WeatherData> = await axios.request(options);
            setWeather(response.data);
            // Add the city to the query string of the URL
            router.push(`/?city=${cityName}`, undefined, { shallow: true });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error);
                console.log(error)
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetchWeatherData(city);
    };

    useEffect(() => {
        // When the component mounts, get the city from the query string
        const cityFromQuery = router.query.city;
        if (typeof cityFromQuery === 'string') {
            setCity(cityFromQuery);
            fetchWeatherData(cityFromQuery);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col flex-wrap justify-center items-center bg-blue-100 mx-auto">
            <h1 className="text-3xl font-bold mb-8">Check Weather</h1>
            <form onSubmit={handleFormSubmit} className='flex flex-col gap-5'>
                <input
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    placeholder="Enter a city name"
                    className="py-2 px-4 rounded-lg shadow-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                    type="submit"
                    className="py-2 px-4 rounded-lg shadow-md bg-blue-500 hover:bg-blue-600 text-white w-fit"
                >
                    Get Weather
                </button>
            </form>
            {isLoading && <p className="mt-4"><Loading /></p>}
            {error && (
                <p className="mt-4 text-red-500">
                    An error occurred: {error.message}
                </p>
            )}
            {weather && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">
                        Weather in {weather.location.name}, {weather.location.country}
                    </h2>
                    <p className="text-lg font-medium">
                        {Math.round(weather.current.temp_c
                        )}°C,{" "}
                        {weather.current.condition.text}
                    </p>
                </div>
            )}
            <Link className='opacity-70 py-3 text-sm hover:underline text-center' href={'/forecast'}>Want to know the weather for the next 3 days? Come!</Link>
        </div>
    );
}
