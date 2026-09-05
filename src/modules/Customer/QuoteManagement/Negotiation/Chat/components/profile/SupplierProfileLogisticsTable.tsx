import React from 'react';
import { BadgeCheck, CreditCard, MapPin, PackageCheck, Shield, ShieldCheck, Truck } from 'lucide-react';

interface SupplierProfileLogisticsTableProps {
    route: string;
    vehicleType: string;
    palletType: string;
}

export const SupplierProfileLogisticsTable: React.FC<SupplierProfileLogisticsTableProps> = ({
    route,
    vehicleType,
    palletType,
}) => (
    <div className="space-y-4 min-w-0">
        <div>
            <h4 className="text-[12px] font-bold text-slate-700 dark:text-slate-200 mb-2 pb-1 border-b border-slate-100 uppercase tracking-wider text-xs">
                Logistics &amp; Freight Profile
            </h4>
            <table className="w-full text-[11.5px] border-collapse">
                <tbody>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><MapPin size={13} className="text-rose-500 shrink-0" /><span>Active Route</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100 leading-snug">{route}</td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><Truck size={13} className="text-blue-500 shrink-0" /><span>Required Vehicle</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">{vehicleType}</td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><PackageCheck size={13} className="text-amber-500 shrink-0" /><span>Standard Cargo</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">{palletType || 'Palletized Commercial Freight'}</td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><CreditCard size={13} className="text-purple-500 shrink-0" /><span>Payment Terms</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">Net 15 Days (CarrierDirect Escrow)</td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500 shrink-0" /><span>Payment History</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">100% Secured (0 Disputes)</td>
                    </tr>
                    <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><BadgeCheck size={13} className="text-emerald-600 shrink-0" /><span>Security Escrow</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-semibold text-emerald-700 dark:text-emerald-400">Guaranteed by Platform</td>
                    </tr>
                    <tr>
                        <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5"><Shield size={13} className="text-slate-400 shrink-0" /><span>Corporate ID</span></div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                        <td className="py-2 pl-2 font-medium text-slate-700 dark:text-slate-300">BIN-883921-EU</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);
