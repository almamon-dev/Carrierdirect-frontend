import React from 'react';
import { MapPin } from 'lucide-react';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import Textarea from '@/components/ui/textarea';
import GooglePlacesAutocompleteInput from '@/components/GooglePlacesAutocompleteInput';
import { QuoteFormData } from '../../types/formTypes';
import { FormRow } from '../FormHelpers';

interface LocationDetailFieldsProps {
  prefix: 'pickup' | 'delivery';
  title: string;
  formData: QuoteFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLocationSelect: (data: any) => void;
  getFieldError: (field: string) => string | undefined;
  markTouched: (field: string) => void;
}

export const LocationDetailFields: React.FC<LocationDetailFieldsProps> = ({
  prefix,
  title,
  formData,
  handleChange,
  onLocationSelect,
  getFieldError,
  markTouched,
}) => {
  const companyKey = `${prefix}Company` as string & keyof QuoteFormData;
  const contactKey = `${prefix}ContactName` as string & keyof QuoteFormData;
  const phoneKey = `${prefix}Phone` as string & keyof QuoteFormData;
  const emailKey = `${prefix}Email` as string & keyof QuoteFormData;
  const countryKey = `${prefix}Country` as string & keyof QuoteFormData;
  const stateKey = `${prefix}State` as string & keyof QuoteFormData;
  const cityKey = `${prefix}City` as string & keyof QuoteFormData;
  const zipKey = `${prefix}Zip` as string & keyof QuoteFormData;
  const addressKey = `${prefix}Address` as string & keyof QuoteFormData;
  const instructionsKey = `${prefix}Instructions` as string & keyof QuoteFormData;

  return (
    <div
      className={`col-span-1 md:col-span-2 ${
        prefix === 'pickup' ? 'border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-2' : ''
      }`}
    >
      <div className="mb-2">
        <h3 className="text-xs font-bold text-[#ff4a1f] tracking-wider flex items-center gap-1.5 select-none">
          <MapPin size={14} /> {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2.5">
        <FormRow label="Company Name">
          <Input
            name={companyKey}
            value={(formData[companyKey] as string) || ''}
            onChange={handleChange}
            placeholder="Company name"
          />
        </FormRow>

        <FormRow label="Contact Person" required error={getFieldError(contactKey)}>
          <Input
            name={contactKey}
            value={(formData[contactKey] as string) || ''}
            onChange={handleChange}
            onBlur={() => markTouched(contactKey)}
            error={getFieldError(contactKey)}
            placeholder="Contact person name"
          />
        </FormRow>

        <FormRow label="Phone Number" required error={getFieldError(phoneKey)}>
          <PhoneInput
            name={phoneKey}
            value={(formData[phoneKey] as string) || ''}
            country={(formData[countryKey] as string) || ''}
            onChange={handleChange}
            onCountryChange={(c) => {
              const currentCountry = (formData[countryKey] as string) || '';
              if (c?.name && (!currentCountry || currentCountry === 'Bangladesh' || currentCountry === '')) {
                handleChange({ target: { name: countryKey, value: c.name } } as any);
              }
            }}
            placeholder="Phone number"
          />
        </FormRow>

        <FormRow label="Email">
          <Input
            name={emailKey}
            value={(formData[emailKey] as string) || ''}
            onChange={handleChange}
            type="email"
            placeholder="name@company.com"
          />
        </FormRow>

        <FormRow label="Country" required error={getFieldError(countryKey)}>
          <Input
            name={countryKey}
            value={(formData[countryKey] as string) || ''}
            onChange={handleChange}
            onBlur={() => markTouched(countryKey)}
            error={getFieldError(countryKey)}
            placeholder="Country"
          />
        </FormRow>

        <FormRow label="State/Division">
          <Input
            name={stateKey}
            value={(formData[stateKey] as string) || ''}
            onChange={handleChange}
            placeholder="State / Division"
          />
        </FormRow>

        <FormRow label="City" required error={getFieldError(cityKey)}>
          <Input
            name={cityKey}
            value={(formData[cityKey] as string) || ''}
            onChange={handleChange}
            onBlur={() => markTouched(cityKey)}
            error={getFieldError(cityKey)}
            placeholder="City / Area"
          />
        </FormRow>

        <FormRow label="ZIP Code">
          <Input
            name={zipKey}
            value={(formData[zipKey] as string) || ''}
            onChange={handleChange}
            placeholder="ZIP / Postal code"
          />
        </FormRow>

        <div className="col-span-1 md:col-span-2">
          <FormRow label="Full Address" required error={getFieldError(addressKey)}>
            <GooglePlacesAutocompleteInput
              name={addressKey}
              value={(formData[addressKey] as string) || ''}
              onChange={handleChange}
              onLocationSelect={onLocationSelect}
              placeholder={`Enter full ${prefix} address or landmark`}
              error={getFieldError(addressKey)}
            />
          </FormRow>
        </div>

        <div className="col-span-1 md:col-span-2">
          <FormRow label={`${prefix === 'pickup' ? 'Pickup' : 'Delivery'} Instructions`}>
            <Textarea
              name={instructionsKey}
              value={(formData[instructionsKey] as string) || ''}
              onChange={handleChange}
              placeholder={`Special instructions for ${prefix} point (gate codes, supervisor, etc.)`}
              rows={2}
            />
          </FormRow>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailFields;
