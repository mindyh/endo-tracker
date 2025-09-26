import { expect, test, describe, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useItemManager } from './useItemManager';

describe('useItemManager', () => {
    test('initializes with provided items', () => {
        const initialItems = [
            { key: 'test-1', label: 'Test 1' },
            { key: 'test-2', label: 'Test 2' }
        ];
        const { result } = renderHook(() => useItemManager(initialItems, 'test'));

        expect(result.current.items).toEqual(initialItems);
    });

    test('manages newInput state', () => {
        const { result } = renderHook(() => useItemManager([], 'test'));

        act(() => {
            result.current.setNewInput('New Item');
        });

        expect(result.current.newInput).toBe('New Item');
    });

    test('adds new item when addItem is called', () => {
        const { result } = renderHook(() => useItemManager([], 'test'));

        act(() => {
            result.current.setNewInput('New Location');
        });

        expect(result.current.newInput).toBe('New Location');

        act(() => {
            result.current.addItem();
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].label).toBe('New Location');
        expect(result.current.items[0].key).toBe('new-location');
        expect(result.current.newInput).toBe(''); // Should clear input
    });

    test('removes item when removeItem is called', () => {
        const initialItems = [
            { key: 'item-1', label: 'Item 1' },
            { key: 'item-2', label: 'Item 2' }
        ];
        const { result } = renderHook(() => useItemManager(initialItems, 'test'));

        act(() => {
            result.current.removeItem('item-1');
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].key).toBe('item-2');
    });

    test('prevents duplicate items', () => {
        const initialItems = [{ key: 'existing', label: 'Existing' }];
        const { result } = renderHook(() => useItemManager(initialItems, 'test'));

        act(() => {
            result.current.setNewInput('Existing'); // Same label as existing item
            result.current.addItem();
        });

        // Should not add duplicate
        expect(result.current.items).toHaveLength(1);
    });

    test('manages collapsed state', () => {
        const { result } = renderHook(() => useItemManager([], 'test'));

        expect(result.current.collapsed).toBe(true);

        act(() => {
            result.current.toggleCollapsed();
        });

        expect(result.current.collapsed).toBe(false);
    });

    test('manages editing state', () => {
        const item = { key: 'test', label: 'Test' };
        const { result } = renderHook(() => useItemManager([item], 'test'));

        act(() => {
            result.current.startEditing(item);
        });

        expect(result.current.editingItem).toBe(item.key);
        expect(result.current.editInput).toBe('Test');

        act(() => {
            result.current.cancelEditing();
        });

        expect(result.current.editingItem).toBeNull();
        expect(result.current.editInput).toBe('');
    });

    test('does not add empty items', () => {
        const { result } = renderHook(() => useItemManager([], 'test'));

        act(() => {
            result.current.setNewInput('   '); // Only whitespace
            result.current.addItem();
        });

        expect(result.current.items).toHaveLength(0);
    });
});
