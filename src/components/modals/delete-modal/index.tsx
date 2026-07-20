import React from 'react';
import ConfirmModal from '../confirm-modal';
import { Trash2 } from 'lucide-react';
import Modal, { ModalProps } from '../modal';

export interface DeleteModalProps extends Omit<ModalProps, 'children' | 'title' | 'description'> {
  onDelete: () => void;
  itemName?: string;
  itemType?: string;
  isLoading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  itemName,
  itemType = 'item',
  isLoading = false,
  ...props
}: DeleteModalProps) {
  
  const title = `Delete ${itemType}`;
  const description = (
    <span>
      Are you sure you want to delete {itemName ? <strong className="text-slate-800">"{itemName}"</strong> : `this ${itemType}`}? This action cannot be undone and will permanently remove the data from our servers.
    </span>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      {...props}
    >
      <div className="flex flex-col items-center text-center pt-4 pb-2">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5 bg-red-100 text-red-600">
          <Trash2 size={28} strokeWidth={2} />
        </div>
        <h3 className="text-[20px] font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-[14px] text-slate-500 font-medium px-2">
          {description}
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3 w-full">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-[14px] text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-[14px] text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
