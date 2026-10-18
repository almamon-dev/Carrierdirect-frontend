import React, { RefObject } from 'react';
import { Shield, CheckCircle2, UploadCloud, FileText } from 'lucide-react';
import Input from '@/components/ui/input';
import DatePicker from '@/components/ui/date-picker';

interface Props {
    isEditMode: boolean;
    insuranceProvider: string;
    setInsuranceProvider: (v: string) => void;
    policyNumber: string;
    setPolicyNumber: (v: string) => void;
    insuranceExpiryDate: string;
    setInsuranceExpiryDate: (v: string) => void;
    insuranceFile: File | null;
    insuranceDocRef: RefObject<HTMLInputElement | null>;
    insuranceCertificateUrl?: string;
    openDocPreview: (title: string, fileUrl?: string, fileType?: string) => void;
}

export const InsurancePolicyCard: React.FC<Props> = ({
    isEditMode,
    insuranceProvider,
    setInsuranceProvider,
    policyNumber,
    setPolicyNumber,
    insuranceExpiryDate,
    setInsuranceExpiryDate,
    insuranceFile,
    insuranceDocRef,
    insuranceCertificateUrl,
    openDocPreview,
}) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 min-h-[42px] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-[#FF4A1F]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                        Commercial Fleet & Auto Liability
                    </h3>
                </div>
                <span className="h-6.5 px-2 text-[10.5px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 rounded-[3px] border border-purple-200 dark:border-purple-800 inline-flex items-center gap-1 shrink-0">
                    <CheckCircle2 size={10.5} className="text-purple-600" />
                    <span>Active Policy</span>
                </span>
            </div>

            <div className="p-3.5 space-y-2 text-xs flex-1">
                {/* Provider */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Provider</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={insuranceProvider}
                            onChange={(e) => setInsuranceProvider(e.target.value)}
                            placeholder="e.g. Progressive Commercial"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {insuranceProvider || '—'}
                        </span>
                    )}
                </div>

                {/* Policy Number */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Policy Number</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={policyNumber}
                            onChange={(e) => setPolicyNumber(e.target.value)}
                            placeholder="e.g. POL-984018"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-mono font-bold text-purple-700 dark:text-purple-400 truncate">
                            {policyNumber || '—'}
                        </span>
                    )}
                </div>

                {/* Expiration Date */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Policy Expiry</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <DatePicker
                            value={insuranceExpiryDate}
                            onChange={(e) => setInsuranceExpiryDate(e.target.value)}
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {insuranceExpiryDate || '—'}
                        </span>
                    )}
                </div>

                {/* Coverage */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Coverage</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Commercial Auto Liability & Cargo
                    </span>
                </div>

                {/* Policy Document */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Policy Doc</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <div>
                        {isEditMode ? (
                            <button
                                type="button"
                                onClick={() => insuranceDocRef.current?.click()}
                                className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 border border-purple-200/60 rounded-[3px] cursor-pointer"
                            >
                                <UploadCloud size={11} />
                                <span>{insuranceFile ? insuranceFile.name : 'Choose Policy Doc'}</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() =>
                                    openDocPreview(
                                        'Fleet Insurance Certificate',
                                        insuranceCertificateUrl || '/documents/insurance-policy.pdf'
                                    )
                                }
                                className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 border border-purple-200/60 rounded-[3px] transition-colors cursor-pointer"
                            >
                                <FileText size={11} className="text-purple-600" />
                                <span>View Attachment</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
