import React from 'react';
import { MapPin } from 'lucide-react';
import Input from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CompanyLocationCardProps {
  formData: {
    state: string;
    city: string;
    zipCode: string;
    address: string;
  };
  handleChange: (field: string, value: string) => void;
}

export function CompanyLocationCard({ formData, handleChange }: CompanyLocationCardProps) {
  return (
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
  );
}
