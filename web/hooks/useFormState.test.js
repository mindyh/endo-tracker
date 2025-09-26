import { expect, test, describe, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormState } from './useFormState';

describe('useFormState', () => {
    test('initializes with default values', () => {
        const { result } = renderHook(() => useFormState());

        expect(result.current.form.type).toBe('');
        expect(result.current.form.details).toBe('');
        expect(result.current.form.painLevel).toBe('');
        expect(result.current.form.painLocations).toEqual([]);
        expect(result.current.form.allergens).toEqual([]);
        expect(result.current.form.supplements).toEqual([]);
    });

    test('updates form field values using updateForm', () => {
        const { result } = renderHook(() => useFormState());

        act(() => {
            result.current.updateForm({ type: 'pain-start' });
        });

        expect(result.current.form.type).toBe('pain-start');
    });

    test('handles change events', () => {
        const { result } = renderHook(() => useFormState());

        const mockEvent = { target: { name: 'details', value: 'test details' } };

        act(() => {
            result.current.handleChange(mockEvent);
        });

        expect(result.current.form.details).toBe('test details');
    });

    test('toggles array items', () => {
        const { result } = renderHook(() => useFormState());

        // Add item
        act(() => {
            result.current.toggleArrayItem('painLocations', 'lower-back');
        });

        expect(result.current.form.painLocations).toContain('lower-back');

        // Remove item
        act(() => {
            result.current.toggleArrayItem('painLocations', 'lower-back');
        });

        expect(result.current.form.painLocations).not.toContain('lower-back');
    });

    test('resets form data', () => {
        const { result } = renderHook(() => useFormState());

        // Set some values
        act(() => {
            result.current.updateForm({
                type: 'pain-start',
                details: 'test details'
            });
            result.current.toggleArrayItem('painLocations', 'abdomen');
        });

        // Reset
        act(() => {
            result.current.resetForm();
        });

        expect(result.current.form.type).toBe('');
        expect(result.current.form.details).toBe('');
        expect(result.current.form.painLocations).toEqual([]);
    });

    test('sets initial timestamp on mount', () => {
        const { result } = renderHook(() => useFormState('America/New_York'));

        expect(result.current.form.timestamp).toBeTruthy();
        // Should be a datetime-local format (YYYY-MM-DDTHH:MM)
        expect(result.current.form.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });
});
