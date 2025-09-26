import { EventList } from './EventList';

export const RecentEvents = (props) => {
  if (props.events.length === 0) return null;

  return (
    <EventList
      {...props}
      title="Recent Events"
      maxEvents={5}
    />
  );
};