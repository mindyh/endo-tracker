import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventForm } from './EventForm';

const mockPainLocations = [
    { key: 'lower-back', label: 'Lower Back' },
    { key: 'abdomen', label: 'Abdomen' },
    { key: 'pelvis', label: 'Pelvis' }
];

const mockAllergens = [
    { key: 'dairy', label: 'Dairy' },
    { key: 'gluten', label: 'Gluten' },
    { key: 'nuts', label: 'Nuts' }
];

const mockSupplements = [
    { key: 'ibuprofen', label: 'Ibuprofen' },
    { key: 'vitamin-d', label: 'Vitamin D' }
];

const mockEventTypes = [
    { key: 'pain-start', label: 'Pain Started', emoji: '🩸' },
    { key: 'meal', label: 'Meal', emoji: '🍽️' },
    { key: 'supplements', label: 'Supplements', emoji: '💊' }
];

const defaultProps = {
    onAddEvent: vi.fn(),
    painLocations: mockPainLocations,
    allergens: mockAllergens,
    supplements: mockSupplements,
    eventTypes: mockEventTypes
};

describe('EventForm Component', () => {
    test('renders form title and quick buttons', () => {
        render(<EventForm {...defaultProps} />);

        expect(screen.getByText('Log New Event')).toBeDefined();
        expect(screen.getByText('🩸 Pain Started')).toBeDefined();
        expect(screen.getByText('🍽️ Meal')).toBeDefined();
        expect(screen.getByText('💊 Supplements')).toBeDefined();
    });

    test('selects event type when quick button clicked', async () => {
        const user = userEvent.setup();
        render(<EventForm {...defaultProps} />);

        const painButton = screen.getByText('🩸 Pain Started');
        await user.click(painButton);

        // Should show pain-specific fields
        expect(screen.getByText('Pain Level')).toBeDefined();
        expect(screen.getByText('Pain Locations')).toBeDefined();
    });

    test('shows appropriate fields for meal event', async () => {
        const user = userEvent.setup();
        render(<EventForm {...defaultProps} />);

        const mealButton = screen.getByText('🍽️ Meal');
        await user.click(mealButton);

        expect(screen.getByText('Allergens')).toBeDefined();
        expect(screen.getAllByText('Dairy')).toBeDefined();
        expect(screen.getAllByText('Gluten')).toBeDefined();
    });

    test('shows supplement fields for supplement event', async () => {
        const user = userEvent.setup();
        render(<EventForm {...defaultProps} />);

        const supplementButton = screen.getByText('💊 Supplements');
        await user.click(supplementButton);

        expect(screen.getByText('Supplements')).toBeDefined();
        expect(screen.getAllByText('Ibuprofen')).toBeDefined();
        expect(screen.getAllByText('Vitamin D')).toBeDefined();
    });

    test('allows entering event details', async () => {
        const user = userEvent.setup();
        render(<EventForm {...defaultProps} />);

        const painButton = screen.getByText('🩸 Pain Started');
        await user.click(painButton);

        const detailsInput = screen.getByPlaceholderText('Additional details...');
        await user.type(detailsInput, 'Sharp cramping pain');

        expect(screen.getByDisplayValue('Sharp cramping pain')).toBeDefined();
    });

    test('allows selecting pain level', async () => {
        const user = userEvent.setup();
        render(<EventForm {...defaultProps} />);

        const painButton = screen.getByText('🩸 Pain Started');
        await user.click(painButton);

        const painLevelSelect = screen.getByDisplayValue('Select pain level');
        await user.selectOptions(painLevelSelect, '7');

        expect(screen.getByDisplayValue('7')).toBeDefined();
    });

    test('allows selecting multiple pain locations', async () => {
        const user = userEvent.setup();
        render(<EventForm {...defaultProps} />);

        const painButton = screen.getByText('🩸 Pain Started');
        await user.click(painButton);

        // Select multiple pain locations
        const lowerBackBtn = screen.getByRole('button', { name: 'Lower Back' });
        const abdomenBtn = screen.getByRole('button', { name: 'Abdomen' });

        await user.click(lowerBackBtn);
        await user.click(abdomenBtn);

        expect(lowerBackBtn).toHaveClass('active');
        expect(abdomenBtn).toHaveClass('active');
    });

    test('allows selecting multiple allergens', async () => {
        const user = userEvent.setup();
        render(<EventForm {...defaultProps} />);

        const mealButton = screen.getByText('🍽️ Meal');
        await user.click(mealButton);

        const dairyBtn = screen.getByRole('button', { name: 'Dairy' });
        const glutenBtn = screen.getByRole('button', { name: 'Gluten' });

        await user.click(dairyBtn);
        await user.click(glutenBtn);

        expect(dairyBtn).toHaveClass('active');
        expect(glutenBtn).toHaveClass('active');
    });

    test('calls onAddEvent when form is submitted', async () => {
        const user = userEvent.setup();
        const mockAddEvent = vi.fn();
        render(<EventForm {...defaultProps} onAddEvent={mockAddEvent} />);

        // Select event type
        const painButton = screen.getByText('🩸 Pain Started');
        await user.click(painButton);

        // Fill in details
        const detailsInput = screen.getByPlaceholderText('Additional details...');
        await user.type(detailsInput, 'Test pain');

        // Select pain level
        const painLevelSelect = screen.getByDisplayValue('Select pain level');
        await user.selectOptions(painLevelSelect, '5');

        // Submit form
        const submitButton = screen.getByText('Log Event');
        await user.click(submitButton);

        expect(mockAddEvent).toHaveBeenCalledWith(expect.objectContaining({
            type: 'pain-start',
            details: 'Test pain',
            painLevel: '5'
        }));
    });

    test('resets form after successful submission', async () => {
        const user = userEvent.setup();
        const mockAddEvent = vi.fn();
        render(<EventForm {...defaultProps} onAddEvent={mockAddEvent} />);

        // Fill and submit form
        const painButton = screen.getByText('🩸 Pain Started');
        await user.click(painButton);

        const detailsInput = screen.getByPlaceholderText('Additional details...');
        await user.type(detailsInput, 'Test pain');

        const submitButton = screen.getByText('Log Event');
        await user.click(submitButton);

        // Form should reset
        expect(screen.getByDisplayValue('')).toBeDefined(); // details field should be empty
    });

    test('validates required fields before submission', async () => {
        const user = userEvent.setup();
        const mockAddEvent = vi.fn();
        render(<EventForm {...defaultProps} onAddEvent={mockAddEvent} />);

        // Try to submit without selecting event type
        const submitButton = screen.getByText('Log Event');
        await user.click(submitButton);

        // Should not call onAddEvent
        expect(mockAddEvent).not.toHaveBeenCalled();
    });

    test('allows changing datetime', async () => {
        const user = userEvent.setup();
        render(<EventForm {...defaultProps} />);

        const painButton = screen.getByText('🩸 Pain Started');
        await user.click(painButton);

        const datetimeInput = screen.getByLabelText(/When/);
        await user.clear(datetimeInput);
        await user.type(datetimeInput, '2025-09-26T15:30');

        expect(screen.getByDisplayValue('2025-09-26T15:30')).toBeDefined();
    });
});
