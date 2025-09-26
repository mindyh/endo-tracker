export const useKeyPress = () => {
    const handleKeyPress = (e, enterAction, escapeAction = null) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            enterAction();
        } else if (e.key === 'Escape' && escapeAction) {
            e.preventDefault();
            escapeAction();
        }
    };

    return { handleKeyPress };
};
