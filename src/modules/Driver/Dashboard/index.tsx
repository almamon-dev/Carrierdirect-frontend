import React, { useState, useEffect } from 'react';
import { Loader2, Clock, ShieldAlert, Truck, CheckCircle2, ShieldCheck, Headphones, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TodayOverviewCards } from './components/TodayOverviewCards';
import { DriverDashboardSkeleton } from './components/DriverDashboardSkeleton';
import { DriverDashboardHeader } from './components/DriverDashboardHeader';
import { ActiveShipmentCard } from './components/ActiveShipmentCard';
import { TodayScheduleSection } from './components/TodayScheduleSection';
import { DigitalBOLModal } from './components/DigitalBOLModal';
import { ReportsModal } from './components/ReportsModal';
import { DispatcherSupportModal } from '../Profile/components/DispatcherSupportModal';
import { GPSComingSoonModal } from '@/components/modals';
import { requireDriverCompliance, useDriverCompliance } from '../Compliance';
import { driverApi } from '../services/driverApi';
import { TOKEN_CONFIG } from '@/config/auth';
import {
    initialDashboardMetrics,
    telemetryData,
} from './data/dashboardData';

function getAuthUser() {
    try {
        const raw =
            localStorage.getItem(TOKEN_CONFIG.userKey) ||
            localStorage.getItem('carrierdirect_user_data') ||
            localStorage.getItem('user');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export default function DriverDashboard() {
    const { isVerified, verificationStatus, complianceData, reloadCompliance, setIsVerificationModalOpen } = useDriverCompliance();
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    const [metrics, setMetrics] = useState(initialDashboardMetrics);
    const [activeShipment, setActiveShipment] = useState<any>(null);
    const [scheduleList, setScheduleList] = useState<any[]>([]);
    const [driverInfo, setDriverInfo] = useState({ vehiclePlate: '231-D-45892', vehicleType: 'Volvo FH16 750 Globetrotter' });
    const [isLoading, setIsLoading] = useState(true);

    const [isBOLOpen, setIsBOLOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isGPSOpen, setIsGPSOpen] = useState(false);
    const [gpsDestination, setGpsDestination] = useState<string | undefined>(undefined);

    const loadDashboard = async () => {
        try {
            const data = await driverApi.getDashboardData();
            if (data) {
                if (data.metrics) setMetrics(data.metrics);
                setActiveShipment(data.activeShipment);
                setScheduleList(data.scheduleList || []);
                if (data.driverInfo) setDriverInfo(data.driverInfo);
            }
        } catch (err) {
            console.error('Failed to load driver dashboard data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleRefreshStatus = async () => {
        setIsCheckingStatus(true);
        try {
            await reloadCompliance();
            await loadDashboard();
        } finally {
            setTimeout(() => setIsCheckingStatus(false), 500);
        }
    };

    const handleOpenLiveGPS = (dest?: any) => {
        requireDriverCompliance(() => {
            const finalDest = typeof dest === 'string' && dest.trim() ? dest.trim() : (activeShipment?.destination?.address || 'Seattle, WA');
            setGpsDestination(finalDest);
            setIsGPSOpen(true);
        }, 'Live GPS Navigation');
    };

    const handleOpenBOL = () => {
        requireDriverCompliance(() => {
            setIsBOLOpen(true);
        }, 'Digital Bill of Lading (BOL)');
    };

    const handleOpenReports = () => {
        requireDriverCompliance(() => {
            setIsReportsOpen(true);
        }, 'Performance & Route Reports');
    };

    const authUser = getAuthUser();
    const driverName = authUser?.name || 'Commercial Driver';

    return (
        <div className="p-3 sm:p-4 md:p-5 space-y-3.5 sm:space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
            {/* ── Top Dashboard Header (Matching Supplier Portal Aesthetics) ── */}
            <DriverDashboardHeader
                driverName={driverName}
                isVerified={isVerified}
                verificationStatus={verificationStatus}
                isRefreshing={isCheckingStatus}
                onRefresh={handleRefreshStatus}
            />

            {/* ── Status Banner for Unverified / Under Review Drivers ── */}
            {!isVerified && verificationStatus === "under_review" && (
                <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 dark:border-amber-700/60 rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Clock size={20} className="animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Driver Verification Under Review (Admin Approval in Progress)
                                </h4>
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10.5px] font-bold rounded">
                                    ~ 24-48 Hours
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                Your commercial credentials and DOT medical documents have been submitted to carrier dispatch compliance team. Verification takes up to <strong>48 hours</strong>. Once approved by the administrator, active dispatch assignments will be unlocked.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                            type="button"
                            onClick={handleRefreshStatus}
                            disabled={isCheckingStatus}
                            className="px-3 py-1.5 bg-white dark:bg-[#1e2329] hover:bg-slate-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                        >
                            <Clock size={13} className={isCheckingStatus ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                            <span>{isCheckingStatus ? "Checking..." : "Refresh Status"}</span>
                        </button>
                    </div>
                </div>
            )}

            {!isVerified && verificationStatus === "rejected" && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                Verification Review Notice - Document Action Required
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                                Administrator Note: <span className="font-semibold text-red-600 dark:text-red-300">"{complianceData?.rejectionReason || "Please review and re-upload submitted document photos."}"</span>
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/driver/profile"
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shrink-0 self-end sm:self-auto cursor-pointer"
                    >
                        Fix Documents & Resubmit
                    </Link>
                </div>
            )}

            {!isVerified && verificationStatus === "pending_setup" && (
                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-[#ff4a1f] flex items-center justify-center shrink-0">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                Complete Your Driver Profile & Verification
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                                Submit your commercial CDL license and DOT medical certificate to start accepting dispatches.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsVerificationModalOpen(true)}
                        className="px-4 py-1.5 bg-[#FF4A1F] hover:bg-[#e03e15] text-white rounded text-xs font-bold shrink-0 self-end sm:self-auto cursor-pointer"
                    >
                        Start Verification (3 Steps)
                    </button>
                </div>
            )}

            {/* Main Content: Skeleton Loader while fetching or Live Dashboard */}
            {isLoading ? (
                <DriverDashboardSkeleton />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
                {/* ── LEFT COLUMN (7 cols): Today's Overview & Active Shipment in Transit ── */}
                <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
                    {/* 1. Today's Overview (4 Metrics Cards) */}
                    <TodayOverviewCards
                        metrics={metrics}
                    />

                    {/* 2. Active Shipment in Transit */}
                    <ActiveShipmentCard
                        shipment={activeShipment}
                        onOpenBOL={handleOpenBOL}
                        onOpenGPS={() => handleOpenLiveGPS(activeShipment?.destination?.address)}
                    />
                </div>

                {/* ── RIGHT COLUMN (5 cols): Today's Schedule & Telematics ── */}
                <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
                    {/* 3. Today's Schedule */}
                    <TodayScheduleSection scheduleList={scheduleList} />

                    {/* 4. Assigned Vehicle & Dispatch Support Card */}
                    <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Truck size={15} className="text-[#FF4A1F]" />
                                <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                                    Assigned Vehicle & Equipment
                                </h3>
                            </div>
                            <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-[4px] border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1">
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
                                onClick={() => setIsSupportOpen(true)}
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
                </div>
            </div>
            )}

            {/* Digital BOL Modal */}
            <DigitalBOLModal
                isOpen={isBOLOpen}
                onClose={() => setIsBOLOpen(false)}
                bolData={activeShipment}
            />

            {/* Reports Modal */}
            <ReportsModal
                isOpen={isReportsOpen}
                onClose={() => setIsReportsOpen(false)}
            />

            {/* Support Modal */}
            <DispatcherSupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
            />

            {/* GPS Coming Soon Modal */}
            <GPSComingSoonModal
                isOpen={isGPSOpen}
                destination={gpsDestination}
                onClose={() => setIsGPSOpen(false)}
            />
        </div>
    );
}
