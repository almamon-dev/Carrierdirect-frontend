/**
 * Review & Save Edit Section Component
 * Clean, flat specification review without nested cards inside cards.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Save, MapPin, Truck, X } from 'lucide-react';
import Button from '@/components/ui/button';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../CreateRequest/types/formTypes';
import { formatCurrency } from '@/lib/utils';

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
            <TabHeader title="Summary & Specification Review" icon={CheckCircle2} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                {/* Header Title & Status */}
                <div className="col-span-1 md:col-span-2 pb-2.5 mb-1 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                            {formData.requestTitle || '-'}
                        </h4>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-[11.5px] mt-0.5">
                            <span>Priority: <strong className="text-red-600 dark:text-red-400 font-semibold">{formData.priority || 'Normal'}</strong></span>
                            <span>•</span>
                            <span>Type: <strong className="text-slate-700 dark:text-slate-300">{formData.shipmentType || 'One Way'}</strong> ({formData.serviceType || 'Standard'})</span>
                        </div>
                    </div>
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 text-xs">
                        Ready to Update
                    </span>
                </div>

                {/* Pickup Section */}
                <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400 mb-1">
                        <MapPin size={14} /> Pickup Details
                    </div>
                    <div className="grid grid-cols-[110px_10px_1fr] items-start text-[12.5px]">
                        <span className="text-slate-500 font-medium">Location</span>
                        <span className="text-slate-400">:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{pickupLocation}</span>
                    </div>
                    {formData.pickupAddress && (
                        <div className="grid grid-cols-[110px_10px_1fr] items-start text-[12.5px]">
                            <span className="text-slate-500 font-medium">Address</span>
                            <span className="text-slate-400">:</span>
                            <span className="text-slate-700 dark:text-slate-300">{formData.pickupAddress}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-[110px_10px_1fr] items-start text-[12.5px]">
                        <span className="text-slate-500 font-medium">Schedule</span>
                        <span className="text-slate-400">:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {formData.pickupDate || '-'} {formData.pickupTime && `at ${formData.pickupTime}`}
                        </span>
                    </div>
                </div>

                {/* Delivery Section */}
                <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        <MapPin size={14} /> Delivery Details
                    </div>
                    <div className="grid grid-cols-[110px_10px_1fr] items-start text-[12.5px]">
                        <span className="text-slate-500 font-medium">Location</span>
                        <span className="text-slate-400">:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{deliveryLocation}</span>
                    </div>
                    {formData.deliveryAddress && (
                        <div className="grid grid-cols-[110px_10px_1fr] items-start text-[12.5px]">
                            <span className="text-slate-500 font-medium">Address</span>
                            <span className="text-slate-400">:</span>
                            <span className="text-slate-700 dark:text-slate-300">{formData.deliveryAddress}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-[110px_10px_1fr] items-start text-[12.5px]">
                        <span className="text-slate-500 font-medium">Schedule</span>
                        <span className="text-slate-400">:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {formData.deliveryDate || 'Flexible'} {formData.deliveryTime && `at ${formData.deliveryTime}`}
                        </span>
                    </div>
                </div>

                {/* Cargo & Pricing Specifications */}
                <div className="col-span-1 md:col-span-2 pt-3 mt-1 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                        <Truck size={14} className="text-[#ff4a1f]" /> Cargo & Pricing Specifications
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-[12.5px]">
                        <div className="grid grid-cols-[140px_10px_1fr] items-start">
                            <span className="text-slate-500 font-medium">Vehicle Type</span>
                            <span className="text-slate-400">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.vehicleType || '-'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr] items-start">
                            <span className="text-slate-500 font-medium">Load & Pallets</span>
                            <span className="text-slate-400">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {formData.loadType || '-'} {formData.palletsCount ? `(${formData.palletsCount} Pallets)` : ''}
                            </span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr] items-start">
                            <span className="text-slate-500 font-medium">Total Weight</span>
                            <span className="text-slate-400">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.weight ? `${formData.weight} KG` : '-'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr] items-start">
                            <span className="text-slate-500 font-medium">Target Budget</span>
                            <span className="text-slate-400">:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(formData.budget, formData.currency)}
                            </span>
                        </div>
                        {servicesCount > 0 && (
                            <div className="grid grid-cols-[140px_10px_1fr] items-start">
                                <span className="text-slate-500 font-medium">Active Services</span>
                                <span className="text-slate-400">:</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{servicesCount} Options Selected</span>
                            </div>
                        )}
                        {formData.internalReference && (
                            <div className="grid grid-cols-[140px_10px_1fr] items-start">
                                <span className="text-slate-500 font-medium">Internal Ref ID</span>
                                <span className="text-slate-400">:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.internalReference}</span>
                            </div>
                        )}
                        {formData.customerNotes && (
                            <div className="col-span-1 md:col-span-2 grid grid-cols-[140px_10px_1fr] items-start pt-1">
                                <span className="text-slate-500 font-medium">Customer Notes</span>
                                <span className="text-slate-400">:</span>
                                <span className="text-slate-700 dark:text-slate-300">{formData.customerNotes}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] font-semibold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => navigate('/customer/quotes/create')}
                    disabled={isSubmitting}
                >
                    <X size={14} className="text-slate-500 dark:text-slate-400" />
                    <span>Cancel</span>
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="h-9 px-5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                    onClick={onSaveUpdate}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    <Save size={14} />
                    <span>Save & Update Changes</span>
                </Button>
            </div>
        </div>
    );
};
