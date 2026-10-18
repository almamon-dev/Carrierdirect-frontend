import React from 'react';
import { FileSpreadsheet, Sparkles, CheckCircle2, FileText, Database } from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { useExportModalStore } from '@/stores/useExportModalStore';

export interface ExportComingSoonModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  reportName?: string;
  title?: string;
  description?: string;
}

export const ExportComingSoonModal: React.FC<ExportComingSoonModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  reportName: propReportName,
  title: propTitle,
  description: propDescription,
}) => {
  const storeIsOpen = useExportModalStore((s) => s.isOpen);
  const storeClose = useExportModalStore((s) => s.closeExportModal);
  const storeReportName = useExportModalStore((s) => s.reportName);
  const storeTitle = useExportModalStore((s) => s.title);
  const storeDescription = useExportModalStore((s) => s.description);

  // If propIsOpen is explicitly boolean, use props mode; otherwise fallback to store
  const isControlled = typeof propIsOpen === 'boolean';
  const isOpen = isControlled ? propIsOpen : storeIsOpen;
  const onClose = isControlled ? propOnClose || (() => {}) : storeClose;
  const reportName = propReportName || storeReportName;
  const title = propTitle || storeTitle || 'Export CSV Coming Soon';
  const description =
    propDescription ||
    storeDescription ||
    "We're actively building automated ledger & CSV downloads with granular filters, accounting dates, and instant spreadsheet compatibility.";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={true}
    >
      <div className="flex flex-col items-center text-center pt-2 pb-1 px-1 font-sans">
        {/* Visual Icon Badge */}
        <div className="relative mb-3">
          <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/70 dark:from-orange-950/40 dark:to-orange-900/20 text-[#ff4a1f] border border-orange-200/90 dark:border-orange-800/60 flex items-center justify-center shadow-sm">
            <FileSpreadsheet size={26} />
          </div>
          <span className="absolute -top-1 -right-1 w-5.5 h-5.5 rounded-full bg-[#ff4a1f] text-white flex items-center justify-center text-[10px] shadow-sm">
            <Sparkles size={11} />
          </span>
        </div>

        {/* Feature Pill */}
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 dark:bg-orange-950/50 text-[#ff4a1f] border border-orange-200 dark:border-orange-900/60 mb-1.5">
          Feature Under Development
        </span>

        {/* Heading */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-[300px]">
          {description}
        </p>

        {/* Target Dataset Preview if provided */}
        {reportName && (
          <div className="mt-3.5 w-full bg-slate-50 dark:bg-slate-900/50 rounded-[4px] p-2.5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 text-left">
            <div className="w-6 h-6 rounded-[4px] bg-orange-100 dark:bg-orange-950/60 text-[#ff4a1f] flex items-center justify-center shrink-0">
              <FileText size={12} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">
                Target Dataset
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {reportName}
              </div>
            </div>
          </div>
        )}

        {/* Feature preview bullets */}
        <div className="mt-3 w-full bg-slate-50/70 dark:bg-slate-900/40 rounded-[4px] p-2.5 border border-slate-200/70 dark:border-slate-800/80 text-left space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-medium">
            <CheckCircle2 size={13} className="text-[#ff4a1f] shrink-0" />
            <span>Standard UTF-8 CSV & Excel (.xlsx) support</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-medium">
            <Database size={13} className="text-[#ff4a1f] shrink-0" />
            <span>Filter by date ranges, status & search queries</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-medium">
            <CheckCircle2 size={13} className="text-[#ff4a1f] shrink-0" />
            <span>Accounting & ERP reconciliation ready</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 w-full">
          <Button
            type="button"
            onClick={onClose}
            className="h-8.5 px-4 w-full bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] shadow-2xs transition-all cursor-pointer inline-flex items-center justify-center"
          >
            Got it, thanks
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportComingSoonModal;
