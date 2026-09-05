import React from 'react';
import { FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, Save, Loader2 } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/button';
import { decryptQuoteId, buildSecureQuoteUrl } from '@/utils/urlSecurity';
import { QuoteEditSkeleton } from './components/QuoteEditSkeleton';
import { useEditQuoteRequest } from './hooks/useEditQuoteRequest';
import { EditSidebar } from './components/EditSidebar';
import { EditRequestSectionContent } from './components/EditRequestSectionContent';

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

    const editState = useEditQuoteRequest(cleanId);

    if (editState.isLoading) {
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

                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="h-[34px] text-[12px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 cursor-pointer font-medium shadow-2xs"
                    disabled={editState.isSubmitting}
                    onClick={editState.handleSubmit}
                >
                    {editState.isSubmitting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save size={14} />
                            <span>Save & Update</span>
                        </>
                    )}
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <EditSidebar
                    tabs={EDIT_TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    formData={editState.formData}
                    servicesCount={editState.servicesCount}
                />

                <EditRequestSectionContent
                    activeTab={activeTab}
                    formData={editState.formData}
                    cleanId={cleanId}
                    servicesCount={editState.servicesCount}
                    isSubmitting={editState.isSubmitting}
                    handleChange={editState.handleChange}
                    handleSelectChange={editState.handleSelectChange}
                    handleCheckboxChange={editState.handleCheckboxChange}
                    handleFileUpload={(field, file) => editState.setFormData(prev => ({ ...prev, [field]: file }))}
                    addDimensionRow={editState.addDimension}
                    updateDimension={editState.updateDimension}
                    removeDimension={editState.removeDimension}
                    handleSaveUpdate={editState.handleSubmit}
                />
            </div>
        </div>
    );
}
