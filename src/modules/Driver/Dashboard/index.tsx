import React, { useState } from 'react';
import { Loader2, Radio, Wifi, Gauge, Fuel, Thermometer, ShieldCheck, Headphones, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TodayOverviewCards } from './components/TodayOverviewCards';
import { ActiveShipmentCard } from './components/ActiveShipmentCard';
import { TodayScheduleSection } from './components/TodayScheduleSection';
import { DigitalBOLModal } from './components/DigitalBOLModal';
import { ReportsModal } from './components/ReportsModal';
import { DispatcherSupportModal } from '../Profile/components/DispatcherSupportModal';
import { requireDriverCompliance } from '../Compliance';
import {
    initialDashboardMetrics,
    activeShipmentInTransit,
    todayScheduleList,
    telemetryData,
} from './data/dashboardData';

export default function DriverDashboard() {
    const [metrics] = useState(initialDashboardMetrics);
    const [activeShipment] = useState(activeShipmentInTransit);
    const [scheduleList] = useState(todayScheduleList);
    const [telemetry] = useState(telemetryData);
    const [isBOLOpen, setIsBOLOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    const handleOpenLiveGPS = () => {
        requireDriverCompliance(() => {
            const dest = encodeURIComponent(activeShipment?.destination?.address || 'Seattle WA');
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
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
        </div>
    );
}
