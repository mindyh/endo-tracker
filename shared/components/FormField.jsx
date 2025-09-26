export const FormField = ({
    label,
    children,
    className = "form-group"
}) => (
    <div className={className}>
        {label && <label>{label}</label>}
        {children}
    </div>
);
