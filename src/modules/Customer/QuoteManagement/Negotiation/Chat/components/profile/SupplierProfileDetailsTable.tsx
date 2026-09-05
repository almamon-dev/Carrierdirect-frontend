import React from 'react';
import { BadgeCheck, Building2, Clock, PackageCheck, Shield, ShieldCheck, Star, Truck, UserCheck } from 'lucide-react';

interface SupplierProfileDetailsTableProps {
    supplierName: string;
    formattedId: string;
    rating: number | string;
}

export const SupplierProfileDetailsTable: React.FC<SupplierProfileDetailsTableProps> = ({
    supplierName,
    formattedId,
    rating,
}) => (
    <div className="space-y-4 min-w-0">
        <div>
            <h4 className="text-[12px] font-bold text-slate-700 dark:text-slate-200 mb-2 pb-1 border-b border-slate-100 uppercase tracking-wider text-xs">
                Carrier Details &amp; Status
            </h4>
            <table className="w-full text-[11.5px] border-collapse">
                <tbody>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><Building2 size={13} className="text-slate-400 shrink-0" /><span>Company</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100 truncate">{supplierName}</td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><Shield size={13} className="text-slate-400 shrink-0" /><span>Platform ID</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-mono font-bold text-[#FF4A1F]">{formattedId}</td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><Star size={13} className="text-amber-500 fill-amber-400 shrink-0" /><span>Rating</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">
                            <span className="text-amber-500 font-bold">{rating}</span>{' '}
                            <span className="text-[10px] text-slate-400 font-normal">(58 reviews)</span>
                        </td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><PackageCheck size={13} className="text-emerald-500 shrink-0" /><span>Orders Done</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">94+ <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 ml-1">(100% Fulfilled)</span></td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><Truck size={13} className="text-blue-500 shrink-0" /><span>On-Time Rate</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">99.2% <span className="text-[10px] text-slate-400 font-normal ml-1">(Reliable)</span></td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><Clock size={13} className="text-orange-500 shrink-0" /><span>Response Time</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">&lt; 15 mins <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 ml-1">(Fast)</span></td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><UserCheck size={13} className="text-slate-400 shrink-0" /><span>Account Type</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-medium text-slate-800 dark:text-slate-200 capitalize truncate">Carrier Partner</td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><BadgeCheck size={13} className="text-emerald-500 shrink-0" /><span>Platform Status</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-emerald-600 dark:text-emerald-400">Active &amp; Verified</td>
                    </tr>
                    <tr>
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-teal-500 shrink-0" /><span>Coverage</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-700 dark:text-slate-300">100% Insured Deals</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);
