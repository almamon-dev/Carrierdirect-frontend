import React, { useState } from 'react';

export const useChatLayout = () => {
    const [callModal, setCallModal] = useState<{ isOpen: boolean; type: 'audio' | 'video' }>({
        isOpen: false,
        type: 'audio'
    });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
    const [sidebarWidth, setSidebarWidth] = useState<number>(320);
    const [isResizing, setIsResizing] = useState<boolean>(false);

    const toggleSidebarCollapse = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    const handleResizeStart = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        const startX = e.clientX;
        const startW = sidebarWidth;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - startX;
            const newWidth = Math.min(Math.max(startW + delta, 240), 460);
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return {
        callModal,
        setCallModal,
        isSidebarCollapsed,
        sidebarWidth,
        isResizing,
        toggleSidebarCollapse,
        handleResizeStart,
    };
};
