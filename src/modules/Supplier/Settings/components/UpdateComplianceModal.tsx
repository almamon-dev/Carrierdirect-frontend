import React, { useState, useEffect } from 'react';
import { Upload, FileText, Calendar, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useToastStore } from '@/stores/useToastStore';
import apiClient from '@/lib/axios';

interface UpdateComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'insurance' | 'license';
  currentData?: any;
  onSuccess: () => void;
}

export function UpdateComplianceModal({
  isOpen,
  onClose,
  type,
  currentData,
  onSuccess,
}: UpdateComplianceModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [insuranceType, setInsuranceType] = useState('Goods in Transit Insurance');
  const [providerName, setProviderName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      if (currentData) {
        setExpiryDate(currentData.raw_expiry || '');
        if (type === 'insurance') {
          setInsuranceType(currentData.type || 'Goods in Transit Insurance');
          setProviderName(currentData.provider_name || '');
          setPolicyNumber(currentData.policy_number || '');
        }
      } else {
        setExpiryDate('');
        setProviderName('');
        setPolicyNumber('');
      }
    }
  }, [isOpen, type, currentData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      useToastStore.getState().showToast('Please select a valid document file (PDF or image).', 'error');
      return;
    }

    if (!expiryDate) {
      useToastStore.getState().showToast('Please specify the document expiration date.', 'error');
      return;
    }

    // Check expiry date is in future
    const exp = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (exp <= today) {
      useToastStore.getState().showToast('Expiry date must be a future date.', 'error');
      return;
    }

    if (type === 'insurance') {
      if (!insuranceType.trim()) {
        useToastStore.getState().showToast('Please provide the insurance type.', 'error');
        return;
      }
      if (!providerName.trim()) {
        useToastStore.getState().showToast('Please enter the insurance provider name.', 'error');
        return;
      }
      if (!policyNumber.trim()) {
        useToastStore.getState().showToast('Please enter the insurance policy number.', 'error');
        return;
      }
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('expiry_date', expiryDate);

      const endpoint = type === 'insurance'
        ? '/supplier/profile/compliance/insurance'
        : '/supplier/profile/compliance/license';

      if (type === 'insurance') {
        formData.append('insurance_type', insuranceType);
        formData.append('insurance_provider_name', providerName);
        formData.append('policy_number', policyNumber);
      }

      await apiClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      useToastStore.getState().showToast(
        type === 'insurance'
          ? 'Insurance document updated and submitted for admin review!'
          : 'Carrier license updated and submitted for admin review!',
        'success'
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Update compliance document error:', err);
      const msg = err.response?.data?.message || err.data?.message || err.message || 'Failed to upload document.';
      useToastStore.getState().showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isInsurance = type === 'insurance';
  const modalTitle = isInsurance
    ? 'Update Insurance Policy Document'
    : 'Update Carrier Operating License';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-[#ff4a1f]" />
          <span>{modalTitle}</span>
        </div>
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Verification Notice Banner */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-[4px] flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Review & Re-verification Notice</p>
            <p className="text-[11.5px] text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
              Uploading a renewed document will set its status to <span className="font-bold">Pending Verification</span>.
              Admin will verify and re-approve your compliance credentials within 24 hours.
            </p>
          </div>
        </div>

        {/* Insurance-specific fields */}
        {isInsurance && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Insurance Type <span className="text-red-500">*</span>
              </label>
              <select
                value={insuranceType}
                onChange={(e) => setInsuranceType(e.target.value)}
                className="w-full h-8.5 px-2.5 text-xs bg-white dark:bg-[#151921] border border-slate-300 dark:border-slate-700 rounded-[3px] text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#ff4a1f]"
              >
                <option value="Goods in Transit Insurance">Goods in Transit Insurance</option>
                <option value="CMR Cargo Insurance">CMR Cargo Insurance</option>
                <option value="Freight Forwarder Liability">Freight Forwarder Liability</option>
                <option value="Public & Carrier Liability">Public & Carrier Liability</option>
                <option value="General Commercial Auto">General Commercial Auto</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Provider Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Allianz, AXA, Zurich"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  className="h-8.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Policy Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. POL-98421-EU"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  className="h-8.5 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Expiration Date Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Document Expiry Date <span className="text-red-500">*</span></span>
          </label>
          <Input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="h-8.5 text-xs"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* File Upload Drop Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload New Document File <span className="text-red-500">*</span></span>
          </label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#ff4a1f] dark:hover:border-[#ff4a1f] transition-colors rounded-[4px] p-4 text-center bg-slate-50/50 dark:bg-[#151921]/50 cursor-pointer relative">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const f = e.target.files[0];
                  if (f.size > 10 * 1024 * 1024) {
                    useToastStore.getState().showToast('File size must be less than 10MB', 'error');
                    return;
                  }
                  setFile(f);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
              <Upload className="w-6 h-6 text-[#ff4a1f]" />
              {file ? (
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 break-all">
                    {file.name}
                  </p>
                  <p className="text-[10.5px] text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Click to browse or drag & drop new document
                  </p>
                  <p className="text-[10.5px] text-slate-400">
                    Supports PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="h-8 px-3 text-xs rounded-[3px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !file || !expiryDate}
            className="h-8 px-4 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center gap-1.5 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>{isLoading ? 'Submitting for Review...' : 'Submit Document'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default UpdateComplianceModal;
