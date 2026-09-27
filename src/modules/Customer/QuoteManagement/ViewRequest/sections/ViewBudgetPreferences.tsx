import React from 'react';
import { Euro, Settings } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '../components/ViewField';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';

interface ViewBudgetPreferencesProps {
    formData: any;
}

export const ViewBudgetPreferences: React.FC<ViewBudgetPreferencesProps> = ({ formData }) => {
    const symbol = getCurrencySymbol(formData.currency);

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Budget & Preferences" icon={Euro} />

                <ViewField
                    label="Target Budget"
                    value={
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                            {formatCurrency(formData.budget, formData.currency)}
                        </span>
                    }
                />

                <ViewField 
                    label="Currency" 
                    value={
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {formData.currency} ({symbol})
                        </span>
                    } 
                />

                <SectionHeader title="Bidding Rules" icon={Settings} />

                <ViewField
                    label="Price Negotiation"
                    value={
                        formData.allowNegotiation
                            ? <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded text-xs font-semibold">Allowed</span>
                            : <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-medium">Fixed Price Only</span>
                    }
                />

                <ViewField
                    label="Bidding System"
                    value={
                        formData.receiveMultiple
                            ? <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded text-xs font-semibold">Multiple Bids Allowed</span>
                            : <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-medium">Direct Carrier Only</span>
                    }
                />

                <ViewField label="Auto Expire" value={formData.autoExpire} />
            </div>
        </div>
    );
};

export default ViewBudgetPreferences;
