import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  size = 'md',
  showCloseButton = true,
  closeOnOutsideClick = true,
}: ModalProps) {
  
  // Prevent body scroll when modal is open
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
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-[95vw] h-[95vh]',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content Wrapper */}
      <div 
        className={cn(
          "relative bg-white dark:bg-[#1e2329] rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-2xl w-full flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200",
          sizeClasses[size],
          size === 'full' ? 'max-h-full' : 'max-h-[90vh]',
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181d24]/60 shrink-0">
            <div className="flex-1">
              {typeof title === 'string' ? (
                <>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                  {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
                </>
              ) : (
                title
              )}
            </div>
            
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="w-7 h-7 -mr-1 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#181d24] shrink-0 flex items-center justify-end gap-3 rounded-b-[5px]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
