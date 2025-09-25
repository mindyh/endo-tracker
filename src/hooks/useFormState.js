import { useState } from 'react';

export const useFormState = () => {
  const [form, setForm] = useState({
    type: '',
    details: '',
    painLevel: '',
    painLocations: [],
    allergens: [],
    supplements: [],
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const updateForm = (updates) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const toggleArrayItem = (arrayName, item) => {
    setForm(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(item)
        ? prev[arrayName].filter(i => i !== item)
        : [...prev[arrayName], item]
    }));
  };

  const resetForm = () => {
    setForm({
      type: '',
      details: '',
      painLevel: '',
      painLocations: [],
      allergens: [],
      supplements: [],
      timestamp: new Date().toISOString().slice(0, 16),
    });
  };

  return {
    form,
    updateForm,
    handleChange,
    toggleArrayItem,
    resetForm
  };
};