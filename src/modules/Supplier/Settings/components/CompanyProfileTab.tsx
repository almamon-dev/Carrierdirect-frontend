import React, { useState, useEffect } from 'react';
import { Building2, Upload, MapPin, ShieldCheck, FileText, CheckCircle2, Paperclip, Eye, RefreshCw, Loader2 } from 'lucide-react';
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
      const data = res.data?.data || res.data || {};
      
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

      // Cache user in localStorage
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
      const updatedProfile = res.data?.data || payload;

      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
      const currentUser = rawUser ? JSON.parse(rawUser) : {};
      localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify({ ...currentUser, ...updatedProfile }));

      await new Promise(resolve => setTimeout(resolve, 600));

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
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoPreview(URL.createObjectURL(file));
    const logoData = new FormData();
    logoData.append('logo', file);

    try {
      const res = await apiClient.post('/supplier/profile/logo', logoData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      useToastStore.getState().showToast('Company logo updated successfully', 'success');
      if (res.data?.data?.profile_picture) {
        setLogoPreview(res.data.data.profile_picture);
      }
    } catch (err) {
      useToastStore.getState().showToast('Logo updated locally', 'info');
    }
  };

  if (isFetching) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[350px] gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff4a1f]" />
        <p className="text-xs font-medium text-slate-500">Loading profile data from database...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-3.5 font-sans antialiased">
      
      {/* Verified Carrier Status */}
      <div className="bg-orange-50/60 border border-orange-200/80 p-3 rounded-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4.5 h-4.5 text-[#ff4a1f] shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900">Freight Carrier Account</span>
            <Badge className={`text-[10px] font-semibold border ${isVerified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
              {isVerified ? 'Verified Active' : 'Pending Verification'}
            </Badge>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">Carrier License & Compliance Status</span>
      </div>

      {/* Basic Company Identity */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Building2 className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Company Identity & Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 space-y-3">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <div className="w-14 h-14 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#ff4a1f]">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-[#ff4a1f]">
                    <Upload className="w-4 h-4" />
                    <span className="text-[9px] font-medium mt-0.5">Logo</span>
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
              <p className="text-xs font-semibold text-slate-800">Company Logo</p>
              <p className="text-[11px] text-slate-500 font-normal">Shown on proposals and invoices (PNG or JPG).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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

      {/* Location & Address Info */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <MapPin className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Location & Business Address
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

      {/* Uploaded Documents Section */}
      {complianceData && (
        <Card className="shadow-2xs border-slate-200">
          <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <Paperclip className="w-3.5 h-3.5 text-[#ff4a1f]" />
              Compliance Documents & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 space-y-2.5">
            {complianceData.insurance && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">Insurance Document</h4>
                    <p className="text-[11px] text-slate-500">Status: {complianceData.insurance.status}</p>
                  </div>
                </div>
                {complianceData.insurance.document_url && (
                  <a
                    href={complianceData.insurance.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-7 px-2.5 bg-white text-slate-700 border border-slate-200 text-[11px] font-medium rounded flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> View
                  </a>
                )}
              </div>
            )}
            {complianceData.license && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">Carrier License Document</h4>
                    <p className="text-[11px] text-slate-500">Status: {complianceData.license.status}</p>
                  </div>
                </div>
                {complianceData.license.document_url && (
                  <a
                    href={complianceData.license.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-7 px-2.5 bg-white text-slate-700 border border-slate-200 text-[11px] font-medium rounded flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> View
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Form Action Footer */}
      <div className="flex items-center justify-between pt-1">
        {isSaved ? (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved successfully
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-normal">Changes apply to future quote requests.</span>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="h-8 text-xs px-5 bg-[#ff4a1f] hover:bg-[#e63d15] font-semibold text-white shadow-2xs cursor-pointer rounded-md"
        >
          Save Profile
        </Button>
      </div>

    </form>
  );
}
