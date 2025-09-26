import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventList } from './EventList';

// Mock data
const mockEvents = [
    {
        id: '1',
        type: 'pain-start',
        timestamp: '2025-09-26T10:00',
        details: 'Lower back pain',
        painLevel: '6',
        painLocations: ['lower-back']
    },
    {
        id: '2',
        type: 'meal',
        timestamp: '2025-09-26T12:00',
        details: 'Lunch with dairy',
        allergens: ['dairy']
    },
    {
        id: '3',
        type: 'pain-start',
        timestamp: '2025-09-25T15:00',
        details: 'Abdominal cramps',
        painLevel: '8',
        painLocations: ['abdomen']
    }
];

const mockPainLocations = [
    { key: 'lower-back', label: 'Lower Back' },
    { key: 'abdomen', label: 'Abdomen' }
];

const mockAllergens = [
    { key: 'dairy', label: 'Dairy' }
];

const mockSupplements = [
    { key: 'ibuprofen', label: 'Ibuprofen' }
];

const defaultProps = {
    events: mockEvents,
    painLocations: mockPainLocations,
    allergens: mockAllergens,
    supplements: mockSupplements,
    timezone: 'America/New_York',
    updateEvent: vi.fn(),
    deleteEvent: vi.fn()
};

describe('EventList Component', () => {
    test('renders events list', () => {
        render(<EventList {...defaultProps} />);

        const painStartElements = screen.getAllByText((content, element) =>
            element?.textContent?.includes('Pain Start')
        );
        expect(painStartElements.length).toBeGreaterThan(0);
        expect(screen.getByText((content, element) => element?.textContent?.includes('⚡'))).toBeDefined();
        expect(screen.getByText('Lower back pain')).toBeDefined();
        expect(screen.getByText((content, element) => element?.textContent?.includes('Lower back pain'))).toBeDefined();
        expect(screen.getByText('Lunch with dairy')).toBeDefined();
        expect(screen.getByText((content, element) => element?.textContent?.includes('Lunch with dairy'))).toBeDefined();
        expect(screen.getByText((content, element) => element?.textContent?.includes('Abdominal cramps'))).toBeDefined();
    });

    test('shows pain level badge', () => {
        render(<EventList {...defaultProps} />);
        expect(screen.getByText('6/10')).toBeDefined();
        expect(screen.getByText('8/10')).toBeDefined();
    });

    test('shows pain locations', () => {
        render(<EventList {...defaultProps} />);
        expect(screen.getAllByText('Locations:')[0]).toBeDefined();
        expect(screen.getByText('Lower Back')).toBeDefined();
        expect(screen.getByText('Abdomen')).toBeDefined();
    });

    test('shows allergens', () => {
        render(<EventList {...defaultProps} />);
        expect(screen.getByText('Allergens:')).toBeDefined();
        expect(screen.getByText('Dairy')).toBeDefined();
    });

    test('respects maxEvents prop', () => {
        render(<EventList {...defaultProps} maxEvents={2} />);

        const eventCards = screen.getAllByText((content, element) =>
            element?.textContent === 'Pain Start' || content.includes('Pain Start')
        );
        expect(eventCards).toHaveLength(1); // Only 1 pain event should be shown due to maxEvents=2
    });

    test('shows empty message when no events', () => {
        render(<EventList {...defaultProps} events={[]} />);
        expect(screen.getByText('No events to display.')).toBeDefined();
    });

    test('shows event count in title when enabled', () => {
        render(<EventList {...defaultProps} showCount={true} />);
        expect(screen.getByText('Events (3 events)')).toBeDefined();
    });

    test('enables editing mode when edit button clicked', async () => {
        const user = userEvent.setup();
        render(<EventList {...defaultProps} />);

        const editButtons = screen.getAllByTitle('Edit event');
        await user.click(editButtons[0]);

        expect(screen.getByDisplayValue('Lower back pain')).toBeDefined();
        expect(screen.getByText('✓ Save')).toBeDefined();
        expect(screen.getByText('✕ Cancel')).toBeDefined();
    });

    test('calls updateEvent when saving edit', async () => {
        const user = userEvent.setup();
        const mockUpdate = vi.fn();
        render(<EventList {...defaultProps} updateEvent={mockUpdate} />);

        // Enter edit mode
        const editButtons = screen.getAllByTitle('Edit event');
        await user.click(editButtons[0]);

        // Modify details
        const detailsTextarea = screen.getByDisplayValue('Lower back pain');
        await user.clear(detailsTextarea);
        await user.type(detailsTextarea, 'Updated pain description');

        // Save
        const saveButton = screen.getByText('✓ Save');
        await user.click(saveButton);

        expect(mockUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
            details: 'Updated pain description'
        }));
    });

    test('calls deleteEvent when delete button clicked', async () => {
        const user = userEvent.setup();
        const mockDelete = vi.fn();

        // Mock window.confirm
        window.confirm = vi.fn(() => true);

        render(<EventList {...defaultProps} deleteEvent={mockDelete} />);

        // Enter edit mode
        const editButtons = screen.getAllByTitle('Edit event');
        await user.click(editButtons[0]);

        // Click delete
        const deleteButton = screen.getByText('🗑️ Delete');
        await user.click(deleteButton);

        expect(mockDelete).toHaveBeenCalledWith('1');
    });
});

describe('EventList Day Grouping', () => {
    test('groups events by day when enabled', () => {
        render(<EventList {...defaultProps} groupByDay={true} />);

        expect(screen.getByText('Today')).toBeDefined();
        expect(screen.getByText('Yesterday')).toBeDefined();
    });

    test('shows day event counts', () => {
        render(<EventList {...defaultProps} groupByDay={true} />);

        expect(screen.getByText('(2 events)')).toBeDefined(); // Today's events
        expect(screen.getByText('(1 events)')).toBeDefined(); // Yesterday's events
    });

    test('toggles day collapse when header clicked', async () => {
        const user = userEvent.setup();
        render(<EventList {...defaultProps} groupByDay={true} />);

        // Initially should show expanded state (▼)
        // Only count collapse buttons in day headers, not in event cards
        const collapseButtons = screen.getAllByRole('button', { name: /▼/ });
        expect(collapseButtons).toHaveLength(1); // One day header after refactor

        // Find a day header and click it
        const yesterdayHeader = screen.getByText('Yesterday').closest('.day-header');
        await user.click(yesterdayHeader);

        // The day should toggle (arrow should change to collapsed ▶)
        expect(screen.getByText((content, element) => element?.textContent?.includes('▶'))).toBeDefined();
    });

    test('shows proper day labels', () => {
        const eventsWithDates = [
            {
                id: '1',
                type: 'pain-start',
                timestamp: new Date().toISOString(), // Today
                details: 'Today pain'
            },
            {
                id: '2',
                type: 'meal',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
                details: 'Yesterday meal'
            },
            {
                id: '3',
                type: 'supplements',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                details: 'Older event'
            }
        ];

        render(<EventList {...defaultProps} events={eventsWithDates} groupByDay={true} />);

        expect(screen.getByText('Today')).toBeDefined();
        expect(screen.getByText('Yesterday')).toBeDefined();
        // Should show full date for older events
        expect(screen.getByText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/)).toBeDefined();
    });
});
