'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AnalogClock from './AnalogClock';

interface ThemeSelectorProps {
  currentHour: number;
  onSelectHour: (hour: number) => void;
  currentMinute: number;
  onClose: () => void; // Add close handler
}

export default function ThemeSelector({ currentHour, onSelectHour, currentMinute, onClose }: ThemeSelectorProps) {
  const [selectedHour, setSelectedHour] = useState(currentHour);
  
  // Apply new hour selection with a slight delay for visual feedback
  const handleSelectHour = (hour: number) => {
    setSelectedHour(hour);
    // Slight delay to let the user see the selection animation
    setTimeout(() => {
      onSelectHour(hour);
    }, 200);
  };
  
  // Update local state when external currentHour changes
  useEffect(() => {
    setSelectedHour(currentHour);
  }, [currentHour]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }}
      className="absolute top-full mt-4 right-0 bg-black/80 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/10 z-[200]"
    >
      {/* Close button */}
      <button 
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white/60 hover:text-white z-10"
        onClick={onClose}
      >
        ✕
      </button>

      {/* 12-hour Analog Clock with current minute */}
      <AnalogClock 
        currentHour={selectedHour} 
        currentMinute={currentMinute}
        onSelectHour={handleSelectHour} 
      />
      
      <div className="mt-4 text-center">
        <p className="text-white/80 text-sm">
          Click on a number to select the hour theme
        </p>
        <p className="text-white/60 text-xs mt-1">
          Click on hour hand to toggle AM/PM
        </p>
      </div>
    </motion.div>
  );
}
