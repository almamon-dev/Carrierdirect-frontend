import React, { useState, useEffect } from 'react';
import { Home, MapPin, Loader2 } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import AddressCard from './AddressCard';
import { AddressData, AddressesResponse } from '../types/addressTypes';

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
      [type]: updated,
    }));
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
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
