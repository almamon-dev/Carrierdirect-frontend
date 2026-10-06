import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, ChevronRight, AlertCircle, FileText, MapPin, Truck, Euro, Paperclip, Send } from 'lucide-react';
import Button from '@/components/ui/button';
import { SubscriptionLockModal } from '@/components/modals';
import { QuotaReminderBanner } from '@/components';
import { useSubscriptionQuota } from '@/hooks/useSubscriptionQuota';
import { useCreateQuoteRequest } from './hooks/useCreateQuoteRequest';
import { BasicInfoSection } from './components/sections/BasicInfoSection';
import { LocationsSection } from './components/sections/LocationsSection';
import { LoadServicesSection } from './components/sections/LoadServicesSection';
import { BudgetPreferencesSection } from './components/sections/BudgetPreferencesSection';
import { AttachmentsNotesSection } from './components/sections/AttachmentsNotesSection';
import { ReviewSubmitSection } from './components/sections/ReviewSubmitSection';

export const CREATE_TABS = [
    { id: 'general', label: 'Basic Info', icon: FileText },
    { id: 'locations', label: 'Locations & Route', icon: MapPin },
    { id: 'load', label: 'Vehicle & Cargo Specs', icon: Truck },
    { id: 'preferences', label: 'Budget & Bidding', icon: Euro },
    { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
    { id: 'review', label: 'Review & Post', icon: Send },
];

export default function CreateRequest() {
    const navigate = useNavigate();
    const [quotaLockModalOpen, setQuotaLockModalOpen] = useState(false);

    const {
        formData, activeTab, setActiveTab, isSubmitting, submittingStatus,
        isLockModalOpen, setIsLockModalOpen, isRepeatMode, repeatSource, servicesCount,
        errors, touched, getFieldError, markTouched,
        resetForm, handleChange, handleSelectChange, handleCheckboxChange, handleLocationSelect,
        handleFileUpload, addDimensionRow, updateDimension, removeDimension, handleSubmit,
    } = useCreateQuoteRequest();

    const {
        isLoading: isQuotaLoading,
        isTrial,
        isExpired,
        isTrialLimitReached,
        quotesUsed,
        quotesLimit,
        daysRemaining,
        isPaidUnlimited,
        modalTitle,
        modalDescription,
        handleUpgradeRedirect,
    } = useSubscriptionQuota();

    const isModalOpen = isLockModalOpen || quotaLockModalOpen;
    const closeModal = () => {
        setIsLockModalOpen(false);
        setQuotaLockModalOpen(false);
    };

    const hasTabError = (tabId: string): boolean => {
        if (tabId === 'general') {
            return Boolean(
                (touched.requestTitle && errors.requestTitle) ||
                (touched.priority && errors.priority) ||
                (touched.shipmentType && errors.shipmentType) ||
                (touched.serviceType && errors.serviceType) ||
                (touched.pickupDate && errors.pickupDate) ||
                (touched.pickupTime && errors.pickupTime) ||
                (touched.deliveryDate && errors.deliveryDate)
            );
        }
        if (tabId === 'locations') {
            return Boolean(
                (touched.pickupContactName && errors.pickupContactName) ||
                (touched.pickupPhone && errors.pickupPhone) ||
                (touched.pickupCountry && errors.pickupCountry) ||
                (touched.pickupCity && errors.pickupCity) ||
                (touched.pickupAddress && errors.pickupAddress) ||
                (touched.deliveryContactName && errors.deliveryContactName) ||
                (touched.deliveryPhone && errors.deliveryPhone) ||
                (touched.deliveryCountry && errors.deliveryCountry) ||
                (touched.deliveryCity && errors.deliveryCity) ||
                (touched.deliveryAddress && errors.deliveryAddress)
            );
        }
        if (tabId === 'load') {
            return Boolean(
                (touched.vehicleType && errors.vehicleType) ||
                (touched.loadType && errors.loadType) ||
                (touched.weight && errors.weight) ||
                (touched.dimensions && errors.dimensions)
            );
        }
        return false;
    };

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] pb-24 animate-in fade-in duration-300">
            {/* Header with Title and Reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
                        {isRepeatMode ? `Repeat Quote Request (${repeatSource})` : 'Create New Quote Request'}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
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

            {/* Quota Reminder Banner below Header (Hidden on active unlimited paid plans) */}
            {(isQuotaLoading || !isPaidUnlimited) && (
                <QuotaReminderBanner
                    className="mb-5"
                    isLoading={isQuotaLoading}
                    title={isTrial ? '7-Day Free Trial Quota Reminder' : 'Free Plan Quota Reminder'}
                    quotaUsed={quotesUsed}
                    maxQuota={quotesLimit}
                    daysRemaining={daysRemaining}
                    onUpgradeClick={handleUpgradeRedirect}
                />
            )}

            {/* Layout: Sidebar on Left, Content on Right */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Sidebar Navigation */}
                <div className="w-full lg:w-[260px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider">
                            Categories
                        </h3>
                    </div>
                    <div className="flex flex-col">
                        {CREATE_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            const tabError = hasTabError(tab.id);

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors border-l-[3px] border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 cursor-pointer ${
                                        isSelected
                                            ? 'border-l-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20 text-[#ff4a1f] font-semibold'
                                            : tabError
                                                ? 'border-l-red-500 bg-red-50/30 dark:bg-red-950/10 text-red-600 dark:text-red-400'
                                                : 'border-l-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-[#ff4a1f]' : tabError ? 'text-red-500' : 'text-slate-400'} />
                                        <span>{tab.label}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {tabError && (
                                            <AlertCircle size={13} className="text-red-500 shrink-0" />
                                        )}
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
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs w-full p-5 md:p-6 space-y-6">
                    {activeTab === 'general' && (
                        <BasicInfoSection
                            formData={formData}
                            handleChange={handleChange}
                            handleSelectChange={handleSelectChange}
                            getFieldError={getFieldError}
                            markTouched={markTouched}
                        />
                    )}
                    {activeTab === 'locations' && (
                        <LocationsSection
                            formData={formData}
                            handleChange={handleChange}
                            onLocationSelect={handleLocationSelect}
                            getFieldError={getFieldError}
                            markTouched={markTouched}
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
                            getFieldError={getFieldError}
                            markTouched={markTouched}
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
                        <ReviewSubmitSection
                            formData={formData}
                            servicesCount={servicesCount}
                            isSubmitting={isSubmitting}
                            submittingStatus={submittingStatus}
                            onSubmit={(_e, targetStatus) => {
                                if (isTrialLimitReached || isExpired) {
                                    setQuotaLockModalOpen(true);
                                    return;
                                }
                                handleSubmit(targetStatus || 'active');
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Trial Limit / Subscription Expired Lock Modal */}
            <SubscriptionLockModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onUpgrade={handleUpgradeRedirect}
                userType="customer"
                title={modalTitle}
                description={modalDescription}
                featureName="Quote Request Quota"
                requiredPlan="Starter Shipper (€29/mo)"
                benefits={[
                    "Unlimited Single Quote Requests & RFQs",
                    "Multi-Carrier Quote Comparison & Price Breakdown",
                    "Direct Carrier Live Chat & Negotiation",
                    "Real-time Order Tracking & Digital POD (Challan)",
                    "Secure Stripe Escrow Payments & Card Checkout"
                ]}
            />
        </div>
    );
}
