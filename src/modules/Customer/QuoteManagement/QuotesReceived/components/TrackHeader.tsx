import React from 'react';
import { ArrowLeft, RefreshCw, Eye, Plus } from 'lucide-react';
import Button from '@/components/ui/button';
import StatusBadge from '@/components/common/StatusBadge';

export interface TrackHeaderProps {
    formattedReqId: string;
    cleanId: string;
    status?: string;
    isRefreshing: boolean;
    onBack: () => void;
    onRefresh: () => void;
    onViewSpecs: () => void;
    onNewRequest: () => void;
}

export const TrackHeader: React.FC<TrackHeaderProps> = ({
    formattedReqId,
    cleanId,
    status,
    isRefreshing,
    onBack,
    onRefresh,
    onViewSpecs,
    onNewRequest,
}) => {
    return (
        <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Bids & Tracking: {formattedReqId}
                        </h1>
                        {status && (
                            <StatusBadge status={status} context="quote" />
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Review and compare carrier proposals, negotiate pricing, and track live milestone progression.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
                    >
                        <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </Button>

                    {cleanId && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onViewSpecs}
                            className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 text-slate-700 dark:text-slate-300"
                        >
                            <Eye size={13} className="text-slate-500" />
                            <span>View Specifications</span>
                        </Button>
                    )}

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onNewRequest}
                        className="h-8 px-3 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 shadow-2xs"
                    >
                        <Plus size={13} />
                        <span>New Request</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
