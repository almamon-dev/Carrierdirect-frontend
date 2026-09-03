import React from 'react';
import { CheckCircle2, FileSpreadsheet, PackageCheck } from 'lucide-react';

interface Step4ConfirmationProps {
    extractedData: any;
    processingFileName: string;
    localFileSize: string;
    uploadedZipName: string;
    localZipSize: string;
    totalBatchBudget: number;
}

export const Step4Confirmation: React.FC<Step4ConfirmationProps> = ({
    extractedData,
    processingFileName,
    localFileSize,
    uploadedZipName,
    localZipSize,
    totalBatchBudget,
}) => {
    const rows = extractedData?.rows || (extractedData ? [extractedData] : []);
    const count = rows.length;

    return (
        <div className="space-y-3 font-sans text-xs">
            {/* Minimal Stat Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-mono">FILE</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block text-xs mt-0.5" title={processingFileName}>
                        {processingFileName || 'Manifest'}
                    </span>
                    <span className="text-[10px] text-slate-400">{localFileSize || ''}</span>
                </div>

                <div className="bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-mono">ATTACHMENTS</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block text-xs mt-0.5" title={uploadedZipName || 'None'}>
                        {uploadedZipName || 'None'}
                    </span>
                    <span className="text-[10px] text-slate-400">{localZipSize || ''}</span>
                </div>

                <div className="bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-mono">TOTAL REQUESTS</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs mt-0.5">
                        {count} items
                    </span>
                </div>

                <div className="bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-mono">TOTAL BUDGET</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs mt-0.5">
                        {totalBatchBudget > 0 ? `৳${totalBatchBudget.toLocaleString()}` : 'Standard'}
                    </span>
                </div>
            </div>

            {/* Clean Record Review List */}
            {count > 0 && (
                <div className="border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
                    <div className="px-3 py-1.5 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Manifest Shipments Queue ({count})</span>
                        <span>Click confirm below to create & broadcast</span>
                    </div>

                    <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-200/60 dark:divide-slate-800/80 text-xs">
                        {rows.map((r: any, idx: number) => {
                            const title = r.requestTitle || r.title || r.request_title || `Quote Request #${idx + 1}`;
                            const pickupStr = r.pickupCity || r.pickup_city || r.pickupAddress || r.pickup || 'Origin';
                            const deliveryStr = r.deliveryCity || r.delivery_city || r.deliveryAddress || r.delivery || 'Destination';
                            const amount = r.budget || r.amount || '';
                            const amountNum = Number(String(amount).replace(/[^0-9.]/g, ''));

                            return (
                                <div key={r.id || idx} className="px-3 py-1.5 flex items-center justify-between hover:bg-white/60 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-2 truncate max-w-[75%]">
                                        <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500">
                                            {String(idx + 1).padStart(2, '0')}.
                                        </span>
                                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                            {pickupStr} <span className="text-slate-400 font-normal">➔</span> {deliveryStr}
                                        </span>
                                        <span className="text-slate-400 dark:text-slate-500 text-[11px] truncate hidden sm:inline">
                                            · {title}
                                        </span>
                                    </div>

                                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                                        {amountNum > 0 ? `৳${amountNum.toLocaleString()}` : ''}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
