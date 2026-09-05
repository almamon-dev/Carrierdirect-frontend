import React from 'react';
import { BadgeCheck, FileText, PackageCheck, Shield } from 'lucide-react';
import { NegotiationItem } from '../../../types';

interface SidebarOverviewSectionProps {
    activeNegotiation: NegotiationItem;
    statusText: string;
    isAccepted: boolean;
    isRejected: boolean;
}

export const SidebarOverviewSection: React.FC<SidebarOverviewSectionProps> = ({
    activeNegotiation,
    statusText,
    isAccepted,
    isRejected,
}) => {
    const getStatusBadgeClass = () => {
        if (isAccepted) return 'text-emerald-700 bg-emerald-50 border-emerald-200/80';
        if (isRejected) return 'text-rose-700 bg-rose-50 border-rose-200/80';
        return 'text-amber-700 bg-amber-50 border-amber-200/60';
    };

    return (
        <div className="px-4 pb-3">
            <table className="w-full text-[11.5px] border-collapse">
                <tbody>
                    <tr className="border-b border-slate-100/80">
                        <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[105px]">
                            <div className="flex items-center gap-1.5">
                                <Shield size={12} className="text-slate-400 shrink-0" />
                                <span>Negotiation ID</span>
                            </div>
                        </td>
                        <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                        <td className="py-1.5 pl-1 font-bold text-[#FF4A1F] text-right">{activeNegotiation.id}</td>
                    </tr>
                    <tr className="border-b border-slate-100/80">
                        <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[105px]">
                            <div className="flex items-center gap-1.5">
                                <FileText size={12} className="text-slate-400 shrink-0" />
                                <span>RFQ Ref</span>
                            </div>
                        </td>
                        <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                        <td className="py-1.5 pl-1 font-medium text-slate-800 text-right">{activeNegotiation.requestId || 'REQ-8820'}</td>
                    </tr>
                    <tr className="border-b border-slate-100/80">
                        <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[105px]">
                            <div className="flex items-center gap-1.5">
                                <BadgeCheck size={12} className="text-slate-400 shrink-0" />
                                <span>Status</span>
                            </div>
                        </td>
                        <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                        <td className="py-1.5 pl-1 text-right">
                            <span className={`font-bold px-2 py-0.5 rounded text-[10.5px] border inline-block ${getStatusBadgeClass()}`}>
                                {statusText}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[105px]">
                            <div className="flex items-center gap-1.5">
                                <PackageCheck size={12} className="text-slate-400 shrink-0" />
                                <span>Cargo</span>
                            </div>
                        </td>
                        <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                        <td className="py-1.5 pl-1 font-medium text-slate-800 text-right leading-snug">
                            {activeNegotiation.palletType || 'Euro Pallets (12 Units)'}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
