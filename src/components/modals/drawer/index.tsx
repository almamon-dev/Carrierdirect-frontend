import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'bottom' | 'top';
  closeOnOutsideClick?: boolean;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  size = 'md',
  position = 'bottom',
  closeOnOutsideClick = true,
}: DrawerProps) {
  
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
    sm: 'h-[30vh]',
    md: 'h-[50vh]',
    lg: 'h-[70vh]',
    xl: 'h-[85vh]',
    full: 'h-screen',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const isBottom = position === 'bottom';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={handleBackdropClick}
      />
      
      {/* Drawer Panel */}
      <div 
        className={cn(
          "relative bg-white w-full flex flex-col shadow-2xl transition-all duration-300",
          sizeClasses[size],
          isBottom 
            ? "mt-auto rounded-t-3xl animate-in slide-in-from-bottom" 
            : "mb-auto rounded-b-3xl animate-in slide-in-from-top",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-[18px] font-bold text-slate-900">{title}</h3>
          
          <button 
            onClick={onClose}
            className="w-9 h-9 -mr-2 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
