import React from 'react';
import { MapPin, CheckCircle, Clock, FileCheck } from 'lucide-react';

interface Props {
    onSelectReply: (text: string) => void;
}

const QUICK_REPLIES = [
    { label: '📍 Arrived at pickup', text: '📍 Arrived at pickup facility and checking in with security/dock.' },
    { label: '📦 Cargo loaded & secured', text: '📦 Cargo has been safely loaded, strapped, and seal inspected.' },
    { label: '⚠️ Traffic delay (~20m)', text: '⚠️ Experiencing moderate highway congestion. Revised ETA updated.' },
    { label: '🚚 At delivery dock', text: '🚚 Backed into delivery dock #12. Preparing for unloading.' },
    { label: '✅ POD signed & completed', text: '✅ Consignee signed POD. Delivery completed in full.' },
];

export const DriverQuickReplies: React.FC<Props> = ({ onSelectReply }) => {
    return (
        <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#161a22] flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap pl-1">
                Quick Status:
            </span>
            {QUICK_REPLIES.map((r, idx) => (
                <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectReply(r.text)}
                    className="px-2.5 py-1 bg-white dark:bg-[#1e2329] hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-700 dark:text-slate-200 hover:text-[#FF4A1F] border border-slate-200 dark:border-slate-700/80 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
                >
                    {r.label}
                </button>
            ))}
        </div>
    );
};
