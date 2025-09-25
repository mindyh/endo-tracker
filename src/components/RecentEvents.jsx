import { eventTypes } from '../data/constants';
import { formatTime } from '../utils/timeUtils';

export const RecentEvents = ({ events, painLocations, allergens, supplements }) => {
  if (events.length === 0) return null;

  return (
    <div className="recent-events">
      <h3>Recent Events</h3>
      <div className="event-list">
        {events.map((event) => {
          const eventType = eventTypes.find(et => et.key === event.type);
          return (
            <div key={event.id} className="event-card">
              <div className="event-content">
                <div className="event-header">
                  <span className="event-type">
                    {eventType?.label.split(' ')[1] || event.type}
                  </span>
                  <span className="event-time">{formatTime(event.timestamp)}</span>
                </div>
                {event.details && (
                  <div className="event-details">{event.details}</div>
                )}
                {event.painLevel && (
                  <div className="event-pain">
                    Pain Level: <span className="pain-badge">{event.painLevel}/10</span>
                  </div>
                )}
                {event.painLocations && event.painLocations.length > 0 && (
                  <div className="event-locations">
                    Locations: {event.painLocations.map(loc => 
                      painLocations.find(pl => pl.key === loc)?.label || loc
                    ).join(', ')}
                  </div>
                )}
                {event.allergens && event.allergens.length > 0 && (
                  <div className="event-allergens">
                    Allergens: {event.allergens.map(allergen => 
                      allergens.find(a => a.key === allergen)?.label || allergen
                    ).join(', ')}
                  </div>
                )}
                {event.supplements && event.supplements.length > 0 && (
                  <div className="event-supplements">
                    Supplements: {event.supplements.map(supplement => 
                      supplements.find(s => s.key === supplement)?.label || supplement
                    ).join(', ')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};