import React from 'react';
import {
    FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, ChevronRight,
    Edit, Copy, ArrowLeft
} from 'lucide-react';
import Button from '@/components/ui/button';
import { QuoteViewSkeleton } from './components/QuoteViewSkeleton';
import { useViewQuoteRequest } from './hooks/useViewQuoteRequest';
import { ViewBasicInfo } from './sections/ViewBasicInfo';
import { ViewLocations } from './sections/ViewLocations';
import { ViewLoadServices } from './sections/ViewLoadServices';
import { ViewBudgetPreferences } from './sections/ViewBudgetPreferences';
import { ViewAttachmentsNotes } from './sections/ViewAttachmentsNotes';
import { ViewSummaryReview } from './sections/ViewSummaryReview';

const VIEW_TABS = [
    { id: 'general', label: 'Basic Information', icon: FileText },
    { id: 'locations', label: 'Pickup & Delivery', icon: MapPin },
    { id: 'load', label: 'Load & Services', icon: Truck },
    { id: 'preferences', label: 'Budget & Preferences', icon: Euro },
    { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
    { id: 'review', label: 'Review & Summary', icon: CheckCircle2 },
];

export default function ViewRequestForm() {
    const { cleanId, activeTab, setActiveTab, isLoading, formData, servicesCount, navigate } = useViewQuoteRequest();

    if (isLoading) {
        return <QuoteViewSkeleton activeTab={activeTab} />;
    }

    return (
        <div className="p-4 md:p-6 mx-auto bg-[#f8f9fa] dark:bg-[#12161b] min-h-screen pb-24 font-sans antialiased">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">

                    <div>
                        <h1 className="text-[18px] font-bold text-slate-900 dark:text-slate-100">
                            Quote Request REQ-{cleanId}
                        </h1>
                        <p className="text-[13px] font-medium text-[#ff4a1f] mt-0.5">
                            Detailed transportation quote request specifications and cargo requirements.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-[34px] text-[12px] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer font-medium"
                        onClick={() => navigate('/customer/quotes/create/new', { state: { repeatData: formData } })}
                    >
                        <Copy size={14} />
                        Repeat Quote
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        className="h-[34px] text-[12px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 cursor-pointer font-medium shadow-2xs"
                        onClick={() => navigate(`/customer/quotes/create/edit/${cleanId}`)}
                    >
                        <Edit size={14} />
                        Edit Request
                    </Button>
                </div>
            </div>

            {/* Layout */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-[260px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Specifications</h3>
                    </div>
                    <div className="flex flex-col">
                        {VIEW_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors border-l-[3px] border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 cursor-pointer ${isSelected
                                            ? 'border-l-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20 text-[#ff4a1f] font-semibold'
                                            : 'border-l-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                        <span>{tab.label}</span>
                                    </div>
                                    {isSelected && <ChevronRight size={14} className="text-[#ff4a1f]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs w-full p-5 md:p-6">
                    {activeTab === 'general' && <ViewBasicInfo formData={formData} cleanId={cleanId} />}
                    {activeTab === 'locations' && <ViewLocations formData={formData} />}
                    {activeTab === 'load' && <ViewLoadServices formData={formData} />}
                    {activeTab === 'preferences' && <ViewBudgetPreferences formData={formData} />}
                    {activeTab === 'files' && <ViewAttachmentsNotes formData={formData} />}
                    {activeTab === 'review' && <ViewSummaryReview formData={formData} cleanId={cleanId} servicesCount={servicesCount} />}
                </div>
            </div>
        </div>
    );
}
