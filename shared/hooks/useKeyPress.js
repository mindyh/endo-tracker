// Cross-platform key press handling
// This provides a unified interface for both web and mobile

export const useKeyPress = () => {
    const handleKeyPress = (e, enterAction, escapeAction = null) => {
        // Web implementation
        if (typeof e === 'object' && e.key) {
            if (e.key === 'Enter') {
                e.preventDefault();
                enterAction();
            } else if (e.key === 'Escape' && escapeAction) {
                e.preventDefault();
                escapeAction();
            }
        }
        // For mobile, we'd handle this differently in the component itself
        // using onSubmitEditing prop on TextInput
    };

    // Return both web-style and mobile-style handlers
    return {
        handleKeyPress,
        // Mobile-friendly handler that can be used with TextInput
        getSubmitHandler: (action) => ({ onSubmitEditing: action })
    };
};