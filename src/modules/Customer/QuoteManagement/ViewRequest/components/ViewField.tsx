import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export const SectionHeader = ({ title, icon: Icon, className = "col-span-1 md:col-span-2" }: { title: string, icon?: any, className?: string }) => (
    <div className={`${className} mt-4 pt-3 border-t border-slate-100 first:mt-0 first:pt-0 first:border-t-0 mb-2`}>
        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            {Icon && <Icon size={16} className="text-slate-400" />}
            {title}
        </h3>
    </div>
);

export const ViewField = ({
    label,
    value,
    children,
    isLink = false,
    linkHref = "",
    colSpan = false,
    isLoading = false
}: {
    label: string;
    value?: React.ReactNode;
    children?: React.ReactNode;
    isLink?: boolean;
    linkHref?: string;
    colSpan?: boolean;
    isLoading?: boolean;
}) => (
    <div className={`${colSpan ? 'col-span-1 md:col-span-2' : ''} grid grid-cols-[140px_10px_1fr] items-start py-0.5`}>
        <p className="text-[12.5px] text-slate-500 font-medium leading-relaxed">{label}</p>
        <p className="text-[12.5px] text-slate-400 leading-relaxed">:</p>
        <div className="w-full">
            {isLoading ? (
                <Skeleton className="h-4 w-32 rounded my-0.5" />
            ) : children ? children : isLink ? (
                <a href={linkHref} target={linkHref.startsWith('http') ? "_blank" : "_self"} className="text-[12.5px] font-semibold text-brand hover:underline break-all leading-relaxed">
                    {value || '-'}
                </a>
            ) : (
                <div className="text-[12.5px] font-semibold text-slate-800 break-words leading-relaxed">{value || <span className="text-[12px] text-slate-400 font-bold">-</span>}</div>
            )}
        </div>
    </div>
);
