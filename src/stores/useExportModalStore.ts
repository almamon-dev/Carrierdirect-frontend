import { create } from 'zustand';

export interface ExportModalOptions {
  reportName?: string;
  title?: string;
  description?: string;
}

interface ExportModalState {
  isOpen: boolean;
  reportName?: string;
  title?: string;
  description?: string;
  openExportModal: (options?: ExportModalOptions) => void;
  closeExportModal: () => void;
}

export const useExportModalStore = create<ExportModalState>((set) => ({
  isOpen: false,
  reportName: undefined,
  title: undefined,
  description: undefined,
  openExportModal: (options?: ExportModalOptions) =>
    set({
      isOpen: true,
      reportName: options?.reportName,
      title: options?.title,
      description: options?.description,
    }),
  closeExportModal: () => set({ isOpen: false }),
}));

export default useExportModalStore;
