import React from 'react';
import {
    Building2,
    Shield,
    Star,
    PackageCheck,
    Truck,
    Clock,
    UserCheck,
    BadgeCheck,
    ShieldCheck,
} from 'lucide-react';
import { ConversationUser } from '@/services/messageService';

interface GeneralChatDetailsProfileTabProps {
    partner: ConversationUser;
    isSupplier: boolean;
    roleLabel: string;
}

export const GeneralChatDetailsProfileTab: React.FC<GeneralChatDetailsProfileTabProps> = ({
    partner,
    isSupplier,
    roleLabel,
}) => {
    return (
        <div className="space-y-4 animate-in fade-in duration-150">
            {/* Partner Details Section */}
            <div className="space-y-2">
                <h4 className="text-[12px] font-bold text-slate-900 dark:text-slate-100 pb-1 border-b border-slate-100 dark:border-slate-800">
                    Partner Details
                </h4>

                <table className="w-full text-[11.5px] border-collapse">
                    <tbody>
                        {partner.company_name && (
                            <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                    <div className="flex items-center gap-1.5">
                                        <Building2 size={13} className="text-slate-400 shrink-0" />
                                        <span>Company</span>
                                    </div>
                                </td>
                                <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                                <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100 truncate">
                                    {partner.company_name}
                                </td>
                            </tr>
                        )}

                        <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                            <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                <div className="flex items-center gap-1.5">
                                    <Shield size={13} className="text-slate-400 shrink-0" />
                                    <span>Platform ID</span>
                                </div>
                            </td>
                            <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                            <td className="py-2 pl-2 font-mono font-bold text-[#FF4A1F]">
                                #CD-{isSupplier ? 'SUP' : 'CUS'}-{String(partner.id).padStart(4, '0')}
                            </td>
                        </tr>

                        <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                            <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                <div className="flex items-center gap-1.5">
                                    <Star size={13} className="text-amber-500 fill-amber-400 shrink-0" />
                                    <span>Rating</span>
                                </div>
                            </td>
                            <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                            <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">
                                <span className="text-amber-500 font-bold">
                                    {partner.rating !== undefined && partner.rating !== null && Number(partner.rating) > 0
                                        ? Number(partner.rating).toFixed(1)
                                        : partner.reviews_count ? '0.0' : '5.0'}
                                </span>{' '}
                                <span className="text-[10px] text-slate-400 font-normal">
                                    ({partner.reviews_count ?? (partner as any).reviews ?? 0} reviews)
                                </span>
                            </td>
                        </tr>

                        <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                            <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                <div className="flex items-center gap-1.5">
                                    <PackageCheck size={13} className="text-emerald-500 shrink-0" />
                                    <span>Orders Done</span>
                                </div>
                            </td>
                            <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                            <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">
                                {isSupplier ? '94+' : '42+'}{' '}
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 ml-1">
                                    (100% Fulfilled)
                                </span>
                            </td>
                        </tr>

                        <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                            <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                <div className="flex items-center gap-1.5">
                                    <Truck size={13} className="text-blue-500 shrink-0" />
                                    <span>On-Time Rate</span>
                                </div>
                            </td>
                            <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                            <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">
                                99.2%{' '}
                                <span className="text-[10px] text-slate-400 font-normal ml-1">
                                    (Reliable)
                                </span>
                            </td>
                        </tr>

                        <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                            <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={13} className="text-orange-500 shrink-0" />
                                    <span>Response Time</span>
                                </div>
                            </td>
                            <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                            <td className="py-2 pl-2 font-semibold text-slate-800 dark:text-slate-100">
                                &lt; 15 mins{' '}
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 ml-1">
                                    (Fast)
                                </span>
                            </td>
                        </tr>

                        <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                            <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                <div className="flex items-center gap-1.5">
                                    <UserCheck size={13} className="text-slate-400 shrink-0" />
                                    <span>Account Type</span>
                                </div>
                            </td>
                            <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                            <td className="py-2 pl-2 font-medium text-slate-800 dark:text-slate-200 capitalize truncate">
                                {roleLabel}
                            </td>
                        </tr>

                        <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                            <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                <div className="flex items-center gap-1.5">
                                    <BadgeCheck size={13} className="text-emerald-500 shrink-0" />
                                    <span>Platform Status</span>
                                </div>
                            </td>
                            <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                            <td className="py-2 pl-2 font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                                Active &amp; Verified
                            </td>
                        </tr>

                        <tr>
                            <td className="py-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[130px]">
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck size={13} className="text-teal-500 shrink-0" />
                                    <span>Coverage</span>
                                </div>
                            </td>
                            <td className="py-2 text-slate-400 font-bold text-center w-[24px] select-none">:</td>
                            <td className="py-2 pl-2 font-semibold text-slate-700 dark:text-slate-300">
                                100% Insured Deals
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Protection Notice */}
            <div className="p-3 rounded-[4px] bg-slate-50 dark:bg-[#181d24] border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    <Shield size={13} />
                    <span>Platform Protected Communication</span>
                </div>
                <p className="text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                    All quote requests, shipments, and messages transmitted inside CarrierDirect are secured with guaranteed payment and dispute protection.
                </p>
            </div>
        </div>
    );
};
