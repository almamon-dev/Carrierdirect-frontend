import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, FileCheck, AlertTriangle, Headphones, ShieldAlert, Navigation } from 'lucide-react';

interface Props {
    onOpenSOS: () => void;
}

export const DriverQuickActions: React.FC<Props> = ({ onOpenSOS }) => {
    return (
        <div className="bg-white dark:bg-[#12161c] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Driver Quick Actions
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Upload POD */}
                <Link
                    to="/driver/shipments"
                    className="p-3.5 bg-orange-50/60 hover:bg-orange-100/60 dark:bg-orange-950/20 dark:hover:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40 rounded-xl text-center space-y-1.5 transition-all group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-lg bg-[#FF4A1F] text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                        <FileCheck size={20} />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Upload POD</div>
                    <div className="text-[10px] text-slate-400">Receipt / Signature</div>
                </Link>

                {/* 2. Scan BOL */}
                <Link
                    to="/driver/shipments"
                    className="p-3.5 bg-blue-50/60 hover:bg-blue-100/60 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 rounded-xl text-center space-y-1.5 transition-all group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                        <QrCode size={20} />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Scan Cargo</div>
                    <div className="text-[10px] text-slate-400">Barcode / QR BOL</div>
                </Link>

                {/* 3. Dispatcher Chat */}
                <Link
                    to="/driver/chat"
                    className="p-3.5 bg-purple-50/60 hover:bg-purple-100/60 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40 rounded-xl text-center space-y-1.5 transition-all group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                        <Headphones size={20} />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Live Dispatch</div>
                    <div className="text-[10px] text-slate-400">Instant Chat & Voice</div>
                </Link>

                {/* 4. SOS Emergency */}
                <button
                    onClick={onOpenSOS}
                    className="p-3.5 bg-red-50/60 hover:bg-red-100/60 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-200/60 dark:border-red-900/40 rounded-xl text-center space-y-1.5 transition-all group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                        <ShieldAlert size={20} />
                    </div>
                    <div className="text-xs font-bold text-red-600 dark:text-red-400">SOS Emergency</div>
                    <div className="text-[10px] text-slate-400">Priority Hotline</div>
                </button>
            </div>
        </div>
    );
};
