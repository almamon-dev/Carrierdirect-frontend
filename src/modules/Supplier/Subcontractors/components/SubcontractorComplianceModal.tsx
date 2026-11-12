import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    ShieldCheck,
    ShieldAlert,
    Clock,
    FileText,
    ExternalLink,
    Calendar,
    CheckCircle2,
    XCircle,
    Building2,
    User,
    AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/button';
import { Subcontractor, SubcontractorDriver } from '../types';

interface SubcontractorComplianceModalProps {
    isOpen: boolean;
    onClose: () => void;
    subcontractor?: Subcontractor | null;
    driver?: SubcontractorDriver | null;
    onVerify: (target: Subcontractor | SubcontractorDriver, action: 'verify' | 'reject', rejectionReason?: string) => Promise<void>;
}

export const SubcontractorComplianceModal: React.FC<SubcontractorComplianceModalProps> = ({
    isOpen,
    onClose,
    subcontractor,
    driver,
    onVerify,
}) => {
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || (!subcontractor && !driver)) return null;

    const isDriver = Boolean(driver);
    const target = isDriver ? driver! : subcontractor!;

    const title = isDriver
        ? `Driver Compliance: ${driver?.name}`
        : `Contractor Compliance: ${subcontractor?.name}`;

    const subtitle = isDriver
        ? `Driving Licence & Transport CPC / Insurance documents for ${driver?.name}`
        : `Insurance Certificate & Operating Licence verification for ${subcontractor?.name}`;

    const isVerified = Boolean(target.is_verified);

    // Calculate days remaining helper
    const getDaysRemainingInfo = (dateStr?: string) => {
        if (!dateStr) return { text: 'No date set', color: 'text-slate-400 bg-slate-50 border-slate-200', isExpired: false };
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiry = new Date(dateStr);
            expiry.setHours(0, 0, 0, 0);
            const diffTime = expiry.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                return {
                    text: `Expired ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'} ago`,
                    color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
                    isExpired: true,
                };
            }
            if (diffDays <= 7) {
                return {
                    text: `Expiring soon: ${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`,
                    color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
                    isExpired: false,
                };
            }
            return {
                text: `${diffDays} days remaining`,
                color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
                isExpired: false,
            };
        } catch {
            return { text: dateStr, color: 'text-slate-600 bg-slate-50 border-slate-200', isExpired: false };
        }
    };

    const formatDateClean = (dateStr?: string) => {
        if (!dateStr) return 'Not set';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    // Subcontractor doc details
    const subInsuranceFileUrl = subcontractor?.insurance_certificate_url || (subcontractor?.insurance_certificate_file ? `/${subcontractor.insurance_certificate_file}` : null);
    const subLicenseFileUrl = subcontractor?.operating_license_url || (subcontractor?.operating_license_file ? `/${subcontractor.operating_license_file}` : null);

    // Driver doc details
    const driverLicenseFileUrl = driver?.license_file_url || (driver?.license_file ? `/${driver.license_file}` : null);
    const driverInsuranceFileUrl = driver?.insurance_file_url || (driver?.insurance_file ? `/${driver.insurance_file}` : null);

    const doc1 = isDriver
        ? {
            title: 'Driving Licence',
            badge: driver?.license_status || 'pending',
            date: driver?.license_expiry_date,
            url: driverLicenseFileUrl,
            file: driver?.license_file,
            number: driver?.driver_license_number,
        }
        : {
            title: 'Insurance Certificate',
            badge: subcontractor?.insurance_status || 'pending',
            date: subcontractor?.insurance_expiry_date,
            url: subInsuranceFileUrl,
            file: subcontractor?.insurance_certificate_file,
            number: undefined,
        };

    const doc2 = isDriver
        ? {
            title: 'Driver Insurance / CPC',
            badge: driver?.insurance_status || 'pending',
            date: driver?.insurance_expiry_date,
            url: driverInsuranceFileUrl,
            file: driver?.insurance_file,
            number: undefined,
        }
        : {
            title: 'Operating Licence',
            badge: subcontractor?.operating_license_status || 'pending',
            date: subcontractor?.operating_license_expiry_date,
            url: subLicenseFileUrl,
            file: subcontractor?.operating_license_file,
            number: subcontractor?.company_registration,
        };

    const doc1Remaining = getDaysRemainingInfo(doc1.date);
    const doc2Remaining = getDaysRemainingInfo(doc2.date);

    const handleApprove = async () => {
        setIsSubmitting(true);
        try {
            await onVerify(target, 'verify');
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmReject = async () => {
        if (!rejectionReason.trim()) return;
        setIsSubmitting(true);
        try {
            await onVerify(target, 'reject', rejectionReason.trim());
            setIsRejecting(false);
            setRejectionReason('');
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-xl bg-white dark:bg-[#161a22] rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200 dark:border-orange-900/60 flex items-center justify-center shrink-0">
                            {isDriver ? <User size={18} /> : <Building2 size={18} />}
                        </div>
                        <div>
                            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {title}
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
                        title="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4 max-h-[78vh] overflow-y-auto custom-scrollbar">
                    {/* Overall Compliance Status Banner */}
                    <div className={`p-3.5 rounded-lg border flex items-center justify-between flex-wrap gap-2 ${
                        isVerified
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                            : (doc1Remaining.isExpired || doc2Remaining.isExpired
                                ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300'
                                : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300')
                    }`}>
                        <div className="flex items-center gap-2.5">
                            {isVerified ? (
                                <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : (
                                <ShieldAlert size={20} className={doc1Remaining.isExpired || doc2Remaining.isExpired ? 'text-rose-600' : 'text-amber-600'} />
                            )}
                            <div>
                                <h4 className="text-xs font-bold leading-tight">
                                    {isVerified
                                        ? 'Verified & Approved Partner'
                                        : (doc1Remaining.isExpired || doc2Remaining.isExpired
                                            ? 'Compliance Expired - Renewal Required'
                                            : 'Compliance Documents Awaiting Verification')}
                                </h4>
                                <p className="text-[11px] opacity-80 mt-0.5">
                                    {isVerified
                                        ? `Verified on ${formatDateClean(target.verified_at)}`
                                        : 'Supplier review required before assigning high-value freight.'}
                                </p>
                            </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isVerified
                                ? 'bg-emerald-600 text-white'
                                : (doc1Remaining.isExpired || doc2Remaining.isExpired ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white')
                        }`}>
                            {isVerified ? 'VERIFIED' : (doc1Remaining.isExpired || doc2Remaining.isExpired ? 'EXPIRED' : 'PENDING')}
                        </span>
                    </div>

                    {/* Rejection Reason if any */}
                    {target.rejection_reason && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg flex items-start gap-2 text-rose-800 dark:text-rose-300">
                            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <strong className="font-bold block">Previous Rejection Reason:</strong>
                                <span className="opacity-90">{target.rejection_reason}</span>
                            </div>
                        </div>
                    )}

                    {/* Document Cards Grid */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                            Compliance Document Records
                        </h4>

                        {/* Document 1 Card */}
                        <div className="p-3.5 bg-slate-50 dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#ff4a1f] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                                    <FileText size={18} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                            {doc1.title}
                                        </h5>
                                        {doc1.number && (
                                            <span className="text-[10px] font-mono font-semibold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded text-slate-700 dark:text-slate-300">
                                                {doc1.number}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <Calendar size={12} className="text-slate-400" />
                                        <span>Expiry: <strong className="font-semibold text-slate-800 dark:text-slate-200">{formatDateClean(doc1.date)}</strong></span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ml-1 ${doc1Remaining.color}`}>
                                            {doc1Remaining.text}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                {doc1.url ? (
                                    <a
                                        href={doc1.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[4px] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-bold text-[#ff4a1f] transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <span>View Document</span>
                                        <ExternalLink size={12} />
                                    </a>
                                ) : (
                                    <span className="text-[11px] text-slate-400 italic">
                                        No file uploaded
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Document 2 Card */}
                        <div className="p-3.5 bg-slate-50 dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#ff4a1f] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                                    <FileText size={18} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                            {doc2.title}
                                        </h5>
                                        {doc2.number && (
                                            <span className="text-[10px] font-mono font-semibold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded text-slate-700 dark:text-slate-300">
                                                {doc2.number}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <Calendar size={12} className="text-slate-400" />
                                        <span>Expiry: <strong className="font-semibold text-slate-800 dark:text-slate-200">{formatDateClean(doc2.date)}</strong></span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ml-1 ${doc2Remaining.color}`}>
                                            {doc2Remaining.text}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                {doc2.url ? (
                                    <a
                                        href={doc2.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[4px] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-bold text-[#ff4a1f] transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <span>View Document</span>
                                        <ExternalLink size={12} />
                                    </a>
                                ) : (
                                    <span className="text-[11px] text-slate-400 italic">
                                        No file uploaded
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Expiry Reminders Note */}
                    <div className="p-3 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-lg flex items-start gap-2.5 text-blue-900 dark:text-blue-200">
                        <Clock size={15} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] leading-relaxed">
                            <strong>Automated Compliance Expiry Watcher:</strong> The system automatically dispatches email reminders to the contractor's email address <strong>7 days</strong> and <strong>3 days</strong> prior to document expiration.
                        </p>
                    </div>

                    {/* Reject Reason Form if rejecting */}
                    {isRejecting && (
                        <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-lg space-y-2">
                            <label className="text-xs font-bold text-rose-800 dark:text-rose-300 block">
                                Rejection Reason (Required)
                            </label>
                            <textarea
                                rows={2}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explain why the documents are rejected (e.g. illegible copy, expired policy, mismatch)..."
                                className="w-full text-xs p-2 rounded border border-rose-300 dark:border-rose-800 bg-white dark:bg-[#12161c] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                            <div className="flex items-center justify-end gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setIsRejecting(false); setRejectionReason(''); }}
                                    className="h-7 px-2.5 text-xs font-semibold cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    disabled={!rejectionReason.trim() || isSubmitting}
                                    onClick={handleConfirmReject}
                                    className="h-7 px-3 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                                >
                                    {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#12161c]">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="h-8 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                        Close
                    </Button>

                    <div className="flex items-center gap-2">
                        {!isRejecting && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isSubmitting}
                                onClick={() => setIsRejecting(true)}
                                className="h-8 px-3 text-xs font-bold text-rose-600 hover:text-rose-700 border-rose-200 hover:border-rose-300 dark:border-rose-900 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer flex items-center gap-1.5"
                            >
                                <XCircle size={13} />
                                <span>Reject</span>
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            disabled={isSubmitting || isVerified}
                            onClick={handleApprove}
                            className={`h-8 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors ${
                                isVerified
                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                            }`}
                        >
                            <CheckCircle2 size={13} />
                            <span>{isVerified ? 'Verified & Approved' : 'Verify & Approve'}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SubcontractorComplianceModal;

