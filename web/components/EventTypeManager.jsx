import { useState } from 'react';
import { CollapsibleSection } from './CollapsibleSection';

export const EventTypeManager = ({
  allEventTypes,
  activeEventTypes,
  setActiveEventTypes
}) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };
  const handleDragStart = (e, index, section) => {
    const dragData = { index, section };
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    // Remove drag-over class from all items and sections
    document.querySelectorAll('.active-event-item, .hidden-event-item, .drop-zone').forEach(item => {
      item.classList.remove('drag-over');
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDropOnItem = (e, dropIndex, dropSection) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { index: dragIndex, section: dragSection } = dragData;

    if (dragSection === 'active' && dropSection === 'active') {
      // Reordering within active events
      if (dragIndex === dropIndex) return;

      const newOrder = [...activeEventTypes];
      const draggedItem = newOrder[dragIndex];

      newOrder.splice(dragIndex, 1);
      newOrder.splice(dropIndex, 0, draggedItem);

      setActiveEventTypes(newOrder);
    }
  };

  const handleDropOnSection = (e, targetSection) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { index: dragIndex, section: dragSection } = dragData;

    if (dragSection === targetSection) return;

    if (dragSection === 'active' && targetSection === 'hidden') {
      // Move from active to hidden
      const draggedItem = activeEventTypes[dragIndex];
      const newActiveEvents = activeEventTypes.filter((_, i) => i !== dragIndex);
      setActiveEventTypes(newActiveEvents);
    } else if (dragSection === 'hidden' && targetSection === 'active') {
      // Move from hidden to active
      const hiddenEvents = allEventTypes.filter(eventType =>
        !activeEventTypes.some(et => et.key === eventType.key)
      );
      const draggedItem = hiddenEvents[dragIndex];
      setActiveEventTypes([...activeEventTypes, draggedItem]);
    }
  };



  const toggleEventType = (eventType) => {
    const isActive = activeEventTypes.some(et => et.key === eventType.key);

    if (isActive) {
      // Remove from active list
      setActiveEventTypes(activeEventTypes.filter(et => et.key !== eventType.key));
    } else {
      // Add to active list at the end
      setActiveEventTypes([...activeEventTypes, eventType]);
    }
  };

  const resetToDefault = () => {
    setActiveEventTypes([...allEventTypes]);
  };

  return (
    <CollapsibleSection
      title="Events"
      collapsed={collapsed}
      onToggle={toggleCollapsed}
    >
      <div className="manager-sections">
        <div
          className="active-events-section drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDropOnSection(e, 'active')}
        >
          <h5>Active Events (Shown on Logging Page)</h5>
          <div className="active-events-list">
            {activeEventTypes.map((eventType, index) => (
              <div
                key={eventType.key}
                className="active-event-item"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, index, 'active')}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropOnItem(e, index, 'active')}
              >
                <div className="drag-handle" title="Drag to reorder">
                  ⋮⋮
                </div>
                <div className="event-info">
                  <span className="event-emoji">{eventType.emoji}</span>
                  <span className="event-label">{eventType.label}</span>
                </div>

              </div>
            ))}
          </div>
        </div>

        <div
          className="hidden-events-section drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDropOnSection(e, 'hidden')}
        >
          <h5>Hidden Events (Drag here to hide from logging page)</h5>
          <div className="hidden-events-list">
            {allEventTypes
              .filter(eventType => !activeEventTypes.some(et => et.key === eventType.key))
              .map((eventType, index) => (
                <div
                  key={eventType.key}
                  className="hidden-event-item"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, index, 'hidden')}
                  onDragEnd={handleDragEnd}
                >
                  <div className="drag-handle" title="Drag to reorder or move to active">
                    ⋮⋮
                  </div>
                  <div className="event-info">
                    <span className="event-emoji">{eventType.emoji}</span>
                    <span className="event-label">{eventType.label}</span>
                  </div>
                </div>
              ))}
          </div>
          {allEventTypes.length === activeEventTypes.length && (
            <p className="no-hidden-events">All event types are currently active</p>
          )}
        </div>
      </div>

      <div className="manager-footer">
        <button
          type="button"
          onClick={resetToDefault}
          className="reset-btn"
        >
          Reset to Default
        </button>
      </div>
    </CollapsibleSection>
  );
};