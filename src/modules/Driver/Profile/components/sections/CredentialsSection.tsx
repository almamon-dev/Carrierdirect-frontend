import React, { useState } from 'react';
import { 
    CreditCard, FileCheck, ShieldCheck, CheckCircle2, 
    FileText, Edit3, Save, X, ExternalLink
} from 'lucide-react';
import { DriverProfile } from '../../../types';
import Button from '@/components/ui/button';
import { DocumentPreviewModal } from '../DocumentPreviewModal';

interface Props {
    profile: DriverProfile;
}

const FormFieldRow = ({ 
    label, 
    required = false, 
    children, 
    isVerified = false, 
    valueText, 
    isEdit = false 
}: any) => (
    <div className={`flex ${isEdit ? 'items-start sm:items-center' : 'items-center'} gap-2`}>
        <div className={`w-[135px] sm:w-[145px] shrink-0 flex items-center justify-between text-[12.5px] ${isEdit ? 'font-bold text-slate-700 dark:text-slate-300 pt-1.5 sm:pt-0' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
            <span>{label} {required && isEdit && <span className="text-[#ff4a1f]">*</span>}</span>
            <span className="text-slate-300 dark:text-slate-600">:</span>
        </div>
        <div className="flex-1 relative min-w-0">
            {isEdit ? children : (
                <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 py-0.5 min-h-[26px] flex items-center break-words">
                    {valueText || '—'}
                </div>
            )}
            {isVerified && !isEdit && (
                <span className="inline-flex items-center text-emerald-500 ml-1.5" title="Verified">
                   <CheckCircle2 size={15} strokeWidth={2.5} />
                </span>
            )}
        </div>
    </div>
);

export const CredentialsSection: React.FC<Props> = ({ profile }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [previewDoc, setPreviewDoc] = useState<{
        isOpen: boolean;
        title: string;
        fileUrl: string;
        fileType?: string;
    }>({
        isOpen: false,
        title: '',
        fileUrl: '',
    });

    // Form state - CDL
    const cdlInfo = profile.cdlDetails || {} as any;
    const [cdlNumber, setCdlNumber] = useState(cdlInfo.cdlNumber || 'DL-4587-NY');
    const [licenseClass, setLicenseClass] = useState(cdlInfo.licenseClass || 'Class A');
    const [stateOfIssue, setStateOfIssue] = useState(cdlInfo.stateOfIssue || 'New York');
    const [issueDate, setIssueDate] = useState(cdlInfo.issueDate || '2025-01-01');
    const [expirationDate, setExpirationDate] = useState(cdlInfo.expirationDate || '2028-12-31');
    const [endorsements, setEndorsements] = useState(cdlInfo.endorsements || 'Air Brakes, Tanker, HazMat');

    // Form state - DOT Medical
    const dotInfo = profile.dotMedical || {} as any;
    const [nrcmeId, setNrcmeId] = useState(dotInfo.nrcmeRegistryId || '#88924018');
    const [medicalExaminer, setMedicalExaminer] = useState(dotInfo.medicalExaminer || 'Dr. Robert Hayes');
    const [examDate, setExamDate] = useState(dotInfo.examDate || '2025-01-10');
    const [dotExpiry, setDotExpiry] = useState(dotInfo.expiryDate || '2026-01-10');

    // Form state - Fleet Insurance
    const insuranceInfo = (profile as any).fleetInsurance || {} as any;
    const [insuranceProvider, setInsuranceProvider] = useState(insuranceInfo.provider || 'Progressive Commercial');
    const [policyNumber, setPolicyNumber] = useState(insuranceInfo.policyNumber || 'POL-99887766');
    const [insuranceEffectiveDate, setInsuranceEffectiveDate] = useState(insuranceInfo.effectiveDate || '2025-01-01');
    const [insuranceExpiryDate, setInsuranceExpiryDate] = useState(insuranceInfo.expiryDate || '2026-01-01');

    const openDocPreview = (title: string, fileUrl?: string, fileType?: string) => {
        setPreviewDoc({
            isOpen: true,
            title,
            fileUrl: fileUrl || '/sample-cdl.jpg',
            fileType
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsEditMode(false);
        }, 600);
    };

    const handleCancel = () => {
        // Reset back to initial values
        setCdlNumber(cdlInfo.cdlNumber || 'DL-4587-NY');
        setLicenseClass(cdlInfo.licenseClass || 'Class A');
        setStateOfIssue(cdlInfo.stateOfIssue || 'New York');
        setIssueDate(cdlInfo.issueDate || '2025-01-01');
        setExpirationDate(cdlInfo.expirationDate || '2028-12-31');
        setEndorsements(cdlInfo.endorsements || 'Air Brakes, Tanker, HazMat');

        setNrcmeId(dotInfo.nrcmeRegistryId || '#88924018');
        setMedicalExaminer(dotInfo.medicalExaminer || 'Dr. Robert Hayes');
        setExamDate(dotInfo.examDate || '2025-01-10');
        setDotExpiry(dotInfo.expiryDate || '2026-01-10');

        setInsuranceProvider(insuranceInfo.provider || 'Progressive Commercial');
        setPolicyNumber(insuranceInfo.policyNumber || 'POL-99887766');
        setInsuranceEffectiveDate(insuranceInfo.effectiveDate || '2025-01-01');
        setInsuranceExpiryDate(insuranceInfo.expiryDate || '2026-01-01');

        setIsEditMode(false);
    };

    const inputClasses = "w-full h-8 px-2.5 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded text-[13px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-orange-300 dark:focus:border-orange-800 focus:ring-1 focus:ring-orange-300 dark:focus:ring-orange-800 transition-shadow";

    return (
        <div className="animate-in fade-in duration-200">
            {/* Header with Title and Mode Actions */}
            <div className="flex items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/60 flex items-center justify-center text-[#ff4a1f]">
                        <CreditCard size={17} />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-extrabold text-slate-900 dark:text-white leading-tight">
                            Driver License & DOT Credentials
                        </h2>
                        <p className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400">
                            FMCSA regulatory compliance and valid active certifications
                        </p>
                    </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                    {!isEditMode ? (
                        <button
                            type="button"
                            onClick={() => setIsEditMode(true)}
                            className="h-8 px-3 text-[12px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <Edit3 size={13} className="text-[#ff4a1f]" />
                            <span>Edit Credentials</span>
                        </button>
                    ) : (
                        <span className="h-8 px-3 text-[11.5px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 rounded border border-orange-200/60 dark:border-orange-900/60 flex items-center">
                            Editing Mode
                        </span>
                    )}
                    <span className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded shadow-2xs">
                        <CheckCircle2 size={13} className="fill-emerald-500 text-white" />
                        <span>Verified & Compliant</span>
                    </span>
                </div>
            </div>

            <form onSubmit={handleSave} className="flex flex-col">
                
                {/* 1. CDL Info */}
                <div className="mb-3.5">
                    <div className="flex items-center justify-between mb-2 border-b border-slate-100 dark:border-slate-800/80 pb-1">
                        <h3 className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <CreditCard size={14} className="text-[#ff4a1f]" />
                            <span>Commercial Driver License (CDL)</span>
                        </h3>
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800/60 flex items-center gap-1">
                            <CheckCircle2 size={11} className="fill-blue-500 text-white" />
                            FMCSA Verified
                        </span>
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-x-8 ${isEditMode ? 'gap-y-2.5' : 'gap-y-1.5'}`}>
                        <FormFieldRow label="CDL Number" required isVerified valueText={cdlNumber} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={cdlNumber} 
                                onChange={(e) => setCdlNumber(e.target.value)} 
                                className={`${inputClasses} pr-10`} 
                                required
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="License Class" required valueText={licenseClass} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={licenseClass} 
                                onChange={(e) => setLicenseClass(e.target.value)} 
                                className={inputClasses} 
                                required
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="State of Issue" required valueText={stateOfIssue} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={stateOfIssue} 
                                onChange={(e) => setStateOfIssue(e.target.value)} 
                                className={inputClasses} 
                                required
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Endorsements" valueText={endorsements} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={endorsements} 
                                onChange={(e) => setEndorsements(e.target.value)} 
                                className={inputClasses} 
                            />
                        </FormFieldRow>

                        <FormFieldRow label="Issue Date" required valueText={issueDate} isEdit={isEditMode}>
                            <input 
                                type="date" 
                                value={issueDate} 
                                onChange={(e) => setIssueDate(e.target.value)} 
                                className={`${inputClasses} appearance-none cursor-pointer`} 
                                required
                            />
                        </FormFieldRow>

                        <FormFieldRow label="Expiration Date" required valueText={expirationDate} isEdit={isEditMode}>
                            <input 
                                type="date" 
                                value={expirationDate} 
                                onChange={(e) => setExpirationDate(e.target.value)} 
                                className={`${inputClasses} font-bold text-emerald-700 dark:text-emerald-400 appearance-none cursor-pointer`} 
                                required
                            />
                        </FormFieldRow>

                        <div className="lg:col-span-2 pt-0.5">
                            <FormFieldRow label="CDL Attachments" isEdit={isEditMode}>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openDocPreview('CDL Front Photo / Document', cdlInfo.cdlFrontUrl)}
                                        className="h-7 px-2.5 text-[12px] font-semibold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                    >
                                        <FileText size={12} className="text-[#ff4a1f]" />
                                        <span>View CDL Front</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openDocPreview('CDL Back Photo / Document', cdlInfo.cdlBackUrl)}
                                        className="h-7 px-2.5 text-[12px] font-semibold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                    >
                                        <FileText size={12} className="text-[#ff4a1f]" />
                                        <span>View CDL Back</span>
                                    </button>
                                </div>
                            </FormFieldRow>
                        </div>
                    </div>
                </div>

                {/* 2. DOT Medical Info */}
                <div className="mb-3.5">
                    <div className="flex items-center justify-between mb-2 border-b border-slate-100 dark:border-slate-800/80 pb-1">
                        <h3 className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <FileCheck size={14} className="text-emerald-600" />
                            <span>DOT Medical Examiner's Certificate</span>
                        </h3>
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                            <CheckCircle2 size={11} className="fill-emerald-500 text-white" />
                            Medical Active
                        </span>
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-x-8 ${isEditMode ? 'gap-y-2.5' : 'gap-y-1.5'}`}>
                        <FormFieldRow label="NRCME Registry ID" valueText={nrcmeId} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={nrcmeId} 
                                onChange={(e) => setNrcmeId(e.target.value)} 
                                className={inputClasses} 
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Medical Examiner" valueText={medicalExaminer} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={medicalExaminer} 
                                onChange={(e) => setMedicalExaminer(e.target.value)} 
                                className={inputClasses} 
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Exam Date" valueText={examDate} isEdit={isEditMode}>
                            <input 
                                type="date" 
                                value={examDate} 
                                onChange={(e) => setExamDate(e.target.value)} 
                                className={`${inputClasses} appearance-none cursor-pointer`} 
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Expiry Date" required valueText={dotExpiry} isEdit={isEditMode}>
                            <input 
                                type="date" 
                                value={dotExpiry} 
                                onChange={(e) => setDotExpiry(e.target.value)} 
                                className={`${inputClasses} font-bold text-emerald-700 dark:text-emerald-400 appearance-none cursor-pointer`} 
                                required
                            />
                        </FormFieldRow>

                        <div className="lg:col-span-2 pt-0.5">
                            <FormFieldRow label="DOT Certificate" isEdit={isEditMode}>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openDocPreview('DOT Medical Examiner Certificate', dotInfo.certificateUrl)}
                                        className="h-7 px-2.5 text-[12px] font-semibold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                    >
                                        <FileCheck size={12} className="text-emerald-600" />
                                        <span>View Medical Certificate</span>
                                    </button>
                                </div>
                            </FormFieldRow>
                        </div>
                    </div>
                </div>

                {/* 3. Fleet Insurance Info */}
                <div className="mb-2">
                    <div className="flex items-center justify-between mb-2 border-b border-slate-100 dark:border-slate-800/80 pb-1">
                        <h3 className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-purple-600" />
                            <span>Fleet Insurance</span>
                        </h3>
                        <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-200 dark:border-purple-800/60 flex items-center gap-1">
                            <CheckCircle2 size={11} className="fill-purple-500 text-white" />
                            Insured
                        </span>
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-x-8 ${isEditMode ? 'gap-y-2.5' : 'gap-y-1.5'}`}>
                        <FormFieldRow label="Insurance Provider" required valueText={insuranceProvider} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={insuranceProvider} 
                                onChange={(e) => setInsuranceProvider(e.target.value)} 
                                className={inputClasses} 
                                required
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Policy Number" required valueText={policyNumber} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={policyNumber} 
                                onChange={(e) => setPolicyNumber(e.target.value)} 
                                className={inputClasses} 
                                required
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Effective Date" valueText={insuranceEffectiveDate} isEdit={isEditMode}>
                            <input 
                                type="date" 
                                value={insuranceEffectiveDate} 
                                onChange={(e) => setInsuranceEffectiveDate(e.target.value)} 
                                className={`${inputClasses} appearance-none cursor-pointer`} 
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Expiration Date" required valueText={insuranceExpiryDate} isEdit={isEditMode}>
                            <input 
                                type="date" 
                                value={insuranceExpiryDate} 
                                onChange={(e) => setInsuranceExpiryDate(e.target.value)} 
                                className={`${inputClasses} font-bold text-emerald-700 dark:text-emerald-400 appearance-none cursor-pointer`} 
                                required
                            />
                        </FormFieldRow>

                        <div className="lg:col-span-2 pt-0.5">
                            <FormFieldRow label="Insurance Document" isEdit={isEditMode}>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openDocPreview('Fleet Insurance Certificate', '/documents/insurance.pdf')}
                                        className="h-7 px-2.5 text-[12px] font-semibold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                    >
                                        <FileText size={12} className="text-purple-600" />
                                        <span>View Policy Certificate</span>
                                    </button>
                                </div>
                            </FormFieldRow>
                        </div>
                    </div>
                </div>

                {/* 4. Actions (Only visible in Edit Mode) */}
                {isEditMode && (
                    <div className="flex justify-end pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 gap-2.5">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="h-8 px-4 text-[12.5px] font-bold bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-[4px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="h-8 px-4 text-[12.5px] font-bold bg-[#1a9f53] hover:bg-[#168a47] text-white rounded-[4px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save Credentials'}
                        </Button>
                    </div>
                )}
                
            </form>

            {/* Document Preview Modal */}
            <DocumentPreviewModal
                isOpen={previewDoc.isOpen}
                onClose={() => setPreviewDoc(prev => ({ ...prev, isOpen: false }))}
                title={previewDoc.title}
                fileUrl={previewDoc.fileUrl}
                fileType={previewDoc.fileType}
            />
        </div>
    );
};
