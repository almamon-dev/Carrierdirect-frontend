import { useState, useRef, useCallback } from 'react';

export interface WidgetPosition {
  x: number;
  y: number;
}

export function useChatWidgetDrag(isOpen: boolean, setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void, onOpenToggle?: () => void) {
  const [btnPos, setBtnPos] = useState<WidgetPosition | null>(() => {
    try {
      const saved = localStorage.getItem('chat_widget_btn_pos');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, mouseX: 0, mouseY: 0 });

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    isDraggingRef.current = false;
    const currentX = btnPos?.x ?? (window.innerWidth - 76);
    const currentY = btnPos?.y ?? (window.innerHeight - 80);
    dragStartRef.current = { x: currentX, y: currentY, mouseX: clientX, mouseY: clientY };

    const onMove = (moveX: number, moveY: number) => {
      const dx = moveX - dragStartRef.current.mouseX;
      const dy = moveY - dragStartRef.current.mouseY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        isDraggingRef.current = true;
      }
      const newX = Math.max(12, Math.min(window.innerWidth - 68, dragStartRef.current.x + dx));
      const newY = Math.max(12, Math.min(window.innerHeight - 68, dragStartRef.current.y + dy));
      setBtnPos({ x: newX, y: newY });
    };

    const onEnd = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      setBtnPos((latest) => {
        if (latest) {
          try {
            localStorage.setItem('chat_widget_btn_pos', JSON.stringify(latest));
          } catch {}
        }
        return latest;
      });
    };

    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleMouseUp = () => onEnd();
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => onEnd();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  }, [btnPos]);

  const handleLauncherClick = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (onOpenToggle) {
      onOpenToggle();
    }
  }, [isOpen, setIsOpen, onOpenToggle]);

  return {
    btnPos,
    setBtnPos,
    handleDragStart,
    handleLauncherClick,
  };
}
