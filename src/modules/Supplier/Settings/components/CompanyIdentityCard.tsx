import React from 'react';
import { Building2, Camera, Trash2, Loader2, Lock } from 'lucide-react';
import Input from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CompanyIdentityCardProps {
  formData: {
    fullName: string;
    companyName: string;
    email: string;
    phone: string;
    country: string;
  };
  logoPreview: string | null;
  isUploadingLogo: boolean;
  handleChange: (field: string, value: string) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoRemove: () => void;
}

export function CompanyIdentityCard({
  formData,
  logoPreview,
  isUploadingLogo,
  handleChange,
  handleLogoUpload,
  handleLogoRemove,
}: CompanyIdentityCardProps) {
  return (
    <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
      <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
        <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
          <Building2 className="w-3.5 h-3.5 text-[#ff4a1f]" />
          Company Identity & Branding
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3.5 sm:p-4 space-y-4">
        {/* Logo Upload Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 sm:p-4 bg-slate-50/70 dark:bg-[#14181f] rounded-[6px] border border-slate-200/80 dark:border-slate-800">
          {/* Logo Preview Box */}
          <div className={`relative group shrink-0 w-20 h-20 rounded-xl bg-white dark:bg-[#1e2329] ${logoPreview ? 'border border-slate-200 dark:border-slate-700' : 'border-2 border-dashed border-slate-300 dark:border-slate-700'} flex items-center justify-center overflow-hidden shadow-2xs`}>
            {logoPreview ? (
              <img key={logoPreview} src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <Building2 className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-[#ff4a1f] transition-colors" />
              </div>
            )}
            {isUploadingLogo && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Logo Info & Actions */}
          <div className="flex-1 min-w-0 space-y-2.5">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Company Brand Logo</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Shown on your quotes, proposals, dispatched orders, and customer invoices.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <label className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all">
                <Camera size={13} />
                <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                <input 
                  type="file" 
                  accept="image/png,image/jpeg,image/jpg,image/webp" 
                  onChange={handleLogoUpload} 
                  className="hidden" 
                />
              </label>

              {logoPreview && (
                <button
                  type="button"
                  onClick={handleLogoRemove}
                  disabled={isUploadingLogo}
                  className="h-8 px-3 bg-white dark:bg-[#1e2329] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-300 text-xs font-semibold rounded-[4px] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              )}

              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                PNG, JPG, or WEBP (Max 5MB)
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Contact Person / Full Name *"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="e.g. John Doe"
            required
          />

          <Input
            label="Legal Company / Business Name *"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="e.g. Acme Freight Logistics LLC"
            required
          />

          <div className="relative">
            <Input
              label="Primary Account Email *"
              type="email"
              value={formData.email}
              disabled
              placeholder="carrier@company.com"
            />
            <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-[34px]" />
          </div>

          <Input
            label="Dispatch Phone Number *"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            required
          />

          <Input
            label="Country *"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="e.g. Germany or United States"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
