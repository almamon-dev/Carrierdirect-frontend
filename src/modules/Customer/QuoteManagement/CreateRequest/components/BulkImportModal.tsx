import React, { useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToastStore } from '@/stores/useToastStore';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { ImportModalHeader } from './bulkImport/ImportModalHeader';
import { ImportModalStepper } from './bulkImport/ImportModalStepper';
import { ImportModalFooter } from './bulkImport/ImportModalFooter';
import { FileProcessingScreen } from './bulkImport/FileProcessingScreen';
import { BulkImportStepBody } from './bulkImport/BulkImportStepBody';
import { useBulkImportUpload } from '../hooks/useBulkImportUpload';
import { useBulkImportConfirm } from '../hooks/useBulkImportConfirm';
import { BulkImportModalProps } from '../types/bulkImportTypes';

export type { BulkImportModalProps };

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
    isOpen, onClose, importType = 'pdf', setImportType,
    processingStep, setProcessingStep, processingFileName,
    setProcessingFileName = () => {}, uploadedZipName = '', setUploadedZipName = () => {},
    extractedData, setExtractedData = () => {}, pdfInputRef, zipInputRef,
    onConfirmImport, onOpenInForm,
}) => {
    const isCsvMode = importType === 'csv';
    const showToast = useToastStore((state) => state.showToast);
    const { getOptions } = useDropdownOptions();

    const dynamicVehicleTypes = useMemo(() => getOptions('vehicle_type'), [getOptions]);
    const dynamicLoadTypes = useMemo(() => getOptions('load_type'), [getOptions]);
    const dynamicServiceTypes = useMemo(() => getOptions('service_type'), [getOptions]);
    const dynamicPriorityTypes = useMemo(() => getOptions('priority'), [getOptions]);

    const {
        isDraggingMain, setIsDraggingMain, isDraggingZip, setIsDraggingZip,
        localFileSize, localZipSize, isProcessingFile,
        internalFileInputRef, internalZipInputRef,
        handleProcessMainFile, handleProcessZipFile, handleClearMainFile, handleClearZip,
    } = useBulkImportUpload({ 
        setExtractedData, setProcessingFileName, setUploadedZipName, 
        uploadedZipName, setProcessingStep,
    });

    const { isConfirming, confirmProgress, confirmStatus, handleExecuteConfirm, resetConfirm } = useBulkImportConfirm(onConfirmImport);
    const isBusy = isConfirming && confirmProgress < 100;

    const handleModalClose = () => { resetConfirm(); onClose(); };

    const handleStepChange = (targetStep: 1 | 2 | 3 | 4 | 5) => {
        if (targetStep > 2 && !processingFileName && !extractedData) {
            showToast('Please upload a CSV or PDF file in Step 2 first.', 'info');
            return;
        }
        setProcessingStep(targetStep);
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
        return extractedData ? 1 : 0;
    }, [extractedData]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen && !isBusy) handleModalClose(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isBusy]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 p-4 font-sans backdrop-blur-xs transition-opacity duration-200" onClick={(e) => { if (e.target === e.currentTarget && !isBusy) handleModalClose(); }}>
            <div className="bg-white dark:bg-slate-900 rounded-[5px] shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col relative" onClick={(e) => e.stopPropagation()}>
                <input ref={internalFileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.txt" className="hidden" onChange={(e) => { e.stopPropagation(); if (e.target.files?.[0]) handleProcessMainFile(e.target.files[0]); }} />
                <input ref={internalZipInputRef} type="file" accept=".zip" className="hidden" onChange={(e) => { e.stopPropagation(); if (e.target.files?.[0]) handleProcessZipFile(e.target.files[0]); }} />

                <ImportModalHeader isCsvMode={isCsvMode} processingStep={processingStep} setImportType={setImportType} onClose={isBusy ? undefined : handleModalClose} />
                <ImportModalStepper processingStep={processingStep} isCsvMode={isCsvMode} onStepChange={isBusy ? () => {} : handleStepChange} />

                <div className="p-4 md:p-5 max-h-[72vh] overflow-y-auto space-y-3 font-sans w-full">
                    {isConfirming ? (
                        <FileProcessingScreen mode="confirm" progress={confirmProgress} statusText={confirmStatus} totalRequestsCount={totalRequestsCount} extractedData={extractedData} onClose={handleModalClose} />
                    ) : (
                        <BulkImportStepBody
                            processingStep={processingStep} setProcessingStep={setProcessingStep}
                            isCsvMode={isCsvMode} processingFileName={processingFileName} localFileSize={localFileSize}
                            isDraggingMain={isDraggingMain} isProcessingFile={isProcessingFile} setIsDraggingMain={setIsDraggingMain}
                            handleProcessMainFile={handleProcessMainFile} handleClearMainFile={handleClearMainFile}
                            internalFileInputRef={internalFileInputRef} pdfInputRef={pdfInputRef}
                            uploadedZipName={uploadedZipName} localZipSize={localZipSize}
                            isDraggingZip={isDraggingZip} setIsDraggingZip={setIsDraggingZip}
                            handleProcessZipFile={handleProcessZipFile} handleClearZip={handleClearZip}
                            internalZipInputRef={internalZipInputRef} zipInputRef={zipInputRef}
                            extractedData={extractedData} activeRequest={activeRequest} totalBatchBudget={totalBatchBudget}
                            dynamicOptions={{ dynamicVehicleTypes, dynamicLoadTypes, dynamicServiceTypes, dynamicPriorityTypes }}
                        />
                    )}
                </div>

                {!isConfirming && (
                    <ImportModalFooter
                        processingStep={processingStep} isCsvMode={isCsvMode} isProcessing={isBusy}
                        onBack={() => setProcessingStep((prev) => ((prev as number) - 1) as any)}
                        onCancel={onClose}
                        onNext={() => handleStepChange(((processingStep as number) + 1) as any)}
                        onOpenInForm={onOpenInForm} onConfirmImport={handleExecuteConfirm}
                    />
                )}
            </div>
        </div>,
        document.body
    );
};
