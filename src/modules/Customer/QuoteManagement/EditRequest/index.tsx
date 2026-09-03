import React from 'react';
import { 
    FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, 
    Sparkles, Save, Loader2 
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/button';
import { decryptQuoteId, buildSecureQuoteUrl } from '@/utils/urlSecurity';
import { QuoteEditSkeleton } from './components/QuoteEditSkeleton';
import { useEditQuoteRequest } from './hooks/useEditQuoteRequest';
import { EditSidebar } from './components/EditSidebar';
import { BasicInfoSection } from '../CreateRequest/components/sections/BasicInfoSection';
import { LocationsSection } from '../CreateRequest/components/sections/LocationsSection';
import { LoadServicesSection } from '../CreateRequest/components/sections/LoadServicesSection';
import { BudgetPreferencesSection } from '../CreateRequest/components/sections/BudgetPreferencesSection';
import { AttachmentsNotesSection } from '../CreateRequest/components/sections/AttachmentsNotesSection';
import { ReviewEditSection } from './sections/ReviewEditSection';

const EDIT_TABS = [
    { id: 'general', label: 'Basic Information', icon: FileText },
    { id: 'locations', label: 'Pickup & Delivery', icon: MapPin },
    { id: 'load', label: 'Load & Services', icon: Truck },
    { id: 'preferences', label: 'Budget & Preferences', icon: Euro },
    { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle2 },
];

export default function EditRequest() {
    const navigate = useNavigate();
    const { id } = useParams();
    const cleanId = decryptQuoteId(id);
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'general';

    React.useEffect(() => {
        if (cleanId) {
            const isUnencrypted = id && !id.startsWith('q_');
            const hasSession = searchParams.has('session_key') || searchParams.has('sk');
            const hasEnc = searchParams.has('enc_key') || searchParams.has('ek');
            if (isUnencrypted || !hasSession || !hasEnc) {
                navigate(buildSecureQuoteUrl('edit', cleanId, activeTab), { replace: true });
            }
        }
    }, [cleanId, id, searchParams, navigate, activeTab]);

    const setActiveTab = (tab: string) => {
        navigate(buildSecureQuoteUrl('edit', cleanId, tab), { replace: true });
    };

    const {
        formData,
        isLoading,
        isSubmitting,
        servicesCount,
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
                        variant="primary"
                        size="sm"
                        className="h-[34px] text-[12px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 cursor-pointer font-medium shadow-2xs"
                        disabled={isSubmitting}
                        onClick={handleSaveUpdate}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={14} />
                                Save & Update
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <EditSidebar
                    tabs={EDIT_TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    formData={formData}
                    servicesCount={servicesCount}
                />

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

                    {activeTab === 'files' && (
                        <AttachmentsNotesSection
                            formData={formData}
                            handleChange={handleChange}
                            handleFileUpload={(field, file) => handleFileUpload(field, file ? ([file] as any) : null)}
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
    );
}
