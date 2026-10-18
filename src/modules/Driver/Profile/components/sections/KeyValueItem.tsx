import React from 'react';

interface KeyValueItemProps {
    label: string;
    value: React.ReactNode;
    isMono?: boolean;
    action?: React.ReactNode;
}

export const KeyValueItem: React.FC<KeyValueItemProps> = ({
    label,
    value,
    isMono = false,
    action,
}) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-36 sm:w-48 shrink-0 text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            <span className="text-slate-300 dark:text-slate-600 font-bold select-none">:</span>
            <span className={`truncate ${isMono ? 'font-mono' : ''} font-semibold text-slate-800 dark:text-slate-200`}>
                {value}
            </span>
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </div>
);

export default KeyValueItem;
