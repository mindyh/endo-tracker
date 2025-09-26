import { useState } from 'react';
import { ItemManager } from './ItemManager';
import { EventTypeManager } from './EventTypeManager';

export const SettingsPanel = ({
  allergenManager,
  painLocationManager,
  supplementManager,
  treatmentManager,
  defaultAllergens,
  defaultPainLocations,
  defaultSupplements,
  defaultTreatments,
  allEventTypes,
  activeEventTypes,
  setActiveEventTypes,
  timezone,
  setTimezone,
  timezones
}) => {
  const [timezoneCollapsed, setTimezoneCollapsed] = useState(true);

  const toggleTimezoneCollapsed = () => {
    setTimezoneCollapsed(prev => !prev);
  };

  return (
    <div className="form-card">
      <h3>Customize your logging experience</h3>
      <div className="settings-section">
        <div className="settings-group">
          <div className="section-header" onClick={toggleTimezoneCollapsed}>
            <h4>Timezone</h4>
            <button type="button" className="collapse-btn">
              {timezoneCollapsed ? '►' : '▼'}
            </button>
          </div>
          {!timezoneCollapsed && (
            <div className="section-content">
              <div className="form-group">
                <label>Select your timezone</label>
                <select
                  className="form-select"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
                <small style={{ color: '#6b7280' }}>Default event time and recent event timestamps will use this timezone.</small>
              </div>
            </div>
          )}
        </div>

        <EventTypeManager
          allEventTypes={allEventTypes}
          activeEventTypes={activeEventTypes}
          setActiveEventTypes={setActiveEventTypes}
        />

        <ItemManager
          title="Pain Location"
          manager={painLocationManager}
          defaultItems={defaultPainLocations}
          placeholder="Add new pain location..."
        />

        <ItemManager
          title="Food Allergens"
          manager={allergenManager}
          defaultItems={defaultAllergens}
          placeholder="Add new allergen..."
        />

        <ItemManager
          title="Supplements"
          manager={supplementManager}
          defaultItems={defaultSupplements}
          placeholder="Add new supplement..."
        />

        <ItemManager
          title="Treatments"
          manager={treatmentManager}
          defaultItems={defaultTreatments}
          placeholder="Add new treatment..."
        />
      </div>
    </div>
  );
};