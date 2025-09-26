import { painLevels } from '../data/constants';
import { dateTimeLocalToISO } from '../utils/timeUtils';
import { SelectableButtonGroup } from './SelectableButtonGroup';

export const EventForm = ({
  form,
  handleChange,
  toggleArrayItem,
  eventTypes,
  painLocations,
  allergens,
  supplements,
  treatments,
  treatmentEffectiveness,
  onSubmit,
  timezone
}) => (
  <div className="form-card">
    <h3>Log Event</h3>
    <form className="detailed-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label>Event Type</label>
        <SelectableButtonGroup
          items={eventTypes}
          selectedItems={form.type ? [form.type] : []}
          onToggle={(key) => handleChange({ target: { name: 'type', value: key } })}
          renderItem={(item) => (
            <>
              <span className="emoji">{item.emoji}</span>
              <span>{item.label}</span>
            </>
          )}
        />
      </div>

      {form.type === 'food' && (
        <div className="form-group">
          <label>Potential Allergens (optional)</label>
          <SelectableButtonGroup
            items={allergens}
            selectedItems={form.allergens || []}
            onToggle={(key) => toggleArrayItem('allergens', key)}
            className="allergen-selection"
            buttonClassName="allergen-btn"
          />
        </div>
      )}

      {form.type === 'pain-start' && (
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
            <SelectableButtonGroup
              items={painLocations}
              selectedItems={form.painLocations || []}
              onToggle={(key) => toggleArrayItem('painLocations', key)}
              className="pain-locations"
              buttonClassName="location-btn"
            />
          </div>
        </>
      )}

      {form.type === 'supplements' && (
        <div className="form-group">
          <label>Supplement(s)</label>
          <SelectableButtonGroup
            items={supplements}
            selectedItems={form.supplements || []}
            onToggle={(key) => toggleArrayItem('supplements', key)}
            className="supplement-selection"
            buttonClassName="supplement-btn"
          />
        </div>
      )}

      {form.type === 'treatment' && (
        <>
          <div className="form-group">
            <label>Treatment(s)</label>
            <SelectableButtonGroup
              items={treatments || []}
              selectedItems={form.treatments || []}
              onToggle={(key) => toggleArrayItem('treatments', key)}
              className="supplement-selection"
              buttonClassName="supplement-btn"
            />
          </div>

          <div className="form-group">
            <label>Did it work?</label>
            <SelectableButtonGroup
              items={treatmentEffectiveness}
              selectedItems={form.effectiveness ? [form.effectiveness] : []}
              onToggle={(key) => handleChange({ target: { name: 'effectiveness', value: key } })}
              renderItem={(item) => (
                <>
                  <span className="emoji">{item.emoji}</span>
                  <span>{item.label}</span>
                </>
              )}
            />
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
          onChange={(e) => {
            // Convert the local wall time in selected timezone to ISO
            const iso = dateTimeLocalToISO(e.target.value, timezone);
            // We still store the input control value as the datetime-local string so the UI shows what the user picked
            // but the event persisted timestamp (when submitting) will be this ISO
            handleChange({ target: { name: 'timestamp', value: e.target.value } });
            // Attach the ISO to a hidden field on form state for submission
            handleChange({ target: { name: 'timestampISO', value: iso } });
          }}
          required
          className="form-input"
        />
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={
          !form.type ||
          (form.type === 'pain-start' && !form.painLevel) ||
          (form.type === 'treatment' && (!form.treatments || form.treatments.length === 0))
        }
      >
        📝 Log Event
      </button>
    </form>
  </div>
);
