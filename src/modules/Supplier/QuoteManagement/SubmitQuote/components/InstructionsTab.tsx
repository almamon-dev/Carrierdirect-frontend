/**
 * Instructions & Attached Files Tab Component
 * Displays special pickup and delivery notes alongside downloadable shipping documents.
 */

import React from 'react';
import { FileText, Download } from 'lucide-react';
import { QuoteRequest } from '../../data/quoteRequestsData';

interface InstructionsTabProps {
    requestDetails: QuoteRequest;
}

export const InstructionsTab: React.FC<InstructionsTabProps> = ({ requestDetails }) => {
    return (
        <div className="p-3.5 sm:p-4 space-y-3.5 font-sans">
            {/* Special Instructions List */}
            <div className="space-y-2">
                {[
                    { label: 'Pickup Instructions', text: requestDetails.pickupInstructions, color: 'border-l-blue-500 bg-slate-50/60 dark:bg-slate-800/40', labelColor: 'text-slate-700 dark:text-slate-300', icon: '📦' },
                    { label: 'Delivery Instructions', text: requestDetails.deliveryInstructions, color: 'border-l-emerald-500 bg-slate-50/60 dark:bg-slate-800/40', labelColor: 'text-slate-700 dark:text-slate-300', icon: '🚚' },
                ].map((item, i) => (
                    <div key={i} className={`flex gap-2.5 p-3 rounded-[3px] border-l-3 ${item.color} border border-slate-200/80 dark:border-slate-800`}>
                        <span className="text-sm shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                            <span className={`text-xs font-semibold ${item.labelColor} block mb-0.5`}>{item.label}</span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-normal">
                                {item.text || <span className="text-slate-400 italic">No instructions provided</span>}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Attached Documents List */}
            <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <FileText size={12.5} className="text-slate-400" /> Attached Documents
                </h4>
                {requestDetails.documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-4 rounded-[3px] border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#181d24] text-slate-400 text-xs font-normal">
                        No documents attached
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-1.5">
                        {requestDetails.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-[3px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#181d24]">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <FileText size={14} className="text-slate-500 shrink-0" />
                                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{doc.name}</span>
                                </div>
                                <a 
                                    href={doc.url || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-slate-50 dark:bg-[#252a32] border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-[3px]"
                                >
                                    <Download size={11} /> Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
