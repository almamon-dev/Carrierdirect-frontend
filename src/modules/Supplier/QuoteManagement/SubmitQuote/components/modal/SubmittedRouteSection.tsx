import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { QuoteRequest } from '../../../data/quoteRequestsData';
import { DetailRow } from './SubmittedSpecsSection';

export const SubmittedRouteSection: React.FC<{ requestDetails: QuoteRequest }> = ({ requestDetails }) => (
    <div className="space-y-0.5 min-w-0">
        <h4 className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 pb-0.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>Route & Location Details</span>
        </h4>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            <DetailRow
                label="Pickup Address"
                value={
                    <div className="min-w-0" title={requestDetails.pickupFullAddress || requestDetails.pickup}>
                        <div className="leading-snug text-slate-800 dark:text-slate-200 font-medium text-[11.5px]">
                            {requestDetails.pickupFullAddress || requestDetails.pickup || '—'}
                        </div>
                        {requestDetails.pickupDate && (
                            <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                                Pickup: {requestDetails.pickupDate} {requestDetails.pickupTimeWindow ? `(${requestDetails.pickupTimeWindow})` : ''}
                            </div>
                        )}
                    </div>
                }
            />
            <DetailRow
                label="Delivery Address"
                value={
                    <div className="min-w-0" title={requestDetails.deliveryFullAddress || requestDetails.delivery}>
                        <div className="leading-snug text-slate-800 dark:text-slate-200 font-medium text-[11.5px]">
                            {requestDetails.deliveryFullAddress || requestDetails.delivery || '—'}
                        </div>
                        {requestDetails.deliveryDate && (
                            <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                                Delivery: {requestDetails.deliveryDate} {requestDetails.deliveryTimeWindow ? `(${requestDetails.deliveryTimeWindow})` : ''}
                            </div>
                        )}
                    </div>
                }
            />
        </div>
    </div>
);
