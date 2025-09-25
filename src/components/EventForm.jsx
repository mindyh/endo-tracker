import { eventTypes, painLevels } from '../data/constants';

export const EventForm = ({ 
  form, 
  handleChange, 
  toggleArrayItem, 
  painLocations, 
  allergens, 
  supplements,
  onSubmit 
}) => (
  <div className="form-card">
    <h3>Log Event</h3>
    <form className="detailed-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label>Event Type</label>
        <div className="quick-buttons">
          {eventTypes.map((et) => (
            <button
              key={et.key}
              type="button"
              className={`quick-btn ${form.type === et.key ? 'active' : ''}`}
              onClick={() => handleChange({ target: { name: 'type', value: et.key } })}
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
            {allergens.map((allergen) => (
              <button
                key={allergen.key}
                type="button"
                className={`allergen-btn ${form.allergens.includes(allergen.key) ? 'active' : ''}`}
                onClick={() => toggleArrayItem('allergens', allergen.key)}
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
              {painLocations.map((location) => (
                <button
                  key={location.key}
                  type="button"
                  className={`location-btn ${form.painLocations.includes(location.key) ? 'active' : ''}`}
                  onClick={() => toggleArrayItem('painLocations', location.key)}
                >
                  {location.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      
      {form.type === 'supplements' && (
        <div className="form-group">
          <label>Supplement(s)</label>
          <div className="supplement-selection">
            {supplements.map((supplement) => (
              <button
                key={supplement.key}
                type="button"
                className={`supplement-btn ${form.supplements.includes(supplement.key) ? 'active' : ''}`}
                onClick={() => toggleArrayItem('supplements', supplement.key)}
              >
                {supplement.label}
              </button>
            ))}
          </div>
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
        📝 Log Event
      </button>
    </form>
  </div>
);