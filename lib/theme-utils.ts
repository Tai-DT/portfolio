/**
 * A utility to manage the time-based theme system
 */

// Convert hour to theme class name
export function getThemeByHour(hour: number): string {
  // 6AM-5PM: Light themes
  // 6PM-5AM: Dark themes
  if (hour >= 6 && hour < 18) {
    // Daytime
    if (hour === 12) {
      return "light" // Noon - default light theme
    } else {
      const hourName = hour < 12 ? `${hour}am` : `${hour-12}pm`
      return `light-${hourName}`
    }
  } else {
    // Nighttime
    if (hour === 0 || hour === 24) {
      return "dark" // Midnight - default dark theme
    } else {
      const hourName = hour < 12 ? `${hour}am` : `${hour-12}pm`
      return `dark-${hourName}`
    }
  }
}

// Get current hour's theme
export function getCurrentHourTheme(): string {
  const currentHour = new Date().getHours()
  return getThemeByHour(currentHour)
}

// Format time to display in the button
export function formatTimeDisplay(date: Date = new Date()): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// Convert 24-hour to 12-hour format with AM/PM
export function format12HourTime(hour24: number, minutes: number = 0): string {
  const hour12 = hour24 === 0 || hour24 === 12 ? 12 : hour24 % 12
  const ampm = hour24 < 12 ? 'AM' : 'PM'
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

// Determine if a given hour is daytime (6AM-5PM) or nighttime (6PM-5AM)
export function isDaytime(hour: number): boolean {
  return hour >= 6 && hour < 18
}

// Check if current hour is during sunrise
export function isSunrise(hour: number): boolean {
  return hour >= 5 && hour <= 7;
}

// Check if current hour is during sunset
export function isSunset(hour: number): boolean {
  return hour >= 17 && hour <= 19;
}

// Get a description of the current time of day
export function getTimeOfDayDescription(hour: number): string {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 14) return "noon";
  if (hour >= 14 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "sunset";
  if (hour >= 20 && hour < 24) return "night";
  return "late night";
}

// Xác định theme dựa trên giờ hiện tại
export function getHourBasedTheme(hour: number): string {
  return getThemeByHour(hour)
}

// Map hour to theme class (matches globals.css: light, light-Nam/pm, dark, dark-Nam/pm)
export function getExactThemeByHour(hour: number): string {
  return getThemeByHour(hour)
}

// Lấy màu chữ tương phản dựa trên màu nền
export function getContrastTextColor(backgroundColor: string): string {
  // Phân tích màu nền để xác định màu chữ phù hợp
  // Đơn giản hóa: trả về màu trắng cho nền tối, đen cho nền sáng
  // Nếu là màu oklch, kiểm tra giá trị sáng tối (lightness - giá trị đầu tiên)
  if (backgroundColor.startsWith('oklch(')) {
    const lightness = parseFloat(backgroundColor.split('(')[1].split(' ')[0]);
    return lightness > 0.6 ? '#000000' : '#ffffff';
  }
  
  // Xử lý các màu thông thường
  if (backgroundColor.includes('night') || backgroundColor.includes('dark')) {
    return '#ffffff';
  }
  return '#000000';
}

// Helper function cho việc tạo gradient theo thời gian
export function getTimeBasedGradient(hour: number): string {
  if (hour >= 5 && hour < 7) { // Bình minh
    return `linear-gradient(to right, #ff9966, #ff5e62)`;
  } else if (hour >= 7 && hour < 10) { // Buổi sáng
    return `linear-gradient(to right, #56ccf2, #2f80ed)`;
  } else if (hour >= 10 && hour < 16) { // Buổi trưa
    return `linear-gradient(to right, #00c6ff, #0072ff)`;
  } else if (hour >= 16 && hour < 18) { // Buổi chiều
    return `linear-gradient(to right, #1e3c72, #2a5298)`;
  } else if (hour >= 18 && hour < 20) { // Hoàng hôn
    return `linear-gradient(to right, #ff5e62, #ff9966)`;
  } else if (hour >= 20 && hour < 23) { // Buổi tối
    return `linear-gradient(to right, #141e30, #243b55)`;
  } else { // Đêm khuya
    return `linear-gradient(to right, #000428, #004e92)`;
  }
}

// Helper function cho việc tạo gradient theo thời gian - can be used by both components
export function getThemeGradient(hour: number): { gradient: string, overlayOpacity: number } {
  if (hour >= 5 && hour < 7) { // Bình minh
    return {
      gradient: `linear-gradient(to bottom,
        ${hour === 5 ? '#0c1445' : '#1e56a0'} 0%,
        ${hour === 5 ? '#4b3286' : '#ff9a8b'} 50%,
        ${hour === 5 ? '#ff6464' : '#ff6a88'} 100%)`,
      overlayOpacity: 0.25
    };
  } else if (hour >= 7 && hour < 10) { // Buổi sáng
    return {
      gradient: 'linear-gradient(to bottom, #87CEEB 0%, #E0F7FF 100%)',
      overlayOpacity: 0.15
    };
  } else if (hour >= 10 && hour < 16) { // Trưa
    return {
      gradient: 'linear-gradient(to bottom, #56CCF2 0%, #2F80ED 100%)',
      overlayOpacity: 0.2
    };
  } else if (hour >= 16 && hour < 18) { // Chiều
    return {
      gradient: 'linear-gradient(to bottom, #2F80ED 0%, #56CCF2 100%)',
      overlayOpacity: 0.2
    };
  } else if (hour >= 18 && hour < 20) { // Hoàng hôn
    return {
      gradient: `linear-gradient(to bottom,
        ${hour === 18 ? '#ff9a8b' : '#4b3286'} 0%,
        ${hour === 18 ? '#ff6a88' : '#1e3c72'} 50%,
        ${hour === 18 ? '#4b3286' : '#0c1445'} 100%)`,
      overlayOpacity: 0.3
    };
  } else if (hour >= 20 && hour < 23) { // Tối
    return {
      gradient: 'linear-gradient(to bottom, #0A1128 0%, #1e3c72 100%)',
      overlayOpacity: 0.35
    };
  } else { // Đêm khuya (23h-5h)
    return {
      gradient: 'linear-gradient(to bottom, #0A0A1A 0%, #141E30 100%)',
      overlayOpacity: 0.4
    };
  }
}
