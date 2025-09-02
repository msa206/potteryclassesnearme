export function formatWorkingHours(hoursString: string | null | undefined): {
  formatted: string[];
  today?: string;
  isOpenNow?: boolean;
} {
  if (!hoursString) return { formatted: [] };

  try {
    // Parse JSON if it's a JSON string
    let hours: Record<string, string>;
    if (hoursString.startsWith('{')) {
      hours = JSON.parse(hoursString);
    } else {
      // If it's not JSON, return as-is
      return { 
        formatted: hoursString.split('\n').filter(line => line.trim()),
        today: hoursString.split('\n')[0]
      };
    }

    // Days of the week in order
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Format each day
    const formatted = daysOrder.map(day => {
      const time = hours[day];
      if (!time) return null;
      return `${day}: ${time}`;
    }).filter(Boolean) as string[];

    // Get today's hours
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today.getDay()];
    const todayHours = hours[todayName];

    // Check if currently open (basic implementation)
    let isOpenNow = false;
    if (todayHours && todayHours !== 'Closed') {
      // This is a simplified check - you'd need more complex logic for accurate open/closed status
      isOpenNow = true;
    }

    return {
      formatted,
      today: todayHours ? `Today: ${todayHours}` : 'Hours not available',
      isOpenNow
    };
  } catch (error) {
    // If parsing fails, return the original string split by lines
    return { 
      formatted: hoursString.split('\n').filter(line => line.trim()),
      today: hoursString.split('\n')[0]
    };
  }
}

export function formatHoursCompact(hoursString: string | null | undefined): string {
  const { today, isOpenNow } = formatWorkingHours(hoursString);
  if (!today) return '';
  
  // Add open/closed indicator
  if (today.includes('Closed')) {
    return '🔴 Closed today';
  } else if (isOpenNow) {
    return `🟢 ${today}`;
  }
  return today;
}