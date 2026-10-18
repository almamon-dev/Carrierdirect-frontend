import { Check, Clock, FileText, LogOut, RotateCw, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DriverComplianceData } from "../types";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import { SubmittedDocItem, SubmittedDocumentsCard } from "./SubmittedDocumentsCard";

interface VerificationUnderReviewViewProps {
    canDismiss?: boolean;
    onClose: () => void;
    complianceData?: DriverComplianceData;
    isRefreshing: boolean;
    refreshSuccess: boolean;
    handleRefresh: () => void;
    handleLogout: () => void;
}

export const VerificationUnderReviewView: React.FC<VerificationUnderReviewViewProps> = ({
    canDismiss = false,
    onClose,
    complianceData,
    isRefreshing,
    refreshSuccess,
    handleRefresh,
    handleLogout,
}) => {
    const [viewingDoc, setViewingDoc] = useState<SubmittedDocItem | null>(null);

    // Dynamic submitted documents list: only show documents that were actually uploaded
    const allDocs: (SubmittedDocItem & { isUploaded: boolean })[] = [
        {
            title: "Driving License (Front Side)",
            type: "license_front",
            url: complianceData?.licenseDocumentUrl,
            isUploaded: true,
        },
        {
            title: "Driving License (Back Side)",
            type: "license_back",
            url: complianceData?.licenseBackDocumentUrl,
            isUploaded: true,
        },
        {
            title: "Medical Certificate",
            type: "medical",
            url: complianceData?.medicalCardDocumentUrl,
            isUploaded: Boolean(complianceData?.medicalCardDocumentUrl),
        },
        {
            title: "Insurance Document",
            type: "insurance",
            url: complianceData?.insuranceDocumentUrl,
            isUploaded: Boolean(complianceData?.insuranceDocumentUrl),
        },
    ];

    const submittedDocs: SubmittedDocItem[] = allDocs.filter((doc) => doc.isUploaded);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs p-0 animate-in fade-in duration-300">
            <div className="fixed inset-0" onClick={canDismiss ? onClose : undefined} />

            <div className="bg-white dark:bg-[#181a20] rounded-t-3xl border-t border-slate-200/90 dark:border-slate-800 w-full max-w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out flex flex-col h-auto max-h-[92vh] md:max-h-[88vh] relative z-10 font-sans mx-auto">
                {/* Drag Handle */}
                <button
                    type="button"
                    onClick={canDismiss ? onClose : undefined}
                    disabled={!canDismiss}
                    className="w-full pt-2.5 pb-2 flex items-center justify-center bg-white dark:bg-[#181a20] shrink-0 cursor-pointer group hover:bg-slate-50 dark:hover:bg-[#1a1f26] transition-colors focus:outline-hidden"
                    title="Click to minimize or close"
                    aria-label="Minimize compliance modal"
                >
                    <div className="w-14 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-[#FF4A1F] dark:group-hover:bg-[#FF4A1F] transition-all group-hover:w-20 group-hover:scale-y-110" />
                </button>

                {/* Close Button */}
                {canDismiss && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 right-4 sm:right-6 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer z-20"
                        title="Close"
                    >
                        <X size={18} />
                    </button>
                )}

                {/* Two-Column Layout */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                    {/* Left Sidebar Stepper: Step 4 Active */}
                    <div className="w-full md:w-[260px] lg:w-[280px] bg-white dark:bg-[#181a20] border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-start shrink-0 overflow-y-auto">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                            Driver Verification
                        </h2>

                        <div className="space-y-4">
                            {[
                                { num: 1, title: "Personal Info" },
                                { num: 2, title: "Driver Details" },
                                { num: 3, title: "Documents & Submit" },
                            ].map((s) => (
                                <div key={s.num} className="flex items-start gap-3 text-left w-full">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500 text-white shadow-2xs shrink-0">
                                        <Check size={16} strokeWidth={2.8} />
                                    </div>
                                    <div className="pt-0.5 min-w-0 flex-1">
                                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 block truncate">
                                            {s.title}
                                        </span>
                                        <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                            Completed
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-start gap-3 px-3 py-2.5 rounded-xl text-left w-full bg-[#FFF5F2] dark:bg-orange-950/30 -mx-2.5">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[#FF4A1F] text-white shadow-2xs shrink-0">
                                    4
                                </div>
                                <div className="pt-0.5 min-w-0 flex-1">
                                    <span className="text-xs sm:text-sm font-bold text-[#FF4A1F] block truncate">
                                        Admin Approval
                                    </span>
                                    <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                        Under review
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#181a20] overflow-hidden">
                        {/* Header Bar */}
                        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#181a20] shrink-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF4A1F] dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200/80 dark:border-orange-800/60">
                                    <FileText size={12} />
                                    Complete Your Account
                                </span>
                                <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Step 4 of 4 • Admin Review
                                </span>
                            </div>
                        </div>

                        {/* Content Body: Two columns */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                {/* Left Column: Review Status Card */}
                                <div className="lg:col-span-7 flex flex-col">
                                    <div className="flex items-start gap-4 sm:gap-5">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[6px] bg-[#FFF5F0] dark:bg-orange-950/40 border border-[#FED7AA]/70 dark:border-orange-900/60 flex items-center justify-center text-[#FF4A1F] shrink-0">
                                            <Clock size={36} className="text-[#FF4A1F] stroke-[2.2]" />
                                        </div>
                                        <div className="pt-0.5">
                                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                                Your documents are being reviewed
                                            </h2>
                                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                                                Thank you! We have received your documents and our team is currently reviewing them. You will be notified once the verification is complete.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Notice Banner */}
                                    <div className="mt-5 bg-[#FFF8F5] dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/50 rounded-md p-4 sm:p-5 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#FF4A1F]">
                                                <div className="w-4 h-4 rounded-full bg-[#FF4A1F] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                                    i
                                                </div>
                                                <span className="text-xs sm:text-sm font-bold text-[#FF4A1F]">Under Review</span>
                                            </div>
                                            <p className="text-[11.5px] sm:text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-normal">
                                                This usually takes 48 hours. We'll notify you once it's approved.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Submitted Documents Card */}
                                <div className="lg:col-span-5">
                                    <SubmittedDocumentsCard
                                        documents={submittedDocs}
                                        onViewDoc={setViewingDoc}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Action Bar */}
                        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#181a20] shrink-0 flex items-center justify-end gap-2.5 sm:gap-3">
                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="py-2 px-4 bg-white dark:bg-[#161a22] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                                <RotateCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                                <span>{isRefreshing ? 'Checking...' : refreshSuccess ? 'Checked - In Review' : 'Check Status'}</span>
                            </button>

                            <Link
                                to="/driver/profile"
                                onClick={onClose}
                                className="py-2 px-4 bg-white dark:bg-[#161a22] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                                <span>View Profile</span>
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="py-2 px-5 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[4px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                                <LogOut size={13} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Document Preview Modal */}
                <DocumentPreviewModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />
            </div>
        </div>
    );
};
