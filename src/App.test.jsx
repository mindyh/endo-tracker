import { expect, test, describe, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    vi.clearAllMocks();
  });

  test('renders app title', () => {
    render(<App />);
    expect(screen.getByText('Endo Tracker')).toBeDefined();
    expect(screen.getByText('Track your endometriosis symptoms')).toBeDefined();
  });

  test('renders tab navigation', () => {
    render(<App />);
    expect(screen.getByText('Log')).toBeDefined();
    expect(screen.getByText('History')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
  });

  test('shows event form by default', () => {
    render(<App />);
    expect(screen.getByText('Log New Event')).toBeDefined();
  });

  test('switches between tabs', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Click History tab
    const historyTab = screen.getByText('History');
    await user.click(historyTab);
    expect(screen.getByText('Event History')).toBeDefined();
    
    // Click Settings tab
    const settingsTab = screen.getByText('Settings');
    await user.click(settingsTab);
    expect(screen.getByText('Settings')).toBeDefined();
  });

  test('allows logging a basic event', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Select pain event
    const painButton = screen.getByText('🩸 Period Started');
    await user.click(painButton);
    
    // Submit the event
    const submitButton = screen.getByText('Log Event');
    await user.click(submitButton);
    
    // Check that localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith('endoEvents', expect.any(String));
  });
});
