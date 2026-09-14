import React, { useState, useEffect } from 'react';
import { Building2, Upload, MapPin, ShieldCheck, FileText, CheckCircle2, Paperclip, Eye, RefreshCw, Loader2, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import apiClient from '@/lib/axios';
import { TOKEN_CONFIG } from '@/config/auth';
import { useToastStore } from '@/stores/useToastStore';

export default function CompanyProfileTab() {
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

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
      setLogoPreview(URL.createObjectURL(file));

      const uploadData = new FormData();
      uploadData.append('logo', file);
      try {
        const res = await apiClient.post('/supplier/profile/logo', uploadData);
        useToastStore.getState().showToast('Logo updated successfully!', 'success');
        if (res.data?.data?.profile_picture) {
          setLogoPreview(res.data.data.profile_picture);
        }
      } catch (err: any) {
        useToastStore.getState().showToast(err.message || 'Failed to upload logo', 'error');
      }
    }
  };

  return (
    <form id="supplier-profile-form" onSubmit={handleSave} className="space-y-3 font-sans antialiased w-full">
      
      {/* Compact Verification Status Strip */}
      <div
    className="p-2.5 bg-white dark:bg-[#151921] rounded-[4px] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${isVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`} />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Account Verification:</span>
          {isVerified ? (
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-[3px]">
              <Check className="w-3 h-3 text-emerald-600" /> Verified Active
            </span>
          ) : (
            <span className="inline-flex items-center text-[10.5px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-[3px]">
              Pending Review
            </span>
          )}
        </div>
        <span className="text-[10.5px] text-slate-400 hidden sm:inline">Carrier License & Compliance Status</span>
      </div>

      {/* Company Identity & Branding */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px]">
        <CardHeader className="py-2 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-[4px]">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Building2 className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Company Identity & Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative group shrink-0">
              <div className="w-11 h-11 rounded-[4px] bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#ff4a1f]">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-[#ff4a1f]">
                    <Upload className="w-3.5 h-3.5" />
                    <span className="text-[8.5px] font-medium mt-0.5">Logo</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                title="Upload logo"
              />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Company Logo</p>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400">Shown on proposals and invoices (PNG or JPG).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
            <Input
              label="Legal Business / Company Name *"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="Enter company name"
              required
            />

            <Input
              label="Account Email *"
              type="email"
              value={formData.email}
              disabled
              placeholder="Enter email"
            />

            <Input
              label="Phone Number *"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter phone number"
              required
            />

            <Input
              label="Country *"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="Enter country"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Location & Business Address */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px]">
        <CardHeader className="py-2 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-[4px]">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <MapPin className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Location & Business Address
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <Input
              label="State / Division"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="Enter state"
            />

            <Input
              label="City *"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Enter city"
              required
            />

            <Input
              label="Zip / Postal Code *"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              placeholder="Enter zip code"
              required
            />

            <div className="sm:col-span-3">
              <Input
                label="Full Business Address *"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter full address"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents Section - Compact */}
      {complianceData && (
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px]">
          <CardHeader className="py-2 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-[4px]">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
              <Paperclip className="w-3.5 h-3.5 text-[#ff4a1f]" />
              Compliance Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {complianceData.insurance && (
              <div
    className="p-2.5 bg-slate-50 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Insurance Policy</h4>
                    <p className="text-[10px] text-slate-400">Status: {complianceData.insurance.status}</p>
                  </div>
                </div>
                {complianceData.insurance.document_url && (
                  <a
                    href={complianceData.insurance.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-6 px-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10.5px] font-medium rounded-[3px] flex items-center gap-1 hover:bg-slate-50"
                  >
                    <Eye className="w-3 h-3" /> View
                  </a>
                )}
              </div>
            )}
            {complianceData.license && (
              <div
    className="p-2.5 bg-slate-50 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Carrier License</h4>
                    <p className="text-[10px] text-slate-400">Status: {complianceData.license.status}</p>
                  </div>
                </div>
                {complianceData.license.document_url && (
                  <a
                    href={complianceData.license.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-6 px-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10.5px] font-medium rounded-[3px] flex items-center gap-1 hover:bg-slate-50"
                  >
                    <Eye className="w-3 h-3" /> View
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isSaved && (
        <div className="flex items-center pt-1">
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved successfully
          </span>
        </div>
      )}

    </form>
  );
}
