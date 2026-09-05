/**
 * Handling & Required Services Tab Component
 * Displays cargo characteristics (stackable, fragile, hazardous, temp control)
 * and required carrier services (loading, packaging, lift gate, white glove).
 */

import React from 'react';
import { Check } from 'lucide-react';
import { QuoteRequest } from '../../data/quoteRequestsData';

interface HandlingServicesTabProps {
    requestDetails: QuoteRequest;
}

export const HandlingServicesTab: React.FC<HandlingServicesTabProps> = ({ requestDetails }) => {
    return (
        <div className="p-3.5 sm:p-4 space-y-3.5 font-sans">
            {/* Cargo Characteristics */}
            <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Cargo Characteristics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                        { label: 'Stackable', active: requestDetails.stackable },
                        { label: 'Fragile', active: requestDetails.fragile },
                        { label: 'Hazardous', active: requestDetails.hazardous },
                        { label: `Temp Control ${requestDetails.tempRange ? `(${requestDetails.tempRange})` : ''}`, active: requestDetails.tempControlled },
                        { label: 'Oversized', active: requestDetails.oversized },
                        { label: 'Perishable', active: requestDetails.perishable },
                    ].map((item, i) => (
                        <div key={i} className={`p-2 rounded-[3px] border flex items-center gap-1.5 text-xs ${
                            item.active
                                ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium'
                                : 'bg-white dark:bg-[#181d24] border-slate-200/60 dark:border-slate-800 text-slate-400 line-through font-normal'
                        }`}>
                            <Check size={12} className={item.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Required Services */}
            <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Required Services</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                        { label: 'Loading Required', active: requestDetails.loadingRequired },
                        { label: 'Unloading Required', active: requestDetails.unloadingRequired },
                        { label: 'Packaging Service', active: requestDetails.packaging },
                        { label: 'Insurance Coverage', active: requestDetails.insurance },
                        { label: 'Lift Gate Needed', active: requestDetails.liftGate },
                        { label: 'White Glove Service', active: requestDetails.whiteGlove },
                        { label: 'Assembly / Installation', active: requestDetails.assembly },
                        { label: 'Inside Delivery', active: requestDetails.insideDelivery },
                    ].map((srv, idx) => (
                        <div key={idx} className={`p-2 rounded-[3px] border flex items-center gap-1.5 text-xs ${
                            srv.active
                                ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium'
                                : 'bg-white dark:bg-[#181d24] border-slate-200/60 dark:border-slate-800 text-slate-400 line-through font-normal'
                        }`}>
                            <Check size={12} className={srv.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'} />
                            <span>{srv.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
