import React from 'react';
import { 
    FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, 
    RotateCcw, Sparkles, ChevronRight 
} from 'lucide-react';
import Button from '@/components/ui/button';
import { SubscriptionLockModal } from '@/components/modals';
import { QuotaReminderBanner } from '@/components';
import { useCreateQuoteRequest } from './hooks/useCreateQuoteRequest';
import { BasicInfoSection } from './components/sections/BasicInfoSection';
import { LocationsSection } from './components/sections/LocationsSection';
import { LoadServicesSection } from './components/sections/LoadServicesSection';
import { BudgetPreferencesSection } from './components/sections/BudgetPreferencesSection';
import { AttachmentsNotesSection } from './components/sections/AttachmentsNotesSection';
import { ReviewSubmitSection } from './components/sections/ReviewSubmitSection';

const CREATE_TABS = [
    { id: 'general', label: 'Basic Information', icon: FileText },
    { id: 'locations', label: 'Pickup & Delivery', icon: MapPin },
    { id: 'load', label: 'Load & Services', icon: Truck },
    { id: 'preferences', label: 'Budget & Preferences', icon: Euro },
    { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle2 },
];

export default function CreateRequestForm() {
    const {
        formData, activeTab, setActiveTab, isSubmitting, submittingStatus,
        isLockModalOpen, setIsLockModalOpen, isRepeatMode, repeatSource, servicesCount,
        resetForm, handleChange, handleSelectChange,
        handleCheckboxChange, handleFileUpload, addDimensionRow, updateDimension,
        removeDimension, handleSubmit,
    } = useCreateQuoteRequest();

    return (
        <div className="p-4 md:p-6 mx-auto bg-[#f8f9fa] dark:bg-[#12161b] min-h-screen pb-24 font-sans antialiased">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 dark:text-slate-100">
                        {isRepeatMode ? `Repeat Quote Request (${repeatSource})` : 'Create New Quote Request'}
                    </h1>
                    <p className="text-[13px] font-medium text-[#ff4a1f] mt-0.5">
                        Fill in all specifications to receive competitive bids from verified carriers.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button" variant="outline" size="sm"
                        className="h-[34px] text-[12px] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer font-medium"
                        onClick={resetForm}
                    >
                        <RotateCcw size={14} />
                        Reset
                    </Button>
                </div>
            </div>

            {/* Quota Reminder Banner below Header */}
            <QuotaReminderBanner className="mb-5" />

            {/* Layout: Sidebar on Left, Content on Right */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Sidebar Navigation */}
                <div className="w-full lg:w-[260px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                            Categories
                        </h3>
                    </div>
                    <div className="flex flex-col">
                        {CREATE_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors border-l-[3px] border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 cursor-pointer ${
                                        isSelected
                                            ? 'border-l-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20 text-[#ff4a1f] font-semibold'
                                            : 'border-l-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                        <span>{tab.label}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {tab.id === 'load' && servicesCount > 0 && (
                                            <span className="bg-orange-100 dark:bg-orange-950/60 text-[#ff4a1f] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                                                {servicesCount}
                                            </span>
                                        )}
                                        {isSelected && <ChevronRight size={14} className="text-[#ff4a1f]" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Form Content Area */}
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs w-full p-5 md:p-6 space-y-6">
                    {activeTab === 'general' && (
                        <BasicInfoSection formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />
                    )}
                    {activeTab === 'locations' && (
                        <LocationsSection formData={formData} handleChange={handleChange} />
                    )}
                    {activeTab === 'load' && (
                        <LoadServicesSection
                            formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange}
                            handleCheckboxChange={handleCheckboxChange} addDimensionRow={addDimensionRow}
                            updateDimension={updateDimension} removeDimension={removeDimension}
                        />
                    )}
                    {activeTab === 'preferences' && (
                        <BudgetPreferencesSection
                            formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    )}
                    {activeTab === 'files' && (
                        <AttachmentsNotesSection
                            formData={formData} handleChange={handleChange}
                            handleFileUpload={(field, file) => handleFileUpload(field, file ? ([file] as any) : null)}
                        />
                    )}
                    {activeTab === 'review' && (
                        <ReviewSubmitSection
                            formData={formData}
                            servicesCount={servicesCount}
                            isSubmitting={isSubmitting}
                            submittingStatus={submittingStatus}
                            onSubmit={(_e, status) => handleSubmit(status || 'active')}
                        />
                    )}
                </div>
            </div>

            <SubscriptionLockModal isOpen={isLockModalOpen} onClose={() => setIsLockModalOpen(false)} />
        </div>
    );
}
