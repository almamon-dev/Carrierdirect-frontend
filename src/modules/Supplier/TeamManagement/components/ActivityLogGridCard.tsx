import React from 'react';
import Badge from '@/components/ui/badge';
import { Layers, Tag, Globe, Clock } from 'lucide-react';
import { ActivityLogItem, ActivityLogActions } from './ActivityLogActions';

interface ActivityLogGridCardProps {
    log: ActivityLogItem;
    onViewDetails: (log: ActivityLogItem) => void;
}

export const ActivityLogGridCard: React.FC<ActivityLogGridCardProps> = ({ log, onViewDetails }) => (
    <div
        key={log.id}
        className="bg-white dark:bg-[#181d24] rounded-md border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-3.5 flex flex-col justify-between transition-all shadow-2xs group"
    >
        <div>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                        {log.avatar}
                    </div>
                    <div className="min-w-0">
                        <span className="font-mono text-[10.5px] font-bold text-slate-400 dark:text-slate-500 block leading-tight">
                            {log.logCode}
                        </span>
                        <button
                            onClick={() => onViewDetails(log)}
                            className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors truncate leading-tight mt-0.5 text-left cursor-pointer"
                            title={log.user}
                        >
                            {log.user}
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <Badge
                        variant="secondary"
                        className={`whitespace-nowrap text-[10px] font-semibold border flex items-center gap-1 px-1.5 py-0.5 ${
                            log.status === 'Success'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : log.status === 'Warning'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                                    : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300'
                        }`}
                    >
                        {log.status === 'Success' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                        {log.status === 'Warning' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                        {log.status === 'Failed' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                        {log.status}
                    </Badge>
                    <ActivityLogActions row={log} onViewDetails={onViewDetails} />
                </div>
            </div>

            <div className="space-y-1.5 py-1 text-xs">
                <div className="text-[11.5px] font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    {log.action}
                </div>
                <div className="flex justify-between items-center text-[11.5px] pt-1">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Layers size={12} className="text-slate-400" /> Target:
                    </span>
                    <span className="font-normal text-slate-700 dark:text-slate-300 truncate">{log.target}</span>
                </div>
                <div className="flex justify-between items-center text-[11.5px]">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Tag size={12} className="text-slate-400" /> Module:
                    </span>
                    <span className="font-normal text-slate-700 dark:text-slate-300 truncate">{log.category}</span>
                </div>
                <div className="flex justify-between items-center text-[11.5px]">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Globe size={12} className="text-slate-400" /> IP:
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-400 truncate">{log.ipAddress}</span>
                </div>
            </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
                <Clock size={11} /> {log.time}
            </span>
            <span className="text-slate-400">{log.timeAgo}</span>
        </div>
    </div>
);
