import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface CustomerProfileHeaderProps {
    customer: any;
    customerName: string;
    formattedId: string;
}

export const CustomerProfileHeader: React.FC<CustomerProfileHeaderProps> = ({
    customer,
    customerName,
    formattedId,
}) => (
    <div className="bg-gradient-to-r from-orange-50/70 via-white to-slate-50 border border-orange-200/60 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
            {customer.customerAvatar ? (
                <img
                    src={customer.customerAvatar}
                    alt={customerName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-orange-300/80 shadow-xs shrink-0"
                />
            ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF4A1F] to-[#E03E15] text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                    {customerName ? customerName.slice(0, 2).toUpperCase() : 'CU'}
                </div>
            )}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 truncate">{customerName}</h3>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0">
                        <BadgeCheck size={13} className="text-emerald-600" />
                        Verified Customer
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[12.5px] text-slate-500">
                    <span className="font-semibold text-[#FF4A1F]">{formattedId}</span>
                    <span>•</span>
                    <span className="font-bold text-amber-600">★ {customer.customerRating || 4.9}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">48 completed orders</span>
                    <span>•</span>
                    <span className="text-slate-400">Joined Mar 2023</span>
                </div>
            </div>
        </div>
    </div>
);
