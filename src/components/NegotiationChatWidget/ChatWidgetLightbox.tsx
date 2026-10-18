import React from 'react';
import { X as CloseIcon } from 'lucide-react';

interface ChatWidgetLightboxProps {
  imageSrc: string | null;
  onClose: () => void;
}

export const ChatWidgetLightbox: React.FC<ChatWidgetLightboxProps> = ({
  imageSrc,
  onClose,
}) => {
  if (!imageSrc) return null;

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white/90 hover:text-white w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center cursor-pointer transition-colors"
        title="Close"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
      <img
        src={imageSrc}
        alt="Preview"
        className="max-w-full max-h-[90%] rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
