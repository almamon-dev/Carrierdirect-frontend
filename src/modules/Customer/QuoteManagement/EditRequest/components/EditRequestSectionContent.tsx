import React from 'react';
import { BasicInfoSection } from '../../CreateRequest/components/sections/BasicInfoSection';
import { LocationsSection } from '../../CreateRequest/components/sections/LocationsSection';
import { LoadServicesSection } from '../../CreateRequest/components/sections/LoadServicesSection';
import { BudgetPreferencesSection } from '../../CreateRequest/components/sections/BudgetPreferencesSection';
import { AttachmentsNotesSection } from '../../CreateRequest/components/sections/AttachmentsNotesSection';
import { ReviewEditSection } from '../sections/ReviewEditSection';

interface EditRequestSectionContentProps {
    activeTab: string;
    formData: any;
    cleanId: string;
    servicesCount: number;
    isSubmitting: boolean;
    handleChange: (e: any) => void;
    handleSelectChange: (name: any, value: string) => void;
    handleCheckboxChange: (name: any, checked: boolean) => void;
    handleFileUpload: (field: string, file: File | null) => void;
    addDimensionRow: () => void;
    updateDimension: (id: number, field: string, value: string) => void;
    removeDimension: (id: number) => void;
    handleSaveUpdate: (e?: any) => Promise<void> | void;
}

export const EditRequestSectionContent: React.FC<EditRequestSectionContentProps> = ({
    activeTab,
    formData,
    cleanId,
    servicesCount,
    isSubmitting,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    handleFileUpload,
    addDimensionRow,
    updateDimension,
    removeDimension,
    handleSaveUpdate,
}) => {
    return (
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs w-full p-5 md:p-6 space-y-6">
            {activeTab === 'general' && (
                <BasicInfoSection
                    formData={formData}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                    requestNumber={`REQ-${cleanId}`}
                />
            )}

            {activeTab === 'locations' && (
                <LocationsSection
                    formData={formData}
                    handleChange={handleChange}
                />
            )}

            {activeTab === 'load' && (
                <LoadServicesSection
                    formData={formData}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                    handleCheckboxChange={handleCheckboxChange}
                    addDimensionRow={addDimensionRow}
                    updateDimension={updateDimension}
                    removeDimension={removeDimension}
                />
            )}

            {activeTab === 'preferences' && (
                <BudgetPreferencesSection
                    formData={formData}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                    handleCheckboxChange={handleCheckboxChange}
                />
            )}

            {activeTab === 'attachments' && (
                <AttachmentsNotesSection
                    formData={formData}
                    handleChange={handleChange}
                    handleFileUpload={handleFileUpload}
                />
            )}

            {activeTab === 'review' && (
                <ReviewEditSection
                    formData={formData}
                    servicesCount={servicesCount}
                    isSubmitting={isSubmitting}
                    onSaveUpdate={() => handleSaveUpdate()}
                />
            )}
        </div>
    );
};
