import React from 'react';
import { Clock, ShieldCheck, MessageSquare, User, Headphones, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AssignedVehicleSupportCardProps {
    driverInfo?: any;
    onOpenSupport?: () => void;
    onOpenReports?: () => void;
}

export const AssignedVehicleSupportCard: React.FC<AssignedVehicleSupportCardProps> = ({
    onOpenSupport,
    onOpenReports,
}) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 font-sans">
            {/* Header: Driver Duty & Dispatch Support + On Duty Status badge */}
            <div className="flex items-center justify-between">
                <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100">
                    Driver Duty & Dispatch Support
                </h3>
                <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-[4px] border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>On Duty / Active</span>
                </span>
            </div>

            {/* 2-Column Driver Status & Operations Grid (No single-car dependency) */}
            <div className="grid grid-cols-2 gap-2.5">
                {/* Shift & Duty Status */}
                <div className="p-2.5 bg-slate-50/80 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800/80">
                    <div className="text-[10.5px] text-slate-400 font-medium flex items-center gap-1.5">
                        <Clock size={13} className="text-blue-500" />
                        <span>Duty Status</span>
                    </div>
                    <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100 mt-1 truncate">
                        Active Shift
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 truncate flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        <span>Ready for Orders</span>
                    </div>
                </div>

                {/* Safety & Compliance Status */}
                <div className="p-2.5 bg-slate-50/80 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800/80">
                    <div className="text-[10.5px] text-slate-400 font-medium flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span>Driver Compliance</span>
                    </div>
                    <div className="text-[13px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                        100% Verified
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                        Permits Up to Date
                    </div>
                </div>
            </div>

            {/* 24/7 Dispatch & Roadside Safety Support Banner */}
            <button
                type="button"
                onClick={onOpenSupport}
                className="w-full py-2 px-3 bg-[#FFF5F2] hover:bg-[#FFEAE3] dark:bg-orange-950/25 dark:hover:bg-orange-950/40 border border-[#FFE2D7] dark:border-orange-900/40 rounded-[4px] text-[11.5px] font-bold text-[#FF4A1F] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
                <Headphones size={13} />
                <span>24/7 Dispatcher & Safety Support</span>
            </button>

            {/* Quick Actions Grid: Live Chat, Performance Reports & Profile */}
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                <Link
                    to="/driver/chat"
                    className="py-1.5 px-2 bg-white hover:bg-slate-50 dark:bg-[#1e2329] dark:hover:bg-[#252b33] border border-slate-200/90 dark:border-slate-700/80 rounded-[4px] text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1 transition-colors shadow-2xs"
                    title="Live Dispatcher Chat"
                >
                    <MessageSquare size={12} className="text-slate-500 shrink-0" />
                    <span className="truncate">Live Chat</span>
                </Link>

                <button
                    type="button"
                    onClick={onOpenReports}
                    className="py-1.5 px-2 bg-white hover:bg-slate-50 dark:bg-[#1e2329] dark:hover:bg-[#252b33] border border-slate-200/90 dark:border-slate-700/80 rounded-[4px] text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    title="View Shift Reports & Earnings"
                >
                    <BarChart3 size={12} className="text-emerald-600 shrink-0" />
                    <span className="truncate">Reports</span>
                </button>

                <Link
                    to="/driver/profile"
                    className="py-1.5 px-2 bg-white hover:bg-slate-50 dark:bg-[#1e2329] dark:hover:bg-[#252b33] border border-slate-200/90 dark:border-slate-700/80 rounded-[4px] text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1 transition-colors shadow-2xs"
                    title="Driver Profile & Documents"
                >
                    <User size={12} className="text-slate-500 shrink-0" />
                    <span className="truncate">My Profile</span>
                </Link>
            </div>
        </div>
    );
};

export default AssignedVehicleSupportCard;
