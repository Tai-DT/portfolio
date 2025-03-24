'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { isDaytime } from '@/lib/theme-utils';
import { useTime } from '@/providers/TimeProvider';
import { useWeather } from '@/providers/WeatherProvider';
import { getThemeGradient } from '@/lib/theme-utils';
import WeatherEffects from '../weather/WeatherEffects';
import { WeatherCondition, Intensity } from '@/lib/weather-utils'; // Import the types

// Define strong types for sky objects
interface SkyObject {
  type: 'star' | 'cloud';
  position: { x: number; y: number };
  size: number;
  brightness?: number;
  delay?: number;
  duration?: number;
}

export default function DynamicBackground() {
  const { theme, resolvedTheme } = useTheme();
  const { currentHour } = useTime();
  const [skyObjects, setSkyObjects] = useState<SkyObject[]>([]);
  const [mounted, setMounted] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.3); // Default opacity
  
  // Use the shared weather context
  const { 
    condition, 
    intensity, 
    temperature, 
    cloudiness,
  } = useWeather();
  
  // Ensure condition is of the correct type
  const safeCondition: WeatherCondition = condition as WeatherCondition;
  const safeIntensity: Intensity = intensity as Intensity;
  
  // Use a ref to track the current hour to avoid dependency issues
  const hourRef = useRef(currentHour);
  useEffect(() => {
    hourRef.current = currentHour;
  }, [currentHour]);
  
  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
    
    // Set appropriate opacity after client-side rendering
    if (theme?.includes('dark') || resolvedTheme === 'dark') {
      setOverlayOpacity(0.4);
    } else {
      setOverlayOpacity(0.1);
    }
  }, [theme, resolvedTheme]);
  
  // Update overlay opacity when theme changes
  useEffect(() => {
    if (mounted) {
      setOverlayOpacity(theme?.includes('dark') || resolvedTheme === 'dark' ? 0.4 : 0.1);
    }
  }, [theme, resolvedTheme, mounted]);
  
  // Compute time of day characteristics 
  const daytime = isDaytime(currentHour);
  const isSunrise = currentHour >= 5 && currentHour <= 7;
  const isSunset = currentHour >= 17 && currentHour <= 19;
  const isDawn = currentHour >= 4 && currentHour <= 6;
  const isDusk = currentHour >= 18 && currentHour <= 20;
  
  // Generate sky objects based on weather conditions
  const generateSkyObjects = useCallback(() => {
    const objects: SkyObject[] = [];
    
    // Generate stars at night
    if (hourRef.current >= 19 || hourRef.current < 6) {
      for (let i = 0; i < 100; i++) {
        objects.push({
          type: 'star',
          position: { x: Math.random() * 100, y: Math.random() * 70 },
          size: Math.random() * 2 + 1,
          brightness: Math.random() * 0.5 + 0.5
        });
      }
    }
    
    // Generate clouds based on cloudiness
    const numClouds = Math.floor(cloudiness / 10);
    for (let i = 0; i < numClouds; i++) {
      objects.push({
        type: 'cloud',
        position: { x: Math.random() * 100, y: Math.random() * 40 + 5 },
        size: Math.random() * 60 + 40,
        delay: Math.random() * 10,
        duration: Math.random() * 50 + 100
      });
    }
    
    // Update sky objects state
    setSkyObjects(objects);
  }, [cloudiness]); // Only depend on cloudiness
  
  // Initial effect for loading and hour/weather changes
  useEffect(() => {
    if (!mounted) return;
    
    // Generate sky objects when weather changes
    generateSkyObjects();
    
  }, [currentHour, cloudiness, mounted, generateSkyObjects]);
  
  // Áp dụng vào getSkyGradient
  const getSkyGradient = () => {
    return getThemeGradient(currentHour).gradient;
  };

  // Render sky objects
  const renderSkyObjects = () => {
    return skyObjects.map((obj, index) => {
      if (obj.type === 'star') {
        return (
          <div
            key={`star-${index}`}
            className="absolute rounded-full bg-white"
            style={{
              top: `${obj.position.y}%`,
              left: `${obj.position.x}%`,
              width: `${obj.size}px`,
              height: `${obj.size}px`,
              opacity: obj.brightness,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out ${Math.random() * 2}s`
            }}
          />
        );
      } else if (obj.type === 'cloud') {
        return (
          <motion.div
            key={`cloud-${index}`}
            className="absolute"
            style={{
              top: `${obj.position.y}%`,
              left: `${obj.position.x}%`,
              opacity: Math.min((cloudiness / 100) * 0.8, 0.8)
            }}
            animate={{ x: [-100, window.innerWidth] }}
            transition={{
              repeat: Infinity,
              duration: obj.duration,
              delay: obj.delay,
              ease: "linear"
            }}
          >
            <div
              className="relative"
              style={{
                width: `${obj.size}px`,
                height: `${obj.size * 0.6}px`
              }}
            >
              <div className="absolute rounded-full bg-white/80" style={{ width: '100%', height: '100%', filter: 'blur(8px)' }} />
              <div className="absolute rounded-full bg-white/80" style={{ width: '70%', height: '70%', top: '-20%', left: '20%', filter: 'blur(8px)' }} />
              <div className="absolute rounded-full bg-white/80" style={{ width: '50%', height: '50%', top: '20%', left: '50%', filter: 'blur(8px)' }} />
            </div>
          </motion.div>
        );
      }
      return null;
    });
  };
  
  // Render sun or moon based on time of day
  const renderCelestialBody = () => {
    // Don't display celestial body when weather is too cloudy
    if (cloudiness > 80) return null;
    
    if (daytime) {
      // Position sun based on time (arc across sky)
      const progress = (currentHour - 6) / 12; // 0 at 6am, 1 at 6pm
      const posX = 10 + progress * 80; // Move from left (10%) to right (90%)
      const posY = 50 - Math.sin(progress * Math.PI) * 40; // Arc from low to high to low
      
      return (
        <motion.div
          className="absolute z-0"
          style={{
            left: `${posX}%`,
            top: `${posY}%`,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: isSunrise || isSunset
              ? 'linear-gradient(to bottom right, #FF8C42, #FF5E5B)'
              : 'linear-gradient(to bottom right, #FFDE59, #FFA726)',
            boxShadow: isSunrise || isSunset
              ? '0 0 60px rgba(255, 100, 50, 0.8), 0 0 120px rgba(255, 150, 50, 0.5)'
              : '0 0 60px rgba(255, 200, 0, 0.8), 0 0 120px rgba(255, 150, 0, 0.5)',
            filter: cloudiness > 60 ? 'blur(3px)' : 'none',
            opacity: cloudiness > 60 ? 1 - (cloudiness - 60) / 40 : 1
          }}
          animate={{
            scale: [1, 1.05, 1, 0.95, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
            type: "tween"
          }}
        />
      );
    } else {
      // Position moon based on time (arc across sky)
      const progress = (currentHour < 6 ? currentHour + 18 : currentHour - 6) / 12; // 0 at 6pm, 1 at 6am
      const posX = 10 + progress * 80; // Move from left (10%) to right (90%)
      const posY = 50 - Math.sin(progress * Math.PI) * 40; // Arc from low to high to low
      
      return (
        <motion.div
          className="absolute z-0"
          style={{
            left: `${posX}%`,
            top: `${posY}%`,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isDawn || isDusk
              ? 'linear-gradient(to bottom right, #E2E8F0, #CBD5E0)'
              : 'linear-gradient(to bottom right, #F7FAFC, #EDF2F7)',
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.5), 0 0 80px rgba(200, 220, 255, 0.3)',
            filter: cloudiness > 60 ? 'blur(2px)' : 'none',
            opacity: cloudiness > 60 ? 0.8 - (cloudiness - 60) / 100 : 0.8
          }}
          animate={{
            scale: [1, 1.02, 1, 0.98, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
            type: "tween"
          }}
        />
      );
    }
  };
  
  // Render conditional UI only after hydration
  if (!mounted) {
    return (
      <div 
        className="fixed inset-0 w-full h-full -z-10 bg-black/30"
        aria-hidden="true"
      />
    );
  }
  
  return (
    <div 
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden"
      style={{ 
        background: getSkyGradient(),
        transition: 'background 2s ease-in-out'
      }}
    >
      {/* Main weather effects that sync with the background */}
      {condition !== 'clear' && (
        <WeatherEffects 
          condition={safeCondition}
          intensity={safeIntensity}
          temperature={temperature}
          isBackground={true}
          uniqueId="main"
        />
      )}

      {/* Render celestial body (sun or moon) */}
      {renderCelestialBody()}
      
      {/* Render stars, clouds, precipitation */}
      {renderSkyObjects()}
      
      {/* Special sunrise/sunset glow effects */}
      {(isSunrise || isSunset) && (
        <div 
          className="absolute inset-0"
          style={{
            background: isSunrise
              ? 'radial-gradient(circle at 20% 60%, rgba(255, 112, 66, 0.3) 0%, transparent 60%)'
              : 'radial-gradient(circle at 80% 60%, rgba(255, 112, 66, 0.3) 0%, transparent 60%)'
          }}
        />
      )}
      
      {/* Base overlay to ensure content remains readable */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" 
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
