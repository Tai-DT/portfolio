'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context with default values
interface TimeContextType {
  currentHour: number;
  currentMinute: number;
  currentTime: string;
  isDaytime: boolean;
  // We need to add this function to match what theme-button.tsx expects
  updateHour: (hour: number) => void;
}

const TimeContext = createContext<TimeContextType>({
  currentHour: new Date().getHours(),
  currentMinute: new Date().getMinutes(),
  currentTime: '00:00',
  isDaytime: true,
  updateHour: () => {}, // Default empty function
});

export const useTime = () => useContext(TimeContext);

export function TimeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with current time
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(() => new Date().getMinutes());
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [isDaytime, setIsDaytime] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
  });

  // Add function to manually update hour (for the theme clock)
  const updateHour = (hour: number) => {
    setCurrentHour(hour);
    setIsDaytime(hour >= 6 && hour < 18);
  };

  // Extract the update logic to a useEffect instead of doing it during render
  useEffect(() => {
    // Update time function
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      
      setCurrentHour(hour);
      setCurrentMinute(minute);
      setCurrentTime(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
      setIsDaytime(hour >= 6 && hour < 18);
    };

    // Update time immediately and then set up interval
    updateTime();
    
    // Update time every minute
    const intervalId = setInterval(updateTime, 60000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const value = {
    currentHour,
    currentMinute,
    currentTime,
    isDaytime,
    updateHour,
  };

  return (
    <TimeContext.Provider value={value}>
      {children}
    </TimeContext.Provider>
  );
}
