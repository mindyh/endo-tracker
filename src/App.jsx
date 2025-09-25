
import './App.css';
import { useState } from 'react';

const eventTypes = [
  { key: 'food', label: '🍎 Food', emoji: '🍎' },
  { key: 'water', label: '💧 Water', emoji: '💧' },
  { key: 'supplements', label: '💊 Supplements', emoji: '💊' },
  { key: 'pain', label: '⚡ Pain', emoji: '⚡' },
  { key: 'treatment', label: '🩹 Treatment', emoji: '🩹' },
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
    timestamp: new Date().toISOString().slice(0, 16),
  });
  const [events, setEvents] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const quickLog = (type, details = '') => {
    const newEvent = {
      type,
      details,
      painLevel: '',
      timestamp: new Date().toISOString().slice(0, 16),
      id: Date.now()
    };
    setEvents((prev) => [newEvent, ...prev]);
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
        <h1 className="title">💜 Endo Tracker</h1>
        <p className="subtitle">Quick event logging for better health insights</p>
      </div>
      
      <div className="main-content">
        {/* Quick Action Buttons */}
        <div className="quick-actions">
          <h3>Quick Log</h3>
          <div className="quick-buttons">
            {eventTypes.map((et) => (
              <button
                key={et.key}
                className="quick-btn"
                onClick={() => quickLog(et.key)}
                type="button"
              >
                <span className="emoji">{et.emoji}</span>
                <span>{et.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Form */}
        <div className="form-card">
          <h3>Detailed Entry</h3>
          <form className="detailed-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Event Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Choose event type</option>
                {eventTypes.map((et) => (
                  <option key={et.key} value={et.key}>{et.label}</option>
                ))}
              </select>
            </div>
            
            {form.type === 'pain' && (
              <div className="form-group">
                <label>Pain Level</label>
                <div className="pain-buttons">
                  {painLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      className={`pain-btn ${form.painLevel == level.value ? 'active' : ''}`}
                      style={{ borderColor: level.color }}
                      onClick={() => setForm(prev => ({ ...prev, painLevel: level.value.toString() }))}
                    >
                      {level.value}
                    </button>
                  ))}
                </div>
                {form.painLevel && (
                  <div className="pain-description">
                    {painLevels.find(p => p.value == form.painLevel)?.label}
                  </div>
                )}
              </div>
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
              📝 Log Detailed Event
            </button>
          </form>
        </div>

        {/* Recent Events */}
        {events.length > 0 && (
          <div className="events-card">
            <h3>Recent Events ({events.length})</h3>
            <div className="events-list">
              {events.slice(0, 10).map((event) => {
                const eventType = eventTypes.find(e => e.key === event.type);
                return (
                  <div key={event.id} className="event-item">
                    <div className="event-icon">{eventType?.emoji}</div>
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
