import React from 'react';
import { Truck, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/button';

interface DriverDashboardHeaderProps {
    driverName?: string;
    isVerified: boolean;
    verificationStatus?: string;
    isRefreshing: boolean;
    onRefresh: () => void;
}

export const DriverDashboardHeader: React.FC<DriverDashboardHeaderProps> = ({
    driverName,
    isVerified,
    verificationStatus,
    isRefreshing,
    onRefresh,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center font-bold text-xl shrink-0">
                    <Truck size={26} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                            Driver Workspace
                        </h1>
                        <span
                            className={`px-2 py-0.5 text-[11px] font-semibold rounded-full flex items-center gap-1 ${
                                isVerified
                                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                                    : verificationStatus === 'under_review'
                                    ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                                    : 'bg-orange-100 dark:bg-orange-950/50 text-[#FF4A1F]'
                            }`}
                        >
                            {isVerified ? (
                                <>
                                    <CheckCircle2 size={12} />
                                    <span>Active on Duty</span>
                                </>
                            ) : verificationStatus === 'under_review' ? (
                                <>
                                    <Clock size={12} className="animate-pulse" />
                                    <span>Under Review</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={12} />
                                    <span>Pending Setup</span>
                                </>
                            )}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage your assigned freight trips, live navigation routes, and delivery milestones.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
                <Link to="/driver/shipments">
                    <Button size="sm" className="bg-[#FF4A1F] hover:bg-[#e03e16] text-white text-xs flex items-center gap-1.5 shadow-xs">
                        <Truck size={15} />
                        <span>Assigned Loads</span>
                    </Button>
                </Link>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="text-xs flex items-center gap-1.5"
                >
                    <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : ""} />
                    <span>{isRefreshing ? "Syncing..." : "Sync Status"}</span>
                </Button>
            </div>
        </div>
    );
};

export default DriverDashboardHeader;
