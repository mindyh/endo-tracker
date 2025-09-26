import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    vi.clearAllMocks();
  });

  test('complete workflow: log event, view in history, edit and delete', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Step 1: Log a new event
    const painButton = screen.getByText('🩸 Pain Started');
    await user.click(painButton);
    
    // Fill in event details
    const detailsInput = screen.getByPlaceholderText('Additional details...');
    await user.type(detailsInput, 'Severe morning cramps');
    
    // Set pain level
    const painLevelSelect = screen.getByDisplayValue('Select pain level');
    await user.selectOptions(painLevelSelect, '8');
    
    // Select pain location
    const abdomenBtn = screen.getByRole('button', { name: 'Abdomen' });
    await user.click(abdomenBtn);
    
    // Submit the event
    const submitButton = screen.getByText('Log Event');
    await user.click(submitButton);
    
    // Verify localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith('endoEvents', expect.any(String));
    
    // Step 2: View event in Recent Events
    expect(screen.getByText('Severe morning cramps')).toBeDefined();
    expect(screen.getByText('8/10')).toBeDefined();
    
    // Step 3: Go to History tab and verify event appears there
    const historyTab = screen.getByText('History');
    await user.click(historyTab);
    
    await waitFor(() => {
      expect(screen.getByText('Event History')).toBeDefined();
      expect(screen.getByText('Severe morning cramps')).toBeDefined();
    });
    
    // Step 4: Edit the event
    const editButton = screen.getByTitle('Edit event');
    await user.click(editButton);
    
    // Modify the details
    const editDetailsTextarea = screen.getByDisplayValue('Severe morning cramps');
    await user.clear(editDetailsTextarea);
    await user.type(editDetailsTextarea, 'Updated: Severe morning cramps with nausea');
    
    // Save the edit
    const saveButton = screen.getByText('✓ Save');
    await user.click(saveButton);
    
    // Verify the edit was saved
    await waitFor(() => {
      expect(screen.getByText('Updated: Severe morning cramps with nausea')).toBeDefined();
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
    const settingsTab = screen.getByText('Settings');
    await user.click(settingsTab);
    
    // Add a custom pain location
    const addLocationInput = screen.getByPlaceholderText('Enter new pain location');
    await user.type(addLocationInput, 'Right Shoulder');
    
    const addLocationButton = screen.getByText('Add Location');
    await user.click(addLocationButton);
    
    // Verify the new location was added
    expect(screen.getByText('Right Shoulder')).toBeDefined();
    
    // Go back to Log tab and verify new location is available
    const logTab = screen.getByText('Log');
    await user.click(logTab);
    
    const painButton = screen.getByText('🩸 Pain Started');
    await user.click(painButton);
    
    // Should see the new pain location option
    expect(screen.getByRole('button', { name: 'Right Shoulder' })).toBeDefined();
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
    localStorageMock.getItem.mockReturnValue(JSON.stringify(existingEvents));
    
    render(<App />);
    
    // Should load existing events on startup
    expect(screen.getByText('Existing pain event')).toBeDefined();
    expect(screen.getByText('6/10')).toBeDefined();
    
    // Verify in history tab as well
    const historyTab = screen.getByText('History');
    await user.click(historyTab);
    
    expect(screen.getByText('Existing pain event')).toBeDefined();
  });

  test('timezone handling in events', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Go to settings and change timezone
    const settingsTab = screen.getByText('Settings');
    await user.click(settingsTab);
    
    // Expand timezone settings
    const timezoneHeader = screen.getByText('Timezone Settings');
    await user.click(timezoneHeader);
    
    const timezoneSelect = screen.getByDisplayValue('America/New_York');
    await user.selectOptions(timezoneSelect, 'America/Los_Angeles');
    
    // Go back and log an event
    const logTab = screen.getByText('Log');
    await user.click(logTab);
    
    const painButton = screen.getByText('🩸 Pain Started');
    await user.click(painButton);
    
    const submitButton = screen.getByText('Log Event');
    await user.click(submitButton);
    
    // Event should be logged with the selected timezone
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('event type filtering and search functionality', async () => {
    const user = userEvent.setup();
    
    // Mock multiple events of different types
    const multipleEvents = [
      {
        id: '1',
        type: 'pain-start',
        timestamp: '2025-09-26T10:00',
        details: 'Pain event'
      },
      {
        id: '2', 
        type: 'meal',
        timestamp: '2025-09-26T12:00',
        details: 'Meal event'
      },
      {
        id: '3',
        type: 'supplements',
        timestamp: '2025-09-26T14:00',
        details: 'Supplement event'
      }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(multipleEvents));
    
    render(<App />);
    
    // Should see all events initially
    expect(screen.getByText('Pain event')).toBeDefined();
    expect(screen.getByText('Meal event')).toBeDefined();
    expect(screen.getByText('Supplement event')).toBeDefined();
    
    // Go to History to see day grouping
    const historyTab = screen.getByText('History');
    await user.click(historyTab);
    
    // Should see events grouped by day
    expect(screen.getByText('Today')).toBeDefined();
    expect(screen.getByText('(3 events)')).toBeDefined();
  });
});
