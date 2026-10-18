import React from 'react';

interface Props {
    label: string;
    value?: string | React.ReactNode;
    isMono?: boolean;
    badge?: React.ReactNode;
    colSpan?: boolean;
}

export const ProfileKeyValueRow: React.FC<Props> = ({
    label,
    value,
    isMono = false,
    badge = null,
    colSpan = false,
}) => (
    <div
        className={`${
            colSpan ? 'col-span-1 md:col-span-2' : ''
        } grid grid-cols-[125px_12px_1fr] sm:grid-cols-[145px_14px_1fr] items-baseline py-1 text-xs`}
    >
        <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium truncate">{label}</span>
        <span className="text-[11.5px] text-slate-400 dark:text-slate-500 text-center font-medium">:</span>
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <span
                className={`text-[12px] font-semibold text-slate-800 dark:text-slate-200 ${
                    isMono ? 'font-mono' : ''
                }`}
            >
                {value || <span className="text-slate-400 font-normal">—</span>}
            </span>
            {badge}
        </div>
    </div>
);
