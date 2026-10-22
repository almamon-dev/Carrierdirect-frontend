import React from 'react';
import { Truck, CheckCircle2, ShieldCheck, Headphones, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AssignedVehicleSupportCardProps {
    driverInfo: {
        vehiclePlate?: string;
        vehicleType?: string;
    };
    onOpenSupport: () => void;
}

export const AssignedVehicleSupportCard: React.FC<AssignedVehicleSupportCardProps> = ({
    driverInfo,
    onOpenSupport,
}) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Truck size={15} className="text-[#FF4A1F]" />
                    <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                        Assigned Vehicle & Equipment
                    </h3>
                </div>
                <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-[2px] border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>Verified Active</span>
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800/80">
                    <div className="text-[10.5px] text-slate-400 font-semibold flex items-center gap-1">
                        <Truck size={12} className="text-blue-500" />
                        <span>Vehicle Plate</span>
                    </div>
                    <div className="text-[13.5px] font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                        {driverInfo?.vehiclePlate || '231-D-45892'}
                    </div>
                    <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {driverInfo?.vehicleType || 'Covered Van (14ft)'}
                    </div>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800/80">
                    <div className="text-[10.5px] text-slate-400 font-semibold flex items-center gap-1">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span>Driver Status</span>
                    </div>
                    <div className="text-[13.5px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        On Duty / Active
                    </div>
                    <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        CDL & DOT Verified
                    </div>
                </div>
            </div>

            {/* Quick Action Links & Dispatcher Hotline */}
            <div className="space-y-2 pt-0.5">
                <button
                    type="button"
                    onClick={onOpenSupport}
                    className="w-full py-2 px-3 bg-orange-50/70 hover:bg-orange-100/70 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 border border-orange-200/80 dark:border-orange-900/40 rounded-[4px] text-xs font-bold text-[#FF4A1F] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                    <Headphones size={14} />
                    <span>24/7 Dispatcher & Safety Support</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                    <Link
                        to="/driver/chat"
                        className="py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-[#161a22] dark:hover:bg-[#1a202c] border border-slate-200/80 dark:border-slate-800 rounded-[4px] text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <MessageSquare size={12} className="text-purple-500" />
                        <span>Live Chat</span>
                    </Link>

                    <Link
                        to="/driver/profile"
                        className="py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-[#161a22] dark:hover:bg-[#1a202c] border border-slate-200/80 dark:border-slate-800 rounded-[4px] text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <User size={12} className="text-blue-500" />
                        <span>My Profile</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
