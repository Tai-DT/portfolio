'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTime } from '@/providers/TimeProvider';
import { WiDaySunny, WiNightClear, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiHot } from 'react-icons/wi';
import { FiWind } from 'react-icons/fi';
import { GiOakLeaf } from 'react-icons/gi'; // For autumn leaf icon
import { useWeather } from '@/providers/WeatherProvider';
import WeatherEffects from './WeatherEffects';
import { WeatherCondition } from '@/lib/weather-utils'; // Remove Intensity import since it's not used

export default function WeatherWidget() {
  const { currentHour } = useTime();
  const [expanded, setExpanded] = useState(false);
  
  // Use the weather context - remove syncWithClock since it's not used
  const {
    temperature,
    feelsLike,
    humidity,
    windSpeed,
    condition,
    description
  } = useWeather();
  
  // Ensure condition is of the correct type
  const safeCondition: WeatherCondition = condition as WeatherCondition;
  
  // Weather icon based on condition and time
  const getWeatherIcon = () => {
    const isDaytime = currentHour >= 6 && currentHour < 18;
    
    switch (condition) {
      case 'clear':
        return isDaytime 
          ? <WiDaySunny className="text-yellow-400" /> 
          : <WiNightClear className="text-blue-200" />;
      case 'cloudy':
      case 'partly-cloudy':
        return <WiCloudy className="text-gray-400" />;
      case 'rain':
        return <WiRain className="text-blue-400" />;
      case 'snow':
        return <WiSnow className="text-blue-100" />;
      case 'thunderstorm':
        return <WiThunderstorm className="text-purple-500" />;
      case 'fog':
        return <WiFog className="text-gray-300" />;
      case 'leaf-fall':
        return <GiOakLeaf className="text-orange-500" />;
      case 'hot':
        return <WiHot className="text-red-500" />;
      default:
        return <WiCloudy className="text-gray-400" />;
    }
  };

  // Loading state based on whether weather data is available
  const loading = !temperature;

  return (
    <div className="relative">
      {/* Weather effects for the widget only when expanded */}
      {expanded && condition !== 'clear' && (
        <WeatherEffects 
          condition={safeCondition} 
          intensity={condition === 'rain' || condition === 'snow' ? 'moderate' : 'light'}
          temperature={temperature}
          isBackground={false}
        />
      )}
      
      <motion.div 
        className="fixed top-4 left-4 p-3 bg-[--card]/80 backdrop-blur-md rounded-lg shadow-lg border border-[--border] text-[--card-foreground] z-40"
        whileHover={{ scale: expanded ? 1 : 1.05 }}
        animate={{ width: expanded ? '240px' : 'auto' }}
        transition={{ duration: 0.2 }}
        onClick={() => setExpanded(!expanded)}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-[--primary] animate-spin"></div>
            <span className="text-sm">Loading weather...</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {/* Compact view */}
            <div className="flex items-center">
              <div className="text-3xl mr-2">
                {getWeatherIcon()}
              </div>
              <div className="text-xl font-bold">
                {temperature}°C
              </div>
            </div>
            
            {/* Expanded details */}
            <AnimatePresence>
              {expanded && (
                <motion.div 
                  className="ml-4 text-sm space-y-1"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  <div className="font-medium">{description}</div>
                  <div className="text-[--muted-foreground]">Feels like: {feelsLike}°C</div>
                  <div className="flex justify-between text-[--muted-foreground]">
                    <span className="flex items-center">
                      <FiWind className="mr-1" /> {windSpeed} km/h
                    </span>
                    <span>Humidity: {humidity}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
