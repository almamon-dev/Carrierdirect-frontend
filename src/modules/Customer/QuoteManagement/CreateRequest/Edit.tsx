/**
 * Customer Quote Management - Edit Quote Request Page
 * Modular form supporting full updates across Basic Information, Locations,
 * Cargo & Services, Budget Preferences, and File Attachments.
 */

import React from 'react';
import { 
    FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, 
    Sparkles, Save, Loader2 
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/button';
import { QuoteEditSkeleton } from './components/skeletons/QuoteEditSkeleton';
import { useEditQuoteRequest } from './hooks/useEditQuoteRequest';
import { EditSidebar } from './components/EditSidebar';
import { BasicInfoSection } from './components/sections/BasicInfoSection';
import { LocationsSection } from './components/sections/LocationsSection';
import { LoadServicesSection } from './components/sections/LoadServicesSection';
import { BudgetPreferencesSection } from './components/sections/BudgetPreferencesSection';
import { AttachmentsNotesSection } from './components/sections/AttachmentsNotesSection';
import { ReviewEditSection } from './components/sections/ReviewEditSection';

const EDIT_TABS = [
    { id: 'general', label: 'Basic Information', icon: FileText },
    { id: 'locations', label: 'Pickup & Delivery', icon: MapPin },
    { id: 'load', label: 'Load & Services', icon: Truck },
    { id: 'preferences', label: 'Budget & Preferences', icon: Euro },
    { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle2 },
];

export default function EditRequestForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const cleanId = id?.replace('REQ-', '') || id;
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'general';

    const setActiveTab = (tab: string) => {
        setSearchParams({ tab }, { replace: true });
    };

    // Custom hook handling state, API mutations, and form helpers
    const {
        formData,
        isLoading,
        isSubmitting,
        servicesCount,
        fillSampleData,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleFileUpload,
        addDimensionRow,
        updateDimension,
        removeDimension,
        handleSaveUpdate,
    } = useEditQuoteRequest(cleanId);

    if (isLoading) {
        return <QuoteEditSkeleton activeTab={activeTab} />;
    }

    return (
        <div className="p-4 md:p-6 mx-auto bg-[#f8f9fa] dark:bg-[#12161b] min-h-screen pb-24 font-sans antialiased">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 dark:text-slate-100">
                        Edit Quote Request REQ-{cleanId}
                    </h1>
                    <p className="text-[13px] font-medium text-[#ff4a1f] mt-0.5">
                        Update and refine the specifications for your transportation quote.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-[34px] text-[12px] border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 flex items-center gap-1.5 cursor-pointer font-medium"
                        onClick={fillSampleData}
                    >
                        <Sparkles size={14} className="text-amber-600 dark:text-amber-400" />
                        Auto Fill Sample Data
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-[34px] text-[13px] cursor-pointer" 
                        onClick={() => navigate('/customer/quotes/create')}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="h-[34px] text-[13px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
                        onClick={handleSaveUpdate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {isSubmitting ? 'Updating...' : 'Save & Update'}
                    </Button>
                </div>
            </div>

            {/* Layout: Left Sidebar Navigation + Right Active Tab Content */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <EditSidebar 
                    tabs={EDIT_TABS} 
                    activeTab={activeTab} 
                    onSelectTab={setActiveTab} 
                />

                <div className="flex-1 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-md shadow-sm w-full">
                    <div className="p-6 md:p-8">
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

                        {activeTab === 'files' && (
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
                                onSaveUpdate={handleSaveUpdate}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
