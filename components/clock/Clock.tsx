'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { getHourBasedTheme } from '@/lib/theme-utils';
import { AnimatePresence } from 'framer-motion';
import ThemeSelector from './ThemeSelector';

interface ClockProps {
  currentHour: number;
  onHourChange?: (hour: number) => void;
  className?: string;
  currentMinute?: number;
}

export default function Clock({ 
  currentHour, 
  onHourChange, 
  className,
  currentMinute = new Date().getMinutes()
}: ClockProps) {
  const { setTheme } = useTheme();
  const [displayHour, setDisplayHour] = useState(currentHour);
  const [minutes, setMinutes] = useState(currentMinute);
  const [isEditing, setIsEditing] = useState(false);
  const [showAnalogClock, setShowAnalogClock] = useState(false);
  
  // Update local display hour when currentHour prop changes
  useEffect(() => {
    setDisplayHour(currentHour);
  }, [currentHour]);

  // Update minutes every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMinutes(new Date().getMinutes());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Format time with leading zeros
  const formattedHour = String(displayHour).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  // Handle clicking on the hour to adjust time
  const handleHourClick = () => {
    setShowAnalogClock(!showAnalogClock);
  };

  // Handle hour change
  const changeHour = (increment: number) => {
    const newHour = (displayHour + increment + 24) % 24;
    setDisplayHour(newHour);
    
    // Call the onHourChange prop if provided
    if (onHourChange) {
      onHourChange(newHour);
    }
    
    // Also update the theme based on the new hour
    setTheme(getHourBasedTheme(newHour));
  };

  // Handler for analog clock hour selection
  const handleSelectHour = (hour: number) => {
    setDisplayHour(hour);
    
    // Call the onHourChange prop if provided
    if (onHourChange) {
      onHourChange(hour);
    }
    
    // Also update the theme based on the new hour
    setTheme(getHourBasedTheme(hour));
  };

  // Close edit mode when clicking outside
  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  // Close analog clock
  const handleCloseAnalogClock = () => {
    setShowAnalogClock(false);
  };

  // Xác định màu sắc phù hợp với giờ hiện tại
  const getHourBasedColors = () => {
    const isDaytime = displayHour >= 6 && displayHour < 18;
    const isTransitionTime = (displayHour >= 5 && displayHour < 7) || 
                            (displayHour >= 17 && displayHour < 19);

    if (isTransitionTime) {
      // Màu sắc chuyển tiếp (bình minh/hoàng hôn)
      return {
        border: 'border-amber-500/30',
        indicator: displayHour >= 5 && displayHour < 7 ? '#FF9F48' : '#FF5E5B',
        shadow: displayHour >= 5 && displayHour < 7 ? '0 0 8px rgba(255, 159, 72, 0.7)' : '0 0 8px rgba(255, 94, 91, 0.7)',
        hover: 'hover:text-amber-300',
      };
    } else if (isDaytime) {
      // Màu sắc ban ngày
      return {
        border: 'border-sky-500/30',
        indicator: '#3B82F6',
        shadow: '0 0 8px rgba(59, 130, 246, 0.7)',
        hover: 'hover:text-sky-300',
      };
    } else {
      // Màu sắc ban đêm
      return {
        border: 'border-indigo-500/30',
        indicator: '#6366F1',
        shadow: '0 0 8px rgba(99, 102, 241, 0.7)',
        hover: 'hover:text-indigo-300',
      };
    }
  };

  const hourColors = getHourBasedColors();

  return (
    <div className="relative">
      <div 
        className={cn(
          `relative flex items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 text-white ${hourColors.border}`,
          className
        )}
        style={{ zIndex: 100 }} // Increase z-index to ensure it's above everything
      >
        <div className="flex items-center space-x-1">
          {/* Hour display/edit */}
          <div className="relative">
            <button 
              className={`cursor-pointer ${hourColors.hover} transition-colors text-lg font-medium`}
              onClick={handleHourClick}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white', 
                padding: '4px 8px',
                outline: 'none'
              }}
              title="Click to open analog clock"
            >
              {formattedHour}
            </button>
            
            {/* Hour adjustment controls - improved visibility and size */}
            {isEditing && (
              <div 
                className="absolute -top-24 left-1/2 -translate-x-1/2 bg-gray-800 rounded-lg p-2 flex flex-col items-center border border-gray-700"
                style={{ zIndex: 110 }} // Make sure controls are above everything else
              >
                <button 
                  className="hover:text-blue-400 hover:bg-gray-700 w-10 h-10 flex items-center justify-center rounded-md"
                  onClick={() => changeHour(1)}
                >
                  ▲
                </button>
                <button 
                  className="hover:text-blue-400 hover:bg-gray-700 w-10 h-10 flex items-center justify-center rounded-md mt-1"
                  onClick={() => changeHour(-1)}
                >
                  ▼
                </button>
              </div>
            )}
          </div>
          
          <span className="text-lg">:</span>
          
          {/* Minutes (read-only) */}
          <div className="text-lg font-medium">{formattedMinutes}</div>
        </div>
        
        {/* Indicator for current time-based theme - made larger and more visible */}
        <div className="ml-3 w-4 h-4 rounded-full" 
          style={{
            backgroundColor: hourColors.indicator,
            boxShadow: hourColors.shadow
          }}
        />
        
        {/* Click outside handler with highest z-index */}
        {isEditing && (
          <div 
            className="fixed inset-0"
            style={{ zIndex: 90 }} // Below the dropdown but above other content
            onClick={handleCloseEdit}
          />
        )}
      </div>

      {/* Analog clock overlay */}
      <AnimatePresence>
        {showAnalogClock && (
          <div className="relative">
            <ThemeSelector 
              currentHour={displayHour} 
              onSelectHour={handleSelectHour} 
              currentMinute={minutes} 
              onClose={handleCloseAnalogClock}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
