import React from 'react';
import { createPortal } from 'react-dom';
import { Activity, Clock } from 'lucide-react';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { ActivityLogItem } from './ActivityLogActions';

interface ActivityLogDetailModalProps {
    log: ActivityLogItem | null;
    onClose: () => void;
}

export const ActivityLogDetailModal: React.FC<ActivityLogDetailModalProps> = ({ log, onClose }) => {
    if (!log) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4 animate-in fade-in duration-150 font-sans"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#181d24] w-full max-w-lg rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden font-sans animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] flex items-center justify-center font-bold">
                            <Activity size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                Activity Log Details
                                <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                    {log.logCode}
                                </span>
                            </h3>
                            <p className="text-[11px] text-slate-400">System audit log trail</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4 text-xs font-sans">
                    {/* Actor Card */}
                    <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-[4px] border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                                {log.avatar}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate">{log.user}</h4>
                                <p className="text-[11px] text-slate-500 truncate">{log.userEmail || 'No email recorded'}</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-[10.5px] border border-slate-200 dark:border-slate-700 shrink-0">
                            {log.userRole}
                        </Badge>
                    </div>

                    {/* Description Box */}
                    <div className="p-3 bg-slate-50/60 dark:bg-slate-800/30 rounded-[4px] border border-slate-200/60 dark:border-slate-700/50 space-y-1">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Event Summary</span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                            {log.description}
                        </p>
                    </div>

                    {/* Key : Value List Rows */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border-t border-b border-slate-100 dark:border-slate-800/80">
                        <div className="py-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-normal">Log Code:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{log.logCode}</span>
                        </div>

                        <div className="py-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-normal">Action Performed:</span>
                            <span className="font-medium text-slate-900 dark:text-slate-100 text-right">{log.action}</span>
                        </div>

                        <div className="py-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-normal">Target Resource:</span>
                            <span className="font-medium text-[#ff4a1f] text-right">{log.target}</span>
                        </div>

                        <div className="py-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-normal">Module Category:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{log.category}</span>
                        </div>

                        <div className="py-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-normal">Action Type:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{log.actionType}</span>
                        </div>

                        <div className="py-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-normal">Outcome / Status:</span>
                            <Badge variant="secondary" className={
                                log.status === 'Success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-[10.5px] border' :
                                log.status === 'Warning' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 font-semibold text-[10.5px] border' :
                                'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 font-semibold text-[10.5px] border'
                            }>
                                {log.status}
                            </Badge>
                        </div>

                        <div className="py-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-normal">IP Address:</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">{log.ipAddress}</span>
                        </div>

                        <div className="py-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-normal">Location Hub:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{log.location}</span>
                        </div>

                        <div className="py-2 flex items-start justify-between text-xs gap-3">
                            <span className="text-slate-500 dark:text-slate-400 font-normal shrink-0">User Agent:</span>
                            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 text-right truncate max-w-[280px]" title={log.userAgent}>{log.userAgent}</span>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-normal">
                        <Clock size={12} /> {log.time}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="h-7 px-3 text-xs font-semibold cursor-pointer rounded"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
