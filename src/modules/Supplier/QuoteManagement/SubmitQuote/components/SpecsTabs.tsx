import React, { useState } from 'react';
import { Truck, Settings, FileText, Box } from 'lucide-react';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { HandlingServicesTab } from './HandlingServicesTab';
import { InstructionsTab } from './InstructionsTab';
import { CargoDimensionsTable } from './CargoDimensionsTable';

interface SpecsTabsProps {
    requestDetails: QuoteRequest;
}

export const SpecsTabs: React.FC<SpecsTabsProps> = ({ requestDetails }) => {
    const [activeTab, setActiveTab] = useState<'specs' | 'services' | 'notes'>('specs');
    const dimensionsList = requestDetails.dimensions || [];
    const filesCount = (requestDetails.documents?.length || 0) + (requestDetails.notes ? 1 : 0);

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] shadow-2xs overflow-hidden font-sans">
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-5 px-4 overflow-x-auto overflow-y-hidden hide-scrollbar no-scrollbar">
                <button
                    type="button"
                    onClick={() => setActiveTab('specs')}
                    className={`py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'specs' ? 'border-[#ff4a1f] text-[#ff4a1f] font-semibold' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <Truck size={13} /> Vehicle & Specs
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('services')}
                    className={`py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'services' ? 'border-[#ff4a1f] text-[#ff4a1f] font-semibold' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <Settings size={13} /> Handling & Services
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('notes')}
                    className={`py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'notes' ? 'border-[#ff4a1f] text-[#ff4a1f] font-semibold' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <FileText size={13} /> Notes & Files ({filesCount})
                </button>
            </div>

            {activeTab === 'specs' && (
                <div className="p-3.5 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <CargoDimensionsTable dimensionsList={dimensionsList} />

                    <div className="space-y-2">
                        <div className="pb-1 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                <Box size={12.5} className="text-slate-400" /> Vehicle & Shipment Specifications
                            </h4>
                        </div>
                        <div className="space-y-1.5 text-xs divide-y divide-slate-100 dark:divide-slate-800/60">
                            <div className="flex items-center justify-between pt-1.5 first:pt-0">
                                <span className="text-slate-500 dark:text-slate-400 font-normal text-[11.5px]">Vehicle Type :</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{requestDetails.vehicleType && requestDetails.vehicleType !== '—' ? requestDetails.vehicleType : '—'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-normal text-[11.5px]">Total Weight :</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{requestDetails.weight && requestDetails.weight !== '—' ? requestDetails.weight : '—'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-normal text-[11.5px]">Load Type :</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{requestDetails.loadType && requestDetails.loadType !== '—' ? requestDetails.loadType : '—'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-normal text-[11.5px]">Items Summary :</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{requestDetails.itemsCount && requestDetails.itemsCount !== '—' ? requestDetails.itemsCount : '—'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-normal text-[11.5px]">Total Volume :</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{requestDetails.volume && requestDetails.volume !== '—' ? requestDetails.volume : '—'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-normal text-[11.5px]">Transit Distance :</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{requestDetails.distance && requestDetails.distance !== '—' ? requestDetails.distance : '—'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'services' && <HandlingServicesTab requestDetails={requestDetails} />}
            {activeTab === 'notes' && <InstructionsTab requestDetails={requestDetails} />}
        </div>
    );
};
