import React from 'react';
import { RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';
import { CreateRequestDropdown } from './CreateRequestDropdown';

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
    return (
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs font-semibold border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer rounded-[4px]"
                onClick={onRefresh}
                disabled={isLoading}
            >
                <RefreshCw size={13} className={isLoading ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
            </Button>

            <CreateRequestDropdown
                onCreateNew={onCreateNew}
                onUploadCsv={onUploadCsv}
                onUploadPdfZip={onUploadPdfZip}
                buttonText="Create Request"
            />
        </div>
    );
};

