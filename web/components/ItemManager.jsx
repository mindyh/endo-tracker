import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { CollapsibleSection } from './CollapsibleSection';
import { useKeyPress } from '../hooks/useKeyPress';

export const ItemManager = ({
  title,
  manager,
  defaultItems,
  placeholder
}) => {
  const {
    items,
    newInput,
    setNewInput,
    editingItem,
    editInput,
    setEditInput,
    collapsed,
    addItem,
    removeItem,
    startEditing,
    cancelEditing,
    saveEdit,
    toggleCollapsed,
    reorderItems
  } = manager;

  const {
    draggedIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleContainerDragOver,
    handleDragLeave,
    handleDrop
  } = useDragAndDrop(reorderItems);

  const { handleKeyPress } = useKeyPress();

  return (
    <CollapsibleSection
      title={title}
      collapsed={collapsed}
      onToggle={toggleCollapsed}
    >
      <div className="add-item">
        <input
          type="text"
          placeholder={placeholder}
          value={newInput}
          onChange={(e) => setNewInput(e.target.value)}
          className="form-input"
          onKeyPress={(e) => handleKeyPress(e, addItem)}
        />
        <button
          type="button"
          onClick={addItem}
          className="add-btn"
          disabled={!newInput.trim()}
        >
          +
        </button>
      </div>
      <div
        className="item-list drop-zone"
        onDragOver={handleContainerDragOver}
        onDragLeave={handleDragLeave}
      >
        {items.map((item, index) => {
          const isEditing = editingItem === item.key;
          return (
            <div
              key={item.key}
              className={`item-container ${draggedIndex === index ? 'dragging' : ''}`}
              draggable={!isEditing}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              style={{ cursor: isEditing ? 'default' : 'grab' }}
            >
              {isEditing ? (
                <div className="edit-item">
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    className="edit-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        saveEdit(item.key);
                      } else if (e.key === 'Escape') {
                        cancelEditing();
                      }
                    }}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button
                      type="button"
                      onClick={() => saveEdit(item.key)}
                      className="save-btn"
                      title="Save changes"
                    >
                      ✅
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="cancel-btn"
                      title="Cancel editing"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="drag-handle" title="Drag to reorder">⋮⋮</span>
                  <span className="item-name">{item.label}</span>
                  <div className="item-actions">
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      className="edit-btn"
                      title="Edit item"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="remove-btn"
                      title="Remove item"
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
    </CollapsibleSection>
  );
};