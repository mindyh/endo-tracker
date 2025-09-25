
import './App.css';
import { useState } from 'react';
import { useItemManager } from './hooks/useItemManager';
import { useFormState } from './hooks/useFormState';
import { TabNavigation } from './components/TabNavigation';
import { EventForm } from './components/EventForm';
import { SettingsPanel } from './components/SettingsPanel';
import { RecentEvents } from './components/RecentEvents';
import { eventTypes, painLocations, commonAllergens, commonSupplements, painLevels } from './data/constants';
import { formatTime } from './utils/timeUtils';

// Constants moved to ./data/constants.js

function App() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('log');
  
  // Use custom hooks for form and item management
  const { form, updateForm, resetForm, toggleArrayItem, handleChange } = useFormState();
  const painLocationManager = useItemManager(painLocations, 'painLocations');
  const allergenManager = useItemManager(commonAllergens, 'allergens');
  const supplementManager = useItemManager(commonSupplements, 'supplements');

  // Event handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    setEvents((prev) => [
      { ...form, id: Date.now() },
      ...prev,
    ]);
    resetForm();
  };

  // Helper functions for item removal from form
  const handleLocationRemoval = (locationKey) => {
    toggleArrayItem('painLocations', locationKey);
  };

  const handleAllergenRemoval = (allergenKey) => {
    toggleArrayItem('allergens', allergenKey);
  };

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">💚 Endo Tracker</h1>
        <p className="subtitle">Logging for better health insights</p>
      </div>
      
      <div className="main-content">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'log' && (
          <EventForm
            form={form}
            handleChange={handleChange}
            toggleArrayItem={toggleArrayItem}
            painLocations={painLocationManager.items}
            allergens={allergenManager.items}
            supplements={supplementManager.items}
            onSubmit={handleSubmit}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            allergenManager={allergenManager}
            painLocationManager={painLocationManager}
            supplementManager={supplementManager}
            defaultAllergens={commonAllergens}
            defaultPainLocations={painLocations}
            defaultSupplements={commonSupplements}
          />
        )}

        <RecentEvents
          events={events}
          painLocations={painLocationManager.items}
          allergens={allergenManager.items}
          supplements={supplementManager.items}
        />
      </div>
    </div>
  );
}

export default App;
