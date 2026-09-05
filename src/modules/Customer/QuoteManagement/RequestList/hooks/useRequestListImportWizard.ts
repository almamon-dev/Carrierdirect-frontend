import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';
import { buildBulkQuoteRequestsPayload } from '../utils/bulkConfirmHelpers';

export function useRequestListImportWizard(fetchQuoteRequests: (isManualRefresh?: boolean) => Promise<void>) {
    const navigate = useNavigate();
    const showToast = useToastStore(state => state.showToast);

    const csvInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const zipInputRef = useRef<HTMLInputElement>(null);

    const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
    const [processingStep, setProcessingStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [processingFileName, setProcessingFileName] = useState('');
    const [uploadedZipName, setUploadedZipName] = useState('');
    const [processingFileType, setProcessingFileType] = useState<'csv' | 'pdf'>('pdf');
    const [extractedData, setExtractedData] = useState<any>(null);

    const openImportWizard = (type: 'csv' | 'pdf' = 'pdf') => {
        setProcessingFileType(type);
        setProcessingFileName('');
        setUploadedZipName('');
        setExtractedData(null);
        setProcessingStep(1);
        setIsProcessingModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'csv' | 'pdf') => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setProcessingFileName(files[0].name);
            openImportWizard(type);
        }
        e.target.value = '';
    };

    const handleConfirmImport = async () => {
        if (!extractedData) return;
        try {
            const requestsPayload = buildBulkQuoteRequestsPayload(extractedData);
            const res = await apiClient.post(ENDPOINTS.CUSTOMER.QUOTE_REQUESTS_BULK_CONFIRM, {
                requests: requestsPayload,
                attachment_path: extractedData.attachment_path || null,
            });
            const count = res.data?.data?.total_created || requestsPayload.length;
            showToast(`🎉 Successfully created ${count} quote request(s) in database!`, 'success');
            fetchQuoteRequests(true);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to save requests to database.';
            showToast(`Error saving to database: ${msg}`, 'error');
            throw err;
        }
    };

    const handleOpenInForm = () => {
        if (extractedData) {
            setIsProcessingModalOpen(false);
            navigate('/customer/quotes/create/new', { state: { repeatData: extractedData } });
        }
    };

    return {
        csvInputRef,
        pdfInputRef,
        zipInputRef,
        isProcessingModalOpen,
        setIsProcessingModalOpen,
        processingStep,
        setProcessingStep,
        processingFileName,
        setProcessingFileName,
        uploadedZipName,
        setUploadedZipName,
        processingFileType,
        setProcessingFileType,
        extractedData,
        setExtractedData,
        openImportWizard,
        handleFileChange,
        handleConfirmImport,
        handleOpenInForm,
    };
}
