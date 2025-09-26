import { EventList } from './EventList';

export const History = (props) => {
    return (
        <EventList
            {...props}
            title="Event History"
            emptyMessage="No events logged yet. Start by logging your first event!"
            showCount={true}
            groupByDay={true}
        />
    );
};
