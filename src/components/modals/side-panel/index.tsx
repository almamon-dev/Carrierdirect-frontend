import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'right' | 'left';
  closeOnOutsideClick?: boolean;
}

export default function SidePanel({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  size = 'md',
  position = 'right',
  closeOnOutsideClick = true,
}: SidePanelProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-2xl',
    full: 'w-screen',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const isRight = position === 'right';

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={handleBackdropClick}
      />
      
      {/* Side Panel */}
      <div 
        className={cn(
          "relative bg-white h-full flex flex-col shadow-2xl transition-all duration-300",
          sizeClasses[size],
          isRight 
            ? "ml-auto animate-in slide-in-from-right" 
            : "mr-auto animate-in slide-in-from-left",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="pr-4">
            <h3 className="text-[18px] font-bold text-slate-900">{title}</h3>
            {description && <p className="text-[13px] text-slate-500 mt-1">{description}</p>}
          </div>
          
          <button 
            onClick={onClose}
            className="w-9 h-9 -mt-1 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
