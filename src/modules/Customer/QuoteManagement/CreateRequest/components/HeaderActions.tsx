import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';
import { TemplateDownloadDropdown } from './TemplateDownloadDropdown';
import { BulkUploadDropdown } from './BulkUploadDropdown';

interface HeaderActionsProps {
    isLoading: boolean;
    onRefresh: () => void;
    onUploadCsv: () => void;
    onUploadPdfZip: () => void;
    onCreateNew: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
    isLoading,
    onRefresh,
    onUploadCsv,
    onUploadPdfZip,
    onCreateNew,
}) => {
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
    const [showBulkDropdown, setShowBulkDropdown] = useState(false);

    return (
        <div className="flex flex-wrap items-center gap-2">
            <TemplateDownloadDropdown
                isOpen={showTemplateDropdown}
                setIsOpen={setShowTemplateDropdown}
                onCloseOther={() => setShowBulkDropdown(false)}
            />

            <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3 text-xs font-semibold border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer rounded-[3px]"
                onClick={onRefresh}
                disabled={isLoading}
            >
                <RefreshCw size={13} className={isLoading ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
            </Button>

            <BulkUploadDropdown
                isOpen={showBulkDropdown}
                setIsOpen={setShowBulkDropdown}
                onCloseOther={() => setShowTemplateDropdown(false)}
                onUploadCsv={onUploadCsv}
                onUploadPdfZip={onUploadPdfZip}
            />

            <Button 
                variant="primary" 
                size="sm" 
                className="h-9 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer rounded-[3px]"
                onClick={onCreateNew}
            >
                <Plus size={15} />
                <span>Create New Request</span>
            </Button>
        </div>
    );
};
