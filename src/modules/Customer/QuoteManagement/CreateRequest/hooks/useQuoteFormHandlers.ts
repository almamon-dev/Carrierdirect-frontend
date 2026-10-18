import React from 'react';
import { QuoteFormData } from '../types/formTypes';
import { calculateAirDistanceKm } from '@/utils/geoDistance';

interface UseQuoteFormHandlersProps {
  formData: QuoteFormData;
  setFormData: React.Dispatch<React.SetStateAction<QuoteFormData>>;
  markTouched: (field: string) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function useQuoteFormHandlers({
  formData,
  setFormData,
  markTouched,
  showToast,
}: UseQuoteFormHandlersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    markTouched(name);
  };

  const handleSelectChange = (name: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    markTouched(name as string);
  };

  const handleCheckboxChange = (name: keyof QuoteFormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleLocationSelect = (prefix: 'pickup' | 'delivery', locData: any) => {
    setFormData((prev) => {
      const next: QuoteFormData = {
        ...prev,
        [`${prefix}Address`]: locData.address || (prev as any)[`${prefix}Address`],
        [`${prefix}Lat`]: locData.lat !== undefined ? locData.lat : (prev as any)[`${prefix}Lat`],
        [`${prefix}Lng`]: locData.lng !== undefined ? locData.lng : (prev as any)[`${prefix}Lng`],
        [`${prefix}City`]: locData.city || (prev as any)[`${prefix}City`],
        [`${prefix}State`]: locData.state || (prev as any)[`${prefix}State`],
        [`${prefix}Country`]: locData.country || (prev as any)[`${prefix}Country`],
        [`${prefix}Zip`]: locData.zip || (prev as any)[`${prefix}Zip`],
      };

      const pLat = prefix === 'pickup' ? locData.lat : prev.pickupLat;
      const pLng = prefix === 'pickup' ? locData.lng : prev.pickupLng;
      const dLat = prefix === 'delivery' ? locData.lat : prev.deliveryLat;
      const dLng = prefix === 'delivery' ? locData.lng : prev.deliveryLng;

      if (pLat && pLng && dLat && dLng) {
        const airKm = calculateAirDistanceKm(pLat, pLng, dLat, dLng);
        if (airKm && airKm > 0) {
          next.distanceKm = airKm;
        }
      }

      return next;
    });

    markTouched(`${prefix}Address`);
    markTouched(`${prefix}City`);
    markTouched(`${prefix}Country`);
  };

  const handleFileUpload = (field: 'images' | 'packingList' | 'invoice', files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (field === 'images') {
      const newFiles = Array.from(files);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newFiles] }));
      showToast(`${newFiles.length} cargo photo(s) attached`, 'success');
    } else {
      setFormData((prev) => ({ ...prev, [field]: files[0] }));
      showToast(`${files[0].name} attached`, 'success');
    }
  };

  const addDimensionRow = () => {
    setFormData((prev) => ({
      ...prev,
      dimensions: [
        ...prev.dimensions,
        { id: Date.now(), length: '', width: '', height: '', qty: '1', unit: 'CM' },
      ],
    }));
  };

  const updateDimension = (id: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: prev.dimensions.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    }));
  };

  const removeDimension = (id: number) => {
    if (formData.dimensions.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      dimensions: prev.dimensions.filter((d) => d.id !== id),
    }));
  };

  return {
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    handleLocationSelect,
    handleFileUpload,
    addDimensionRow,
    updateDimension,
    removeDimension,
  };
}
