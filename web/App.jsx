import './App.css';
import { useState } from 'react';
import { useItemManager } from '../shared/hooks/useItemManager';
import { useFormState } from '../shared/hooks/useFormState';
import { useTimezone } from '../shared/hooks/useTimezone';
import { useEventTypeConfig } from '../shared/hooks/useEventTypeConfig';
import { TabNavigation } from '../shared/components/TabNavigation';
import { EventForm } from '../shared/components/EventForm';
import { SettingsPanel } from '../shared/components/SettingsPanel';
import { RecentEvents } from '../shared/components/RecentEvents';
import { History } from '../shared/components/History';
import { eventTypes, painLocations, commonAllergens, commonSupplements, commonTreatments, treatmentEffectiveness, painLevels } from '../shared/data/constants';
import { formatTime } from '../shared/utils/timeUtils';

// Constants moved to ./data/constants.js

function App() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('log');

  // Use custom hooks for form and item management
  const { timezone, setTimezone, timezones } = useTimezone();
  const { form, updateForm, resetForm, toggleArrayItem, handleChange } = useFormState(timezone);
  const painLocationManager = useItemManager(painLocations, 'painLocations');
  const allergenManager = useItemManager(commonAllergens, 'allergens');
  const supplementManager = useItemManager(commonSupplements, 'supplements');
  const treatmentManager = useItemManager(commonTreatments, 'treatments');
  const { activeEventTypes, setActiveEventTypes } = useEventTypeConfig(eventTypes);

  // Event handlers
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that an event type is selected
    if (!form.type) {
      alert('Please select an event type before logging.');
      return;
    }

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

  // Functions for managing existing events
  const updateEvent = (eventId, updatedEvent) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, ...updatedEvent } : event
      )
    );
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">💚 Endo Tracker</h1>
        <p className="subtitle">Logging for insights</p>
      </div>

      <div className="main-content">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'log' && (
          <>
            <EventForm
              form={form}
              handleChange={handleChange}
              toggleArrayItem={toggleArrayItem}
              eventTypes={activeEventTypes}
              painLocations={painLocationManager.items}
              allergens={allergenManager.items}
              supplements={supplementManager.items}
              treatments={treatmentManager.items}
              treatmentEffectiveness={treatmentEffectiveness}
              onSubmit={handleSubmit}
              timezone={timezone}
            />
            <RecentEvents
              events={events}
              painLocations={painLocationManager.items}
              allergens={allergenManager.items}
              supplements={supplementManager.items}
              treatments={treatmentManager.items}
              timezone={timezone}
              updateEvent={updateEvent}
              deleteEvent={deleteEvent}
              eventTypes={activeEventTypes}
            />
          </>
        )}

        {activeTab === 'history' && (
          <History
            events={events}
            painLocations={painLocationManager.items}
            allergens={allergenManager.items}
            supplements={supplementManager.items}
            treatments={treatmentManager.items}
            timezone={timezone}
            updateEvent={updateEvent}
            deleteEvent={deleteEvent}
            eventTypes={activeEventTypes}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            allergenManager={allergenManager}
            painLocationManager={painLocationManager}
            supplementManager={supplementManager}
            treatmentManager={treatmentManager}
            defaultAllergens={commonAllergens}
            defaultPainLocations={painLocations}
            defaultSupplements={commonSupplements}
            defaultTreatments={commonTreatments}
            allEventTypes={eventTypes}
            activeEventTypes={activeEventTypes}
            setActiveEventTypes={setActiveEventTypes}
            timezone={timezone}
            setTimezone={setTimezone}
            timezones={timezones}
          />
        )}
      </div>
    </div>
  );
}

export default App;
