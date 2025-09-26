import { useState, useEffect } from 'react';
import { eventTypes, painLevels } from '../data/constants';
import { formatTime, dateTimeLocalToISO } from '../utils/timeUtils';

export const EventList = ({
    events,
    painLocations,
    allergens,
    supplements,
    timezone,
    updateEvent,
    deleteEvent,
    eventTypes: activeEventTypes,
    title = "Events",
    emptyMessage = "No events to display.",
    showCount = false,
    maxEvents = null,
    groupByDay = false
}) => {
    const [editingEvent, setEditingEvent] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [collapsedDays, setCollapsedDays] = useState(new Set());
    const [initializedCollapse, setInitializedCollapse] = useState(false);

    const displayEvents = maxEvents ? events.slice(0, maxEvents) : events;

    // Initialize collapsed state only once when groupByDay is enabled
    useEffect(() => {
        if (groupByDay && !initializedCollapse && events.length > 0) {
            const groupedEvents = groupEventsByDay(displayEvents);
            if (groupedEvents.length > 1) {
                const newCollapsed = new Set();
                groupedEvents.slice(1).forEach(([dateKey]) => {
                    newCollapsed.add(dateKey);
                });
                setCollapsedDays(newCollapsed);
            }
            setInitializedCollapse(true);
        }
    }, [groupByDay, events.length, initializedCollapse]);

    // Group events by day if requested
    const groupEventsByDay = (events) => {
        const groups = {};
        events.forEach(event => {
            const date = new Date(event.timestamp);
            const dateKey = date.toDateString(); // "Mon Sep 26 2025"
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(event);
        });

        // Sort groups by date (most recent first) and return array of [dateKey, events]
        return Object.entries(groups).sort((a, b) =>
            new Date(b[0]).getTime() - new Date(a[0]).getTime()
        );
    };

    const toggleDayCollapse = (dateKey) => {
        setCollapsedDays(prev => {
            const newSet = new Set(prev);
            if (newSet.has(dateKey)) {
                newSet.delete(dateKey);
            } else {
                newSet.add(dateKey);
            }
            return newSet;
        });
    };

    const formatDayHeader = (dateKey) => {
        const date = new Date(dateKey);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    if (events.length === 0) {
        return (
            <div className="recent-events">
                <h3>{title}</h3>
                <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic', padding: '2rem' }}>
                    {emptyMessage}
                </p>
            </div>
        );
    }

    const startEditing = (event) => {
        setEditingEvent(event.id);
        setEditForm({ ...event });
    };

    const cancelEditing = () => {
        setEditingEvent(null);
        setEditForm({});
    };

    const saveEdit = () => {
        updateEvent(editingEvent, editForm);
        setEditingEvent(null);
        setEditForm({});
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (arrayName, item) => {
        setEditForm(prev => ({
            ...prev,
            [arrayName]: prev[arrayName]?.includes(item)
                ? prev[arrayName].filter(i => i !== item)
                : [...(prev[arrayName] || []), item]
        }));
    };

    const renderEvent = (event) => {
        const eventType = eventTypes.find(et => et.key === event.type);
        const isEditing = editingEvent === event.id;

        if (isEditing) {
            return (
                <div key={event.id} className="event-card editing">
                    <div className="event-content">
                        <div className="edit-form">
                            <div className="form-group">
                                <label>Event Type</label>
                                <div>
                                    {eventType?.emoji} {eventType?.label}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Time</label>
                                <input
                                    type="datetime-local"
                                    value={editForm.timestamp || ''}
                                    onChange={(e) => handleEditChange('timestamp', e.target.value)}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Details</label>
                                <textarea
                                    value={editForm.details || ''}
                                    onChange={(e) => handleEditChange('details', e.target.value)}
                                    className="form-textarea"
                                    rows="2"
                                />
                            </div>

                            {(editForm.type === 'pain-start' || event.painLevel) && (
                                <div className="form-group">
                                    <label>Pain Level</label>
                                    <select
                                        value={editForm.painLevel || ''}
                                        onChange={(e) => handleEditChange('painLevel', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">Select pain level</option>
                                        {painLevels.map(level => (
                                            <option key={level.value} value={level.value}>{level.value}/10</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(editForm.type === 'pain-start' || event.painLocations?.length > 0) && (
                                <div className="form-group">
                                    <label>Pain Locations</label>
                                    <div className="checkbox-grid">
                                        {painLocations.map(location => (
                                            <button
                                                key={location.key}
                                                type="button"
                                                className={`checkbox-btn ${editForm.painLocations?.includes(location.key) ? 'active' : ''}`}
                                                onClick={() => toggleArrayItem('painLocations', location.key)}
                                            >
                                                {location.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(editForm.type === 'meal' || event.allergens?.length > 0) && (
                                <div className="form-group">
                                    <label>Allergens</label>
                                    <div className="checkbox-grid">
                                        {allergens.map(allergen => (
                                            <button
                                                key={allergen.key}
                                                type="button"
                                                className={`checkbox-btn ${editForm.allergens?.includes(allergen.key) ? 'active' : ''}`}
                                                onClick={() => toggleArrayItem('allergens', allergen.key)}
                                            >
                                                {allergen.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(editForm.type === 'supplements' || event.supplements?.length > 0) && (
                                <div className="form-group">
                                    <label>Supplements</label>
                                    <div className="checkbox-grid">
                                        {supplements.map(supplement => (
                                            <button
                                                key={supplement.key}
                                                type="button"
                                                className={`checkbox-btn ${editForm.supplements?.includes(supplement.key) ? 'active' : ''}`}
                                                onClick={() => toggleArrayItem('supplements', supplement.key)}
                                            >
                                                {supplement.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="edit-actions">
                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={(e) => {
                                        if (confirm('Are you sure you want to delete this event?')) {
                                            deleteEvent(event.id);
                                        }
                                    }}
                                >
                                    🗑️ Delete
                                </button>
                                <div className="action-buttons-right">
                                    <button
                                        type="button"
                                        onClick={saveEdit}
                                        className="save-btn"
                                    >
                                        ✓ Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        className="cancel-btn"
                                    >
                                        ✕ Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div key={event.id} className="event-card">
                <div className="event-content">
                    <div className="event-header">
                        <div className="event-type">
                            {eventType?.emoji} {eventType?.label}
                        </div>
                        <div className="event-actions">
                            <span className="event-time">{formatTime(event.timestamp, timezone)}</span>
                            <button
                                className="edit-btn"
                                onClick={() => startEditing(event)}
                                title="Edit event"
                            >
                                ✏️
                            </button>
                        </div>
                    </div>

                    {event.details && (
                        <div className="event-details">{event.details}</div>
                    )}

                    {event.painLevel && (
                        <div className="event-pain">
                            <span className="pain-badge">{event.painLevel}/10</span>
                        </div>
                    )}

                    {event.fatigueLevel && (
                        <div className="event-fatigue">
                            <span className="fatigue-badge">Fatigue: {event.fatigueLevel}/10</span>
                        </div>
                    )}

                    {event.painLocations?.length > 0 && (
                        <div className="event-locations">
                            <strong>Locations:</strong> {event.painLocations.map(loc =>
                                painLocations.find(pl => pl.key === loc)?.label || loc
                            ).join(', ')}
                        </div>
                    )}

                    {event.allergens?.length > 0 && (
                        <div className="event-allergens">
                            <strong>Allergens:</strong> {event.allergens.map(allergen =>
                                allergens.find(a => a.key === allergen)?.label || allergen
                            ).join(', ')}
                        </div>
                    )}

                    {event.supplements?.length > 0 && (
                        <div className="event-supplements">
                            {event.supplements.map(supplement =>
                                supplements.find(s => s.key === supplement)?.label || supplement
                            ).join(', ')}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const titleText = showCount ? `${title} (${events.length} events)` : title;

    return (
        <div className="recent-events">
            <h3>{titleText}</h3>
            <div className="event-list">
                {groupByDay ? (
                    // Grouped by day view
                    (() => {
                        const groupedEvents = groupEventsByDay(displayEvents);

                        return groupedEvents.map(([dateKey, dayEvents], dayIndex) => {
                            const isCollapsed = collapsedDays.has(dateKey);

                            return (
                                <div key={dateKey} className="day-section">
                                    <div
                                        className="day-header"
                                        onClick={() => toggleDayCollapse(dateKey)}
                                    >
                                        <h4>{formatDayHeader(dateKey)}</h4>
                                        <span className="day-count">({dayEvents.length} events)</span>
                                        <button className="collapse-btn">
                                            {isCollapsed ? '▶' : '▼'}
                                        </button>
                                    </div>
                                    {!isCollapsed && (
                                        <div className="day-events">
                                            {dayEvents.map(event => renderEvent(event))}
                                        </div>
                                    )}
                                </div>
                            );
                        });
                    })()
                ) : (
                    // Regular ungrouped view
                    displayEvents.map(event => renderEvent(event))
                )}
            </div>
        </div>
    );
};
