import React from 'react';
import { MessageSquare as ChatIcon, X as CloseIcon } from 'lucide-react';
import { WidgetPosition } from './useChatWidgetDrag';

interface ChatWidgetFabButtonProps {
  btnPos: WidgetPosition | null;
  isOpen: boolean;
  unreadCount: number;
  onLauncherClick: (e: React.MouseEvent) => void;
  onDragStart: (clientX: number, clientY: number) => void;
}

export const ChatWidgetFabButton: React.FC<ChatWidgetFabButtonProps> = ({
  btnPos,
  isOpen,
  unreadCount,
  onLauncherClick,
  onDragStart,
}) => {
  return (
    <div
      style={
        btnPos
          ? { left: `${btnPos.x}px`, top: `${btnPos.y}px` }
          : { right: '24px', bottom: '24px' }
      }
      className="fixed z-50 select-none touch-none"
    >
      <button
        onClick={onLauncherClick}
        onMouseDown={(e) => {
          if (e.button === 0) onDragStart(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          if (e.touches.length > 0) onDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 border-2 ${
          isOpen
            ? 'bg-slate-900 text-white hover:bg-slate-800 border-white/20'
            : 'bg-[#ff4a1f] hover:bg-[#e63d15] text-white border-white/30 shadow-[#ff4a1f]/30'
        }`}
        title={isOpen ? 'Close Chat' : 'Open Messages'}
      >
        {isOpen ? (
          <CloseIcon className="w-6 h-6 transition-transform duration-200" />
        ) : (
          <ChatIcon className="w-6 h-6 transition-transform duration-200" />
        )}

        {/* Unread badge on button */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 bg-red-600 text-white text-[11px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
