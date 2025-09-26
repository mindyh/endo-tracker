export const formatTime = (timestamp, timezone) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleString(undefined, { timeZone: timezone || undefined });
};

export const createKeyFromLabel = (label) => {
  return label.trim().toLowerCase().replace(/\s+/g, '-');
};

// Create a datetime-local compatible string for a given timezone representing "now"
export function nowDateTimeLocalInTimeZone(timezone) {
  const now = new Date();
  // Represent local time for the given timezone by formatting pieces and rebuilding
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone || undefined,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map(p => [p.type, p.value]));
  const y = parts.year;
  const m = parts.month;
  const d = parts.day;
  const hh = parts.hour;
  const mm = parts.minute;
  // datetime-local expects YYYY-MM-DDTHH:MM
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

// Convert a datetime-local string (interpreted in selected timezone) to ISO string
export function dateTimeLocalToISO(dateTimeLocal, timezone) {
  // Parse components
  const [datePart, timePart] = dateTimeLocal.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);

  // Build a date as if in that timezone by first formatting the intended epoch
  // We can get the offset by creating the date in UTC then adjusting using the timezone
  // Using Intl, compute the offset at that time by comparing UTC hours to timezone hours
  const utc = new Date(Date.UTC(y, (m - 1), d, hh, mm));
  // Find what local wall time would be in the target timezone for this UTC
  const tzHour = new Intl.DateTimeFormat('en-GB', { timeZone: timezone || 'UTC', hour: '2-digit', hour12: false }).format(utc);
  const tzDay = new Intl.DateTimeFormat('en-GB', { timeZone: timezone || 'UTC', day: '2-digit' }).format(utc);
  const utcHour = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', hour: '2-digit', hour12: false }).format(utc);
  const utcDay = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: '2-digit' }).format(utc);
  // If days differ, adjust hour delta accordingly
  const hourDelta = Number(tzHour) - Number(utcHour) + (Number(tzDay) - Number(utcDay)) * 24;
  // Apply the inverse delta so that the local wall time equals the provided input in target timezone
  const corrected = new Date(utc.getTime() - hourDelta * 60 * 60 * 1000);
  return corrected.toISOString();
}