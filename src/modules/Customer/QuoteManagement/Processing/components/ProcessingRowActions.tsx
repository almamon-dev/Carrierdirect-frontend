import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';

export const ProcessingRowActions: React.FC<{ row: any }> = ({ row }) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-end gap-1.5 w-full min-h-[26px]">
            <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(buildSecureQuoteUrl(row.rawId || row.id, 'view'));
                }}
                className="h-7 px-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[5px] cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1 shrink-0"
                title="View Full Request Details"
            >
                <Eye size={12.5} className="shrink-0 text-slate-500 dark:text-slate-400" />
                <span>View</span>
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(buildSecureQuoteUrl(row.rawId || row.id, 'edit'));
                }}
                className="h-7 px-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[5px] cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1 shrink-0"
                title="Edit Request"
            >
                <Edit size={12.5} className="shrink-0 text-slate-500 dark:text-slate-400" />
                <span>Edit</span>
            </Button>
        </div>
    );
};
