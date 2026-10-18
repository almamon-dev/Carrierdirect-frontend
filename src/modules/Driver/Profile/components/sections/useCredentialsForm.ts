import { useState, useRef, useEffect, FormEvent } from 'react';
import { DriverProfile } from '../../../types';
import { submitCredentials } from './credentialsSubmitHandler';

const formatDate = (val?: string | null): string => {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    return val;
};

export const licenseClassOptions = [
    { value: 'Class A', label: 'Class A - Heavy Tractor-Trailer combinations' },
    { value: 'Class B', label: 'Class B - Straight Truck & Heavy Single Vehicle' },
    { value: 'Class C', label: 'Class C - Hazardous / Passenger Transport' },
];

export function useCredentialsForm(profile: DriverProfile) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [cdlNumber, setCdlNumber] = useState('');
    const [stateOfIssue, setStateOfIssue] = useState('');
    const [licenseClass, setLicenseClass] = useState('Class A');
    const [issueDate, setIssueDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [endorsements, setEndorsements] = useState('');

    const [nrcmeId, setNrcmeId] = useState('');
    const [medicalExaminer, setMedicalExaminer] = useState('');
    const [examDate, setExamDate] = useState('');
    const [dotExpiry, setDotExpiry] = useState('');
    const [mcsaForm, setMcsaForm] = useState('MCSA-5876');

    const [insuranceProvider, setInsuranceProvider] = useState('');
    const [policyNumber, setPolicyNumber] = useState('');
    const [insuranceEffectiveDate, setInsuranceEffectiveDate] = useState('');
    const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');

    const [cdlFrontFile, setCdlFrontFile] = useState<File | null>(null);
    const [cdlBackFile, setCdlBackFile] = useState<File | null>(null);
    const [medicalFile, setMedicalFile] = useState<File | null>(null);
    const [mcsaFile, setMcsaFile] = useState<File | null>(null);
    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

    const cdlFrontRef = useRef<HTMLInputElement>(null);
    const cdlBackRef = useRef<HTMLInputElement>(null);
    const medicalDocRef = useRef<HTMLInputElement>(null);
    const mcsaDocRef = useRef<HTMLInputElement>(null);
    const insuranceDocRef = useRef<HTMLInputElement>(null);

    const [previewDoc, setPreviewDoc] = useState<{
        isOpen: boolean;
        title: string;
        fileUrl?: string;
        fileType?: string;
    }>({ isOpen: false, title: '' });

    const syncWithProfile = () => {
        const cdl = profile.cdlDetails || ({} as any);
        const dot = profile.dotMedical || ({} as any);
        const fleet = profile.fleetEquipment || ({} as any);

        setCdlNumber(cdl.cdlNumber || '');
        setLicenseClass(cdl.licenseClass || 'Class A');
        setStateOfIssue(cdl.stateOfIssue || '');
        setIssueDate(formatDate(cdl.issueDate));
        setExpirationDate(formatDate(cdl.expirationDate));
        setEndorsements(cdl.endorsements || '');

        setNrcmeId(dot.nrcmeRegistryId || '');
        setMedicalExaminer(dot.medicalExaminer || '');
        setExamDate(formatDate(dot.examDate));
        setDotExpiry(formatDate(dot.expiryDate));
        setMcsaForm(dot.mcsaForm || 'MCSA-5876');

        setInsuranceProvider(fleet.insuranceProvider || '');
        setPolicyNumber(fleet.insurancePolicyNumber || '');
        setInsuranceEffectiveDate(formatDate(fleet.insuranceEffectiveDate));
        setInsuranceExpiryDate(formatDate(fleet.insuranceExpiryDate));

        setCdlFrontFile(null);
        setCdlBackFile(null);
        setMedicalFile(null);
        setMcsaFile(null);
        setInsuranceFile(null);
    };

    useEffect(() => {
        syncWithProfile();
    }, [profile]);

    const openDocPreview = (title: string, fileUrl?: string, fileType?: string) => {
        if (!fileUrl) return;
        setPreviewDoc({ isOpen: true, title, fileUrl, fileType: fileType || 'Document PDF / Scan' });
    };

    const handleSave = async (e?: FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        try {
            await submitCredentials(
                {
                    cdlNumber,
                    stateOfIssue,
                    licenseClass,
                    issueDate,
                    expirationDate,
                    endorsements,
                    nrcmeId,
                    medicalExaminer,
                    examDate,
                    dotExpiry,
                    mcsaForm,
                    insuranceProvider,
                    policyNumber,
                    insuranceEffectiveDate,
                    insuranceExpiryDate,
                },
                { cdlFrontFile, cdlBackFile, medicalFile, mcsaFile, insuranceFile }
            );
            setIsEditMode(false);
        } catch (err) {
            console.error('Failed to update credentials:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        syncWithProfile();
        setIsEditMode(false);
    };

    return {
        isEditMode,
        setIsEditMode,
        isSaving,
        handleSave,
        handleCancel,
        cdlNumber,
        setCdlNumber,
        stateOfIssue,
        setStateOfIssue,
        licenseClass,
        setLicenseClass,
        issueDate,
        setIssueDate,
        expirationDate,
        setExpirationDate,
        endorsements,
        setEndorsements,
        cdlFrontFile,
        setCdlFrontFile,
        cdlBackFile,
        setCdlBackFile,
        cdlFrontRef,
        cdlBackRef,
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
        setMedicalFile,
        mcsaFile,
        setMcsaFile,
        medicalDocRef,
        mcsaDocRef,
        insuranceProvider,
        setInsuranceProvider,
        policyNumber,
        setPolicyNumber,
        insuranceEffectiveDate,
        setInsuranceEffectiveDate,
        insuranceExpiryDate,
        setInsuranceExpiryDate,
        insuranceFile,
        setInsuranceFile,
        insuranceDocRef,
        previewDoc,
        setPreviewDoc,
        openDocPreview,
    };
}
