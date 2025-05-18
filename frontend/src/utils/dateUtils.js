// src/utils/dateUtils.js

export function formatDate(date) {
  if (!date) return null;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Format time
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // For today, yesterday, and tomorrow, show special text
  if (date.toDateString() === today.toDateString()) {
    return `Today at ${time}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${time}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${time}`;
  }
  
  // For dates this week, show day name
  const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  if (daysAgo > 0 && daysAgo < 7) {
    return `${date.toLocaleDateString([], { weekday: 'long' })} at ${time}`;
  }
  
  // For other dates, show formatted date
  return `${date.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })} at ${time}`;
}