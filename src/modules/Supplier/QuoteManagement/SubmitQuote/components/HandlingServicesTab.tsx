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
        <div className="p-5 space-y-5">
            {/* Cargo Characteristics */}
            <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Characteristics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    {[
                        { label: 'Stackable', active: requestDetails.stackable },
                        { label: 'Fragile', active: requestDetails.fragile },
                        { label: 'Hazardous', active: requestDetails.hazardous },
                        { label: `Temp Control ${requestDetails.tempRange ? `(${requestDetails.tempRange})` : ''}`, active: requestDetails.tempControlled },
                        { label: 'Oversized', active: requestDetails.oversized },
                        { label: 'Perishable', active: requestDetails.perishable },
                    ].map((item, i) => (
                        <div key={i} className={`p-2.5 rounded border flex items-center gap-2 font-medium ${
                            item.active
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold'
                                : 'bg-white dark:bg-[#181d24] border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                        }`}>
                            <Check size={13} className={item.active ? 'text-emerald-600' : 'text-slate-300'} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Required Services */}
            <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Required Services</h4>
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
                        <div key={idx} className={`p-2.5 rounded border flex items-center gap-2 font-medium ${
                            srv.active
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold'
                                : 'bg-white dark:bg-[#181d24] border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                        }`}>
                            <Check size={13} className={srv.active ? 'text-emerald-600' : 'text-slate-300'} />
                            <span>{srv.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
