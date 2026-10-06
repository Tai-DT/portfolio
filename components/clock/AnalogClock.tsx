'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/providers/WeatherProvider';
import { getThemeGradient } from '@/lib/theme-utils';
import WeatherEffects from '../weather/WeatherEffects';
import { WeatherCondition, Intensity } from '@/lib/weather-utils'; // Import the shared types

interface AnalogClockProps {
  currentHour: number; // 0-23 format for theme selection
  onSelectHour: (hour: number) => void;
  size?: number;
  currentMinute?: number;
}

// Cải tiến hàm lấy màu sắc cho theme
const getThemeColors = (hour: number): { primary: string; accent: string; background: string; text: string } => {
  // Define colors based on time of day
  if (hour >= 6 && hour < 18) {
    // Day themes (light)
    const hue = hour < 12 ? 30 + (hour - 6) * 15 : 105 + (hour - 12) * 15;
    const saturation = hour === 12 ? 0 : 0.02 + (hour % 12) * 0.01;
    
    return {
      primary: `oklch(0.205 ${saturation} ${hue})`,
      accent: `oklch(0.97 ${saturation} ${hue})`,
      background: hour === 12 
        ? 'oklch(1 0 0)' // Noon is pure white
        : `oklch(${0.98 + hour * 0.001} ${0.02 + (hour % 12) * 0.005} ${hour < 12 ? 240 - (hour - 6) * 10 : 140 - (hour - 12) * 20})`,
      text: hour < 9 || hour >= 16 ? '#ffffff' : '#202020' // Văn bản tối cho giờ sáng, văn bản sáng cho buổi chiều tối
    };
  } else {
    // Night themes (dark)
    const nightHour = hour < 6 ? hour : hour - 18;
    const hue = hour < 6 ? 315 + nightHour * 15 : 210 + nightHour * 15;
    const saturation = hour === 0 ? 0 : 0.02 + (nightHour) * 0.01;
    
    return {
      primary: `oklch(0.922 ${saturation} ${hue})`,
      accent: `oklch(0.269 ${saturation} ${hue})`,
      background: hour === 0
        ? 'oklch(0.145 0 0)' // Midnight is default dark
        : `oklch(${0.13 + nightHour * 0.01} ${0.01 + nightHour * 0.005} ${hour < 6 ? 320 + nightHour * 10 : 260 + nightHour * 10})`,
      text: '#ffffff' // Văn bản sáng cho ban đêm
    };
  }
};

export default function AnalogClock({ currentHour, onSelectHour, size = 280, currentMinute = new Date().getMinutes() }: AnalogClockProps) {
  const [prevHour, setPrevHour] = useState(currentHour);
  const [prevMinute, setPrevMinute] = useState(currentMinute);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [selectedAmPm, setSelectedAmPm] = useState<'am' | 'pm'>(currentHour >= 12 ? 'pm' : 'am');
  const [minutes, setMinutes] = useState(currentMinute);
  
  // Access the weather context to display weather effects
  const { condition, intensity, temperature, cloudiness, updateWeather } = useWeather();
  
  // Ensure condition is of the correct type
  const safeCondition: WeatherCondition = condition as WeatherCondition;
  const safeIntensity: Intensity = intensity as Intensity;
  
  const currentThemeColors = getThemeColors(currentHour);
  
  // Update minute state when prop changes - fix dependency issue
  useEffect(() => {
    setPrevMinute(minutes); // Store the previous value before updating
    setMinutes(currentMinute);
  }, [currentMinute, minutes]);
  
  // Convert 24-hour to 12-hour format for display
  const to12HourFormat = (hour24: number): number => {
    if (hour24 === 0 || hour24 === 12) return 12;
    return hour24 % 12;
  };
  
  // Convert 12-hour with AM/PM back to 24-hour
  const to24HourFormat = (hour12: number, ampm: 'am' | 'pm'): number => {
    if (hour12 === 12) {
      return ampm === 'am' ? 0 : 12;
    }
    return ampm === 'am' ? hour12 : hour12 + 12;
  };
  
  // Update prevHour for animations
  useEffect(() => {
    setPrevHour(currentHour);
    setSelectedAmPm(currentHour >= 12 ? 'pm' : 'am');
  }, [currentHour]);
  
  // Generate the 12 hour markers for the clock
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    // Convert index to hour number (1-12)
    const hourNumber = i === 0 ? 12 : i;
    
    // Calculate theme colors for both AM and PM variants
    const amHour = hourNumber === 12 ? 0 : hourNumber;
    const pmHour = hourNumber === 12 ? 12 : hourNumber + 12;
    
    // Position calculation (30 degrees per hour)
    const angle = (hourNumber * 30) - 90; // -90 to start at 12 o'clock
    const radian = (angle * Math.PI) / 180;
    const radius = size / 2 - 30;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    
    return {
      hourNumber,
      amHour,
      pmHour,
      x,
      y,
      angle,
      amThemeColors: getThemeColors(amHour),
      pmThemeColors: getThemeColors(pmHour),
    };
  });

  // Handle click on hour hand
  const handleHourHandClick = () => {
    // Toggle between AM and PM for the current hour
    const newAmPm = selectedAmPm === 'am' ? 'pm' : 'am';
    setSelectedAmPm(newAmPm);
    
    // Update the hour in 24-hour format
    const current12Hour = to12HourFormat(currentHour);
    const new24Hour = to24HourFormat(current12Hour, newAmPm);
    
    // Only trigger if the hour actually changes
    if (new24Hour !== currentHour) {
      onSelectHour(new24Hour);
      // Update weather when hour changes
      updateWeather();
    }
  };

  // Handle click on clock face
  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate position relative to center
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - centerY;
    
    // Calculate angle
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    
    // Convert to 12-hour format (30 degrees per hour)
    let hour12 = Math.round((angle + 90) / 30) % 12;
    if (hour12 === 0) hour12 = 12;
    
    // Convert to 24-hour format based on selected AM/PM
    const hour24 = to24HourFormat(hour12, selectedAmPm);
    
    onSelectHour(hour24);
  };

  // Handle AM/PM selection
  const handleAmPmChange = (ampm: 'am' | 'pm') => {
    setSelectedAmPm(ampm);
    
    // Update the hour in 24-hour format
    const current12Hour = to12HourFormat(currentHour);
    const new24Hour = to24HourFormat(current12Hour, ampm);
    
    // Only trigger if the hour actually changes
    if (new24Hour !== currentHour) {
      onSelectHour(new24Hour);
      // Update weather when AM/PM changes
      updateWeather();
    }
  };

  // Calculate hour hand rotation (30 degrees per hour + 0.5 degrees per minute)
  const hour12 = to12HourFormat(currentHour);
  const hourHandRotation = (hour12 * 30) + (minutes / 2); // Góc quay của kim giờ
  
  // Calculate minute hand rotation (6 degrees per minute)
  const minuteHandRotation = minutes * 6; // Góc quay của kim phút

  // Configure weather based on the current hour
  const isDaytime = (selectedAmPm === 'am' && hour12 >= 6) || (selectedAmPm === 'pm' && hour12 < 6);
  const isEarlyMorning = selectedAmPm === 'am' && (hour12 >= 5 && hour12 <= 7);
  const isNight = (selectedAmPm === 'am' && hour12 < 6) || (selectedAmPm === 'pm' && hour12 >= 6);
  
  // Get consistent sky gradient using the same function as DynamicBackground
  const getSkyGradient = () => {
    // Get the hour in 24-hour format for accurate gradient calculation
    const hour24 = selectedAmPm === 'am' 
      ? (hour12 === 12 ? 0 : hour12)
      : (hour12 === 12 ? 12 : hour12 + 12);
    
    // Use the same gradient function from theme-utils that DynamicBackground uses
    return getThemeGradient(hour24).gradient;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Clock face */}
      <div 
        className="absolute inset-0 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer overflow-hidden"
        style={{
          background: `radial-gradient(circle at center, ${currentThemeColors.background} 0%, rgba(0,0,0,0.8) 100%)`
        }}
        onClick={handleClockClick}
      >
        {/* Dynamic sky background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Day/Night sky gradient based on time - matching website background */}
          <div 
            className="absolute inset-0 transition-opacity duration-1000" 
            style={{
              background: getSkyGradient(), // Using the same gradient function as DynamicBackground
              opacity: 0.8 // Slightly higher opacity in the clock for better visibility
            }}
          />
          
          {/* Stars - visible at night */}
          {isNight && (
            <div className="absolute inset-0">
              {/* Generate 50 stars with different sizes and positions */}
              {[...Array(50)].map((_, i) => {
                const size = Math.random() * 2 + 1;
                const top = Math.random() * 100;
                const left = Math.random() * 100;
                const animationDelay = Math.random() * 3;
                
                return (
                  <div 
                    key={`star-${i}`} 
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      top: `${top}%`,
                      left: `${left}%`,
                      opacity: Math.random() * 0.7 + 0.3,
                      animation: `twinkle 4s infinite ${animationDelay}s`
                    }}
                  />
                );
              })}
            </div>
          )}
          
          {/* Moon - visible at night */}
          {isNight && (
            <motion.div
              className="absolute"
              style={{
                top: '15%',
                right: '20%',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#F5F3CE',
                boxShadow: '0 0 20px rgba(255, 255, 220, 0.8)',
                filter: cloudiness > 60 ? 'blur(2px)' : 'none',
                opacity: cloudiness > 80 ? 0.7 : 1
              }}
              animate={{
                x: [0, 5, 0, -5, 0],
                y: [0, 5, 0, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: "easeInOut",
                type: "tween"
              }}
            >
              {/* Moon crater details */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-gray-200/30" />
              <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-gray-200/30" />
              <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-gray-200/30" />
            </motion.div>
          )}
          
          {/* Sun - visible during day */}
          {isDaytime && (
            <motion.div
              className="absolute"
              style={{
                top: isEarlyMorning ? '40%' : '15%',
                left: isEarlyMorning ? '20%' : '70%',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(to bottom right, #FFD700, #FFA500)',
                boxShadow: '0 0 30px rgba(255, 200, 0, 0.8)',
                filter: cloudiness > 60 ? 'blur(3px)' : 'none',
                opacity: cloudiness > 80 ? 0.7 : 1
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
            >
              {/* Sun rays */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 60,
                  ease: "linear",
                  type: "tween"
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`ray-${i}`}
                    className="absolute bg-yellow-400 origin-center"
                    style={{
                      width: '2px',
                      height: '15px',
                      left: '50%',
                      top: '-15px',
                      transformOrigin: 'center 40px',
                      transform: `translateX(-50%) rotate(${i * 45}deg)`
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
          
          {/* Weather effects - use a consistent uniqueId */}
          {condition !== 'clear' && (
            <div className="absolute inset-0">
              <WeatherEffects 
                condition={safeCondition}
                intensity={safeIntensity}
                temperature={temperature}
                uniqueId="clock" // Important! Providing a unique ID for consistent animations
              />
            </div>
          )}
        </div>
      
        {/* Color wheel showing themes */}
        <div className="absolute inset-8 rounded-full opacity-30">
          {hourMarkers.map((marker) => (
            <div key={`am-color-${marker.hourNumber}`} className="absolute inset-0">
              {/* AM themes (left half) */}
              <div 
                className="absolute inset-0"
                style={{ 
                  clipPath: `polygon(50% 50%, ${50 + 45 * Math.cos((marker.angle) * Math.PI / 180)}% ${50 + 45 * Math.sin((marker.angle) * Math.PI / 180)}%, ${50 + 45 * Math.cos((marker.angle + 15) * Math.PI / 180)}% ${50 + 45 * Math.sin((marker.angle + 15) * Math.PI / 180)}%)`,
                  background: marker.amThemeColors.primary,
                  opacity: selectedAmPm === 'am' ? 0.8 : 0.3
                }}
              />
              
              {/* PM themes (right half) */}
              <div 
                className="absolute inset-0"
                style={{ 
                  clipPath: `polygon(50% 50%, ${50 + 45 * Math.cos((marker.angle + 180) * Math.PI / 180)}% ${50 + 45 * Math.sin((marker.angle + 180) * Math.PI / 180)}%, ${50 + 45 * Math.cos((marker.angle + 195) * Math.PI / 180)}% ${50 + 45 * Math.sin((marker.angle + 195) * Math.PI / 180)}%)`,
                  background: marker.pmThemeColors.primary,
                  opacity: selectedAmPm === 'pm' ? 0.8 : 0.3
                }}
              />
            </div>
          ))}
        </div>

        {/* Minute markers */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          const angle = (i * 6) - 90;
          const outerRadius = size / 2 - 10;
          // Remove unused position variables since we're using angle-based transforms
          
          return (
            <div 
              key={`minute-${i}`} 
              className="absolute top-1/2 left-1/2 origin-center"
              style={{ 
                width: '1px', 
                height: isHour ? '10px' : '5px', 
                background: isHour ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(${-outerRadius + 5}px)`
              }}
            />
          );
        })}

        {/* Hands Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Clock hands wrapper with centered origin */}
          <div className="relative w-0 h-0">
            {/* Minute hand */}
            <motion.div
              key={`minute-hand-${minutes}`}
              initial={{ rotate: prevMinute * 6 }}
              animate={{ rotate: minuteHandRotation }}
              transition={{ 
                type: 'spring', 
                stiffness: 150, 
                damping: 15, 
                duration: 0.5 
              }}
              className="absolute z-10 origin-bottom"
              style={{
                width: '2px',
                height: `${size / 2 - 30}px`,
                background: 'white',
                boxShadow: '0 0 5px rgba(255,255,255,0.6)',
                borderRadius: '1px 1px 0 0',
                bottom: '0px',
                left: '-1px'
              }}
            />
            
            {/* Hour hand */}
            <motion.div
              key={`hour-hand-${currentHour}-${selectedAmPm}`}
              initial={{ rotate: prevHour * 30 + (prevMinute / 2) }}
              animate={{ rotate: hourHandRotation }}
              transition={{ 
                type: 'spring', 
                stiffness: 100, 
                damping: 15,
                duration: 0.8
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleHourHandClick();
              }}
              className="absolute z-20 origin-bottom cursor-pointer"
              style={{
                width: '4px',
                height: `${size / 4 - 20}px`,
                background: `linear-gradient(to top, ${currentThemeColors.primary}, ${currentThemeColors.accent})`,
                boxShadow: '0 0 5px rgba(255,255,255,0.6)',
                borderRadius: '2px 2px 0 0',
                bottom: '0px',
                left: '-2px'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                Click to toggle AM/PM
              </motion.div>
            </motion.div>
          </div>
          
          {/* Center cap over hands */}
          <div 
            className="absolute w-6 h-6 rounded-full border-2 border-white/20 z-30"
            style={{ 
              background: currentThemeColors.accent,
              boxShadow: '0 0 6px rgba(255,255,255,0.8)'
            }}
          />
        </div>
        
        {/* Hour numbers */}
        {hourMarkers.map((marker) => {
          const isActive = to12HourFormat(currentHour) === marker.hourNumber && 
                         (currentHour >= 12 ? selectedAmPm === 'pm' : selectedAmPm === 'am');
                         
          const isHovered = hoveredHour === marker.hourNumber;
          const themeColors = selectedAmPm === 'am' ? marker.amThemeColors : marker.pmThemeColors;
          
          return (
            <motion.div 
              key={marker.hourNumber}
              className="absolute flex items-center justify-center rounded-full transition-all duration-300"
              style={{ 
                left: `calc(50% + ${marker.x}px - 14px)`, 
                top: `calc(50% + ${marker.y}px - 14px)`,
                width: '28px',
                height: '28px',
                background: isActive || isHovered 
                  ? themeColors.primary 
                  : 'rgba(0,0,0,0.5)',
                color: isActive || isHovered 
                  ? themeColors.text
                  : '#fff',
                border: `1px solid ${isActive ? 'white' : 'transparent'}`,
                boxShadow: isActive 
                  ? '0 0 8px rgba(255,255,255,0.8)' 
                  : isHovered 
                    ? '0 0 5px rgba(255,255,255,0.5)' 
                    : 'none',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 400,
                zIndex: isActive || isHovered ? 5 : 1
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 10px rgba(255,255,255,0.7)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                const hour24 = selectedAmPm === 'am' 
                  ? marker.amHour 
                  : marker.pmHour;
                onSelectHour(hour24);
              }}
              onHoverStart={() => setHoveredHour(marker.hourNumber)}
              onHoverEnd={() => setHoveredHour(null)}
            >
              {marker.hourNumber}
              
              {/* Small indicator showing the corresponding 24h time */}
              {isHovered && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black/70 text-white px-1 py-0.5 rounded">
                  {selectedAmPm === 'am' ? marker.amHour : marker.pmHour}:00
                </div>
              )}
            </motion.div>
          );
        })}
        
        {/* AM/PM selectors with improved transitions and sun/moon icons */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-4 text-white text-sm font-medium">
          <motion.button 
            className="px-4 py-1.5 rounded-full flex items-center gap-1.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              background: selectedAmPm === 'am' ? currentThemeColors.primary : 'rgba(0,0,0,0.6)',
              color: selectedAmPm === 'am' ? currentThemeColors.text : '#fff',
              boxShadow: selectedAmPm === 'am' ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
            }}
            transition={{ duration: 0.3 }}
            style={{ 
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: selectedAmPm === 'am' ? 600 : 400
            }}
            onClick={() => handleAmPmChange('am')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" fill="#FFD700" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            AM
          </motion.button>
          <motion.button 
            className="px-4 py-1.5 rounded-full flex items-center gap-1.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              background: selectedAmPm === 'pm' ? currentThemeColors.primary : 'rgba(0,0,0,0.6)',
              color: selectedAmPm === 'pm' ? currentThemeColors.text : '#fff',
              boxShadow: selectedAmPm === 'pm' ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
            }}
            transition={{ duration: 0.3 }}
            style={{ 
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: selectedAmPm === 'pm' ? 600 : 400
            }}
            onClick={() => handleAmPmChange('pm')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#A0BEFF" strokeWidth="1" />
            </svg>
            PM
          </motion.button>
        </div>
        
        {/* Day/night visual indicator - Enhanced with sun and moon paths */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-r from-blue-400/10 to-indigo-900/10 rounded-full" 
               style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}>
            {/* Subtle sun path */}
            <div className="absolute w-full h-full opacity-10" 
                 style={{ 
                   background: 'radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.6), transparent 40%)',
                   display: selectedAmPm === 'am' ? 'block' : 'none'
                 }}/>
          </div>
          <div className="absolute inset-0 bg-linear-to-l from-orange-400/10 to-purple-900/10 rounded-full" 
               style={{ clipPath: 'polygon(100% 0, 50% 0, 50% 100%, 100% 100%)' }}>
            {/* Subtle moon path */}
            <div className="absolute w-full h-full opacity-10" 
                 style={{ 
                   background: 'radial-gradient(circle at 70% 30%, rgba(160, 190, 255, 0.6), transparent 40%)',
                   display: selectedAmPm === 'pm' ? 'block' : 'none'
                 }}/>
          </div>
        </div>
        
        {/* Current time display with improved styling */}
        <motion.div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-md text-sm"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {hour12}:{minutes.toString().padStart(2, '0')} {selectedAmPm.toUpperCase()}
        </motion.div>
      </div>

      {/* Theme preview tooltip */}
      {hoveredHour !== null && hoveredHour !== to12HourFormat(currentHour) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md text-sm whitespace-nowrap"
          style={{ 
            background: selectedAmPm === 'am' 
              ? hourMarkers.find(m => m.hourNumber === hoveredHour)?.amThemeColors.background
              : hourMarkers.find(m => m.hourNumber === hoveredHour)?.pmThemeColors.background,
            color: selectedAmPm === 'am'
              ? hourMarkers.find(m => m.hourNumber === hoveredHour)?.amThemeColors.text || '#fff'
              : hourMarkers.find(m => m.hourNumber === hoveredHour)?.pmThemeColors.text || '#fff',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            zIndex: 20
          }}
        >
          {hoveredHour === 12 ? (selectedAmPm === 'am' ? 'Midnight' : 'Noon') : 
          `${hoveredHour}:00 ${selectedAmPm.toUpperCase()}`} theme
        </motion.div>
      )}
    </motion.div>
  );
}
