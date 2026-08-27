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
        <div className="p-5 space-y-5">
            {/* Special Instructions List */}
            <div className="space-y-2.5">
                {[
                    { label: 'Pickup Instructions', text: requestDetails.pickupInstructions, color: 'border-blue-400 bg-blue-50 dark:bg-blue-950/30', labelColor: 'text-blue-700 dark:text-blue-300', icon: '📦' },
                    { label: 'Delivery Instructions', text: requestDetails.deliveryInstructions, color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30', labelColor: 'text-emerald-700 dark:text-emerald-300', icon: '🚚' },
                ].map((item, i) => (
                    <div key={i} className={`flex gap-3 p-3.5 rounded-lg border-l-4 ${item.color} border border-slate-200 dark:border-slate-800`}>
                        <span className="text-base shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                            <span className={`text-[11px] font-bold uppercase tracking-wide ${item.labelColor} block mb-1`}>{item.label}</span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                {item.text || <span className="text-slate-400 italic">No instructions provided</span>}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Attached Documents List */}
            <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                    <FileText size={13} className="text-slate-500" /> Attached Documents
                </h4>
                {requestDetails.documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#181d24] text-slate-400 text-xs">
                        No documents attached
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {requestDetails.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#181d24]">
                                <div className="flex items-center gap-3 min-w-0">
                                    <FileText size={16} className="text-blue-600 shrink-0" />
                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{doc.name}</span>
                                </div>
                                <a 
                                    href={doc.url || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-slate-50 dark:bg-[#252a32] border border-slate-200 dark:border-slate-700 px-2 py-1 rounded"
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
