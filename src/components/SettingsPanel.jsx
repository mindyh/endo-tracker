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
    <h3>Customize your logging experience</h3>
    <div className="settings-section">
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
    </div>
  </div>
);