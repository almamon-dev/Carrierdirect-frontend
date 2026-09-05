import React, { useMemo, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { FileProcessingStreamFeed } from './FileProcessingStreamFeed';

export interface FileProcessingScreenProps {
    mode?: 'extract' | 'confirm';
    progress: number;
    statusText?: string;
    totalRequestsCount?: number;
    extractedData?: any;
    onClose?: () => void;
}

export const FileProcessingScreen: React.FC<FileProcessingScreenProps> = ({
    progress,
    totalRequestsCount = 1,
    extractedData,
    onClose,
}) => {
    const isCompleted = progress >= 100;
    const terminalRef = useRef<HTMLDivElement>(null);

    const rows: any[] = useMemo(() => {
        if (!extractedData) return [];
        if (Array.isArray(extractedData)) return extractedData;
        if (Array.isArray(extractedData.rows) && extractedData.rows.length > 0) return extractedData.rows;
        if (Array.isArray(extractedData.requests) && extractedData.requests.length > 0) return extractedData.requests;
        if (typeof extractedData === 'object' && (extractedData.requestTitle || extractedData.title || extractedData.pickup || extractedData.pickupCity)) {
            return [extractedData];
        }
        return [];
    }, [extractedData]);

    const effectiveTotal = rows.length || totalRequestsCount || 1;

    const visibleCount = useMemo(() => {
        if (isCompleted) return rows.length;
        if (progress < 5) return 0;
        const count = Math.min(rows.length, Math.ceil(((progress - 5) / 88) * rows.length));
        return Math.max(1, count);
    }, [progress, rows.length, isCompleted]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [visibleCount, isCompleted]);

    return (
        <div className="w-full py-1 font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-2 mb-2.5 px-0.5">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        {isCompleted ? (
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        ) : (
                            <>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                            </>
                        )}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                        {isCompleted ? `Published ${effectiveTotal} Quote Requests` : 'Creating & Publishing Requests...'}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-slate-400 dark:text-slate-500">{visibleCount}/{effectiveTotal} rows</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.round(progress)}%</span>
                </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mb-3">
                <div
                    className={`h-full rounded-full transition-all duration-150 ease-out ${
                        isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <FileProcessingStreamFeed
                terminalRef={terminalRef}
                rows={rows}
                visibleCount={visibleCount}
                effectiveTotal={effectiveTotal}
                isCompleted={isCompleted}
            />

            {isCompleted && (
                <div className="pt-3 flex items-center justify-end animate-in fade-in duration-150">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8 px-4 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-md inline-flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                        <span>View Requests</span>
                        <ArrowRight size={13} />
                    </button>
                </div>
            )}
        </div>
    );
};
