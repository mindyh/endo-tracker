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
    toggleCollapsed
  } = manager;

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    } else if (e.key === 'Escape' && action === cancelEditing) {
      cancelEditing();
    }
  };

  return (
    <div className="settings-group">
      <div className="section-header" onClick={toggleCollapsed}>
        <h4>{title}</h4>
        <button type="button" className="collapse-btn">
          {collapsed ? '►' : '▼'}
        </button>
      </div>
      {!collapsed && (
        <div className="section-content">
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
              ➕ Add
            </button>
          </div>
          <div className="item-list">
            {items.map((item) => {
              const isDefault = defaultItems.find(d => d.key === item.key);
              const isEditing = editingItem === item.key;
              return (
                <div key={item.key} className="item-container">
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
                      <span className="item-name">{item.label}</span>
                      <div className="item-actions">
                        {isDefault && <span className="default-badge">Default</span>}
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
        </div>
      )}
    </div>
  );
};