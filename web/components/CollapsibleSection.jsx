export const CollapsibleSection = ({
    title,
    collapsed,
    onToggle,
    children,
    className = "settings-group"
}) => (
    <div className={className}>
        <div className="section-header" onClick={onToggle}>
            <h4>{title}</h4>
            <button type="button" className="collapse-btn">
                {collapsed ? '►' : '▼'}
            </button>
        </div>
        {!collapsed && (
            <div className="section-content">
                {children}
            </div>
        )}
    </div>
);
