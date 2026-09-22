import React, { useState } from 'react';
import { Loader2, Clock, AlertTriangle, ShieldAlert, CheckCircle2, RotateCw, Radio, Wifi, Gauge, Fuel, Thermometer, ShieldCheck, Headphones, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TodayOverviewCards } from './components/TodayOverviewCards';
import { ActiveShipmentCard } from './components/ActiveShipmentCard';
import { TodayScheduleSection } from './components/TodayScheduleSection';
import { DigitalBOLModal } from './components/DigitalBOLModal';
import { ReportsModal } from './components/ReportsModal';
import { DispatcherSupportModal } from '../Profile/components/DispatcherSupportModal';
import { GPSComingSoonModal } from '@/components/modals';
import { requireDriverCompliance, useDriverCompliance } from '../Compliance';
import {
    initialDashboardMetrics,
    activeShipmentInTransit,
    todayScheduleList,
    telemetryData,
} from './data/dashboardData';

export default function DriverDashboard() {
    const { isVerified, verificationStatus, complianceData, reloadCompliance, setIsVerificationModalOpen } = useDriverCompliance();
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    const handleRefreshStatus = async () => {
        setIsCheckingStatus(true);
        try {
            await reloadCompliance();
        } finally {
            setTimeout(() => setIsCheckingStatus(false), 500);
        }
    };

    const [metrics] = useState(initialDashboardMetrics);
    const [activeShipment] = useState(activeShipmentInTransit);
    const [scheduleList] = useState(todayScheduleList);
    const [telemetry] = useState(telemetryData);
    const [isBOLOpen, setIsBOLOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isGPSOpen, setIsGPSOpen] = useState(false);
    const [gpsDestination, setGpsDestination] = useState<string | undefined>(undefined);

    const handleOpenLiveGPS = (dest?: string) => {
        requireDriverCompliance(() => {
            setGpsDestination(dest || activeShipment?.destination?.address || 'Seattle, WA');
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

    return (
        <div className="p-3 sm:p-4 md:p-5 space-y-3.5 sm:space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
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
                            <RotateCw size={12} className={isCheckingStatus ? "animate-spin" : ""} />
                            <span>{isCheckingStatus ? "Checking..." : "Refresh Status"}</span>
                        </button>
                        <Link
                            to="/driver/profile"
                            className="px-3 py-1.5 bg-[#FF4A1F] hover:bg-[#e03e15] text-white rounded text-xs font-bold transition-colors shadow-2xs"
                        >
                            View Submitted Dossier
                        </Link>
                    </div>
                </div>
            )}

            {!isVerified && verificationStatus === "rejected" && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-red-700 dark:text-red-400">
                                Verification Revision Requested
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

            {/* Left and Right Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
                {/* ── LEFT COLUMN (7 cols): Today's Overview & Active Shipment in Transit ── */}
                <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
                    {/* 1. Today's Overview (4 Metrics Cards + 3 Action Buttons) */}
                    <TodayOverviewCards
                        metrics={metrics}
                        onOpenGPS={handleOpenLiveGPS}
                        onOpenBOL={handleOpenBOL}
                        onOpenReports={handleOpenReports}
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

                    {/* 4. Vehicle Telemetry & GPS Telematics Status */}
                    <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Radio size={15} className="text-emerald-500 animate-pulse" />
                                <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                                    Fleet Unit ({telemetry.vehiclePlate})
                                </h3>
                            </div>
                            <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-[4px] border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1">
                                <Wifi size={11} />
                                <span>Connected</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800/80">
                                <div className="text-[10.5px] text-slate-400 font-semibold flex items-center gap-1">
                                    <Fuel size={12} className="text-amber-500" />
                                    <span>Diesel Fuel</span>
                                </div>
                                <div className="text-[15px] font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 tabular-nums">
                                    {telemetry.fuelLevel}%
                                </div>
                            </div>

                            <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800/80">
                                <div className="text-[10.5px] text-slate-400 font-semibold flex items-center gap-1">
                                    <Gauge size={12} className="text-blue-500" />
                                    <span>Cruising Speed</span>
                                </div>
                                <div className="text-[15px] font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 tabular-nums">
                                    {telemetry.speed}
                                </div>
                            </div>
                        </div>

                        {/* Dispatcher Hotline shortcut */}
                        <div className="pt-0.5">
                            <button
                                type="button"
                                onClick={() => setIsSupportOpen(true)}
                                className="w-full py-2 px-3 bg-orange-50/70 hover:bg-orange-100/70 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 border border-orange-200/80 dark:border-orange-900/40 rounded-[4px] text-xs font-bold text-[#FF4A1F] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                                <Headphones size={14} />
                                <span>24/7 Dispatcher & Safety SOS</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
