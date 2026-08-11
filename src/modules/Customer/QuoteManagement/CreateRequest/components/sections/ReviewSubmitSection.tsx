import React from 'react';
import { CheckCircle2, Send, MapPin, Truck, Euro, Paperclip, Save } from 'lucide-react';
import Button from '@/components/ui/button';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';

interface SectionProps {
    formData: QuoteFormData;
    servicesCount: number;
    isSubmitting: boolean;
    onSubmit: (e?: React.FormEvent, status?: 'active' | 'pending') => void;
}

export const ReviewSubmitSection: React.FC<SectionProps> = ({
    formData,
    servicesCount,
    isSubmitting,
    onSubmit,
}) => {
    const pickupLocation = [formData.pickupCompany, formData.pickupCity, formData.pickupState, formData.pickupCountry].filter(Boolean).join(', ') || formData.pickupAddress;
    const deliveryLocation = [formData.deliveryCompany, formData.deliveryCity, formData.deliveryState, formData.deliveryCountry].filter(Boolean).join(', ') || formData.deliveryAddress;

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <TabHeader title="Review Request Summary" icon={CheckCircle2} />

            <div className="bg-slate-50/80 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-md p-4 space-y-3.5 text-xs">
                {/* Request Header */}
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
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800/60 text-xs shadow-2xs">
                        Ready to Post
                    </span>
                </div>

                {/* Locations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-md shadow-2xs">
                        <span className="font-bold text-purple-700 dark:text-purple-400 text-xs flex items-center gap-1.5 mb-1.5">
                            <MapPin size={13} /> Pickup Details
                        </span>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-[13px]">{pickupLocation || '-'}</p>
                        {formData.pickupAddress && <p className="text-slate-600 dark:text-slate-400 text-[11.5px] mt-0.5">{formData.pickupAddress}</p>}
                        {(formData.pickupDate || formData.pickupTime) && (
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-[11px] mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                Date: <strong className="text-slate-800 dark:text-slate-200">{formData.pickupDate} {formData.pickupTime}</strong>
                            </p>
                        )}
                    </div>

                    <div className="p-3 bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-md shadow-2xs">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1.5 mb-1.5">
                            <MapPin size={13} /> Delivery Details
                        </span>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-[13px]">{deliveryLocation || '-'}</p>
                        {formData.deliveryAddress && <p className="text-slate-600 dark:text-slate-400 text-[11.5px] mt-0.5">{formData.deliveryAddress}</p>}
                        {(formData.deliveryDate || formData.deliveryTime) && (
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-[11px] mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                Date: <strong className="text-slate-800 dark:text-slate-200">{formData.deliveryDate} {formData.deliveryTime}</strong>
                            </p>
                        )}
                    </div>
                </div>

                {/* Cargo & Vehicle Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-md shadow-2xs">
                    <div>
                        <span className="text-slate-400 dark:text-slate-500 block font-medium text-[11px]">Vehicle Type</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-[12px]">{formData.vehicleType || '-'}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 dark:text-slate-500 block font-medium text-[11px]">Load & Weight</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-[12px]">
                            {formData.weight ? `${formData.weight} KG` : ''} {formData.loadType ? `(${formData.loadType})` : ''}
                            {!formData.weight && !formData.loadType && '-'}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-400 dark:text-slate-500 block font-medium text-[11px]">Target Budget</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[13px]">
                            {formData.budget ? `${formData.currency || '€'}${formData.budget}` : '-'}
                        </span>
                    </div>
                </div>

                {/* Additional Specs if present */}
                {(servicesCount > 0 || formData.internalReference || formData.customerNotes) && (
                    <div className="p-3 bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-md flex flex-wrap items-center justify-between gap-2 shadow-2xs text-slate-700 dark:text-slate-300">
                        {servicesCount > 0 && (
                            <span>Selected Services: <strong className="text-slate-900 dark:text-slate-100 font-bold">{servicesCount} Options Active</strong></span>
                        )}
                        {formData.internalReference && (
                            <span>Ref ID: <strong className="text-slate-800 dark:text-slate-200 font-bold">{formData.internalReference}</strong></span>
                        )}
                        {formData.customerNotes && (
                            <div className="w-full pt-1.5 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11.5px]">
                                <strong>Notes:</strong> {formData.customerNotes}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="pt-2 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 px-5 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] font-bold text-xs flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => onSubmit(undefined, 'pending')}
                    disabled={isSubmitting}
                >
                    <Save size={15} className="text-slate-500 dark:text-slate-400" />
                    <span>Save as Draft</span>
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="h-10 px-6 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    onClick={() => onSubmit(undefined, 'active')}
                    disabled={isSubmitting}
                >
                    <Send size={15} />
                    <span>{isSubmitting ? 'Posting Request...' : 'Confirm & Post Request'}</span>
                </Button>
            </div>
        </div>
    );
};
