'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTime } from '@/providers/TimeProvider';
import { WeatherCondition, Intensity } from '@/lib/weather-utils'; // Import the shared types

interface WeatherEffectsProps {
  condition: WeatherCondition;
  intensity: Intensity;
  temperature?: number;
  isBackground?: boolean;
  uniqueId?: string;
}

export default function WeatherEffects({ 
  condition, 
  intensity, 
  temperature = 20, 
  isBackground = false,
  uniqueId = 'main'
}: WeatherEffectsProps) {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const [lightningFlash, setLightningFlash] = useState(false);
  const [shadeEffect, setShadeEffect] = useState<React.ReactNode | null>(null);
  const { currentHour } = useTime();
  
  // Use refs to ensure consistent random values across all instances
  const seedRef = useRef<number>(uniqueId === 'clock' ? 0.5 : 0.7);
  
  // Wrap pseudoRandom in useCallback to fix the exhaustive deps warning
  const pseudoRandom = useCallback((min: number, max: number, offset: number = 0): number => {
    const x = Math.sin(seedRef.current + offset) * 10000;
    seedRef.current += 0.1;
    return min + (max - min) * (x - Math.floor(x));
  }, []);
  
  // Generate weather effect particles based on condition, intensity and time
  useEffect(() => {
    // Reset seed for consistent generation across components
    seedRef.current = uniqueId === 'clock' ? 0.5 : 0.7;
    
    let particleCount: number;
    
    // Set particle count based on intensity
    switch (intensity) {
      case 'light':
        particleCount = 20;
        break;
      case 'moderate':
        particleCount = 50;
        break;
      case 'heavy':
        particleCount = 100;
        break;
      default:
        particleCount = 30;
    }
    
    // Scale particle count based on whether it's background or clock
    if (isBackground) {
      particleCount = Math.round(particleCount * 1.5);
    } else if (uniqueId === 'clock') {
      particleCount = Math.round(particleCount * 0.4); // Fewer particles for the clock
    }
    
    // Time-based adjustments - using these in the particle generation logic
    const isNight = currentHour < 5 || currentHour >= 20;
    const isSunrise = currentHour >= 5 && currentHour < 8;
    const isSunset = currentHour >= 17 && currentHour < 20;
    
    // Handle partly-cloudy like cloudy but with fewer clouds
    const effectiveCondition = condition === 'partly-cloudy' ? 'cloudy' : condition;
    const effectiveParticleCount = condition === 'partly-cloudy' 
      ? Math.floor(particleCount * 0.5) // 50% fewer particles for partly-cloudy
      : particleCount;
    
    // Generate particles based on weather condition
    if (effectiveCondition === 'rain') {
      // Rain intensity varies by time of day
      let rainOpacity = 0.4;
      let rainSpeed = 1.0;
      
      if (isNight) {
        rainOpacity = 0.3;  // Less visible at night
      } else if (isSunrise || isSunset) {
        rainOpacity = 0.5;  // More visible during sunrise/sunset
      }
      
      // Rain is faster during storms, slower in light rain
      if (intensity === 'heavy') {
        rainSpeed = 0.7;
      } else if (intensity === 'light') {
        rainSpeed = 1.2;
      }
      
      const raindrops = Array.from({ length: particleCount }).map((_, i) => {
        const duration = (pseudoRandom(0.5, 1.0, i) * rainSpeed);
        const delay = pseudoRandom(0, 0.5, i + 100);
        const positionX = pseudoRandom(0, 100, i + 200);
        const opacity = (pseudoRandom(0.3, 0.7, i + 300) * rainOpacity);
        const height = intensity === 'heavy'
          ? pseudoRandom(15, 35, i + 400)
          : intensity === 'moderate'
            ? pseudoRandom(10, 25, i + 400)
            : pseudoRandom(5, 15, i + 400);
        const angle = intensity === 'heavy' 
          ? pseudoRandom(15, 25, i + 500)
          : pseudoRandom(5, 15, i + 500);
        
        return (
          <motion.div
            key={`rain-${uniqueId}-${i}`}
            className="absolute bg-blue-400 rounded-full"
            style={{
              width: '1px',
              height: `${height}px`,
              left: `${positionX}%`,
              top: '-20px',
              opacity: isBackground ? opacity * 0.8 : opacity,
              transform: `rotate(${angle}deg)`
            }}
            animate={{
              y: ['0vh', '100vh']
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "linear"
            }}
          />
        );
      });
      setParticles(raindrops);
      
    } else if (effectiveCondition === 'snow') {
      // Snow intensity and appearance varies by time
      let snowOpacity = 0.7;
      let snowSpeed = 1.0;
      let snowColor = 'white';
      
      // Night snow has blue tint, sunrise/sunset has a warmer tint
      if (isNight) {
        snowColor = 'rgb(230, 240, 255)'; // Blue-ish tint at night
        snowOpacity = 0.65;
      } else if (isSunrise) {
        snowColor = 'rgb(255, 250, 240)'; // Warm sunrise tint
        snowOpacity = 0.75;
      } else if (isSunset) {
        snowColor = 'rgb(255, 245, 235)'; // Warm sunset tint
        snowOpacity = 0.75;
      }
      
      // Make snow more dramatic for colder temperatures
      const snowflakeCount = temperature < -5 
        ? particleCount * 1.5 
        : temperature < 0 
          ? particleCount * 1.2 
          : particleCount;
      
      // Snow falls slower at night, faster during day
      if (isNight) {
        snowSpeed = 0.8; // Slower at night
      } else if (intensity === 'heavy') {
        snowSpeed = 0.9; // Still slower in heavy snow
      } else if (intensity === 'light') {
        snowSpeed = 1.1; // Faster in light snow
      }
          
      const snowflakes = Array.from({ length: Math.ceil(snowflakeCount) }).map((_, i) => {
        const size = pseudoRandom(2, 4, i) + (temperature < -10 ? 4 : 2);
        const duration = (pseudoRandom(6, 11, i + 100) / snowSpeed);
        const delay = pseudoRandom(0, 5, i + 200);
        const positionX = pseudoRandom(0, 100, i + 300);
        const useStarShape = pseudoRandom(0, 1, i + 400) > 0.7;
        
        if (useStarShape) {
          return (
            <motion.div
              key={`snow-star-${uniqueId}-${i}`}
              className="absolute"
              style={{
                width: `${size * 1.5}px`,
                height: `${size * 1.5}px`,
                left: `${positionX}%`,
                top: '-10px',
                opacity: isBackground ? snowOpacity * 0.8 : snowOpacity
              }}
              animate={{
                y: ['0vh', '100vh'],
                x: [`${positionX}%`, `${positionX - 10 + pseudoRandom(0, 20, i + 500)}%`],
                rotate: [0, 360]
              }}
              transition={{
                y: {
                  duration,
                  repeat: Infinity,
                  delay
                },
                x: {
                  duration: duration / 2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                },
                rotate: {
                  duration: duration * 2,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M12 2L14 9H21L16 14L18 21L12 17L6 21L8 14L3 9H10L12 2Z" 
                  fill={snowColor}
                  fillOpacity={0.9}
                />
              </svg>
            </motion.div>
          );
        } else {
          return (
            <motion.div
              key={`snow-${uniqueId}-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${positionX}%`,
                top: '-10px',
                background: snowColor,
                opacity: isBackground ? snowOpacity * 0.9 : snowOpacity,
                filter: 'blur(0.5px)'
              }}
              animate={{
                y: ['0vh', '100vh'],
                x: [`${positionX}%`, `${positionX - 10 + pseudoRandom(0, 20, i + 500)}%`],
                rotate: [0, 360]
              }}
              transition={{
                y: {
                  duration,
                  repeat: Infinity,
                  delay
                },
                x: {
                  duration: duration / 2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                },
                rotate: {
                  duration: duration * 2,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            />
          );
        }
      });
      setParticles(snowflakes);
      
    } else if (effectiveCondition === 'leaf-fall') {
      // Leaf colors and behavior vary by time of day
      let leafOpacity = 0.9;
      let leafSpeed = 1.0;
      
      // Leaves are less visible at night, more visible during sunrise/sunset
      if (isNight) {
        leafOpacity = 0.6;
      } else if (isSunrise || isSunset) {
        leafOpacity = 1.0; // More visible during golden hours
      }
      
      // Leaves fall faster with more wind in afternoon, slower at night
      if (isNight) {
        leafSpeed = 0.8; // Slower at night
      } else if (currentHour >= 10 && currentHour <= 15) {
        leafSpeed = 1.2; // Faster in mid-day (more wind)
      }
      
      // Different leaf colors based on time of day
      const getMorningColors = () => [
        'rgb(244, 196, 54)',    // Bright yellow
        'rgb(242, 134, 39)',    // Bright orange
        'rgb(254, 192, 45)',    // Yellow
        'rgb(200, 125, 22)',     // Golden brown
        'rgb(235, 153, 33)',    // Gold
      ];
      
      const getAfternoonColors = () => [
        'rgb(244, 96, 54)',     // Orange-red
        'rgb(232, 84, 39)',     // Strong orange
        'rgb(180, 82, 22)',     // Brown
        'rgb(156, 44, 40)',     // Dark red
        'rgb(215, 113, 33)',    // Copper
      ];
      
      const getNightColors = () => [
        'rgb(184, 76, 44)',     // Muted orange-red
        'rgb(162, 64, 29)',     // Muted orange
        'rgb(140, 62, 12)',     // Dark brown
        'rgb(126, 34, 30)',     // Dark red
        'rgb(165, 93, 23)',     // Muted copper
      ];
      
      let colors = getMorningColors();
      if (currentHour >= 12 && currentHour < 18) {
        colors = getAfternoonColors();
      } else if (currentHour >= 18 || currentHour < 6) {
        colors = getNightColors();
      }
      
      // Create falling autumn leaves with time-appropriate colors
      const leafCount = isBackground ? Math.ceil(particleCount * 0.35) : particleCount;
      const leaves = Array.from({ length: leafCount }).map((_, i) => {
        const size = pseudoRandom(5, 20, i);
        const duration = (pseudoRandom(10, 18, i + 100) / leafSpeed);
        const delay = pseudoRandom(0, 5, i + 200);
        const positionX = pseudoRandom(0, 100, i + 300);
        const swayAmount = pseudoRandom(100, 300, i + 400);
        const rotateAmount = pseudoRandom(-360, 360, i + 500);
        
        const colorIndex = Math.floor(pseudoRandom(0, colors.length, i + 600));
        const color = colors[colorIndex];
        
        // More leaf variety with different shapes
        const leafType = Math.floor(pseudoRandom(0, 3, i + 700)); // 3 different leaf types
        
        let leafPath = '';
        if (leafType === 0) {
          // Maple-like leaf
          leafPath = "M10 0C7 4 0 7 0 13C0 16.866 4.477 20 10 20C15.523 20 20 16.866 20 13C20 7 13 4 10 0Z";
        } else if (leafType === 1) {
          // Oak-like leaf
          leafPath = "M10 0C8 3 3 5 0 8C0 13 3 20 10 20S20 13 20 8C17 5 12 3 10 0Z";
        } else {
          // Round leaf
          leafPath = "M10 0C5 2 0 5 0 10C0 15.523 4.477 20 10 20S20 15.523 20 10C20 5 15 2 10 0Z";
        }
        
        return (
          <motion.div
            key={`leaf-${uniqueId}-${i}`}
            className="absolute"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${positionX}%`,
              top: '-20px',
              opacity: isBackground ? leafOpacity * 0.45 : leafOpacity,
              zIndex: isBackground ? 0 : 10
            }}
            animate={{
              y: ['0vh', '100vh'],
              x: [
                `${positionX}%`,
                `${positionX - swayAmount / 2}%`, 
                `${positionX + swayAmount / 2}%`,
                `${positionX - swayAmount / 4}%`,
              ],
              rotate: [0, rotateAmount],
            }}
            transition={{
              y: {
                duration,
                repeat: Infinity,
                delay,
                ease: "easeIn"
              },
              x: {
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.33, 0.67, 1]
              },
              rotate: {
                duration: duration / 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          >
            {/* SVG Leaf with time-appropriate color */}
            <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={leafPath} fill={color} />
              <path d="M10 2C10 2 10 12 10 16" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            </svg>
          </motion.div>
        );
      });
      setParticles(leaves);
      
    // ... existing code for other conditions ...
    } else if (effectiveCondition === 'cloudy') {
      // Cloud appearance varies by time of day
      let cloudOpacity = 0.3;
      let cloudColor = 'rgba(255, 255, 255, 0.7)';
      
      if (isNight) {
        cloudColor = 'rgba(220, 225, 235, 0.5)'; // Darker at night
        cloudOpacity = 0.2;
      } else if (isSunrise) {
        cloudColor = 'rgba(255, 210, 180, 0.6)'; // Pink-orange at sunrise
        cloudOpacity = 0.35;
      } else if (isSunset) {
        cloudColor = 'rgba(255, 180, 150, 0.6)'; // Orange-red at sunset
        cloudOpacity = 0.35;
      }
      
      // Create cloud patches - using effectiveParticleCount for partly-cloudy support
      const cloudCount = Math.floor(effectiveParticleCount / 10);
      const clouds = Array.from({ length: cloudCount }).map((_, i) => {
        const opacity = pseudoRandom(0.1, 0.4, i);
        const scale = pseudoRandom(1, 2, i + 100);
        const top = pseudoRandom(0, 30, i + 200);
        const positionX = pseudoRandom(0, 100, i + 300);
        const duration = pseudoRandom(100, 250, i + 400);
        
        return (
          <div key={`cloud-${uniqueId}-${i}`} className="absolute" style={{ 
            top: `${top}%`, 
            left: `${positionX}%`, 
            opacity: isBackground ? opacity * cloudOpacity * 0.9 : opacity * cloudOpacity 
          }}>
            <motion.div 
              className="relative"
              animate={{
                x: [`-100vw`, `100vw`]
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="absolute rounded-full" style={{ 
                width: `${scale * 100}px`, 
                height: `${scale * 60}px`, 
                filter: 'blur(10px)',
                background: cloudColor
              }}></div>
              <div className="absolute rounded-full" style={{ 
                width: `${scale * 70}px`, 
                height: `${scale * 50}px`, 
                top: `-${scale * 20}px`, 
                left: `${scale * 40}px`, 
                filter: 'blur(10px)',
                background: cloudColor
              }}></div>
              <div className="absolute rounded-full" style={{ 
                width: `${scale * 60}px`, 
                height: `${scale * 40}px`, 
                top: `${scale * 10}px`, 
                left: `${scale * 80}px`, 
                filter: 'blur(10px)',
                background: cloudColor
              }}></div>
            </motion.div>
          </div>
        );
      });
      setParticles(clouds);
      
    } else if (effectiveCondition === 'thunderstorm') {
      // Rain particles for thunderstorm
      const raindrops = Array.from({ length: particleCount }).map((_, i) => {
        const duration = pseudoRandom(0.3, 0.8, i);
        const delay = pseudoRandom(0, 0.5, i + 100);
        const positionX = pseudoRandom(0, 100, i + 200);
        const opacity = pseudoRandom(0.3, 0.9, i + 300) * 
                        (isNight ? 0.4 : isSunset ? 0.6 : 0.5);
        
        return (
          <motion.div
            key={`storm-rain-${uniqueId}-${i}`}
            className="absolute bg-blue-400 rounded-full"
            style={{
              width: '2px',
              height: '20px',
              left: `${positionX}%`,
              top: '-20px',
              opacity: isBackground ? opacity * 0.8 : opacity,
              transform: 'rotate(10deg)'
            }}
            animate={{
              y: ['0vh', '100vh']
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "linear"
            }}
          />
        );
      });
      
      setParticles(raindrops);
    } else if (effectiveCondition === 'fog') {
      // Fog appearance varies by time - morning fog is white, evening fog is bluer
      let fogColor = 'white';
      let fogOpacity = 1.0;
      
      if (isNight) {
        fogColor = 'rgb(220, 225, 235)';  // Slight blue tint at night
        fogOpacity = 0.8;
      } else if (isSunrise) {
        fogColor = 'rgb(255, 245, 235)';  // Slight warm tint at sunrise
        fogOpacity = 1.2; // More visible
      } else if (isSunset) {
        fogColor = 'rgb(255, 235, 225)';  // Orange tint at sunset
        fogOpacity = 1.2; // More visible
      }
      
      const fogLayers = Array.from({ length: 6 }).map((_, i) => (
        <motion.div 
          key={`fog-layer-${uniqueId}-${i}`}
          className="absolute inset-0"
          style={{
            background: fogColor,
            opacity: (0.025 + (i * 0.01)) * fogOpacity,
            filter: `blur(${10 + i * 5}px)`
          }}
          animate={{ 
            x: [
              -100 + (i * 10), 
              100 - (i * 10)
            ],
            opacity: [
              (0.025 + (i * 0.01)) * fogOpacity,
              (0.045 + (i * 0.01)) * fogOpacity,
              (0.025 + (i * 0.01)) * fogOpacity
            ]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: 90 - (i * 10),
              ease: "linear"
            },
            opacity: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: 30 - (i * 3),
              ease: "easeInOut"
            }
          }}
        />
      ));
      
      setParticles(fogLayers);
      
    } else if (effectiveCondition === 'hot') {
      // No particles for hot weather, just heat distortion and shade effects
      setParticles([]);
    }
    
  }, [condition, intensity, temperature, isBackground, currentHour, uniqueId, pseudoRandom]);
  
  // Lightning effect for thunderstorms - now uses the memoized pseudoRandom
  useEffect(() => {
    if (condition === 'thunderstorm') {
      const isNight = currentHour < 5 || currentHour >= 20;
      // Lightning frequency depends on intensity and time of day
      const frequency = isNight ? 0.25 : 0.2;
      
      const lightningInterval = setInterval(() => {
        // Random chance of lightning
        if (pseudoRandom(0, 1) < (isBackground ? frequency * 0.75 : frequency)) {
          setLightningFlash(true);
          setTimeout(() => setLightningFlash(false), 200);
        }
      }, isNight ? 4000 : 3000);  // Less frequent at night to avoid being too disruptive
      
      return () => clearInterval(lightningInterval);
    }
  }, [condition, isBackground, currentHour, pseudoRandom]);
  
  // Heat effect for hot temperatures - also update to use the memoized pseudoRandom
  useEffect(() => {
    if (condition === 'hot' && temperature > 30) {
      // Heat intensity based on temperature and time of day
      const isDaytime = currentHour >= 7 && currentHour <= 18;
      const isPeakHeat = currentHour >= 11 && currentHour <= 15; // Peak heat hours
      
      // Heat intensity varies based on time of day
      let heatIntensity = temperature > 35 ? 0.4 : temperature > 32 ? 0.3 : 0.2;
      
      // Heat is more intense during peak hours
      if (isPeakHeat) {
        heatIntensity *= 1.2;
      } else if (!isDaytime) {
        heatIntensity *= 0.7; // Less intense heat effect at night
      }
      
      // Heat color varies by time - warmer tinted during sunset
      const isSunset = currentHour >= 17 && currentHour <= 19;
      const heatColor = isSunset ? 'rgba(255,220,180,' : 'rgba(255,230,180,';
      
      // Create shade overlay (tree shadows and heat distortion)
      const shade = (
        <div className="fixed inset-0 pointer-events-none z-10">
          {/* Heat distortion effect */}
          <div 
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at 50% -20%, transparent 0%, ${heatColor}${heatIntensity}})`,
              opacity: isBackground ? 0.7 : 0.8,
            }}
          />
          
          {/* If this is for background, add more intense distortion effects */}
          {isBackground && (
            <>
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(0deg, ${heatColor}${heatIntensity * 0.7}) 0%, transparent 50%)`,
                  mixBlendMode: 'overlay',
                  opacity: 0.5
                }}
              />
            </>
          )}
          
          {/* Top-edge shadow effect to improve UI readability */}
          <div 
            className="absolute inset-x-0 top-0 h-40 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)',
              opacity: isBackground ? 0.5 : 0.6,
            }}
          />
          
          {/* Side shadow effects */}
          <div 
            className="absolute inset-y-0 left-0 w-40 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 100%)',
              opacity: isBackground ? 0.4 : 0.5,
            }}
          />
          <div 
            className="absolute inset-y-0 right-0 w-40 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, rgba(0,0,0,0.3) 0%, transparent 100%)',
              opacity: isBackground ? 0.4 : 0.5,
            }}
          />
          
          {/* Tree shadows (randomly positioned) - only for non-background mode */}
          {!isBackground && Array.from({ length: 5 }).map((_, i) => {
            const leftPos = pseudoRandom(0, 100, i);
            const topPos = pseudoRandom(30, 100, i + 100);
            const width = pseudoRandom(100, 400, i + 200);
            const height = pseudoRandom(100, 300, i + 300);
            
            return (
              <motion.div 
                key={`shade-${uniqueId}-${i}`}
                className="absolute"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  width: `${width}px`,
                  height: `${height}px`,
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 70%)',
                  transformOrigin: 'center',
                }}
                animate={{
                  scale: [1, 1.05, 1, 0.98, 1],
                  opacity: [0.3, 0.35, 0.3, 0.25, 0.3],
                  x: [-5, 5, -3, 8, -5],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
          
          {/* Heat waves animation */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'url("data:image/svg+xml,%3Csvg width=\'400\' height=\'400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
              filter: 'blur(8px)',
              mixBlendMode: 'overlay',
              opacity: isBackground ? 0.2 : 0.3,
              animation: 'heat-wave 10s infinite alternate ease-in-out',
            }}
          >
            <style jsx>{`
              @keyframes heat-wave {
                0% { transform: scale(1.0) translate(0, 0) rotate(0deg); }
                50% { transform: scale(1.05) translate(10px, 5px) rotate(1deg); }
                100% { transform: scale(1.02) translate(-5px, -8px) rotate(-1deg); }
              }
            `}</style>
          </div>
        </div>
      );
      
      setShadeEffect(shade);
    } else {
      setShadeEffect(null);
    }
  }, [condition, temperature, isBackground, currentHour, uniqueId, pseudoRandom]);
  
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${isBackground ? '-z-5' : 'z-10'}`}>
      {/* Weather particles */}
      {particles}
      
      {/* Lightning flash overlay - color varies based on time of day */}
      {lightningFlash && (
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, isBackground ? 0.6 : 0.8, 0.1, isBackground ? 0.4 : 0.6, 0] 
          }}
          style={{
            background: currentHour >= 17 || currentHour < 8 
              ? 'rgb(230, 230, 255)' // Bluer lightning at night/dawn
              : 'white'              // White lightning during day
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
      
      {/* Show shade effect for hot weather */}
      {shadeEffect}
    </div>
  );
}
