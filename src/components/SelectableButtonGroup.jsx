export const SelectableButtonGroup = ({
    items,
    selectedItems = [],
    onToggle,
    className = 'quick-buttons',
    buttonClassName = 'quick-btn',
    renderItem
}) => (
    <div className={className}>
        {items.map((item) => (
            <button
                key={item.key}
                type="button"
                className={`${buttonClassName} ${selectedItems.includes(item.key) ? 'active' : ''}`}
                onClick={() => onToggle(item.key)}
            >
                {renderItem ? renderItem(item) : item.label}
            </button>
        ))}
    </div>
);
