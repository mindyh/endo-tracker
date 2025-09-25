import { useState } from 'react';
import { createKeyFromLabel } from '../utils/timeUtils';

export const useItemManager = (initialItems, itemType) => {
  const [items, setItems] = useState(initialItems);
  const [newInput, setNewInput] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const addItem = () => {
    if (newInput.trim() && !items.find(item => item.key === createKeyFromLabel(newInput))) {
      const newItem = {
        key: createKeyFromLabel(newInput),
        label: newInput.trim()
      };
      setItems(prev => [...prev, newItem]);
      setNewInput('');
    }
  };

  const removeItem = (itemKey, updateFormCallback) => {
    setItems(prev => prev.filter(item => item.key !== itemKey));
    // Remove from form selections if callback provided
    if (updateFormCallback) {
      updateFormCallback(itemKey);
    }
  };

  const startEditing = (item) => {
    setEditingItem(item.key);
    setEditInput(item.label);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditInput('');
  };

  const saveEdit = (itemKey) => {
    if (editInput.trim()) {
      setItems(prev => 
        prev.map(item => 
          item.key === itemKey 
            ? { ...item, label: editInput.trim() }
            : item
        )
      );
      setEditingItem(null);
      setEditInput('');
    }
  };

  const toggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };

  return {
    items,
    newInput,
    setNewInput,
    editingItem,
    editInput,
    setEditInput,
    collapsed,
    addItem,
    removeItem,
    startEditing,
    cancelEditing,
    saveEdit,
    toggleCollapsed
  };
};