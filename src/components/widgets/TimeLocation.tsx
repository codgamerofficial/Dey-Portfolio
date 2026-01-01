'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import MapWidget with no SSR
const MapWidget = dynamic(() => import('./MapWidget'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[var(--bg-tertiary)] animate-pulse rounded-2xl flex items-center justify-center text-xs text-white/20">INITIALIZING SATELLITE LINK...</div>
});

interface LocationDetails {
    lat: number;
    lon: number;
    area: string;
    city: string;
    state: string;
    country: string;
    countryCode: string;
    timezone: string;
}

interface WeatherData {
    temperature: number;
    weathercode: number;
    windspeed: number;
    is_day: number;
}

// WMO Weather Codes to Icons
const getWeatherIcon = (code: number, isDay: number) => {
    if (code === 0) return isDay ? '☀️' : '🌙';
    if (code <= 3) return isDay ? 'g⛅' : '☁️';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '⛈️';
    return '🌡️';
};

const getWeatherDesc = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Thunderstorm';
    return 'Unknown';
}

export default function TimeLocation() {
    const [time, setTime] = useState<Date | null>(null);
    const [location, setLocation] = useState<LocationDetails | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Clock
    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Weather
    const fetchWeather = async (lat: number, lon: number) => {
        try {
            const res = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
            );
            setWeather(res.data.current_weather);
        } catch (e) {
            console.warn("Weather fetch failed", e);
        }
    };

    // Geolocation
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geo-System Offline');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Fetch Address
                try {
                    const res = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const addr = res.data.address;

                    setLocation({
                        lat: latitude,
                        lon: longitude,
                        area: addr.suburb || addr.neighborhood || '',
                        city: addr.city || addr.town || addr.village || '',
                        state: addr.state || '',
                        country: addr.country || '',
                        countryCode: addr.country_code?.toUpperCase() || '',
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    });

                    // Fetch Weather
                    fetchWeather(latitude, longitude);

                } catch (err) {
                    console.warn("Reverse geocoding failed", err);
                    setError('Address Look-up Failed');
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.warn("Geolocation permission denied", err);
                // Fallback IP
                axios.get('https://ipapi.co/json/')
                    .then(res => {
                        const { latitude, longitude } = res.data;
                        setLocation({
                            lat: latitude,
                            lon: longitude,
                            area: '',
                            city: res.data.city,
                            state: res.data.region,
                            country: res.data.country_name,
                            countryCode: res.data.country_code,
                            timezone: res.data.timezone,
                        });
                        fetchWeather(latitude, longitude);
                    })
                    .catch(() => setError('System Offline'))
                    .finally(() => setLoading(false));
            }
        );
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Manual Pincode Search
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            // Nominatim Free Geocoder (Postal Code Search)
            const res = await axios.get(
                `https://nominatim.openstreetmap.org/search?postalcode=${searchQuery}&format=json&addressdetails=1`
            );

            if (res.data && res.data.length > 0) {
                const target = res.data[0];
                const newLat = parseFloat(target.lat);
                const newLon = parseFloat(target.lon);
                const addr = target.address;

                setLocation({
                    lat: newLat,
                    lon: newLon,
                    area: addr.suburb || addr.neighborhood || '',
                    city: addr.city || addr.town || addr.village || addr.county || '',
                    state: addr.state || '',
                    country: addr.country || '',
                    countryCode: addr.country_code?.toUpperCase() || '',
                    timezone: location?.timezone || 'Manual Target',
                });

                // Refresh Weather for new target
                fetchWeather(newLat, newLon);
            } else {
                alert("Target coordinates not found. Try a valid pincode.");
            }
        } catch (error) {
            console.error("Targeting failed", error);
        } finally {
            setIsSearching(false);
            setSearchQuery('');
        }
    };

    if (!time) return null;

    const formattedDate = time.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="glass-strong rounded-3xl p-6 h-full relative overflow-hidden flex flex-col border border-[var(--glass-border)] hover:border-[var(--neon-blue)] transition-all group">

            {/* Top Bar: Time & Date */}
            <div className="flex justify-between items-start mb-4 z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--neon-blue)] font-bold mb-1">
                        System Local Time
                    </span>
                    <div className="text-4xl font-mono font-bold text-white leading-none tracking-tight">
                        {time.toLocaleTimeString([], { hour12: false })}
                        <span className="text-sm text-[var(--text-tertiary)] ml-1 font-normal animate-pulse">:{(time.getMilliseconds() / 10).toFixed(0).padStart(2, '0')}</span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-[var(--text-secondary)]">
                        <span className="text-xs font-semibold uppercase">{location?.timezone || 'UTC'}</span>
                        {weather && (
                            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                <span className="text-sm">{getWeatherIcon(weather.weathercode, weather.is_day)}</span>
                                <span className="text-xs font-bold text-white">{weather.temperature}°C</span>
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">{formattedDate}</div>
                </div>
            </div>

            {/* Middle: Map Widget */}
            <div className="flex-1 relative rounded-xl overflow-hidden border border-white/5 mb-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] min-h-[160px]">
                {location ? (
                    <>
                        <MapWidget lat={location.lat} lon={location.lon} />

                        {/* Pincode Search HUD */}
                        <div className="absolute top-2 right-2 z-[400]">
                            <form onSubmit={handleSearch} className="flex items-center bg-black/80 rounded border border-[var(--neon-blue)]/50 focus-within:border-[var(--neon-blue)] transition-colors p-0.5 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                <span className="text-[9px] text-[var(--neon-blue)] font-bold px-1.5 animate-pulse">⌖</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={isSearching ? "LOCKING..." : "ENTER ZIPCODE"}
                                    disabled={isSearching}
                                    className="w-24 bg-transparent text-[9px] text-white font-mono placeholder:text-white/30 focus:outline-none uppercase"
                                />
                                <button type="submit" className="text-[9px] bg-[var(--neon-blue)]/20 hover:bg-[var(--neon-blue)] text-[var(--neon-blue)] hover:text-white px-1.5 py-0.5 rounded transition-all">
                                    GO
                                </button>
                            </form>
                        </div>

                        {/* HUD Overlays */}
                        <div className="absolute top-2 left-2 z-[400] text-[8px] font-mono text-[var(--neon-blue)] bg-black/60 px-1 rounded">
                            LAT: {location.lat.toFixed(4)}
                        </div>
                        <div className="absolute top-5 left-2 z-[400] text-[8px] font-mono text-[var(--neon-blue)] bg-black/60 px-1 rounded">
                            LON: {location.lon.toFixed(4)}
                        </div>
                        <div className="absolute bottom-2 right-2 z-[400] flex gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                            <span className="text-[8px] text-red-500 font-bold tracking-widest">{isSearching ? 'SCANNING...' : 'LIVE TRACKING'}</span>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-4 border-[var(--neon-blue)] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-[var(--neon-blue)] tracking-widest animate-pulse">ACQUIRING SIGNAL...</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
                {/* Scan Line Animation */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--neon-blue)]/5 to-transparent h-[10%] w-full animate-scan pointer-events-none" />
            </div>

            {/* Bottom: Env Details Grid */}
            <div className="z-10 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/30 p-2 rounded border border-white/5 flex flex-col">
                    <span className="text-[var(--text-tertiary)] text-[9px] uppercase tracking-wider">Coordinates</span>
                    <span className="text-white font-mono truncate" title={`${location?.city}, ${location?.state}`}>
                        {location ? `${location.city}, ${location.countryCode}` : '---'}
                    </span>
                </div>

                <div className="bg-black/30 p-2 rounded border border-white/5 flex flex-col">
                    <span className="text-[var(--text-tertiary)] text-[9px] uppercase tracking-wider">Environment</span>
                    <span className="text-white font-mono truncate flex items-center gap-2">
                        {weather ? `${getWeatherDesc(weather.weathercode)}` : 'Scanning...'}
                        {weather && <span className="text-[8px] opacity-50 hidden sm:inline">| {weather.windspeed}km/h</span>}
                    </span>
                </div>
            </div>
        </div>
    );
}
