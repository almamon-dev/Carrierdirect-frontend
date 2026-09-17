import React, { useState, useEffect } from 'react';
import { Building2, Upload, MapPin, ShieldCheck, FileText, CheckCircle2, Paperclip, Eye, Loader2, Check, Lock, Camera } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import apiClient from '@/lib/axios';
import { TOKEN_CONFIG } from '@/config/auth';
import { useToastStore } from '@/stores/useToastStore';

export default function CompanyProfileTab() {
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    address: '',
  });

  const [complianceData, setComplianceData] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsFetching(true);
    try {
      const res = await apiClient.get('/supplier/profile');
      const data = res?.data?.data || res?.data || res || {};
      
      setFormData({
        companyName: data.company_name || data.name || '',
        email: data.email || '',
        phone: data.phone_number || '',
        country: data.country || '',
        state: data.state || '',
        city: data.city || '',
        zipCode: data.zip_code || '',
        address: data.business_address || '',
      });

      if (data.profile_picture) {
        setLogoPreview(data.profile_picture);
      }

      if (data.compliance) {
        setComplianceData(data.compliance);
      }
      setIsVerified(!!data.is_verified || !!data.compliance?.is_verified);

      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
      const currentUser = rawUser ? JSON.parse(rawUser) : {};
      localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify({ ...currentUser, ...data }));
    } catch (err: any) {
      console.error('Fetch profile error:', err);
      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
      if (rawUser) {
        const u = JSON.parse(rawUser);
        setFormData({
          companyName: u.company_name || u.name || '',
          email: u.email || '',
          phone: u.phone_number || '',
          country: u.country || '',
          state: u.state || '',
          city: u.city || '',
          zipCode: u.zip_code || '',
          address: u.business_address || '',
        });
        if (u.profile_picture) setLogoPreview(u.profile_picture);
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: formData.companyName,
        company_name: formData.companyName,
        phone_number: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zip_code: formData.zipCode,
        business_address: formData.address,
      };

      const res = await apiClient.post('/supplier/profile', payload);
      const updatedProfile = res?.data?.data || res?.data || payload;

      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
      const currentUser = rawUser ? JSON.parse(rawUser) : {};
      localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify({ ...currentUser, ...updatedProfile }));

      setIsSaved(true);
      useToastStore.getState().showToast('Profile updated successfully!', 'success');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      console.error('Update profile error:', err);
      const msg = err.data?.message || err.message || 'Failed to update profile.';
      useToastStore.getState().showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        useToastStore.getState().showToast('Logo file size must be less than 5MB', 'error');
        return;
      }
      setLogoPreview(URL.createObjectURL(file));

      setIsUploadingLogo(true);
      const uploadData = new FormData();
      uploadData.append('logo', file);
      try {
        const res = await apiClient.post('/supplier/profile/logo', uploadData);
        useToastStore.getState().showToast('Company logo updated successfully!', 'success');
        if (res.data?.data?.profile_picture) {
          setLogoPreview(res.data.data.profile_picture);
        }
      } catch (err: any) {
        useToastStore.getState().showToast(err.message || 'Failed to upload logo', 'error');
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

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
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
        <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Building2 className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Company Identity & Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 space-y-4">
          
          {/* Logo Upload Row */}
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <div className="relative group shrink-0">
              <div className="w-13 h-13 rounded-[4px] bg-slate-50 dark:bg-[#12161c] border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#ff4a1f]">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 dark:text-slate-500 group-hover:text-[#ff4a1f]">
                    <Building2 className="w-5 h-5" />
                    <span className="text-[8.5px] font-semibold mt-0.5">Logo</span>
                  </div>
                )}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/png,image/jpeg,image/jpg,image/webp" 
                onChange={handleLogoUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                title="Upload company logo"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Company Logo</label>
                <label className="text-[11px] font-bold text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-1">
                  <Camera size={12} />
                  <span>Upload New</span>
                  <input 
                    type="file" 
                    accept="image/png,image/jpeg,image/jpg,image/webp" 
                    onChange={handleLogoUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Shown on quotes, proposals and dispatch invoices (PNG or JPG under 5MB).
              </p>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* Location & Business Address */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
        <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <MapPin className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Headquarters & Business Address
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="State / Province"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="e.g. Bavaria"
            />

            <Input
              label="City *"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. Munich"
              required
            />

            <Input
              label="Zip / Postal Code *"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              placeholder="e.g. 80331"
              required
            />

            <div className="sm:col-span-3">
              <Input
                label="Full Street Address *"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Street address, building, suite/unit"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Documents Section */}
      {complianceData && (
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
          <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
              <Paperclip className="w-3.5 h-3.5 text-[#ff4a1f]" />
              Compliance & License Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {complianceData.insurance && (
              <div className="p-2.5 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Insurance Policy</h4>
                    <p className="text-[10.5px] text-slate-400 capitalize">Status: {complianceData.insurance.status || 'Verified'}</p>
                  </div>
                </div>
                {complianceData.insurance.document_url && (
                  <a
                    href={complianceData.insurance.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-6.5 px-2.5 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 shrink-0 shadow-2xs"
                  >
                    <Eye className="w-3 h-3" /> View
                  </a>
                )}
              </div>
            )}
            {complianceData.license && (
              <div className="p-2.5 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Carrier Operating License</h4>
                    <p className="text-[10.5px] text-slate-400 capitalize">Status: {complianceData.license.status || 'Verified'}</p>
                  </div>
                </div>
                {complianceData.license.document_url && (
                  <a
                    href={complianceData.license.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-6.5 px-2.5 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 shrink-0 shadow-2xs"
                  >
                    <Eye className="w-3 h-3" /> View
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
