import React from 'react';
import { Euro, Settings } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '../components/ViewField';

interface ViewBudgetPreferencesProps {
    formData: any;
}

export const ViewBudgetPreferences: React.FC<ViewBudgetPreferencesProps> = ({ formData }) => {
    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Budget & Preferences" icon={Euro} />

                <ViewField
                    label="Target Budget"
                    value={
                        <span className="text-emerald-600 font-bold text-sm">
                            {formData.currency} {Number(String(formData.budget).replace(/[^0-9.]/g, '') || 0).toLocaleString()}
                        </span>
                    }
                />

                <ViewField label="Currency" value={formData.currency} />

                <SectionHeader title="Bidding Rules" icon={Settings} />

                <ViewField
                    label="Price Negotiation"
                    value={
                        formData.allowNegotiation
                            ? <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">Allowed</span>
                            : <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">Fixed Price Only</span>
                    }
                />

                <ViewField
                    label="Bidding System"
                    value={
                        formData.receiveMultiple
                            ? <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">Multiple Bids Allowed</span>
                            : <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">Direct Carrier Only</span>
                    }
                />

                <ViewField label="Auto Expire" value={formData.autoExpire} />
            </div>
        </div>
    );
};
