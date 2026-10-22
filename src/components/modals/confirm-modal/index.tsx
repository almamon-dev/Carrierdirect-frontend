import React from 'react';
import Modal, { ModalProps } from '../modal';
import { AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
  icon,
  className,
  size = 'sm',
  ...props
}: ConfirmModalProps) {

  const handleConfirm = () => {
    if (!isLoading) onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      showCloseButton={false}
      className={cn(
        "max-w-[370px] sm:max-w-[390px] p-4.5 sm:p-5 border border-slate-200 dark:border-slate-800 rounded-[5px] bg-white dark:bg-[#1e2329] shadow-xl",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center text-center pt-2 pb-1">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 shrink-0 ${
          isDestructive 
            ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400' 
            : 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
        }`}>
          {icon || <AlertCircle size={22} strokeWidth={2} />}
        </div>
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
          {title}
        </h3>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium px-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2.5 w-full">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 h-8 rounded-[3px] text-xs font-semibold whitespace-nowrap bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-none cursor-pointer flex items-center justify-center"
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={isDestructive ? "destructive" : "default"}
          size="sm"
          onClick={handleConfirm}
          isLoading={isLoading}
          disabled={isLoading}
          className="flex-1 h-8 rounded-[3px] text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs flex items-center justify-center"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
