import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  position?: 'bottom' | 'top' | 'right' | 'left';
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
  position = 'right',
  closeOnOutsideClick = true,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const heightClasses = {
    sm: 'h-[30vh]',
    md: 'h-[50vh]',
    lg: 'h-[70vh]',
    xl: 'h-[85vh]',
    full: 'h-screen',
  };

  const widthClasses = {
    sm: 'max-w-xs w-full',
    md: 'max-w-md w-full',
    lg: 'max-w-lg w-full',
    xl: 'max-w-xl w-full',
    full: 'w-screen',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const isRight = position === 'right';
  const isLeft = position === 'left';
  const isBottom = position === 'bottom';

  return createPortal(
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[99999] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={handleBackdropClick}
      />

      {/* Drawer Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative bg-white flex flex-col shadow-2xl transition-all duration-300 z-10 h-full max-h-screen",
          isRight && cn(widthClasses[size], "ml-auto rounded-none animate-in slide-in-from-right"),
          isLeft && cn(widthClasses[size], "mr-auto rounded-none animate-in slide-in-from-left"),
          isBottom && cn("w-full mt-auto rounded-t-2xl animate-in slide-in-from-bottom", heightClasses[size]),
          !isRight && !isLeft && !isBottom && cn("w-full mb-auto rounded-b-2xl animate-in slide-in-from-top", heightClasses[size]),
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 shrink-0">
          <div className="flex-1">
            {typeof title === 'string' ? (
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            ) : (
              title
            )}
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 -mr-1 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 pt-2 pb-4 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
