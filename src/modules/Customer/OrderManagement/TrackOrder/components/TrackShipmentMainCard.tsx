import React, { useState } from 'react';
import {
    ArrowLeftRight,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Crosshair,
    LocateFixed,
    MapPin,
    Maximize2,
    Navigation,
    Route,
    Truck,
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { NormalizedCustomerOrder } from '../../Details/utils/customerOrderDetailsUtils';

export interface ProgressStepItem {
    id: string;
    title: string;
    time: string;
    completed: boolean;
    active: boolean;
}

interface TrackShipmentMainCardProps {
    order: NormalizedCustomerOrder;
    fromCity: string;
    toCity: string;
    displayDistance: string;
    displayEta: string;
    remainingDistance: string;
    displayExpectedDelivery: string;
    driverLocationLabel?: string;
    pickupStatusLabel?: string;
    isPickupCompleted?: boolean;
    hasLiveGps?: boolean;
    isGpsFresh?: boolean;
    gpsUpdatedHuman?: string;
    progressSteps: ProgressStepItem[];
    mapContainerRef: React.RefObject<HTMLDivElement | null>;
    mapLoaded: boolean;
    mapError: boolean;
    mapType: 'roadmap' | 'satellite';
    onChangeMapType: (type: 'roadmap' | 'satellite') => void;
    onFocusDriver?: () => void;
    onFitRoute?: () => void;
    embedMapSrc: string;
    googleMapsUrl: string;
    headerActions?: React.ReactNode;
}

export const TrackShipmentMainCard: React.FC<TrackShipmentMainCardProps> = ({
    order,
    fromCity,
    toCity,
    displayDistance,
    displayEta,
    remainingDistance,
    displayExpectedDelivery,
    driverLocationLabel,
    pickupStatusLabel,
    isPickupCompleted = false,
    hasLiveGps = false,
    isGpsFresh = false,
    gpsUpdatedHuman = 'Just now',
    progressSteps,
    mapContainerRef,
    mapType,
    onChangeMapType,
    onFocusDriver,
    onFitRoute,
    googleMapsUrl,
    headerActions,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopyOrderNo = () => {
        navigator.clipboard.writeText(order.orderNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const resolvedDriverLoc =
        driverLocationLabel ||
        order.productLocation?.currentAddress ||
        `${fromCity} → ${toCity}`;

    const isCompletedStage =
        order.rawStatus === 'completed' ||
        order.rawStatus === 'delivered' ||
        order.rawStatus === 'pod_uploaded' ||
        order.rawStatus === 'pod_accepted';

    return (
        <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-4 font-sans">
            {/* Top Header Row: Left Identity & Shipment Status + Right Metrics */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                {/* Left: Truck Icon + Order Number + Shipment Status & Pickup Status */}
                <div className="flex items-center justify-between sm:justify-start gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 border border-orange-100 dark:border-orange-900/40 text-[#ff4a1f] flex items-center justify-center shrink-0">
                            <Truck size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                                    {order.orderNumber}
                                </h2>
                                <button
                                    type="button"
                                    onClick={handleCopyOrderNo}
                                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
                                    title="Copy Order ID"
                                >
                                    {copied ? (
                                        <Check size={13.5} className="text-emerald-500" />
                                    ) : (
                                        <Copy size={13.5} />
                                    )}
                                </button>
                                {!isCompletedStage && (
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                                            hasLiveGps && isGpsFresh
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                                : hasLiveGps
                                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                                                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                        }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                hasLiveGps && isGpsFresh
                                                    ? 'bg-emerald-500 animate-pulse'
                                                    : hasLiveGps
                                                    ? 'bg-amber-500'
                                                    : 'bg-slate-400'
                                            }`}
                                        />
                                        <span>
                                            {hasLiveGps && isGpsFresh
                                                ? `GPS Live • ${gpsUpdatedHuman}`
                                                : hasLiveGps
                                                ? `GPS Offline • Last seen ${gpsUpdatedHuman}`
                                                : 'GPS Offline • Awaiting Signal'}
                                        </span>
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                    Status:
                                </span>
                                <StatusBadge status={order.status} />
                                {pickupStatusLabel && (
                                    <span
                                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-[4px] border ${
                                            isPickupCompleted
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                                : 'bg-orange-50 text-[#ff4a1f] border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800'
                                        }`}
                                    >
                                        {isPickupCompleted ? (
                                            <CheckCircle2 size={11} className="shrink-0" />
                                        ) : (
                                            <Truck size={11} className="shrink-0" />
                                        )}
                                        <span>{pickupStatusLabel}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: 5 Inline Metrics (including Driver Location) + Optional Action Slot */}
                <div className="flex flex-wrap items-center justify-between xl:justify-end gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 flex-1 xl:flex-initial">
                        <div className="flex items-center gap-2 pr-3 py-1 col-span-2 sm:col-span-1">
                            <Navigation size={16} className="text-[#ff4a1f] shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                    Driver Location
                                </p>
                                <p
                                    className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mt-0.5 truncate max-w-[155px]"
                                    title={resolvedDriverLoc}
                                >
                                    {resolvedDriverLoc}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:px-3 py-1">
                            <MapPin size={16} className="text-[#ff4a1f] shrink-0" />
                            <div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                    Total Distance
                                </p>
                                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                                    {displayDistance}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:px-3 py-1">
                            <Clock size={16} className="text-[#ff4a1f] shrink-0" />
                            <div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                    Est. Travel Time
                                </p>
                                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                                    {displayEta}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:px-3 py-1">
                            <ArrowLeftRight size={16} className="text-[#ff4a1f] shrink-0" />
                            <div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                    Remaining
                                </p>
                                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                                    {remainingDistance}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:pl-3 py-1">
                            <Calendar size={16} className="text-[#ff4a1f] shrink-0" />
                            <div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                    Est. Delivery
                                </p>
                                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                                    {displayExpectedDelivery}
                                </p>
                            </div>
                        </div>
                    </div>

                    {headerActions && <div className="flex items-center gap-2 shrink-0">{headerActions}</div>}
                </div>
            </div>

            {/* Body Row: Left Clean Map (8 cols) + Right Shipment Progress (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* Left: Ultra-Clean Interactive Route & Live Driver Map */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="relative w-full h-[340px] sm:h-[380px] rounded-[4px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 z-0">
                        <div ref={mapContainerRef} className="w-full h-full z-0" />

                        {/* Top-Left Compact Map / Satellite Switcher */}
                        <div className="absolute top-3 left-3 z-[400] flex items-center gap-2">
                            <div className="bg-white/95 dark:bg-[#181c22]/95 backdrop-blur-xs border border-slate-200 dark:border-slate-700 rounded-[4px] p-0.5 shadow-sm flex items-center text-xs font-bold">
                                <button
                                    type="button"
                                    onClick={() => onChangeMapType('roadmap')}
                                    className={`px-2.5 py-1 rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors ${
                                        mapType === 'roadmap'
                                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                                    }`}
                                >
                                    <Route size={12} />
                                    <span>Map</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChangeMapType('satellite')}
                                    className={`px-2.5 py-1 rounded-[3px] cursor-pointer transition-colors ${
                                        mapType === 'satellite'
                                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                                    }`}
                                >
                                    Satellite
                                </button>
                            </div>
                        </div>

                        {/* Top-Right Compact Controls: Driver Focus | Fit Full Route | Open in Google Maps */}
                        <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5">
                            {onFocusDriver && (
                                <button
                                    type="button"
                                    onClick={onFocusDriver}
                                    title="Focus on Driver Live Position"
                                    className="h-8 px-2.5 bg-white/95 dark:bg-[#181c22]/95 hover:bg-white border border-slate-200 dark:border-slate-700 rounded-[4px] shadow-sm flex items-center gap-1.5 text-xs font-bold text-[#1A73E8] cursor-pointer transition-colors"
                                >
                                    <Crosshair size={13} />
                                    <span>Driver</span>
                                </button>
                            )}
                            {onFitRoute && (
                                <button
                                    type="button"
                                    onClick={onFitRoute}
                                    title="Center Full Route"
                                    className="w-8 h-8 bg-white/95 dark:bg-[#181c22]/95 hover:bg-white border border-slate-200 dark:border-slate-700 rounded-[4px] shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
                                >
                                    <LocateFixed size={14} />
                                </button>
                            )}
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Open Full Route in Google Maps"
                                className="w-8 h-8 bg-white/95 dark:bg-[#181c22]/95 hover:bg-white border border-slate-200 dark:border-slate-700 rounded-[4px] shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
                            >
                                <Maximize2 size={14} />
                            </a>
                        </div>

                        {/* Bottom-Left Compact Live Driver Bar */}
                        <div className="absolute bottom-3 left-3 z-[400] flex flex-wrap items-center gap-2 pointer-events-none">
                            <div className="bg-white/95 dark:bg-[#181c22]/95 backdrop-blur-xs border border-slate-200 dark:border-slate-700 rounded-[4px] px-2.5 py-1.5 shadow-sm flex items-center gap-2 text-xs">
                                <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                        isCompletedStage
                                            ? 'bg-emerald-500'
                                            : hasLiveGps && isGpsFresh
                                            ? 'bg-[#1A73E8] animate-pulse'
                                            : 'bg-[#F97316]'
                                    }`}
                                />
                                <span className="text-slate-500 dark:text-slate-400 font-semibold">
                                    {isCompletedStage ? 'Delivered:' : 'Driver Now:'}
                                </span>
                                <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[220px] sm:max-w-[320px]">
                                    {resolvedDriverLoc}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Shipment Progress Card */}
                <div className="lg:col-span-4 flex flex-col">
                    <div className="border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-4 flex-1 flex flex-col justify-between bg-white dark:bg-[#1e2329]">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                                    Shipment Progress
                                </h3>
                                <span className="text-[11px] font-bold text-[#ff4a1f]">
                                    {order.status}
                                </span>
                            </div>

                            <div className="relative space-y-3">
                                <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-slate-200 dark:bg-slate-700 z-0" />

                                {progressSteps.map((step) => {
                                    const isDone = step.completed && !step.active;
                                    const isCurrent = step.active;

                                    return (
                                        <div
                                            key={step.id}
                                            className={`relative z-10 flex items-start gap-3 transition-all ${
                                                isCurrent
                                                    ? 'bg-orange-50/90 dark:bg-[#ff4a1f]/10 rounded-[4px] p-2 -ml-2'
                                                    : 'py-0.5'
                                            }`}
                                        >
                                            <div className="shrink-0 mt-0.5">
                                                {isDone ? (
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                                                        <Check size={13} strokeWidth={3} />
                                                    </div>
                                                ) : isCurrent ? (
                                                    <div className="w-6 h-6 rounded-full bg-[#ff4a1f] text-white flex items-center justify-center shadow-2xs">
                                                        <Truck size={12} />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-white dark:bg-[#1e2329] border-2 border-slate-300 dark:border-slate-700" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`text-xs sm:text-[13px] leading-snug ${
                                                        isCurrent
                                                            ? 'font-extrabold text-slate-900 dark:text-white'
                                                            : isDone
                                                            ? 'font-bold text-slate-900 dark:text-slate-100'
                                                            : 'font-medium text-slate-400 dark:text-slate-500'
                                                    }`}
                                                >
                                                    {step.title}
                                                </p>
                                                {step.time && (isDone || isCurrent) && (
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                                        {step.time}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackShipmentMainCard;

