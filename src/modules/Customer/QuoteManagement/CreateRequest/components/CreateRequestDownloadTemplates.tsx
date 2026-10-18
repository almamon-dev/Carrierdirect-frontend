import React from 'react';
import { Download, FileSpreadsheet, FileCheck, Eye } from 'lucide-react';
import { 
    downloadBlankCSVTemplate, 
    downloadSampleCSVWithValues, 
    downloadBlankPDFTemplate, 
    downloadSamplePDFWithValues 
} from '../utils/templateHelpers';

interface CreateRequestDownloadTemplatesProps {
  onClose: () => void;
}

export const CreateRequestDownloadTemplates: React.FC<CreateRequestDownloadTemplatesProps> = ({ onClose }) => {
  return (
    <div className="px-3.5 pt-1 pb-1.5">
      <div className="flex items-center justify-between text-[11.5px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
        <span>Download Templates</span>
        <Download size={12} className="text-slate-400" />
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => {
            onClose();
            downloadBlankCSVTemplate();
          }}
          className="px-2 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileSpreadsheet size={13} className="text-slate-500 shrink-0" />
          <span>Blank CSV</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            downloadSampleCSVWithValues();
          }}
          className="px-2 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileSpreadsheet size={13} className="text-slate-500 shrink-0" />
          <span>Sample CSV</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            downloadBlankPDFTemplate();
          }}
          className="px-2 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileCheck size={13} className="text-slate-500 shrink-0" />
          <span>Blank PDF</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            downloadSamplePDFWithValues();
          }}
          className="px-2 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Eye size={13} className="text-slate-500 shrink-0" />
          <span>Sample PDF</span>
        </button>
      </div>
    </div>
  );
};

export default CreateRequestDownloadTemplates;
