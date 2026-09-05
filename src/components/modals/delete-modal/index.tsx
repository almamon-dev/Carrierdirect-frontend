import React from "react";
import { Trash2 } from "lucide-react";
import Modal, { ModalProps } from "../modal";

export interface DeleteModalProps extends Omit<ModalProps, "children" | "title" | "description"> {
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
  itemType = "item",
  isLoading = false,
  ...props
}: DeleteModalProps) {

  const title = `Delete ${itemType}`;
  const description = (
    <span>
      Are you sure you want to delete {itemName ? <strong className="text-slate-900 dark:text-slate-100 font-bold">\"{itemName}\"</strong> : `this ${itemType}`}? This action cannot be undone and will permanently remove the data from our servers.
    </span>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      className="dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[5px]"
      {...props}
    >
      <div className="flex flex-col items-center text-center pt-3 pb-2">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
          <Trash2 size={24} strokeWidth={2} />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2.5 w-full">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-3 py-2 rounded-[3px] font-semibold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isLoading}
          className="flex-1 px-3 py-2 rounded-[3px] font-semibold text-xs text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-xs"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
