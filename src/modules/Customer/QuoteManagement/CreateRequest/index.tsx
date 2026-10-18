import React, { useState } from 'react';
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
import CreateRequestHeader from './components/CreateRequestHeader';
import CreateRequestSidebar, { CREATE_TABS } from './components/CreateRequestSidebar';

export { CREATE_TABS };

export default function CreateRequest() {
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
      <CreateRequestHeader
        isRepeatMode={isRepeatMode}
        repeatSource={repeatSource}
        onReset={resetForm}
      />

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

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <CreateRequestSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasTabError={hasTabError}
          servicesCount={servicesCount}
        />

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
          'Unlimited Single Quote Requests & RFQs',
          'Multi-Carrier Quote Comparison & Price Breakdown',
          'Direct Carrier Live Chat & Negotiation',
          'Real-time Order Tracking & Digital POD (Challan)',
          'Secure Stripe Escrow Payments & Card Checkout',
        ]}
      />
    </div>
  );
}
