import React from 'react';
import { MapPin, Navigation, Plane } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';
import { resolveQuoteDistance } from '@/utils/geoDistance';
import LocationDetailFields from './LocationDetailFields';

interface SectionProps {
  formData: QuoteFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleLocationSelect?: (prefix: 'pickup' | 'delivery', locationData: any) => void;
  onLocationSelect?: (prefix: 'pickup' | 'delivery', locationData: any) => void;
  getFieldError?: (field: string) => string | undefined;
  markTouched?: (field: string) => void;
}

export const LocationsSection: React.FC<SectionProps> = ({
  formData,
  handleChange,
  handleLocationSelect,
  onLocationSelect,
  getFieldError = () => undefined,
  markTouched = () => {},
}) => {
  const distInfo = resolveQuoteDistance(formData);
  const hasDistance = distInfo.distanceStr && distInfo.distanceStr !== '—';
  const locationHandler = handleLocationSelect || onLocationSelect;

  const handleLocationSelectInternal = (prefix: 'pickup' | 'delivery', data: any) => {
    if (locationHandler) {
      locationHandler(prefix, data);
    }
    if (data.company) handleChange({ target: { name: `${prefix}Company`, value: data.company } } as any);
    if (data.city) handleChange({ target: { name: `${prefix}City`, value: data.city } } as any);
    if (data.state) handleChange({ target: { name: `${prefix}State`, value: data.state } } as any);
    if (data.country) handleChange({ target: { name: `${prefix}Country`, value: data.country } } as any);
    if (data.zip) handleChange({ target: { name: `${prefix}Zip`, value: data.zip } } as any);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
        <div className="col-span-1 md:col-span-2 flex items-center justify-between">
          <TabHeader title="Location Information" icon={MapPin} />
          {hasDistance && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold border ${
                distInfo.isAirDistance
                  ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/60'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
              }`}
            >
              {distInfo.isAirDistance ? (
                <Plane size={13} className="text-sky-500" />
              ) : (
                <Navigation size={13} className="text-[#ff4a1f]" />
              )}
              <span>Estimated Distance: {distInfo.distanceStr}</span>
            </div>
          )}
        </div>

        <LocationDetailFields
          prefix="pickup"
          title="Pickup Details"
          formData={formData}
          handleChange={handleChange}
          onLocationSelect={(data) => handleLocationSelectInternal('pickup', data)}
          getFieldError={getFieldError}
          markTouched={markTouched}
        />

        <LocationDetailFields
          prefix="delivery"
          title="Delivery Details"
          formData={formData}
          handleChange={handleChange}
          onLocationSelect={(data) => handleLocationSelectInternal('delivery', data)}
          getFieldError={getFieldError}
          markTouched={markTouched}
        />
      </div>
    </div>
  );
};

export default LocationsSection;
