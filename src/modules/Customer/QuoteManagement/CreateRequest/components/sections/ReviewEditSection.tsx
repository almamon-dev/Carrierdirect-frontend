/**
 * Review & Save Edit Section Component
 * Displays a complete summary of the edited quote request before submitting updates.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Save, MapPin, Truck, Euro, Paperclip, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';

interface ReviewEditSectionProps {
    formData: QuoteFormData;
    servicesCount: number;
    isSubmitting: boolean;
    onSaveUpdate: () => void;
}

export const ReviewEditSection: React.FC<ReviewEditSectionProps> = ({
    formData,
    servicesCount,
    isSubmitting,
    onSaveUpdate,
}) => {
    const navigate = useNavigate();
    const pickupLocation = [formData.pickupCompany, formData.pickupCity, formData.pickupState, formData.pickupCountry].filter(Boolean).join(', ') || formData.pickupAddress || '-';
    const deliveryLocation = [formData.deliveryCompany, formData.deliveryCity, formData.deliveryState, formData.deliveryCountry].filter(Boolean).join(', ') || formData.deliveryAddress || '-';

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <TabHeader title="Review & Update Request" icon={CheckCircle2} />

            <div className="bg-slate-50/80 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-md p-4 space-y-3.5 text-xs">
                {/* Header Info */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                            {formData.requestTitle || '-'}
                        </h4>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-[11px] mt-1">
                            <span>Priority: <strong className="text-red-600 dark:text-red-400 font-bold">{formData.priority || '-'}</strong></span>
                            <span>•</span>
                            <span>Type: <strong className="text-slate-700 dark:text-slate-300">{formData.shipmentType || '-'}</strong> ({formData.serviceType || '-'})</span>
                        </div>
                    </div>
                </div>

                {/* Route */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-1">
                    <div className="flex items-start gap-2 bg-white dark:bg-[#1e2329] p-2.5 rounded border border-slate-200/80 dark:border-slate-800">
                        <MapPin size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pickup</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">{pickupLocation}</span>
                            <span className="text-[11px] text-slate-500">{formData.pickupDate} {formData.pickupTime && `at ${formData.pickupTime}`}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white dark:bg-[#1e2329] p-2.5 rounded border border-slate-200/80 dark:border-slate-800">
                        <MapPin size={15} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Delivery</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">{deliveryLocation}</span>
                            <span className="text-[11px] text-slate-500">{formData.deliveryDate || 'Flexible'} {formData.deliveryTime && `at ${formData.deliveryTime}`}</span>
                        </div>
                    </div>
                </div>

                {/* Cargo & Budget */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1 border-t border-slate-200 dark:border-slate-800 pt-2.5">
                    <div className="bg-white dark:bg-[#1e2329] p-2 rounded border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Vehicle</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate block">{formData.vehicleType || '-'}</span>
                    </div>
                    <div className="bg-white dark:bg-[#1e2329] p-2 rounded border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Weight / Pallets</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">{formData.weight ? `${formData.weight} kg` : '-'} / {formData.palletsCount || '-'}</span>
                    </div>
                    <div className="bg-white dark:bg-[#1e2329] p-2 rounded border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Budget</span>
                        <span className="font-bold text-[#ff4a1f] text-xs block">{formData.budget ? `${formData.currency}${formData.budget}` : 'Negotiable'}</span>
                    </div>
                    <div className="bg-white dark:bg-[#1e2329] p-2 rounded border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Services Active</span>
                        <span className="font-semibold text-emerald-600 text-xs block">{servicesCount} selected</span>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-md p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                    <Button
                        variant="primary"
                        className="flex-1 h-[40px] text-[14px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
                        onClick={onSaveUpdate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>{isSubmitting ? 'Updating Request...' : 'Save & Update Changes'}</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-[40px] px-5 text-[14px] cursor-pointer"
                        onClick={() => navigate('/customer/quotes/create')}
                    >
                        Cancel
                    </Button>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded p-2.5 flex gap-2">
                    <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-tight">
                        Please ensure all required fields are filled out. Modifying this request will automatically notify bidding carriers.
                    </p>
                </div>
            </div>
        </div>
    );
};
