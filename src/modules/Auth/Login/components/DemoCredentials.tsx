import React from 'react';
import { User, Truck, Zap } from 'lucide-react';

interface DemoCredentialsProps {
    onSelect: (email: string, pass: string) => void;
}

export default function DemoCredentials({ onSelect }: DemoCredentialsProps) {
    return (
        <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-[#384150]">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap size={11} className="text-amber-500 fill-amber-500" /> Demo Credentials
                </span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500">Click to fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {/* Customer Test Account */}
                <button
                    type="button"
                    onClick={() => onSelect('customer@gmail.com', 'password')}
                    className="flex items-center justify-between p-2 bg-blue-50/70 hover:bg-blue-100/70 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-100 hover:border-blue-300 dark:border-blue-800/50 rounded-lg transition-all text-left group cursor-pointer"
                    title="customer@gmail.com • password"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <User size={11} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">Customer</div>

                        </div>
                    </div>

                </button>

                {/* Supplier Test Account */}
                <button
                    type="button"
                    onClick={() => onSelect('supplier@gmail.com', 'password')}
                    className="flex items-center justify-between p-2 bg-amber-50/70 hover:bg-amber-100/70 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 border border-amber-100 hover:border-amber-300 dark:border-amber-800/50 rounded-lg transition-all text-left group cursor-pointer"
                    title="supplier@gmail.com • password"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded bg-amber-500 text-white flex items-center justify-center shrink-0">
                            <Truck size={11} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">Supplier</div>

                        </div>

                    </div>
                </button>
            </div>
        </div>
    );
}
