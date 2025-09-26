import { expect, test, describe } from 'vitest';
import { formatTime, dateTimeLocalToISO } from './timeUtils';

describe('timeUtils', () => {
    describe('formatTime', () => {
        test('formats ISO timestamp to readable time', () => {
            const timestamp = '2024-01-15T14:30:00.000Z';
            const timezone = 'America/New_York';

            const result = formatTime(timestamp, timezone);

            // Should include time and date info (exact format may vary by locale)
            expect(result).toContain('9:30'); // 2:30 PM UTC = 9:30 AM EST (standard time)
        });

        test('handles different timezones', () => {
            const timestamp = '2024-01-15T14:30:00.000Z';

            const nyResult = formatTime(timestamp, 'America/New_York');
            const laResult = formatTime(timestamp, 'America/Los_Angeles');

            expect(nyResult).not.toEqual(laResult);
        });

        test('handles datetime-local format', () => {
            const timestamp = '2024-01-15T14:30';
            const timezone = 'America/New_York';

            const result = formatTime(timestamp, timezone);

            expect(result).toContain('2:30');
        });
    });

    describe('dateTimeLocalToISO', () => {
        test('converts datetime-local to ISO format', () => {
            const datetimeLocal = '2025-09-26T14:30';

            const result = dateTimeLocalToISO(datetimeLocal);

            expect(result).toBe('2025-09-26T14:30:00.000Z');
        });

        test('handles empty input', () => {
            const result = dateTimeLocalToISO('');
            expect(result).toBe(null);
        });

        test('handles null/undefined input', () => {
            expect(dateTimeLocalToISO(null)).toBe(null);
            expect(dateTimeLocalToISO(undefined)).toBe(null);
        });

        test('preserves timezone information', () => {
            const datetimeLocal = '2025-09-26T14:30';
            const result = dateTimeLocalToISO(datetimeLocal);

            // Should end with Z indicating UTC
            expect(result.endsWith('Z')).toBe(true);
        });
    });
});
