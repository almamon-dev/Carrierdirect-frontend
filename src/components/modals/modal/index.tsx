import React, { useEffect } from 'react';
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content Wrapper */}
      <div 
        className={cn(
          "relative bg-white rounded-md shadow-2xl w-full flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200",
          sizeClasses[size],
          size === 'full' ? 'max-h-full' : 'max-h-[90vh]',
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div>
              {title && <h3 className="text-[17px] font-bold text-slate-900">{title}</h3>}
              {description && <p className="text-[13px] text-slate-500 mt-1">{description}</p>}
            </div>
            
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="w-8 h-8 -mr-2 -mt-1 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-end gap-3 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
