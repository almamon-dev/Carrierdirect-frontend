import React from 'react';
import { FileText, X, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/button';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';

interface SupplierPODDocModalProps {
    order: NormalizedSupplierOrder;
    onClose: () => void;
}

export const SupplierPODDocModal: React.FC<SupplierPODDocModalProps> = ({ order, onClose }) => {
    const fileUrl = order.podFileUrl || '';
    const isPdf = fileUrl.toLowerCase().includes('.pdf');
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl);
    const fileName = fileUrl
        ? fileUrl.split('/').pop() || ('CarrierDirect_Signed_POD_' + order.id + '.pdf')
        : 'CarrierDirect_Signed_POD_' + order.id + '.pdf';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <FileText size={17} className="text-[#ff4a1f]" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            Proof of Delivery Document
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
                    {fileUrl ? (
                        isImage ? (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                <img src={fileUrl} alt="Proof of Delivery" className="w-full h-auto max-h-[400px] object-contain bg-slate-50 dark:bg-slate-900/50" />
                            </div>
                        ) : isPdf ? (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                <iframe src={fileUrl} title="POD Document" className="w-full h-[400px]" />
                            </div>
                        ) : (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-2.5 min-h-[120px]">
                                <div className="w-13 h-13 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center border border-orange-200 dark:border-orange-800/60">
                                    <FileText size={26} />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{fileName}</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Verified Carrier Haulage Receipt</p>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-2.5 min-h-[180px]">
                            <div className="w-13 h-13 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center border border-orange-200 dark:border-orange-800/60">
                                <FileText size={26} />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    CarrierDirect_Signed_POD_{order.id}.pdf
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Verified Carrier Haulage Receipt
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-800/30">
                    {fileUrl && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="h-8 px-4 text-xs font-semibold inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ExternalLink size={12} />
                            Open File
                        </a>
                    )}
                    <Button variant="outline" size="sm" onClick={onClose} className="h-8 px-4 text-xs font-semibold">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SupplierPODDocModal;
