import React, { RefObject } from 'react';
import { Briefcase, CheckCircle2, UploadCloud, FileText } from 'lucide-react';
import Input from '@/components/ui/input';
import DatePicker from '@/components/ui/date-picker';
import { StatusBadge } from '@/components/common/StatusBadge';

interface Props {
    isEditMode: boolean;
    nrcmeId: string;
    setNrcmeId: (v: string) => void;
    medicalExaminer: string;
    setMedicalExaminer: (v: string) => void;
    examDate: string;
    setExamDate: (v: string) => void;
    dotExpiry: string;
    setDotExpiry: (v: string) => void;
    mcsaForm: string;
    setMcsaForm: (v: string) => void;
    medicalFile: File | null;
    medicalDocRef: RefObject<HTMLInputElement | null>;
    certificateUrl?: string;
    openDocPreview: (title: string, fileUrl?: string, fileType?: string) => void;
}

export const DotMedicalCard: React.FC<Props> = ({
    isEditMode,
    nrcmeId,
    setNrcmeId,
    medicalExaminer,
    setMedicalExaminer,
    examDate,
    setExamDate,
    dotExpiry,
    setDotExpiry,
    mcsaForm,
    setMcsaForm,
    medicalFile,
    medicalDocRef,
    certificateUrl,
    openDocPreview,
}) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 min-h-[42px] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-[#FF4A1F]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                        DOT Medical Certificate
                    </h3>
                </div>
                <StatusBadge status="Active" label="NRCME Active" />
            </div>

            <div className="p-3.5 space-y-2 text-xs flex-1">
                {/* NRCME ID */}
                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">NRCME ID</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={nrcmeId}
                            onChange={(e) => setNrcmeId(e.target.value)}
                            placeholder="e.g. 5646456456"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
                            {nrcmeId || '—'}
                        </span>
                    )}
                </div>

                {/* Medical Examiner */}
                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Examiner</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={medicalExaminer}
                            onChange={(e) => setMedicalExaminer(e.target.value)}
                            placeholder="e.g. Dr. Jane Smith, MD"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {medicalExaminer || '—'}
                        </span>
                    )}
                </div>

                {/* Exam Date */}
                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Exam Date</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <DatePicker
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {examDate || '—'}
                        </span>
                    )}
                </div>

                {/* Medical Expiry */}
                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Card Expiry</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <DatePicker
                            value={dotExpiry}
                            onChange={(e) => setDotExpiry(e.target.value)}
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {dotExpiry || '—'}
                        </span>
                    )}
                </div>

                {/* MCSA Form */}
                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">MCSA Form</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={mcsaForm}
                            onChange={(e) => setMcsaForm(e.target.value)}
                            placeholder="e.g. MCSA-5876"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                            {mcsaForm || 'MCSA-5876'}
                        </span>
                    )}
                </div>

                {/* Documents */}
                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Medical Doc</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <div>
                        {isEditMode ? (
                            <button
                                type="button"
                                onClick={() => medicalDocRef.current?.click()}
                                className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/60 rounded-[3px] cursor-pointer"
                            >
                                <UploadCloud size={11} />
                                <span>{medicalFile ? medicalFile.name : 'Choose Medical Doc'}</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() =>
                                    openDocPreview(
                                        'DOT Medical Certificate (MCSA-5876)',
                                        certificateUrl || '/documents/medical-card.pdf'
                                    )
                                }
                                className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/60 rounded-[3px] transition-colors cursor-pointer"
                            >
                                <FileText size={11} className="text-emerald-600" />
                                <span>View Attachment</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
