'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTime } from './TimeProvider';
import { getWeatherForHour, WeatherCondition, Intensity } from '@/lib/weather-utils';

// Interface for weather context
interface WeatherContextType {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  intensity: Intensity;
  description: string;
  cloudiness: number; // Added cloudiness for better sync
  isDaytime: boolean; // Added time of day indicator
  updateWeather: () => void;
  // Remove syncWithClock fields as we'll always sync
}

// Create weather context with default values
const WeatherContext = createContext<WeatherContextType>({
  temperature: 20,
  feelsLike: 20,
  humidity: 60,
  windSpeed: 5,
  condition: 'clear',
  intensity: 'light',
  description: 'Clear',
  cloudiness: 10,
  isDaytime: true,
  updateWeather: () => {},
});

// Hook to access weather context
export const useWeather = () => useContext(WeatherContext);

// Weather provider component
export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const { currentHour } = useTime();
  const [temperature, setTemperature] = useState(20);
  const [feelsLike, setFeelsLike] = useState(20);
  const [humidity, setHumidity] = useState(60);
  const [windSpeed, setWindSpeed] = useState(5);
  const [condition, setCondition] = useState<WeatherCondition>('clear');
  const [intensity, setIntensity] = useState<Intensity>('light');
  const [description, setDescription] = useState('Clear');
  const [cloudiness, setCloudiness] = useState(10);
  
  // Determine if it's daytime based on current hour
  const isDaytime = currentHour >= 6 && currentHour < 18;
  
  // Generate weather based on current hour
  const generateWeather = () => {
    const weather = getWeatherForHour(currentHour);
    
    setTemperature(weather.temperature);
    setFeelsLike(weather.feelsLike);
    setHumidity(weather.humidity);
    setWindSpeed(weather.windSpeed);
    setCondition(weather.condition);
    setIntensity(weather.intensity);
    setDescription(weather.description);
    
    // Calculate cloudiness based on condition
    let newCloudiness = 0;
    switch(weather.condition) {
      case 'cloudy':
        newCloudiness = 80 + Math.random() * 20;
        break;
      case 'partly-cloudy':
        newCloudiness = 40 + Math.random() * 30;
        break;
      case 'rain':
      case 'thunderstorm':
      case 'snow':
        newCloudiness = 70 + Math.random() * 30;
        break;
      case 'fog':
        newCloudiness = 50 + Math.random() * 30;
        break;
      case 'leaf-fall':
        newCloudiness = 30 + Math.random() * 20;
        break;
      case 'clear':
      default:
        newCloudiness = Math.random() * 20;
    }
    setCloudiness(newCloudiness);
  };
  
  // Update weather on hour change
  useEffect(() => {
    generateWeather();
    
    // Setup occasional weather changes
    const weatherInterval = setInterval(() => {
      // 20% chance to change weather every 5 minutes
      if (Math.random() < 0.2) {
        generateWeather();
      }
    }, 300000);
    
    return () => clearInterval(weatherInterval);
  }, [currentHour]);
  
  // Context value
  const value = {
    temperature,
    feelsLike,
    humidity,
    windSpeed,
    condition,
    intensity,
    description,
    cloudiness,
    isDaytime,
    updateWeather: generateWeather,
  };
  
  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}
