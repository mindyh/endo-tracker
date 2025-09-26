import { expect, test, describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabNavigation } from './TabNavigation';

describe('TabNavigation Component', () => {
    test('renders all tabs', () => {
        const mockSetActiveTab = vi.fn();
        render(<TabNavigation activeTab="log" setActiveTab={mockSetActiveTab} />);

        expect(screen.getByText('📝 Log Event')).toBeDefined();
        expect(screen.getByText('📊 History')).toBeDefined();
        expect(screen.getByText('⚙️ Settings')).toBeDefined();
    });

    test('shows active tab correctly', () => {
        const mockSetActiveTab = vi.fn();
        render(<TabNavigation activeTab="history" setActiveTab={mockSetActiveTab} />);

        const historyTab = screen.getByText('📊 History').closest('button');
        expect(historyTab).toHaveClass('active');
    });

    test('calls setActiveTab when tab is clicked', async () => {
        const user = userEvent.setup();
        const mockSetActiveTab = vi.fn();
        render(<TabNavigation activeTab="log" setActiveTab={mockSetActiveTab} />);

        const historyTab = screen.getByText('📊 History');
        await user.click(historyTab);

        expect(mockSetActiveTab).toHaveBeenCalledWith('history');
    });

    test('renders with proper button structure', () => {
        const mockSetActiveTab = vi.fn();
        render(<TabNavigation activeTab="log" setActiveTab={mockSetActiveTab} />);

        const tabButtons = screen.getAllByRole('button');
        expect(tabButtons).toHaveLength(3);
    });
});
