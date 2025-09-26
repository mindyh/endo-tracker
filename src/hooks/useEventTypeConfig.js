import { useState, useEffect } from 'react';

export const useEventTypeConfig = (defaultEventTypes) => {
  const [activeEventTypes, setActiveEventTypes] = useState(() => {
    const saved = localStorage.getItem('endo-tracker-active-event-types');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate that saved event types still exist in defaultEventTypes
        const validEventTypes = parsed.filter(savedType =>
          defaultEventTypes.some(defaultType => defaultType.key === savedType.key)
        );

        // Add any new event types that weren't in the saved list
        const newEventTypes = defaultEventTypes.filter(defaultType =>
          !parsed.some(savedType => savedType.key === defaultType.key)
        );

        const mergedEventTypes = [...validEventTypes, ...newEventTypes];
        return mergedEventTypes.length > 0 ? mergedEventTypes : defaultEventTypes;
      } catch (e) {
        console.warn('Failed to parse saved event types, using defaults');
        return defaultEventTypes;
      }
    }
    return defaultEventTypes;
  });

  // Save to localStorage whenever activeEventTypes changes
  useEffect(() => {
    localStorage.setItem('endo-tracker-active-event-types', JSON.stringify(activeEventTypes));
  }, [activeEventTypes]);

  return {
    activeEventTypes,
    setActiveEventTypes
  };
};