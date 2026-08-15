import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { Home, MapPin, Globe, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';

const COUNTRY_OPTIONS = [
  { id: 'Bangladesh', name: '🇧🇩 Bangladesh' },
  { id: 'Germany', name: '🇩🇪 Germany' },
  { id: 'France', name: '🇫🇷 France' },
  { id: 'Netherlands', name: '🇳🇱 Netherlands' },
  { id: 'Poland', name: '🇵🇱 Poland' },
  { id: 'United Kingdom', name: '🇬🇧 United Kingdom' },
  { id: 'United States', name: '🇺🇸 United States' },
];

interface AddressData {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

interface AddressesResponse {
  permanent: AddressData | null;
  present: AddressData | null;
}

const BLANK: AddressData = {
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  zip_code: '',
  country: 'Bangladesh',
};

function AddressCard({
  type,
  title,
  icon: Icon,
  accentColor,
  initialData,
  onSaveSuccess,
}: {
  type: 'permanent' | 'present';
  title: string;
  icon: React.ElementType;
  accentColor: string;
  initialData: AddressData | null;
  onSaveSuccess: (updated: AddressData) => void;
}) {
  const [data, setData] = useState<AddressData>(initialData || BLANK);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setData({
        address_line_1: initialData.address_line_1 ?? '',
        address_line_2: initialData.address_line_2 ?? '',
        city: initialData.city ?? '',
        state: initialData.state ?? '',
        zip_code: initialData.zip_code ?? '',
        country: initialData.country ?? 'Bangladesh',
      });
    }
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveErr(null);
    try {
      const res = await apiClient.post(`${ENDPOINTS.CUSTOMER.ADDRESSES}/${type}`, data);
      const savedData = res.data?.data || res.data || data;
      onSaveSuccess(savedData);
      setToastMsg(`${type === 'permanent' ? 'Permanent' : 'Present'} address saved successfully!`);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'Failed to save address. Please try again.';
      setSaveErr(msg);
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof AddressData, val: string) =>
    setData(prev => ({ ...prev, [field]: val }));

  return (
    <form
      onSubmit={handleSave}
      className={`bg-white rounded-md border shadow-xs overflow-hidden ${accentColor}`}
    >
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type === 'permanent' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="text-[11px] text-slate-500">
            {type === 'permanent'
              ? 'Your permanent / billing address'
              : 'Your present / dispatch location address'}
          </p>
        </div>
      </div>

      <div className="p-5 space-y-3.5">
        {saveErr && (
          <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {saveErr}
          </div>
        )}

        {toastMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700 font-bold">
            {toastMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Input
              label="Address Line 1"
              type="text"
              placeholder="House no., Road no., Area"
              value={data.address_line_1}
              onChange={e => set('address_line_1', e.target.value)}
              icon={<MapPin className="w-4 h-4 text-slate-400" />}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Address Line 2"
              type="text"
              placeholder="Apartment, suite, block (optional)"
              value={data.address_line_2}
              onChange={e => set('address_line_2', e.target.value)}
              icon={<MapPin className="w-4 h-4 text-slate-300" />}
            />
          </div>
          <Input
            label="City / Town"
            type="text"
            placeholder="Dhaka"
            value={data.city}
            onChange={e => set('city', e.target.value)}
          />
          <Input
            label="State / Division"
            type="text"
            placeholder="Dhaka Division"
            value={data.state}
            onChange={e => set('state', e.target.value)}
          />
          <Input
            label="ZIP / Postal Code"
            type="text"
            placeholder="1212"
            value={data.zip_code}
            onChange={e => set('zip_code', e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-semibold text-slate-700">Country</label>
            <Select
              value={data.country}
              onChange={opt => set('country', typeof opt === 'object' ? opt.id : opt)}
              options={COUNTRY_OPTIONS}
              icon={Globe}
              showSearch={false}
              placeholder="Select country..."
            />
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end bg-slate-50/40">
        <button
          type="submit"
          disabled={saving}
          className="h-9 px-5 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {saving ? 'Saving…' : 'Save Address'}
        </button>
      </div>
    </form>
  );
}

export default function AddressBookTab() {
  const [addresses, setAddresses] = useState<AddressesResponse>({ permanent: null, present: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAllAddresses() {
      setIsLoading(true);
      try {
        const res = await apiClient.get(ENDPOINTS.CUSTOMER.ADDRESSES);
        const dataObj = res.data?.data || res.data || {};
        setAddresses({
          permanent: dataObj.permanent ?? null,
          present: dataObj.present ?? null,
        });
      } catch (err) {
        console.error('Failed to load addresses:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAllAddresses();
  }, []);

  const handleUpdate = (type: 'permanent' | 'present', updated: AddressData) => {
    setAddresses(prev => ({
      ...prev,
      [type]: updated
    }));
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900">Address Book</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Keep your permanent and present addresses up to date for faster quote requests and deliveries.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 flex items-center justify-center text-slate-500 gap-2">
          <Loader2 size={20} className="animate-spin text-[#ff4a1f]" />
          <span>Loading address book...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AddressCard
            type="permanent"
            title="Permanent Address"
            icon={Home}
            accentColor="border-slate-200 hover:border-blue-200 transition-colors"
            initialData={addresses.permanent}
            onSaveSuccess={updated => handleUpdate('permanent', updated)}
          />
          <AddressCard
            type="present"
            title="Present Address"
            icon={MapPin}
            accentColor="border-slate-200 hover:border-emerald-200 transition-colors"
            initialData={addresses.present}
            onSaveSuccess={updated => handleUpdate('present', updated)}
          />
        </div>
      )}
    </div>
  );
}
