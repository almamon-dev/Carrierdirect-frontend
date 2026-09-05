import React from 'react';
import Skeleton from '@/components/ui/skeleton';
import { FileText, MapPin, Truck, Euro, Paperclip, Activity } from 'lucide-react';

export const QuoteViewGeneralTabSkeleton = () => (
    <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div className="col-span-1 md:col-span-2 pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
                <FileText size={18} className="text-brand" />
                <span>Basic Information</span>
            </div>
            <div className="col-span-1 md:col-span-2 grid grid-cols-[160px_10px_1fr] items-start">
                <p className="text-[14px] text-slate-500 font-medium">Request Title</p>
                <p className="text-[14px] text-slate-400">:</p>
                <Skeleton className="h-5 w-3/4 rounded" />
            </div>
            <div className="grid grid-cols-[160px_10px_1fr] items-start">
                <p className="text-[14px] text-slate-500 font-medium">Request Number</p>
                <p className="text-[14px] text-slate-400">:</p>
                <Skeleton className="h-5 w-24 rounded" />
            </div>
            <div className="grid grid-cols-[160px_10px_1fr] items-start">
                <p className="text-[14px] text-slate-500 font-medium">Priority</p>
                <p className="text-[14px] text-slate-400">:</p>
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="col-span-1 md:col-span-2 mt-4 pt-3 border-t border-slate-100 mb-2">
                <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={16} className="text-slate-400" /> Schedule
                </h3>
            </div>
            {['Pickup Date', 'Pickup Time', 'Delivery Date', 'Delivery Time', 'Transit Time (Days)'].map((label) => (
                <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start">
                    <p className="text-[14px] text-slate-500 font-medium">{label}</p>
                    <p className="text-[14px] text-slate-400">:</p>
                    <Skeleton className="h-5 w-28 rounded" />
                </div>
            ))}
        </div>
    </div>
);

export const QuoteViewLocationsTabSkeleton = () => (
    <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div className="col-span-1 md:col-span-2 pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
                <MapPin size={18} className="text-brand" />
                <span>Location Information</span>
            </div>
            {['Company Name', 'Contact Person', 'Phone Number', 'Email', 'City', 'ZIP Code'].map(label => (
                <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start">
                    <p className="text-[14px] text-slate-500 font-medium">{label}</p>
                    <p className="text-[14px] text-slate-400">:</p>
                    <Skeleton className="h-5 w-32 rounded" />
                </div>
            ))}
        </div>
    </div>
);

export const QuoteViewOtherTabSkeleton = () => (
    <div className="space-y-4">
        <div className="pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
            <Truck size={18} className="text-brand" />
            <Skeleton className="h-5 w-40 rounded" />
        </div>
        <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="grid grid-cols-[160px_10px_1fr] items-start">
                    <Skeleton className="h-4 w-28 rounded" />
                    <p className="text-[14px] text-slate-400">:</p>
                    <Skeleton className="h-5 w-48 rounded" />
                </div>
            ))}
        </div>
    </div>
);
