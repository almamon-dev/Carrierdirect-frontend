import React from 'react';
import Modal, { ModalProps } from '../modal';
import { AlertCircle } from 'lucide-react';

export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
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
      {...props}
    >
      <div className="flex flex-col items-center text-center pt-4 pb-2">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          <AlertCircle size={28} strokeWidth={2} />
        </div>
        <h3 className="text-[20px] font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-[14px] text-slate-500 font-medium px-4">
          {description}
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3 w-full">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-[14px] text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-[14px] text-white transition-colors disabled:opacity-50 flex items-center justify-center ${
            isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : confirmText}
        </button>
      </div>
    </Modal>
  );
}
