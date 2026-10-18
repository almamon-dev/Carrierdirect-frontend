import React, { RefObject } from 'react';
import { Shield, CheckCircle2, UploadCloud, FileText } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import DatePicker from '@/components/ui/date-picker';
import { licenseClassOptions } from './useCredentialsForm';

interface Props {
    isEditMode: boolean;
    licenseClassBadge: string;
    cdlNumber: string;
    setCdlNumber: (v: string) => void;
    stateOfIssue: string;
    setStateOfIssue: (v: string) => void;
    licenseClass: string;
    setLicenseClass: (v: string) => void;
    expirationDate: string;
    setExpirationDate: (v: string) => void;
    endorsements: string;
    setEndorsements: (v: string) => void;
    cdlFrontFile: File | null;
    cdlBackFile: File | null;
    cdlFrontRef: RefObject<HTMLInputElement | null>;
    cdlBackRef: RefObject<HTMLInputElement | null>;
    cdlFrontUrl?: string;
    openDocPreview: (title: string, fileUrl?: string, fileType?: string) => void;
}

export const CdlLicenseCard: React.FC<Props> = ({
    isEditMode,
    licenseClassBadge,
    cdlNumber,
    setCdlNumber,
    stateOfIssue,
    setStateOfIssue,
    licenseClass,
    setLicenseClass,
    expirationDate,
    setExpirationDate,
    endorsements,
    setEndorsements,
    cdlFrontFile,
    cdlBackFile,
    cdlFrontRef,
    cdlBackRef,
    cdlFrontUrl,
    openDocPreview,
}) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 min-h-[42px] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-[#FF4A1F]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                        Commercial Driver License (CDL)
                    </h3>
                </div>
                <span className="h-6.5 px-2 text-[10.5px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-[3px] border border-blue-200 dark:border-blue-800 inline-flex items-center gap-1 shrink-0">
                    <CheckCircle2 size={10.5} className="text-blue-600" />
                    <span>{licenseClassBadge || 'Class A'}</span>
                </span>
            </div>

            <div className="p-3.5 space-y-2 text-xs flex-1">
                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">License #</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input value={cdlNumber} onChange={(e) => setCdlNumber(e.target.value)} placeholder="e.g. CDL-894210" className="h-7 text-xs" />
                    ) : (
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">{cdlNumber || '—'}</span>
                    )}
                </div>

                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Issue State</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input value={stateOfIssue} onChange={(e) => setStateOfIssue(e.target.value)} placeholder="e.g. TX / CA" className="h-7 text-xs" />
                    ) : (
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{stateOfIssue || '—'}</span>
                    )}
                </div>

                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Class</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Select
                            value={licenseClass}
                            onChange={(val) => {
                                const selected = typeof val === 'object' ? (val?.value ?? val?.target?.value ?? '') : (val || '');
                                setLicenseClass(selected);
                            }}
                            options={licenseClassOptions}
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate">{licenseClass || 'Class A'}</span>
                    )}
                </div>

                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Expiration</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <DatePicker value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className="h-7 text-xs" />
                    ) : (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{expirationDate || '—'}</span>
                    )}
                </div>

                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Endorsements</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input value={endorsements} onChange={(e) => setEndorsements(e.target.value)} placeholder="e.g. HazMat (H), Tanker (N)" className="h-7 text-xs" />
                    ) : (
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{endorsements || '—'}</span>
                    )}
                </div>

                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">License Doc</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <div className="flex flex-wrap gap-1.5">
                        {isEditMode ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => cdlFrontRef.current?.click()}
                                    className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 border border-blue-200/60 rounded-[3px] cursor-pointer"
                                >
                                    <UploadCloud size={11} />
                                    <span>{cdlFrontFile ? cdlFrontFile.name : 'Front Doc'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => cdlBackRef.current?.click()}
                                    className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 rounded-[3px] cursor-pointer"
                                >
                                    <UploadCloud size={11} />
                                    <span>{cdlBackFile ? cdlBackFile.name : 'Back Doc'}</span>
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => openDocPreview('Commercial Driver License (CDL)', cdlFrontUrl || '/documents/cdl-front.pdf')}
                                className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 border border-blue-200/60 rounded-[3px] transition-colors cursor-pointer"
                            >
                                <FileText size={11} className="text-blue-600" />
                                <span>View Attachment</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
