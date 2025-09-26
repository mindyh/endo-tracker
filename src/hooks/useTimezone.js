import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'timezone';

function getBrowserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

function getSupportedTimeZones() {
  if (typeof Intl.supportedValuesOf === 'function') {
    try {
      const vals = Intl.supportedValuesOf('timeZone');
      if (Array.isArray(vals) && vals.length) return vals;
    } catch {}
  }
  // Fallback minimal list
  return [
    'UTC',
    'America/Los_Angeles',
    'America/Denver',
    'America/Chicago',
    'America/New_York',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Kolkata',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];
}

export function useTimezone() {
  const initial = typeof window !== 'undefined'
    ? (localStorage.getItem(STORAGE_KEY) || getBrowserTimeZone())
    : getBrowserTimeZone();
  const [timezone, setTimezone] = useState(initial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, timezone);
    } catch {}
  }, [timezone]);

  const timezones = useMemo(() => getSupportedTimeZones(), []);

  return { timezone, setTimezone, timezones };
}
