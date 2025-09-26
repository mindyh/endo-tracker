import { useState } from 'react';
import { nowDateTimeLocalInTimeZone } from '../utils/timeUtils';

export const useFormState = (timezone) => {
  const [form, setForm] = useState({
    type: '',
    details: '',
    painLevel: '',
    painLocations: [],
    allergens: [],
    supplements: [],
    timestamp: nowDateTimeLocalInTimeZone(timezone),
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
      timestamp: nowDateTimeLocalInTimeZone(timezone),
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