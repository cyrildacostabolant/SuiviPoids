import { useState, useEffect } from 'react';

export function getLocalDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useLocalDateString(): string {
  const [todayStr, setTodayStr] = useState(getLocalDateString());

  useEffect(() => {
    let timeoutId: number;

    const scheduleUpdate = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      // Add 100ms extra to ensure we safely cross the midnight threshold locally
      const msUntilMidnight = tomorrow.getTime() - now.getTime() + 100;
      
      timeoutId = window.setTimeout(() => {
        setTodayStr(getLocalDateString());
        scheduleUpdate(); // Reschedule for next midnight
      }, msUntilMidnight);
    };

    scheduleUpdate();

    return () => window.clearTimeout(timeoutId);
  }, []);

  return todayStr;
}
