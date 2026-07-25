import React from 'react';
import { CheckCircle2, Send, MapPin, Truck, Euro, Paperclip } from 'lucide-react';
import Button from '@/components/ui/button';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';

interface SectionProps {
    formData: QuoteFormData;
    servicesCount: number;
    isSubmitting: boolean;
    onSubmit: (e?: React.FormEvent) => void;
}

export const ReviewSubmitSection: React.FC<SectionProps> = ({
    formData,
    servicesCount,
    isSubmitting,
    onSubmit,
}) => {
    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <TabHeader title="Review Request Summary" icon={CheckCircle2} />
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">{formData.requestTitle || 'Untitled Quote Request'}</h4>
                        <p className="text-slate-500 font-medium text-[11px] mt-0.5">Priority: <span className="font-bold text-red-600">{formData.priority}</span> | Type: {formData.shipmentType} ({formData.serviceType})</p>
                    </div>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 text-xs">
                        Ready to Post
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-white border border-slate-200 rounded">
                        <span className="font-bold text-purple-700 flex items-center gap-1 mb-1">
                            <MapPin size={13} /> Pickup Location
                        </span>
                        <p className="font-bold text-slate-900">{formData.pickupCompany || 'Not specified'}</p>
                        <p className="text-slate-600">{formData.pickupAddress || 'Address not entered'}</p>
                        <p className="text-slate-500 mt-1">Date: {formData.pickupDate} {formData.pickupTime}</p>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded">
                        <span className="font-bold text-emerald-700 flex items-center gap-1 mb-1">
                            <MapPin size={13} /> Delivery Location
                        </span>
                        <p className="font-bold text-slate-900">{formData.deliveryCompany || 'Not specified'}</p>
                        <p className="text-slate-600">{formData.deliveryAddress || 'Address not entered'}</p>
                        <p className="text-slate-500 mt-1">Date: {formData.deliveryDate} {formData.deliveryTime}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-white border border-slate-200 rounded">
                    <div>
                        <span className="text-slate-400 block font-medium">Vehicle</span>
                        <span className="font-bold text-slate-900">{formData.vehicleType || 'Any'}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block font-medium">Load & Weight</span>
                        <span className="font-bold text-slate-900">{formData.weight ? `${formData.weight} KG` : 'N/A'} ({formData.loadType || 'General'})</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block font-medium">Target Budget</span>
                        <span className="font-bold text-emerald-600 text-sm">€{formData.budget || 'Open'}</span>
                    </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded flex items-center justify-between">
                    <span>Active Services & Requirements: <strong className="text-slate-900">{servicesCount} Selected</strong></span>
                    <span>Ref ID: <strong className="text-slate-900">{formData.internalReference || 'Auto Generated'}</strong></span>
                </div>
            </div>

            <div className="pt-2 flex justify-end">
                <Button 
                    type="button" 
                    variant="primary" 
                    size="sm"
                    className="h-10 px-6 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    onClick={() => onSubmit()}
                    disabled={isSubmitting}
                >
                    <Send size={15} />
                    <span>{isSubmitting ? 'Posting Request...' : 'Confirm & Post Request'}</span>
                </Button>
            </div>
        </div>
    );
};
