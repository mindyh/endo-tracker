
import './App.css';
import { useState } from 'react';

const eventTypes = [
  { key: 'food', label: '🍎 Food', emoji: '🍎' },
  { key: 'water', label: '💧 Water', emoji: '💧' },
  { key: 'supplements', label: '💊 Supplements', emoji: '💊' },
  { key: 'pain', label: '⚡ Pain', emoji: '⚡' },
  { key: 'treatment', label: '🩹 Treatment', emoji: '🩹' },
];

const painLocations = [
  { key: 'pelvis', label: 'Pelvis' },
  { key: 'left-hip', label: 'Left Hip' },
  { key: 'right-hip', label: 'Right Hip' },
  { key: 'left-leg', label: 'Left Leg' },
  { key: 'right-leg', label: 'Right Leg' },
  { key: 'lower-back', label: 'Lower Back' },
  { key: 'rectum', label: 'Rectum' },
];

const commonAllergens = [
  { key: 'gluten', label: 'Gluten' },
  { key: 'dairy', label: 'Dairy' },
  { key: 'eggs', label: 'Eggs' },
  { key: 'soy', label: 'Soy' },
  { key: 'nuts', label: 'Tree Nuts' },
  { key: 'peanuts', label: 'Peanuts' },
  { key: 'shellfish', label: 'Shellfish' },
  { key: 'fish', label: 'Fish' },
];

const painLevels = [
  { value: 1, label: '1 - Minimal', color: '#22c55e' },
  { value: 2, label: '2 - Mild', color: '#84cc16' },
  { value: 3, label: '3 - Mild+', color: '#eab308' },
  { value: 4, label: '4 - Moderate', color: '#f59e0b' },
  { value: 5, label: '5 - Moderate+', color: '#f97316' },
  { value: 6, label: '6 - Severe', color: '#ef4444' },
  { value: 7, label: '7 - Severe+', color: '#dc2626' },
  { value: 8, label: '8 - Very Severe', color: '#b91c1c' },
  { value: 9, label: '9 - Extreme', color: '#991b1b' },
  { value: 10, label: '10 - Unbearable', color: '#7f1d1d' },
];

function App() {
  const [form, setForm] = useState({
    type: '',
    details: '',
    painLevel: '',
    painLocations: [],
    allergens: [],
    timestamp: new Date().toISOString().slice(0, 16),
  });
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('log');
  const [customPainLocations, setCustomPainLocations] = useState(painLocations);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [editingLocation, setEditingLocation] = useState(null);
  const [editLocationInput, setEditLocationInput] = useState('');
  const [customAllergens, setCustomAllergens] = useState(commonAllergens);
  const [newAllergenInput, setNewAllergenInput] = useState('');
  const [editingAllergen, setEditingAllergen] = useState(null);
  const [editAllergenInput, setEditAllergenInput] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({
    allergens: false,
    painLocations: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePainLocation = (location) => {
    setForm(prev => ({
      ...prev,
      painLocations: prev.painLocations.includes(location)
        ? prev.painLocations.filter(loc => loc !== location)
        : [...prev.painLocations, location]
    }));
  };

  const toggleAllergen = (allergen) => {
    setForm(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Pain location management functions
  const addCustomLocation = () => {
    if (newLocationInput.trim() && !customPainLocations.find(loc => loc.key === newLocationInput.trim().toLowerCase().replace(/\s+/g, '-'))) {
      const newLocation = {
        key: newLocationInput.trim().toLowerCase().replace(/\s+/g, '-'),
        label: newLocationInput.trim()
      };
      setCustomPainLocations(prev => [...prev, newLocation]);
      setNewLocationInput('');
    }
  };

  const removeCustomLocation = (locationKey) => {
    setCustomPainLocations(prev => prev.filter(location => location.key !== locationKey));
    // Also remove from any form selections
    setForm(prev => ({
      ...prev,
      painLocations: prev.painLocations.filter(loc => loc !== locationKey)
    }));
  };

  const startEditingLocation = (location) => {
    setEditingLocation(location.key);
    setEditLocationInput(location.label);
  };

  const cancelEditingLocation = () => {
    setEditingLocation(null);
    setEditLocationInput('');
  };

  const saveEditedLocation = (locationKey) => {
    if (editLocationInput.trim() && editLocationInput.trim() !== '') {
      setCustomPainLocations(prev => 
        prev.map(location => 
          location.key === locationKey 
            ? { ...location, label: editLocationInput.trim() }
            : location
        )
      );
      setEditingLocation(null);
      setEditLocationInput('');
    }
  };

  // Allergen management functions
  const addCustomAllergen = () => {
    if (newAllergenInput.trim() && !customAllergens.find(allergen => allergen.key === newAllergenInput.trim().toLowerCase().replace(/\s+/g, '-'))) {
      const newAllergen = {
        key: newAllergenInput.trim().toLowerCase().replace(/\s+/g, '-'),
        label: newAllergenInput.trim()
      };
      setCustomAllergens(prev => [...prev, newAllergen]);
      setNewAllergenInput('');
    }
  };

  const removeCustomAllergen = (allergenKey) => {
    setCustomAllergens(prev => prev.filter(allergen => allergen.key !== allergenKey));
    // Also remove from any form selections
    setForm(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergenKey)
    }));
  };

  const startEditingAllergen = (allergen) => {
    setEditingAllergen(allergen.key);
    setEditAllergenInput(allergen.label);
  };

  const cancelEditingAllergen = () => {
    setEditingAllergen(null);
    setEditAllergenInput('');
  };

  const saveEditedAllergen = (allergenKey) => {
    if (editAllergenInput.trim() && editAllergenInput.trim() !== '') {
      setCustomAllergens(prev => 
        prev.map(allergen => 
          allergen.key === allergenKey 
            ? { ...allergen, label: editAllergenInput.trim() }
            : allergen
        )
      );
      setEditingAllergen(null);
      setEditAllergenInput('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEvents((prev) => [
      { ...form, id: Date.now() },
      ...prev,
    ]);
    setForm({
      type: '',
      details: '',
      painLevel: '',
      painLocations: [],
      allergens: [],
      timestamp: new Date().toISOString().slice(0, 16),
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">💚 Endo Tracker</h1>
        <p className="subtitle">Quick event logging for better health insights</p>
      </div>
      
      <div className="main-content">
        {/* Tab Navigation */}
        <div className="tab-nav">
          <button 
            className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
            onClick={() => setActiveTab('log')}
          >
            📝 Log Event
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Log Event Tab */}
        {activeTab === 'log' && (
          <div className="form-card">
            <h3>Log Event</h3>
            <form className="detailed-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Type</label>
                <div className="quick-buttons">
                  {eventTypes.map((et) => (
                    <button
                      key={et.key}
                      type="button"
                      className={`quick-btn ${form.type === et.key ? 'active' : ''}`}
                      onClick={() => setForm(prev => ({ ...prev, type: et.key }))}
                    >
                      <span className="emoji">{et.emoji}</span>
                      <span>{et.label.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {form.type === 'food' && (
                <div className="form-group">
                  <label>Potential Allergens (optional)</label>
                  <div className="allergen-selection">
                    {customAllergens.map((allergen) => (
                      <button
                        key={allergen.key}
                        type="button"
                        className={`allergen-btn ${form.allergens.includes(allergen.key) ? 'active' : ''}`}
                        onClick={() => toggleAllergen(allergen.key)}
                      >
                        {allergen.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {form.type === 'pain' && (
                <>
                  <div className="form-group">
                    <label>Pain Level: {form.painLevel ? `${form.painLevel}/10` : '0/10'}</label>
                    <input
                      type="range"
                      name="painLevel"
                      min="0"
                      max="10"
                      step="1"
                      value={form.painLevel || 0}
                      onChange={handleChange}
                      className="pain-slider"
                    />
                    <div className="slider-labels">
                      <span>No Pain</span>
                      <span>Unbearable</span>
                    </div>
                    {form.painLevel && (
                      <div className="pain-description">
                        {painLevels.find(p => p.value == form.painLevel)?.label}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Pain Location(s)</label>
                    <div className="pain-locations">
                      {customPainLocations.map((location) => (
                        <button
                          key={location.key}
                          type="button"
                          className={`location-btn ${form.painLocations.includes(location.key) ? 'active' : ''}`}
                          onClick={() => togglePainLocation(location.key)}
                        >
                          {location.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label>Details (optional)</label>
                <textarea
                  name="details"
                  placeholder="Add notes, triggers, or context..."
                  value={form.details}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="2"
                />
              </div>
              
              <div className="form-group">
                <label>When</label>
                <input
                  type="datetime-local"
                  name="timestamp"
                  value={form.timestamp}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <button type="submit" className="submit-btn">
                📝 Log Event
              </button>
            </form>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="form-card">
            <h3>Configuration Settings</h3>
            <div className="settings-section">
              
              {/* Allergen Management */}
              <div className="settings-group">
                <div className="section-header" onClick={() => toggleSection('allergens')}>
                  <h4>Food Allergen Settings</h4>
                  <button type="button" className="collapse-btn">
                    {collapsedSections.allergens ? '►' : '▼'}
                  </button>
                </div>
                {!collapsedSections.allergens && (
                  <div className="section-content">
                    <div className="add-item">
                      <input
                        type="text"
                        placeholder="Add new allergen..."
                        value={newAllergenInput}
                        onChange={(e) => setNewAllergenInput(e.target.value)}
                        className="form-input"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAllergen())}
                      />
                      <button
                        type="button"
                        onClick={addCustomAllergen}
                        className="add-btn"
                        disabled={!newAllergenInput.trim()}
                      >
                        ➕ Add
                      </button>
                    </div>
                    <div className="item-list">
                      {customAllergens.map((allergen) => {
                        const isDefault = commonAllergens.find(a => a.key === allergen.key);
                        const isEditing = editingAllergen === allergen.key;
                        return (
                          <div key={allergen.key} className="item-container">
                            {isEditing ? (
                              <div className="edit-item">
                                <input
                                  type="text"
                                  value={editAllergenInput}
                                  onChange={(e) => setEditAllergenInput(e.target.value)}
                                  className="edit-input"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      saveEditedAllergen(allergen.key);
                                    } else if (e.key === 'Escape') {
                                      cancelEditingAllergen();
                                    }
                                  }}
                                  autoFocus
                                />
                                <div className="edit-actions">
                                  <button
                                    type="button"
                                    onClick={() => saveEditedAllergen(allergen.key)}
                                    className="save-btn"
                                    title="Save changes"
                                  >
                                    ✅
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEditingAllergen}
                                    className="cancel-btn"
                                    title="Cancel editing"
                                  >
                                    ❌
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="item-name">{allergen.label}</span>
                                <div className="item-actions">
                                  {isDefault && <span className="default-badge">Default</span>}
                                  <button
                                    type="button"
                                    onClick={() => startEditingAllergen(allergen)}
                                    className="edit-btn"
                                    title="Edit allergen"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeCustomAllergen(allergen.key)}
                                    className="remove-btn"
                                    title="Remove allergen"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Pain Location Management */}
              <div className="settings-group">
                <div className="section-header" onClick={() => toggleSection('painLocations')}>
                  <h4>Pain Location Settings</h4>
                  <button type="button" className="collapse-btn">
                    {collapsedSections.painLocations ? '►' : '▼'}
                  </button>
                </div>
                {!collapsedSections.painLocations && (
                  <div className="section-content">
                    <div className="add-item">
                      <input
                        type="text"
                        placeholder="Add new pain location..."
                        value={newLocationInput}
                        onChange={(e) => setNewLocationInput(e.target.value)}
                        className="form-input"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomLocation())}
                      />
                      <button
                        type="button"
                        onClick={addCustomLocation}
                        className="add-btn"
                        disabled={!newLocationInput.trim()}
                      >
                        ➕ Add
                      </button>
                    </div>
                    <div className="item-list">
                      {customPainLocations.map((location) => {
                        const isDefault = painLocations.find(loc => loc.key === location.key);
                        const isEditing = editingLocation === location.key;
                        return (
                          <div key={location.key} className="item-container">
                            {isEditing ? (
                              <div className="edit-item">
                                <input
                                  type="text"
                                  value={editLocationInput}
                                  onChange={(e) => setEditLocationInput(e.target.value)}
                                  className="edit-input"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      saveEditedLocation(location.key);
                                    } else if (e.key === 'Escape') {
                                      cancelEditingLocation();
                                    }
                                  }}
                                  autoFocus
                                />
                                <div className="edit-actions">
                                  <button
                                    type="button"
                                    onClick={() => saveEditedLocation(location.key)}
                                    className="save-btn"
                                    title="Save changes"
                                  >
                                    ✅
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEditingLocation}
                                    className="cancel-btn"
                                    title="Cancel editing"
                                  >
                                    ❌
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="item-name">{location.label}</span>
                                <div className="item-actions">
                                  {isDefault && <span className="default-badge">Default</span>}
                                  <button
                                    type="button"
                                    onClick={() => startEditingLocation(location)}
                                    className="edit-btn"
                                    title="Edit location"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeCustomLocation(location.key)}
                                    className="remove-btn"
                                    title="Remove location"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Events */}
        {events.length > 0 && (
          <div className="recent-events">
            <h3>Recent Events</h3>
            <div className="event-list">
              {events.map((event) => {
                const eventType = eventTypes.find(et => et.key === event.type);
                return (
                  <div key={event.id} className="event-card">
                    <div className="event-content">
                      <div className="event-header">
                        <span className="event-type">{eventType?.label.split(' ')[1] || event.type}</span>
                        <span className="event-time">{formatTime(event.timestamp)}</span>
                      </div>
                      {event.details && (
                        <div className="event-details">{event.details}</div>
                      )}
                      {event.painLevel && (
                        <div className="event-pain">
                          Pain Level: <span className="pain-badge">{event.painLevel}/10</span>
                        </div>
                      )}
                      {event.painLocations && event.painLocations.length > 0 && (
                        <div className="event-locations">
                          Locations: {event.painLocations.map(loc => 
                            customPainLocations.find(pl => pl.key === loc)?.label || loc
                          ).join(', ')}
                        </div>
                      )}
                      {event.allergens && event.allergens.length > 0 && (
                        <div className="event-allergens">
                          Allergens: {event.allergens.map(allergen => 
                            customAllergens.find(a => a.key === allergen)?.label || allergen
                          ).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
