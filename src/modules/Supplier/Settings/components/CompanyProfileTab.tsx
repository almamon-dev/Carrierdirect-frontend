import React from 'react';
import { ShieldCheck, Check, CheckCircle2, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { CompanyIdentityCard } from './CompanyIdentityCard';
import { CompanyLocationCard } from './CompanyLocationCard';
import { CompanyComplianceCard } from './CompanyComplianceCard';
import { useCompanyProfileState } from '../hooks/useCompanyProfileState';

export default function CompanyProfileTab() {
  const {
    isFetching,
    isLoading,
    isSaved,
    logoPreview,
    isUploadingLogo,
    formData,
    complianceData,
    isVerified,
    handleChange,
    handleSave,
    handleLogoUpload,
    handleLogoRemove,
  } = useCompanyProfileState();

  if (isFetching) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-[4px]" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[4px]" />
      </div>
    );
  }

  return (
    <form id="supplier-profile-form" onSubmit={handleSave} className="space-y-3 font-sans antialiased w-full">
      {/* Verification Status Banner */}
      <div className="p-2.5 sm:p-3 bg-white dark:bg-[#181a20] rounded-[4px] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${isVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`} />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Carrier Verification:</span>
          {isVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-[3px]">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Verified Active
            </span>
          ) : (
            <span className="inline-flex items-center text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-[3px]">
              Pending Compliance Review
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline font-medium">Carrier License & Compliance</span>
      </div>

      {/* Company Identity & Branding */}
      <CompanyIdentityCard
        formData={formData}
        logoPreview={logoPreview}
        isUploadingLogo={isUploadingLogo}
        handleChange={handleChange}
        handleLogoUpload={handleLogoUpload}
        handleLogoRemove={handleLogoRemove}
      />

      {/* Location & Business Address */}
      <CompanyLocationCard
        formData={formData}
        handleChange={handleChange}
      />

      {/* Compliance Documents Section */}
      <CompanyComplianceCard
        complianceData={complianceData}
      />

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold h-8.5 px-4 rounded-[4px] cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          <span>{isLoading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
        </Button>

        {isSaved && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" /> Profile saved successfully
          </span>
        )}
      </div>
    </form>
  );
}
