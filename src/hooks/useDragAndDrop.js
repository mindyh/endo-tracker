import { useState } from 'react';

export const useDragAndDrop = (onReorder, options = {}) => {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const { supportsSections = false } = options;

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        setDraggedIndex(index);

        // Add visual feedback
        e.currentTarget.classList.add('dragging');

        // Add drag image styling
        setTimeout(() => {
            e.currentTarget.style.opacity = '0.5';
        }, 0);
    };

    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('dragging');
        e.currentTarget.style.opacity = '';
        setDraggedIndex(null);

        // Remove drag-over class from all items
        document.querySelectorAll('.drag-over').forEach(item => {
            item.classList.remove('drag-over');
        });
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Only add drag-over if it's not the dragged item itself
        if (draggedIndex !== null && draggedIndex !== index) {
            e.currentTarget.classList.add('drag-over');
        }
    };

    // Container-level drag over (for drop zone effect)
    const handleContainerDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedIndex !== null) {
            e.currentTarget.classList.add('drag-over');
        }
    };

    const handleDragLeave = (e) => {
        // Only remove if we're actually leaving the element, not entering a child
        if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.classList.remove('drag-over');
        }
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

        if (dragIndex !== dropIndex && onReorder) {
            onReorder(dragIndex, dropIndex);
        }

        setDraggedIndex(null);
    };

    return {
        draggedIndex,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleContainerDragOver,
        handleDragLeave,
        handleDrop
    };
};
