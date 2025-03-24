export type WeatherCondition = 'clear' | 'cloudy' | 'partly-cloudy' | 'rain' | 'snow' | 'thunderstorm' | 'fog' | 'leaf-fall' | 'hot';
export type Intensity = 'light' | 'moderate' | 'heavy';

interface WeatherData {
  condition: WeatherCondition;
  intensity: Intensity;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

/**
 * Returns expected weather conditions based on hour of day and season
 */
export function getWeatherForHour(hour: number): WeatherData {
  // Get current month to determine season (Northern Hemisphere)
  const currentMonth = new Date().getMonth(); // 0-11, January is 0
  const isSummer = currentMonth >= 5 && currentMonth <= 8; // June-September
  const isWinter = currentMonth === 11 || currentMonth <= 1; // December-February
  const isSpring = currentMonth >= 2 && currentMonth <= 4; // March-May
  const isFall = currentMonth >= 9 && currentMonth <= 10; // October-November
  
  // Generate temperature based on hour and season
  let baseTemp = 22; // Default base temperature (Celsius)
  
  if (isWinter) baseTemp = 5;
  else if (isSummer) baseTemp = 28;
  else if (isSpring) baseTemp = 18;
  else if (isFall) baseTemp = 15;
  
  // Adjust temperature based on time of day using a curve
  // Coolest at 5AM, warmest at 3PM (15)
  const hourFactor = hour < 5 
    ? -3 // Before dawn, coldest
    : hour < 10
      ? -2 + (hour - 5) * (4/5) // Morning warming
      : hour < 15
        ? 1 + (hour - 10) * (2/5) // Getting warmer to peak
        : hour < 21
          ? 3 - (hour - 15) * (4/6) // Cooling evening
          : -2 - (hour - 21) * (1/3); // Night cooling
  
  // Apply some randomization
  const randomFactor = Math.random() * 2 - 1; // -1 to +1
  const temperature = Math.round(baseTemp + hourFactor + randomFactor);
  
  // Determine intensity of weather effects based on time and season
  let intensity: Intensity = 'moderate';
  
  // Early morning or late evening - typically lighter weather effects
  if ((hour >= 5 && hour <= 7) || (hour >= 18 && hour <= 20)) {
    intensity = Math.random() > 0.3 ? 'light' : 'moderate';
  } 
  // Night time - more extreme intensities are rare
  else if (hour < 6 || hour >= 21) {
    intensity = Math.random() > 0.8 ? 'heavy' : Math.random() > 0.6 ? 'moderate' : 'light';
  }
  // Stormy afternoon in summer - can be heavy
  else if (hour >= 14 && hour <= 17 && isSummer) {
    intensity = Math.random() > 0.7 ? 'heavy' : Math.random() > 0.3 ? 'moderate' : 'light';
  }
  // Winter storms - more likely to be moderate or heavy
  else if (isWinter && temperature <= 0) {
    intensity = Math.random() > 0.6 ? 'heavy' : 'moderate';
  }
  // Default daytime mix
  else {
    intensity = Math.random() > 0.8 ? 'heavy' : Math.random() > 0.4 ? 'moderate' : 'light';
  }
  
  // Determine weather condition with weighted randomness based on time, temperature, and season
  let conditions: WeatherCondition[] = [];
  
  // Cold temperatures - Snow more likely
  if (temperature <= 0) {
    // Snow is more common at night and early morning in winter
    if (hour < 8 || hour >= 17) {
      conditions = ['snow', 'snow', 'snow', 'cloudy', 'partly-cloudy', 'clear'];
    } else {
      conditions = ['snow', 'snow', 'cloudy', 'partly-cloudy', 'clear', 'clear'];
    }
  }
  // Fall season with falling leaves - more common during daytime, especially with wind
  else if (isFall && temperature > 0 && temperature <= 15) {
    if (hour >= 8 && hour <= 17) {
      conditions = ['leaf-fall', 'leaf-fall', 'leaf-fall', 'partly-cloudy', 'cloudy', 'clear'];
    } else {
      // Less falling leaves at night (less visible anyway)
      conditions = ['leaf-fall', 'cloudy', 'partly-cloudy', 'clear', 'clear'];
    }
  }
  // Spring rain showers - more common in afternoon
  else if (isSpring && hour >= 12 && hour <= 18) {
    conditions = ['rain', 'rain', 'cloudy', 'partly-cloudy', 'clear'];
  }
  // Early morning fog - much more likely in spring and fall
  else if ((isSpring || isFall) && hour >= 5 && hour <= 8) {
    conditions = ['fog', 'fog', 'fog', 'partly-cloudy', 'clear'];
  } 
  // Winter fog - also more common in morning
  else if (isWinter && hour >= 6 && hour <= 10) {
    conditions = ['fog', 'fog', 'cloudy', 'partly-cloudy', 'clear'];
  }
  // Hot summer days - heat distortion during peak heat
  else if (isSummer && temperature >= 30 && hour >= 11 && hour <= 16) {
    conditions = ['hot', 'hot', 'clear', 'partly-cloudy'];
  }
  // Summer thunderstorms - more likely in late afternoon/early evening
  else if (isSummer && hour >= 14 && hour <= 20 && temperature > 25) {
    conditions = ['thunderstorm', 'thunderstorm', 'rain', 'cloudy', 'partly-cloudy'];
  }
  // Cool temperatures - rain more likely, especially in spring
  else if (temperature > 0 && temperature <= 15) {
    if (isSpring) {
      conditions = ['rain', 'rain', 'rain', 'cloudy', 'partly-cloudy', 'clear'];
    } else {
      conditions = ['rain', 'rain', 'cloudy', 'partly-cloudy', 'clear'];
    }
  }
  // Night time - generally clearer, especially in summer
  else if (hour < 6 || hour >= 20) {
    if (isSummer) {
      conditions = ['clear', 'clear', 'clear', 'partly-cloudy', 'cloudy'];
    } else {
      conditions = ['clear', 'clear', 'partly-cloudy', 'cloudy'];
    }
  }
  // Default daytime mix - more clear skies in summer
  else {
    if (isSummer) {
      conditions = ['clear', 'clear', 'clear', 'partly-cloudy', 'partly-cloudy', 'cloudy', 'rain'];
    } else {
      conditions = ['clear', 'clear', 'partly-cloudy', 'cloudy', 'rain'];
    }
  }
  
  // Randomly select a condition based on weighted array
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  // Descriptive text for the condition with time-appropriate modifiers
  let description = '';
  const isDaytime = hour >= 6 && hour < 18;
  const isMorning = hour >= 6 && hour < 12;
  const isAfternoon = hour >= 12 && hour < 18;
  const isEvening = hour >= 18 && hour < 22;
  const isNight = hour >= 22 || hour < 6;
  
  // Add time-of-day prefix for more realistic descriptions
  const timePrefix = isMorning ? 'Morning ' : 
                    isAfternoon ? 'Afternoon ' : 
                    isEvening ? 'Evening ' : 
                    isNight ? 'Night ' : '';
  
  switch (condition) {
    case 'clear':
      if (isDaytime) {
        if (temperature >= 35) description = 'Extreme Heat';
        else if (temperature >= 30) description = 'Hot and Sunny';
        else if (temperature >= 25) description = 'Warm and Sunny';
        else description = 'Sunny';
      } else {
        description = isEvening ? 'Clear Evening' : 'Clear Sky';
      }
      break;
    case 'partly-cloudy':
      description = `${timePrefix}Partly Cloudy`;
      break;
    case 'cloudy':
      description = `${timePrefix}Overcast`;
      break;
    case 'rain':
      if (intensity === 'light') description = `${timePrefix}Light Rain`;
      else if (intensity === 'moderate') description = `${timePrefix}Rain`;
      else description = `${timePrefix}Heavy Rain`;
      
      // Add atmospheric conditions for different times
      if (isEvening) description += ", Breezy";
      if (isMorning && intensity === 'light') description = "Morning Drizzle";
      break;
    case 'snow':
      if (intensity === 'light') description = `${timePrefix}Light Snow`;
      else if (intensity === 'moderate') description = `${timePrefix}Snow`;
      else description = `${timePrefix}Heavy Snow`;
      
      // Add temperature modifier
      if (temperature < -10) description = "Blizzard Conditions";
      else if (temperature < -5 && intensity === 'heavy') description = "Snowstorm";
      break;
    case 'thunderstorm':
      if (isNight) description = "Night Thunderstorm";
      else if (isEvening) description = "Evening Thunder";
      else description = "Thunderstorms";
      break;
    case 'fog':
      if (isMorning) description = "Morning Fog";
      else if (isEvening) description = "Evening Mist";
      else if (isNight) description = "Night Fog";
      else description = "Foggy";
      break;
    case 'leaf-fall':
      if (intensity === 'light') description = "Gentle Autumn Breeze";
      else if (intensity === 'moderate') description = "Autumn Breeze";
      else description = "Windy Autumn Day";
      break;
    case 'hot':
      if (temperature >= 38) description = "Dangerous Heat";
      else if (temperature >= 35) description = "Extreme Heat";
      else description = "Very Hot";
      
      // Add time modifiers
      if (hour >= 12 && hour <= 15) description += ", Peak Heat";
      break;
  }
  
  // Humidity varies by condition and time of day
  let humidity = 60;
  if (condition === 'rain' || condition === 'thunderstorm') {
    humidity = 80 + Math.floor(Math.random() * 15);
  } else if (condition === 'fog') {
    humidity = 90 + Math.floor(Math.random() * 5);
  } else if (condition === 'hot') {
    // Hot days can be either humid or dry depending on region
    // Let's assume a mix with lower average humidity
    humidity = 30 + Math.floor(Math.random() * 20);
  } else if (hour >= 5 && hour <= 8) {
    // Early morning typically has higher humidity
    humidity = 75 + Math.floor(Math.random() * 10);
  } else if (temperature < 5) {
    // Cold air typically holds less moisture but relative humidity can be high
    humidity = 50 + Math.floor(Math.random() * 20);
  } else {
    // Default case
    humidity = 40 + Math.floor(Math.random() * 30);
  }
  
  // Wind speed varies by time, condition, and season
  let windSpeed = 0;
  if (condition === 'leaf-fall') {
    // Stronger winds cause more leaf fall, especially in afternoon
    windSpeed = isAfternoon ? 18 + Math.floor(Math.random() * 10) : 
                           15 + Math.floor(Math.random() * 8);
  } else if (condition === 'thunderstorm') {
    // Thunderstorms often have gusty winds
    windSpeed = 15 + Math.floor(Math.random() * 15);
  } else if (condition === 'hot' && isAfternoon) {
    // Hot afternoons can have thermal winds
    windSpeed = 8 + Math.floor(Math.random() * 10);
  } else if (condition === 'clear' && isDaytime) {
    // Clear days generally have some wind, especially spring/fall
    windSpeed = (isSpring || isFall) ? 10 + Math.floor(Math.random() * 10) : 
                                     8 + Math.floor(Math.random() * 8);
  } else if (isWinter && intensity === 'heavy' && condition === 'snow') {
    // Blizzard conditions
    windSpeed = 20 + Math.floor(Math.random() * 15);
  } else {
    // Default case
    windSpeed = 5 + Math.floor(Math.random() * 7);
  }
  
  // Adjust "feels like" temperature based on wind chill, heat index and humidity
  let feelsLike = temperature;
  
  // Wind chill effect (significant when temperature is low and wind is high)
  if (temperature < 10 && windSpeed > 15) {
    // Basic wind chill approximation
    feelsLike -= 2 + Math.floor(windSpeed / 10);
    
    // More extreme wind chill at very low temperatures
    if (temperature < 0) {
      feelsLike -= 2;
    }
  } 
  // Heat index effect (significant when temperature is high and humidity is high)
  else if (temperature > 25 && humidity > 70) {
    // Basic heat index approximation for high humidity
    feelsLike += 2 + Math.floor((humidity - 70) / 10);
    
    // More extreme heat index at very high temperatures
    if (temperature >= 30) {
      feelsLike += 1 + Math.floor((temperature - 30) / 2);
    }
  } 
  // General heat factor for very hot weather, regardless of humidity
  else if (temperature >= 30) {
    feelsLike += 1 + Math.floor((temperature - 30) * 0.4);
  }
  
  return {
    condition,
    intensity,
    temperature,
    feelsLike: Math.round(feelsLike),
    humidity,
    windSpeed,
    description
  };
}

/**
 * Returns appropriate weather effect based on theme and temperature
 */
export function getWeatherEffectForTheme(theme: string, temperature: number = 20): { condition: WeatherCondition, intensity: Intensity } | null {
  // Handle special weather cases based on theme and temperature
  
  // Cold weather - snow
  if (temperature <= 0) {
    return { condition: 'snow', intensity: temperature < -5 ? 'heavy' : 'moderate' };
  }
  
  // Hot weather - shade effect
  if (temperature >= 30) {
    return { condition: 'hot', intensity: temperature >= 35 ? 'heavy' : 'moderate' };
  }
  
  // Fall theme with cool temperatures - falling leaves
  if ((theme.includes('fall') || theme === 'autumn') && temperature <= 15) {
    return { condition: 'leaf-fall', intensity: 'moderate' };
  }
  
  // Rain themed weather
  if (theme.includes('rain')) {
    return { condition: 'rain', intensity: 'moderate' };
  }
  
  // Snow themed weather
  if (theme.includes('snow') || theme.includes('winter')) {
    return { condition: 'snow', intensity: 'moderate' };
  }
  
  // Foggy conditions for dawn/morning
  if (theme === 'dawn' || theme === 'morning') {
    return Math.random() > 0.6 
      ? { condition: 'fog', intensity: 'light' }
      : null;
  }
  
  // Default: no special weather effects
  return null;
}
