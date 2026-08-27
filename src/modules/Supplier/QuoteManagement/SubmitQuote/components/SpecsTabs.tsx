/**
 * SpecsTabs Component
 * Displays 3 tabs: Vehicle & Specs (with side-by-side Cargo Dimensions table and
 * Vehicle & Shipment Specifications list), Handling & Services, and Notes & Files.
 */

import React, { useState } from 'react';
import { Truck, Settings, FileText, Layers, Box } from 'lucide-react';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { HandlingServicesTab } from './HandlingServicesTab';
import { InstructionsTab } from './InstructionsTab';

interface SpecsTabsProps {
    requestDetails: QuoteRequest;
}

export const SpecsTabs: React.FC<SpecsTabsProps> = ({ requestDetails }) => {
    const [activeTab, setActiveTab] = useState<'specs' | 'services' | 'notes'>('specs');

    const dimensionsList = (requestDetails.dimensions && requestDetails.dimensions.length > 0)
        ? requestDetails.dimensions
        : [{ id: 1, length: '120', width: '100', height: '150', qty: '5', unit: 'CM' }];

    const filesCount = (requestDetails.documents?.length || 0) + (requestDetails.notes ? 1 : 0);

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden font-sans">
            {/* Underline Tab Navigation */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 px-5 overflow-x-auto overflow-y-hidden hide-scrollbar no-scrollbar">
                <button
                    type="button"
                    onClick={() => setActiveTab('specs')}
                    className={`py-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'specs'
                            ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <Truck size={14} /> Vehicle & Specs
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('services')}
                    className={`py-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'services'
                            ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <Settings size={14} /> Handling & Services
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('notes')}
                    className={`py-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'notes'
                            ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <FileText size={14} /> Notes & Files ({filesCount})
                </button>
            </div>

            {/* Tab 1: Vehicle & Specs (Side-by-Side 2-column layout) */}
            {activeTab === 'specs' && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left Column: Cargo Dimensions */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <Layers size={13} className="text-slate-500" /> Cargo Dimensions
                            </h4>
                            <span className="text-xs text-slate-400 font-medium">
                                {dimensionsList.length} item{dimensionsList.length > 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#181d24] text-slate-500 dark:text-slate-400 font-semibold">
                                        <th className="py-2 px-3 text-left w-10">#</th>
                                        <th className="py-2 px-3 text-left">Length</th>
                                        <th className="py-2 px-3 text-left">Width</th>
                                        <th className="py-2 px-3 text-left">Height</th>
                                        <th className="py-2 px-3 text-center">Qty</th>
                                        <th className="py-2 px-3 text-center">Unit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#1e2329]">
                                    {dimensionsList.map((dim, i) => (
                                        <tr key={dim.id || i}>
                                            <td className="py-2 px-3 text-slate-900 dark:text-slate-100 font-bold">#{i + 1}</td>
                                            <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-semibold">{dim.length}</td>
                                            <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-semibold">{dim.width}</td>
                                            <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-semibold">{dim.height}</td>
                                            <td className="py-2 px-3 text-center text-slate-900 dark:text-slate-100 font-bold">{dim.qty}</td>
                                            <td className="py-2 px-3 text-center text-slate-500 uppercase">{dim.unit || 'CM'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: Vehicle & Shipment Specifications */}
                    <div className="space-y-2.5">
                        <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <Box size={13} className="text-slate-500" /> Vehicle & Shipment Specifications
                            </h4>
                        </div>
                        <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800/60">
                            <div className="flex items-center justify-between pt-1.5 first:pt-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Vehicle Type :</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{requestDetails.vehicleType || 'Covered Van (20ft)'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Total Weight :</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{requestDetails.weight || '12,500 kg'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Load Type :</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{requestDetails.loadType || 'Pallets'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Items Summary :</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{requestDetails.itemsCount || '5 Pallets'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Total Volume :</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{requestDetails.volume || '120.00 × 100.00 × 150.00 cm'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Transit Distance :</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{requestDetails.distance || '245 km'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Handling & Services */}
            {activeTab === 'services' && <HandlingServicesTab requestDetails={requestDetails} />}

            {/* Tab 3: Notes & Attached Files */}
            {activeTab === 'notes' && <InstructionsTab requestDetails={requestDetails} />}
        </div>
    );
};
