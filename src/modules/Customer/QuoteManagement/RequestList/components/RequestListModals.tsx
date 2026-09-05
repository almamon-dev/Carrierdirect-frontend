import React from 'react';
import { BulkImportModal } from '../../CreateRequest/components/BulkImportModal';
import { DeleteModal } from '@/components/modals';

interface RequestListModalsProps {
    wizard: any;
    deleteState: any;
}

export const RequestListModals: React.FC<RequestListModalsProps> = ({ wizard, deleteState }) => {
    return (
        <>
            <BulkImportModal
                isOpen={wizard.isProcessingModalOpen}
                onClose={() => wizard.setIsProcessingModalOpen(false)}
                importType={wizard.processingFileType}
                setImportType={wizard.setProcessingFileType}
                processingStep={wizard.processingStep}
                setProcessingStep={wizard.setProcessingStep}
                processingFileName={wizard.processingFileName}
                setProcessingFileName={wizard.setProcessingFileName}
                uploadedZipName={wizard.uploadedZipName}
                setUploadedZipName={wizard.setUploadedZipName}
                extractedData={wizard.extractedData}
                setExtractedData={wizard.setExtractedData}
                pdfInputRef={wizard.pdfInputRef}
                zipInputRef={wizard.zipInputRef}
                onConfirmImport={wizard.handleConfirmImport}
                onOpenInForm={wizard.handleOpenInForm}
            />

            <DeleteModal
                isOpen={deleteState.isDeleteModalOpen}
                onClose={() => deleteState.setIsDeleteModalOpen(false)}
                onDelete={deleteState.handleConfirmDelete}
                isLoading={deleteState.isDeleting}
                itemName={deleteState.selectedIdsToDelete ? `${deleteState.selectedIdsToDelete.length} Requests` : (deleteState.itemToDelete?.id || '')}
                itemType="Quote Request"
            />
        </>
    );
};
