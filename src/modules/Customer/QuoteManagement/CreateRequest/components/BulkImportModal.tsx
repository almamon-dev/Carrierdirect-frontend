import React, { useMemo, useEffect, useState } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { ImportModalHeader } from './bulkImport/ImportModalHeader';
import { ImportModalStepper } from './bulkImport/ImportModalStepper';
import { Step1Upload } from './bulkImport/Step1Upload';
import { Step2ZipUpload } from './bulkImport/Step2ZipUpload';
import { Step3ColumnPreview } from './bulkImport/Step3ColumnPreview';
import { Step4Confirmation } from './bulkImport/Step4Confirmation';
import { ImportModalFooter } from './bulkImport/ImportModalFooter';
import { FileProcessingScreen } from './bulkImport/FileProcessingScreen';
import { openAllowedValuesGuideWindow } from './bulkImport/allowedValuesGuide';
import { useBulkImportUpload } from '../hooks/useBulkImportUpload';

export interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    importType?: 'pdf' | 'csv';
    setImportType?: (type: 'csv' | 'pdf') => void;
    processingStep: 1 | 2 | 3 | 4;
    setProcessingStep: (step: 1 | 2 | 3 | 4 | ((prev: 1 | 2 | 3 | 4) => 1 | 2 | 3 | 4)) => void;
    processingFileName: string;
    setProcessingFileName?: (name: string) => void;
    uploadedZipName?: string;
    setUploadedZipName?: (name: string) => void;
    extractedData: any;
    setExtractedData?: (data: any) => void;
    pdfInputRef: React.RefObject<HTMLInputElement | null>;
    zipInputRef: React.RefObject<HTMLInputElement | null>;
    onConfirmImport: () => void | Promise<void>;
    onOpenInForm: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
    isOpen,
    onClose,
    importType = 'pdf',
    setImportType,
    processingStep,
    setProcessingStep,
    processingFileName,
    setProcessingFileName = () => {},
    uploadedZipName = '',
    setUploadedZipName = () => {},
    extractedData,
    setExtractedData = () => {},
    pdfInputRef,
    zipInputRef,
    onConfirmImport,
    onOpenInForm,
}) => {
    const isCsvMode = importType === 'csv';
    const showToast = useToastStore((state) => state.showToast);
    const { getOptions } = useDropdownOptions();

    const [isConfirming, setIsConfirming] = useState(false);
    const [confirmProgress, setConfirmProgress] = useState(0);
    const [confirmStatus, setConfirmStatus] = useState('');
    const [confirmStage, setConfirmStage] = useState(1);

    const dynamicVehicleTypes = useMemo(() => getOptions('vehicle_type'), [getOptions]);
    const dynamicLoadTypes = useMemo(() => getOptions('load_type'), [getOptions]);
    const dynamicServiceTypes = useMemo(() => getOptions('service_type'), [getOptions]);
    const dynamicPriorityTypes = useMemo(() => getOptions('priority'), [getOptions]);

    const {
        isDraggingMain, setIsDraggingMain, isDraggingZip, setIsDraggingZip,
        localFileSize, localZipSize, isProcessingFile,
        processingProgress, processingStatus, processingStage,
        internalFileInputRef, internalZipInputRef,
        handleProcessMainFile, handleProcessZipFile,
        handleClearMainFile, handleClearZip,
    } = useBulkImportUpload({ 
        setExtractedData, 
        setProcessingFileName, 
        setUploadedZipName, 
        uploadedZipName,
        setProcessingStep,
    });

    const isBusy = isConfirming && confirmProgress < 100;

    const handleModalClose = () => {
        setIsConfirming(false);
        setConfirmProgress(0);
        onClose();
    };

    const handleStepChange = (targetStep: 1 | 2 | 3 | 4) => {
        if (targetStep > 1 && !processingFileName && !extractedData) {
            showToast('Please select or upload a CSV or PDF file first.', 'info');
            return;
        }
        setProcessingStep(targetStep);
    };

    const handleExecuteConfirm = async () => {
        setIsConfirming(true);
        setConfirmProgress(0);
        setConfirmStage(1);
        setConfirmStatus('Validating shipment batch payload & parameters...');

        const startTime = Date.now();
        const minDurationMs = 3000;

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(92, Math.floor((elapsed / minDurationMs) * 90));
            setConfirmProgress(pct);

            if (pct < 25) {
                setConfirmStage(1);
                setConfirmStatus('Validating shipment batch payload & parameters...');
            } else if (pct < 60) {
                setConfirmStage(2);
                setConfirmStatus('Creating quote requests in database server...');
            } else if (pct < 90) {
                setConfirmStage(3);
                setConfirmStatus('Linking cargo routes, service types & attached documents...');
            }
        }, 30);

        try {
            await Promise.all([
                Promise.resolve(onConfirmImport()),
                new Promise((resolve) => setTimeout(resolve, minDurationMs)),
            ]);

            clearInterval(progressInterval);
            setConfirmProgress(100);
            setConfirmStage(4);
            setConfirmStatus('Quote requests created successfully! Finalizing marketplace broadcast...');
            // Keep modal open so user can review the log
        } catch (err: any) {
            console.error('Batch confirm error:', err);
            clearInterval(progressInterval);
            setIsConfirming(false);
        } finally {
            clearInterval(progressInterval);
        }
    };

    const activeRequest = useMemo(() => {
        if (extractedData?.rows && extractedData.rows.length > 0) return extractedData.rows[0];
        return extractedData || {};
    }, [extractedData]);

    const totalBatchBudget = useMemo(() => {
        if (extractedData?.rows && extractedData.rows.length > 0) {
            return extractedData.rows.reduce((sum: number, r: any) => sum + (Number(String(r.amount || r.budget || 0).replace(/[^0-9.]/g, '')) || 0), 0);
        }
        return Number(String(extractedData?.budget || extractedData?.amount || 0).replace(/[^0-9.]/g, '')) || 0;
    }, [extractedData]);

    const totalRequestsCount = useMemo(() => {
        if (extractedData?.rows && extractedData.rows.length > 0) return extractedData.rows.length;
        if (extractedData) return 1;
        return 0;
    }, [extractedData]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen && !isBusy) handleModalClose(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isBusy]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 font-sans backdrop-blur-xs transition-opacity duration-200"
            onClick={(e) => { if (e.target === e.currentTarget && !isBusy) handleModalClose(); }}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                <input ref={internalFileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.txt" className="hidden" onChange={(e) => { e.stopPropagation(); if (e.target.files?.[0]) handleProcessMainFile(e.target.files[0]); }} />
                <input ref={internalZipInputRef} type="file" accept=".zip" className="hidden" onChange={(e) => { e.stopPropagation(); if (e.target.files?.[0]) handleProcessZipFile(e.target.files[0]); }} />

                <ImportModalHeader isCsvMode={isCsvMode} processingStep={processingStep} setImportType={setImportType} onClose={isBusy ? undefined : handleModalClose} />
                <ImportModalStepper processingStep={processingStep} isCsvMode={isCsvMode} onStepChange={isBusy ? () => {} : handleStepChange} />

                <div className="p-4 md:p-5 max-h-[72vh] overflow-y-auto space-y-3 font-sans w-full">
                    {isConfirming ? (
                        <FileProcessingScreen
                            mode="confirm"
                            progress={confirmProgress}
                            statusText={confirmStatus}
                            totalRequestsCount={totalRequestsCount}
                            extractedData={extractedData}
                            onClose={handleModalClose}
                        />
                    ) : (
                        <>
                            {processingStep === 1 && (
                                <Step1Upload
                                    isCsvMode={isCsvMode}
                                    processingFileName={processingFileName}
                                    localFileSize={localFileSize}
                                    isDraggingMain={isDraggingMain}
                                    isProcessingFile={isProcessingFile}
                                    setIsDraggingMain={setIsDraggingMain}
                                    onFileSelect={handleProcessMainFile}
                                    onClearFile={handleClearMainFile}
                                    onOpenAllowedValuesGuide={() => openAllowedValuesGuideWindow({ dynamicVehicleTypes, dynamicLoadTypes, dynamicServiceTypes, dynamicPriorityTypes })}
                                    internalFileInputRef={internalFileInputRef}
                                    pdfInputRef={pdfInputRef}
                                />
                            )}

                            {processingStep === 2 && (
                                <Step2ZipUpload
                                    uploadedZipName={uploadedZipName}
                                    localZipSize={localZipSize}
                                    isDraggingZip={isDraggingZip}
                                    setIsDraggingZip={setIsDraggingZip}
                                    onZipSelect={handleProcessZipFile}
                                    onClearZip={handleClearZip}
                                    internalZipInputRef={internalZipInputRef}
                                    zipInputRef={zipInputRef}
                                />
                            )}

                            {processingStep === 3 && (
                                <Step3ColumnPreview
                                    extractedData={extractedData}
                                    processingFileName={processingFileName}
                                    activeRequest={activeRequest}
                                    onBackToStep1={() => setProcessingStep(1)}
                                />
                            )}

                            {processingStep === 4 && (
                                <Step4Confirmation
                                    extractedData={extractedData}
                                    processingFileName={processingFileName}
                                    localFileSize={localFileSize}
                                    uploadedZipName={uploadedZipName}
                                    localZipSize={localZipSize}
                                    totalBatchBudget={totalBatchBudget}
                                />
                            )}
                        </>
                    )}
                </div>

                {!isConfirming && (
                    <ImportModalFooter
                        processingStep={processingStep}
                        isCsvMode={isCsvMode}
                        isProcessing={isBusy}
                        onBack={() => setProcessingStep((prev) => ((prev as number) - 1) as any)}
                        onCancel={onClose}
                        onNext={() => handleStepChange(((processingStep as number) + 1) as any)}
                        onOpenInForm={onOpenInForm}
                        onConfirmImport={handleExecuteConfirm}
                    />
                )}
            </div>
        </div>
    );
};
