import React from 'react';
import Skeleton from '@/components/ui/skeleton';
import { FileText, MapPin, Truck } from 'lucide-react';

export const QuoteEditGeneralTabSkeleton = () => (
    <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="col-span-1 md:col-span-2 pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
                <FileText size={18} className="text-brand" />
                <span>Basic Information</span>
            </div>
            {['Request Title', 'Request Number', 'Priority', 'Shipment Type', 'Service Type'].map(label => (
                <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                    <p className="text-[14px] text-slate-700 font-medium mt-2">{label}</p>
                    <p className="text-[14px] text-slate-400 mt-2">:</p>
                    <Skeleton className="h-9 w-full rounded-[2px]" />
                </div>
            ))}
            <div className="col-span-1 md:col-span-2 mt-4 pt-3 border-t border-slate-100 mb-2">
                <h3 className="text-[13px] font-bold text-slate-800">Schedule</h3>
            </div>
            {['Pickup Date', 'Pickup Time', 'Delivery Date', 'Delivery Time', 'Transit Time (Days)'].map((label) => (
                <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                    <p className="text-[14px] text-slate-700 font-medium mt-2">{label}</p>
                    <p className="text-[14px] text-slate-400 mt-2">:</p>
                    <Skeleton className="h-9 w-full rounded-[2px]" />
                </div>
            ))}
        </div>
    </div>
);

export const QuoteEditLocationsTabSkeleton = () => (
    <div className="space-y-6">
        <div className="border-b border-slate-100 pb-6">
            <h3 className="text-[13px] font-bold text-brand mb-4 flex items-center gap-2">
                <MapPin size={16} /> Pickup Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {['Company Name', 'Contact Person', 'Phone Number', 'Email', 'City', 'ZIP Code'].map(label => (
                    <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                        <p className="text-[14px] text-slate-700 font-medium mt-2">{label}</p>
                        <p className="text-[14px] text-slate-400 mt-2">:</p>
                        <Skeleton className="h-9 w-full rounded-[2px]" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const QuoteEditOtherTabSkeleton = () => (
    <div className="space-y-4">
        <div className="pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
            <Truck size={18} className="text-brand" />
            <Skeleton className="h-5 w-40 rounded" />
        </div>
        <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                    <Skeleton className="h-4 w-28 rounded mt-2" />
                    <p className="text-[14px] text-slate-400 mt-2">:</p>
                    <Skeleton className="h-9 w-full rounded-[2px]" />
                </div>
            ))}
        </div>
    </div>
);
