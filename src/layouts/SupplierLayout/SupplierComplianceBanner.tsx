import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const SupplierComplianceBanner: React.FC = () => {
    return (
        <div className="px-3 sm:px-4 md:px-5 pt-3 sm:pt-4 md:pt-5 pb-0">
            <div className="bg-[#FFFBEB] dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/60 rounded-md px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs text-amber-950 dark:text-amber-200 shadow-2xs transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <ShieldAlert size={14} />
                        </div>
                        <p className="text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-200">
                            <strong className="font-bold text-slate-900 dark:text-white mr-1.5">Compliance Under Review:</strong>
                            <span>Your insurance and license documents are pending admin verification. Submitting quotes and accepting jobs will be unlocked once approved.</span>
                        </p>
                    </div>
                    <Link
                        to="/supplier/settings"
                        className="inline-flex items-center gap-1 text-[12px] font-bold text-[#ff4a1f] hover:text-[#d43810] dark:text-[#ff6643] hover:underline shrink-0 whitespace-nowrap pl-8 sm:pl-0"
                    >
                        <span>View Document Status</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
