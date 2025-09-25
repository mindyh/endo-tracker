import { ItemManager } from './ItemManager';
import { EventTypeManager } from './EventTypeManager';

export const SettingsPanel = ({ 
  allergenManager, 
  painLocationManager, 
  supplementManager,
  defaultAllergens, 
  defaultPainLocations,
  defaultSupplements,
  allEventTypes,
  activeEventTypes,
  setActiveEventTypes
}) => (
  <div className="form-card">
    <h3>Configuration Settings</h3>
    <div className="settings-section">
      <ItemManager
        title="Food Allergen Settings"
        manager={allergenManager}
        defaultItems={defaultAllergens}
        placeholder="Add new allergen..."
      />
      
      <ItemManager
        title="Pain Location Settings"
        manager={painLocationManager}
        defaultItems={defaultPainLocations}
        placeholder="Add new pain location..."
      />
      
      <ItemManager
        title="Supplement Settings"
        manager={supplementManager}
        defaultItems={defaultSupplements}
        placeholder="Add new supplement..."
      />
      
      <EventTypeManager
        allEventTypes={allEventTypes}
        activeEventTypes={activeEventTypes}
        setActiveEventTypes={setActiveEventTypes}
      />
    </div>
  </div>
);