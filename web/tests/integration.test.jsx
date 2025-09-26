import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('App Integration Tests', () => {
    beforeEach(() => {
        localStorageMock.getItem.mockImplementation((key) => {
            // Return null by default, let individual tests override specific keys
            return null;
        });
        localStorageMock.setItem.mockClear();
        vi.clearAllMocks();
    });

    test('complete workflow: log event, view in history, edit and delete', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Step 1: Log a new event
        const painButton = screen.getByRole('button', { name: /⚡\s*Pain Start/i });
        await user.click(painButton);

        // Fill in event details
        const detailsInput = screen.getByPlaceholderText('Add notes, triggers, or context...');
        await user.type(detailsInput, 'Severe morning cramps');

        // Set pain level
        const painLevelSlider = screen.getByRole('slider');
        fireEvent.change(painLevelSlider, { target: { value: '8' } });
        // fireEvent is now imported

        // Select pain location
        const abdomenBtn = screen.getByRole('button', { name: 'Abdomen' });
        // Use regex matcher for split text
        // Abdomen button may have emoji, so match by label only
        await user.click(abdomenBtn);

        // Submit the event
        const submitButton = screen.getByText('📝 Log Event');
        // Use getByRole for submit button
        // const submitButton = screen.getByRole('button', { name: /📝 Log Event/ });
        await user.click(submitButton);

        // Verify localStorage was called
        expect(localStorageMock.setItem).toHaveBeenCalledWith('endoEvents', expect.any(String));

        // Step 2: View event in Recent Events
        expect(screen.getByText('Severe morning cramps')).toBeDefined();
        // Use custom matcher for split text
        expect(screen.getByText((content, element) => element?.textContent?.includes('Severe morning cramps'))).toBeDefined();
        expect(screen.getByText('8/10')).toBeDefined();

        // Step 3: Go to History tab and verify event appears there
        const historyTab = screen.getByText('📊 History');
        // Use getByRole for tab navigation
        // const historyTab = screen.getByRole('button', { name: /📊 History/ });
        await user.click(historyTab);

        await waitFor(() => {
            expect(screen.getByText('Event History')).toBeDefined();
            // Use custom matcher for split text
            expect(screen.getByText((content, element) => element?.textContent?.includes('Event History'))).toBeDefined();
            expect(screen.getByText('Severe morning cramps')).toBeDefined();
        });

        // Step 4: Edit the event
        const editButton = screen.getByTitle('Edit event');
        // Use getByRole for edit button
        await user.click(editButton);

        // Modify the details
        const editDetailsTextarea = screen.getByDisplayValue('Severe morning cramps');
        // Use getByDisplayValue for textarea
        await user.clear(editDetailsTextarea);
        await user.type(editDetailsTextarea, 'Updated: Severe morning cramps with nausea');

        // Save the edit
        const saveButton = screen.getByText('✓ Save');
        await user.click(saveButton);

        // Verify the edit was saved
        await waitFor(() => {
            expect(screen.getByText('Updated: Severe morning cramps with nausea')).toBeDefined();
            expect(screen.getByText((content, element) => element?.textContent?.includes('Updated: Severe morning cramps with nausea'))).toBeDefined();
        });

        // Step 5: Delete the event
        const editButtonAgain = screen.getByTitle('Edit event');
        await user.click(editButtonAgain);

        const deleteButton = screen.getByText('🗑️ Delete');
        await user.click(deleteButton);

        // Verify event was removed
        await waitFor(() => {
            expect(screen.queryByText('Updated: Severe morning cramps with nausea')).toBeNull();
        });
    });

    test('settings management workflow', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Go to Settings tab
        const settingsTab = screen.getByText('⚙️ Settings');
        await user.click(settingsTab);

        // Add a custom pain location
        const addLocationInput = screen.getByPlaceholderText((content, element) => content.includes('Add new pain location...'));
        await user.type(addLocationInput, 'Right Shoulder');

        const addLocationButton = screen.getByText('Add Location');
        await user.click(addLocationButton);

        // Verify the new location was added
        expect(screen.getByText('Right Shoulder')).toBeDefined();
        expect(screen.getByText((content, element) => element?.textContent?.includes('Right Shoulder'))).toBeDefined();

        // Go back to Log tab and verify new location is available
        const logTab = screen.getByRole('button', { name: /📝 Log Event/ });
        await user.click(logTab);

        const painButton = screen.getByRole('button', { name: /⚡\s*Pain Start/i });
        await user.click(painButton);

        // Should see the new pain location option
        expect(screen.getByRole('button', { name: 'Right Shoulder' })).toBeDefined();
        expect(screen.getByRole('button', { name: /Right Shoulder/ })).toBeDefined();
    });

    test('data persistence across app reloads', async () => {
        const user = userEvent.setup();

        // Mock localStorage to return existing events
        const existingEvents = [
            {
                id: '123',
                type: 'pain-start',
                timestamp: '2025-09-26T10:00',
                details: 'Existing pain event',
                painLevel: '6',
                painLocations: ['abdomen']
            }
        ];
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'endoEvents') return JSON.stringify(existingEvents);
            return null;
        });

        render(<App />);

        // Should load existing events on startup
        expect(screen.getByText((content, element) => element?.textContent?.includes('Existing pain event'))).toBeDefined();
        expect(screen.getByText('6/10')).toBeDefined();

        // Verify in history tab as well
        const historyTab = screen.getByRole('button', { name: /📊 History/ });
        await user.click(historyTab);

        expect(screen.getByText('Existing pain event')).toBeDefined();
        expect(screen.getByText((content, element) => element?.textContent?.includes('Existing pain event'))).toBeDefined();
    });

    test('timezone handling in events', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Go to settings and change timezone
        const settingsTab = screen.getByText('⚙️ Settings');
        await user.click(settingsTab);

        // Expand timezone settings
        const timezoneHeader = screen.getByText((content, element) => element?.textContent?.includes('Timezone'));
        await user.click(timezoneHeader);

        const timezoneSelect = screen.getByDisplayValue('America/New_York');
        // Use getByRole for select
        // const timezoneSelect = screen.getByRole('combobox', { name: /Select your timezone/ });
        await user.selectOptions(timezoneSelect, 'America/Los_Angeles');

        // Go back and log an event
        const logTab = screen.getByText('📝 Log Event');
        await user.click(logTab);

        const painButton = screen.getByRole('button', { name: /Pain Start/i });
        await user.click(painButton);

        const submitButton = screen.getByText('📝 Log Event');
        await user.click(submitButton);

        // Event should be logged with the selected timezone
        expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('renders multiple event types and day grouping', async () => {
        const user = userEvent.setup();

        // Mock multiple events of different types
        const multipleEvents = [
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
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'endoEvents') return JSON.stringify(multipleEvents);
            return null;
        });

        render(<App />);

        // DOM-wide search for event details
        expect(document.body.textContent).toContain('Lower back pain');
        expect(document.body.textContent).toContain('Lunch with dairy');
        expect(document.body.textContent).toContain('Abdominal cramps');

        const historyTab = screen.getByRole('button', { name: /📊 History/ });
        await user.click(historyTab);

        // Should see events grouped by day
        const todayEls = screen.queryAllByText((content, element) => element?.textContent?.includes('Today'));
        expect(todayEls.length).toBeGreaterThan(0);
        const eventsCountEls = screen.queryAllByText((content, element) => element?.textContent?.includes('(3 events)'));
        expect(eventsCountEls.length).toBeGreaterThan(0);
    });
});
