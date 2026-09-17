import React from 'react';
import { X, BarChart3, Download } from 'lucide-react';
import Button from '@/components/ui/button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ReportsModal: React.FC<Props> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                            <BarChart3 size={17} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Driver Performance & Reports</h2>
                            <p className="text-[11px] text-slate-500">Daily shift summary and metrics</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[4px] transition-colors cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
                    {/* Summary cards */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-200 dark:border-slate-800">
                            <div className="text-[11px] text-slate-400 font-semibold">Today's Earnings</div>
                            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">$480.00</div>
                            <div className="text-[10.5px] text-slate-400 mt-0.5">+$65.00 Fuel Surcharge</div>
                        </div>

                        <div className="p-3.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-200 dark:border-slate-800">
                            <div className="text-[11px] text-slate-400 font-semibold">On-Time Rate</div>
                            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">99.4%</div>
                            <div className="text-[10.5px] text-emerald-600 font-semibold mt-0.5">Top 5% Carrier Driver</div>
                        </div>
                    </div>

                    {/* Breakdown list */}
                    <div className="space-y-1.5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Shift Breakdown</h3>
                        <div className="p-2.5 bg-white dark:bg-[#12161c] rounded-[4px] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Total Driving Hours</span>
                            <span className="font-bold text-slate-900 dark:text-white">4h 12m</span>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-[#12161c] rounded-[4px] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Total Distance Logged</span>
                            <span className="font-bold text-slate-900 dark:text-white">142.6 km</span>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-[#12161c] rounded-[4px] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Completed Orders</span>
                            <span className="font-bold text-slate-900 dark:text-white">8 Orders</span>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-[#12161c] rounded-[4px] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Customer Satisfaction</span>
                            <span className="font-bold text-amber-500">4.95 / 5.00 ★</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/50 dark:bg-[#161a22]">
                    <Button variant="outline" size="sm" onClick={onClose} className="text-xs rounded-[4px]">
                        Close
                    </Button>
                    <Button size="sm" className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs flex items-center gap-1.5 shadow-2xs rounded-[4px]">
                        <Download size={13} />
                        <span>Export Report</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
