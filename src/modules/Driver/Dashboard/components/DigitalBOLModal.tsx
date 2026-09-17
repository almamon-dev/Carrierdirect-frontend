import React from 'react';
import { X, FileText, Download, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    bolData?: any;
}

export const DigitalBOLModal: React.FC<Props> = ({ isOpen, onClose, bolData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-orange-100 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center">
                            <FileText size={17} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Digital Bill of Lading (BOL)</h2>
                            <p className="text-[11px] text-slate-500">BOL Document #{bolData?.orderNumber || '#SHP-987654'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[4px] transition-colors cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                {/* BOL Document Body */}
                <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto font-sans text-xs">
                    {/* Header info */}
                    <div className="p-3.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <div className="text-xs font-black text-slate-900 dark:text-white">CARRIER DIRECT FREIGHT</div>
                            <div className="text-slate-500 text-[10.5px] mt-0.5">Standard Truckload Uniform BOL • e-Signed</div>
                        </div>
                        <div className="text-right">
                            <span className="px-2 py-0.5 font-mono font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 rounded-[4px] border border-blue-200">
                                {bolData?.cargoTag || 'Reefer -18°C'}
                            </span>
                        </div>
                    </div>

                    {/* Shipper & Consignee */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 bg-white dark:bg-[#12161c] rounded-[4px] border border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Shipper (Origin)</div>
                            <div className="font-bold text-slate-900 dark:text-white">{bolData?.origin?.name || 'ABC Warehouse Logistics'}</div>
                            <div className="text-slate-500 text-[11px]">{bolData?.origin?.address || 'Port Logistics Park, Seattle WA'}</div>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#12161c] rounded-[4px] border border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Consignee (Delivery)</div>
                            <div className="font-bold text-slate-900 dark:text-white">{bolData?.destination?.name || 'Starlight Supermarket Central'}</div>
                            <div className="text-slate-500 text-[11px]">{bolData?.destination?.address || '742 Evergreen Terrace, Seattle WA'}</div>
                        </div>
                    </div>

                    {/* Cargo Specs */}
                    <div className="p-3.5 bg-white dark:bg-[#12161c] rounded-[4px] border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Commodity Description</div>
                        <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                            <span>Refrigerated Commercial Food Supplies</span>
                            <span>16,500 kg (20 Pallets)</span>
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-1 font-bold">
                            <CheckCircle2 size={13} />
                            <span>Temperature Controlled Setpoint: -18°C verified intact</span>
                        </div>
                    </div>

                    {/* Barcode representation */}
                    <div className="p-3 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-200 dark:border-slate-800 text-center space-y-0.5">
                        <div className="font-mono text-base tracking-widest font-black text-slate-800 dark:text-slate-200">
                            ||| | |||| || | ||| |||| | ||||| ||
                        </div>
                        <div className="text-[10.5px] font-mono text-slate-400">TRK-SEATTLE-987654-BOL</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#161a22]">
                    <span className="text-[11px] text-slate-400">CarrierDirect Verified Digital BOL</span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onClose} className="text-xs rounded-[4px]">
                            Close
                        </Button>
                        <Button size="sm" className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs flex items-center gap-1.5 shadow-2xs rounded-[4px]">
                            <Download size={13} />
                            <span>Download PDF</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
