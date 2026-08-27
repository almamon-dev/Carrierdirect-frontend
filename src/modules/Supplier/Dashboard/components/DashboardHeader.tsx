import React from 'react';
import { CheckCircle2, RefreshCw, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import { DashboardProfile } from '../types/dashboard.types';

interface DashboardHeaderProps {
    profile: DashboardProfile | null;
    isRefreshing: boolean;
    onRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    profile,
    isRefreshing,
    onRefresh,
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#181a20] p-4 sm:p-5 rounded-xl border border-slate-200/90 dark:border-[#384150] shadow-2xs">
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Supplier Dashboard
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                        <CheckCircle2 size={12} />
                        Active Partner
                    </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Welcome back{profile?.name || profile?.company_name ? `, ${profile.name || profile.company_name}` : ''}! Here is your live operations and revenue overview.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="h-9 px-3 text-xs font-semibold border-slate-200 dark:border-[#384150] hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                    <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                    <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/supplier/quotes/requests')}
                    className="h-9 px-3.5 text-xs font-bold bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                    <Truck size={14} />
                    <span>Live Requests</span>
                </Button>
            </div>
        </div>
    );
};
