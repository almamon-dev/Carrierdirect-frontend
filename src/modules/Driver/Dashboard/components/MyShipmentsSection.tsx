import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Calendar,
    Layers,
    Truck,
    Package,
    Navigation,
    MapPin,
    ArrowUpRight,
    Scale,
    Boxes,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { ShipmentItem } from '../../types';

interface MyShipmentsSectionProps {
    allShipments: ShipmentItem[];
    activeShipmentId?: string | number | null;
    onSelectShipment?: (shipment: ShipmentItem) => void;
    onOpenGPS: (destinationAddress?: string) => void;
}

export const MyShipmentsSection: React.FC<MyShipmentsSectionProps> = ({
    allShipments = [],
    activeShipmentId,
    onSelectShipment,
    onOpenGPS,
}) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0); // 0 = Today, 1 = Tomorrow, 2 = Upcoming

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const isSameDate = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const parseDate = (item: ShipmentItem): Date | null => {
        const raw =
            (item as any).pickup?.raw_date ||
            (item as any).pickup_date ||
            (item as any).pickup?.date ||
            item.shipper?.pickupDate ||
            (item as any).date;
        if (!raw) return null;
        const parsed = new Date(raw);
        return isNaN(parsed.getTime()) ? null : parsed;
    };

    // Filter shipments into Today, Tomorrow, Upcoming (matching Driver App schedule filtering)
    const todayShipments = allShipments.filter((item) => {
        const s = (item.status || '').toLowerCase();
        // Exclude delivered, completed, cancelled, rejected orders from active dispatch tabs
        if (['delivered', 'completed', 'pod_uploaded', 'cancelled', 'rejected'].includes(s)) {
            return false;
        }

        const d = parseDate(item);
        if (d && isSameDate(d, now)) return true;
        const dateStr = `${item.shipper?.pickupDate || ''} ${(item as any).date || ''}`.toLowerCase();
        if (dateStr.includes('today')) return true;

        // In-progress driving trips are actively underway, so they are always in Today
        if (['in_transit', 'picked_up', 'at_pickup', 'at_delivery', 'in_progress', 'active'].includes(s)) {
            return true;
        }

        // Active/assigned shipments that are due today or overdue (scheduled for today or earlier)
        if (['driver_assigned', 'assigned', 'scheduled', 'pending', 'confirmed'].includes(s)) {
            if (d) {
                const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                if (d <= endOfToday) return true;
            } else {
                // If date is unparseable but status is active/assigned, keep in Today so driver sees assignment
                return true;
            }
        }

        return false;
    });

    const tomorrowShipments = allShipments.filter((item) => {
        const s = (item.status || '').toLowerCase();
        if (['delivered', 'completed', 'pod_uploaded', 'cancelled', 'rejected'].includes(s)) {
            return false;
        }

        // Exclude items already categorized into Today
        if (todayShipments.some((t) => t.id === item.id)) return false;

        const d = parseDate(item);
        if (d && isSameDate(d, tomorrow)) return true;
        const dateStr = `${item.shipper?.pickupDate || ''} ${(item as any).date || ''}`.toLowerCase();
        if (dateStr.includes('tomorrow')) return true;
        return false;
    });

    const upcomingShipments = allShipments.filter((item) => {
        // Exclude items already categorized into Today or Tomorrow
        const inToday = todayShipments.some((t) => t.id === item.id);
        const inTomorrow = tomorrowShipments.some((tm) => tm.id === item.id);
        if (inToday || inTomorrow) return false;

        const s = (item.status || '').toLowerCase();
        // Exclude completed, delivered, or cancelled orders
        if (['delivered', 'completed', 'pod_uploaded', 'cancelled', 'rejected'].includes(s)) {
            return false;
        }

        const d = parseDate(item);
        if (d) {
            const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);
            if (d > endOfTomorrow) return true;
        }
        // Scheduled/assigned loads with future dates
        if (['driver_assigned', 'assigned', 'scheduled', 'pending', 'confirmed'].includes(s)) {
            return true;
        }
        return false;
    });

    // Effective list for current tab
    let currentList: ShipmentItem[] = [];
    let tabTitle = 'Today';

    if (activeTab === 0) {
        tabTitle = 'Today';
        currentList = todayShipments;
    } else if (activeTab === 1) {
        tabTitle = 'Tomorrow';
        currentList = tomorrowShipments;
    } else {
        tabTitle = 'Upcoming';
        currentList = upcomingShipments;
    }

    // Default expanded item is the active shipment or first in the current list
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const effectiveExpandedId = expandedId || (activeShipmentId ? String(activeShipmentId) : (currentList.length > 0 ? currentList[0].id : null));

    const handleTabSwitch = (newTab: 0 | 1 | 2) => {
        setActiveTab(newTab);
        let targetList: ShipmentItem[] = [];
        if (newTab === 0) {
            targetList = todayShipments;
        } else if (newTab === 1) {
            targetList = tomorrowShipments;
        } else {
            targetList = upcomingShipments;
        }

        if (targetList.length > 0) {
            setExpandedId(targetList[0].id);
            onSelectShipment?.(targetList[0]);
        } else {
            setExpandedId(null);
        }
    };

    const formatDateTime = (dateStr?: string, timeStr?: string) => {
        if (!dateStr && !timeStr) return '2026-11-17 • 05:00 PM';
        if (dateStr && timeStr) return `${dateStr} • ${timeStr}`;
        return dateStr || timeStr || '';
    };

    const renderStatusBadge = (status: string) => {
        const s = (status || '').toLowerCase();
        if (s.includes('transit') || s.includes('picked') || s.includes('progress')) {
            return (
                <span className="px-2 py-0.5 text-[11px] font-bold bg-[#EBF5FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 rounded-[4px] border border-blue-200/80 dark:border-blue-900/60 flex items-center gap-1">
                    <Truck size={12} />
                    <span>Picked up</span>
                </span>
            );
        }
        if (s.includes('deliver') || s.includes('complete')) {
            return (
                <span className="px-2 py-0.5 text-[11px] font-bold bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 rounded-[4px] border border-emerald-200/80 dark:border-emerald-900/60 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Delivered</span>
                </span>
            );
        }
        return (
            <span className="px-2 py-0.5 text-[11px] font-bold bg-[#FFF7ED] dark:bg-orange-950/60 text-[#EA580C] dark:text-orange-400 rounded-[4px] border border-orange-200/80 dark:border-orange-900/60 flex items-center gap-1">
                <Truck size={12} />
                <span>Pickup</span>
            </span>
        );
    };

    return (
        <div className="space-y-3.5">
            {/* 1. Date Filter Tabs matching mockup */}
            <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {/* Tab 0: Today */}
                <button
                    type="button"
                    onClick={() => handleTabSwitch(0)}
                    className={`px-3.5 py-1.5 rounded-[4px] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0 ${
                        activeTab === 0
                            ? 'bg-[#FF5722] text-white border border-[#FF5722]'
                            : 'bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                >
                    <Calendar size={13} />
                    <span>Today ({todayShipments.length})</span>
                </button>

                {/* Tab 1: Tomorrow */}
                <button
                    type="button"
                    onClick={() => handleTabSwitch(1)}
                    className={`px-3.5 py-1.5 rounded-[4px] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0 ${
                        activeTab === 1
                            ? 'bg-[#FF5722] text-white border border-[#FF5722]'
                            : 'bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                >
                    <Calendar size={13} />
                    <span>Tomorrow ({tomorrowShipments.length})</span>
                </button>

                {/* Tab 2: Upcoming */}
                <button
                    type="button"
                    onClick={() => handleTabSwitch(2)}
                    className={`px-3.5 py-1.5 rounded-[4px] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0 ${
                        activeTab === 2
                            ? 'bg-[#FF5722] text-white border border-[#FF5722]'
                            : 'bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                >
                    <Layers size={13} />
                    <span>Upcoming ({upcomingShipments.length})</span>
                </button>
            </div>

            {/* 2. Section Header: My Shipments • Today (X)  --  View All ➔ */}
            <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    My Shipments • {tabTitle} ({currentList.length})
                </h3>
                <Link
                    to="/driver/shipments"
                    className="text-[12.5px] font-bold text-[#FF5722] hover:underline flex items-center gap-1 group"
                >
                    <span>View All</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* 3. Shipments List */}
            {currentList.length === 0 ? (
                <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-8 text-center space-y-2 shadow-2xs">
                    <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                        <Truck size={20} />
                    </div>
                    <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                        No Shipments for {tabTitle}
                    </h4>
                    <p className="text-[11.5px] text-slate-400">
                        No dispatch orders scheduled for {tabTitle.toLowerCase()}.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {currentList.map((item) => {
                        const isExpanded = item.id === effectiveExpandedId;
                        const isSelected = String(item.id) === String(activeShipmentId || effectiveExpandedId);
                        const pickupDateFormatted = formatDateTime(item.shipper?.pickupDate, item.shipper?.pickupTimeWindow);
                        const deliveryDateFormatted = formatDateTime(item.consignee?.deliveryDate, item.consignee?.deliveryTimeWindow);
                        const distanceVal = item.route?.distanceKm ? `${item.route.distanceKm} km` : (item.route?.distanceFormatted || '285.1 km');
                        const palletsVal = item.cargo?.pallets ? `${item.cargo.pallets} Pallets` : '1 Pallets';
                        const weightVal = item.cargo?.weightKg ? `${item.cargo.weightKg} kg` : '4,500.00 kg';

                        if (isExpanded) {
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => onSelectShipment?.(item)}
                                    className={`bg-white dark:bg-[#1e2329] rounded-[4px] border ${
                                        isSelected
                                            ? 'border-[#FF5722] ring-1 ring-[#FF5722]/30 shadow-xs'
                                            : 'border-slate-200/90 dark:border-slate-800 shadow-2xs'
                                    } p-3.5 sm:p-4 space-y-3 transition-all cursor-pointer`}
                                >
                                    {/* Top Row: Icon + Order Number + Date + Status Badge */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-[4px] bg-[#FFF0EB] dark:bg-[#341d16] text-[#FF4A1F] flex items-center justify-center shrink-0">
                                                <Truck size={17} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[13.5px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                                                    {item.orderNumber || `#ORD-${item.id}`}
                                                </div>
                                                <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Calendar size={11} />
                                                    <span>{deliveryDateFormatted}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shrink-0">
                                            {renderStatusBadge(item.status)}
                                        </div>
                                    </div>

                                    {/* Route Timeline */}
                                    <div className="space-y-3 relative pl-1 pt-1">
                                        {/* Origin */}
                                        <div className="flex items-start gap-2.5 relative">
                                            <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-white dark:bg-[#1e2329] flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                                                        {item.shipper?.city || item.pickup_city || 'Balbriggan'}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-[#FF5722]">
                                                        {pickupDateFormatted}
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                    {item.shipper?.address || item.pickup_address || 'Balbriggan, Co. Dublin, Ireland'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Connecting dashed line */}
                                        <div className="absolute left-[7.5px] top-4 bottom-4 w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 pointer-events-none" />

                                        {/* Destination */}
                                        <div className="flex items-start gap-2.5 relative pt-0.5">
                                            <div className="w-3.5 h-3.5 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                                                <MapPin size={15} className="fill-red-500 text-white" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                                                        {item.consignee?.city || item.delivery_city || 'Cork'}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-[#2563EB]">
                                                        {deliveryDateFormatted}
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                    {item.consignee?.address || item.delivery_address || 'Cork, Ireland'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Meta specs row: Distance + Pallets + Weight */}
                                    <div className="flex items-center gap-4 sm:gap-6 pt-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <ArrowUpRight size={13} className="text-slate-400" />
                                            <span>{distanceVal}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Boxes size={13} className="text-slate-400" />
                                            <span>{palletsVal}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Scale size={13} className="text-slate-400" />
                                            <span>{weightVal}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons: Navigation + Details matching mockup */}
                                    <div className="grid grid-cols-2 gap-2.5 pt-1" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/driver/navigation/${item.id}`)}
                                            className="py-2 px-3 bg-[#FF5722] hover:bg-[#E03E15] text-white rounded-[4px] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                                        >
                                            <Navigation size={13} className="fill-white" />
                                            <span>Navigation</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => navigate(`/driver/shipments/${item.id}`)}
                                            className="py-2 px-3 bg-white hover:bg-slate-50 dark:bg-[#1e2329] dark:hover:bg-[#252b33] border border-slate-200/90 dark:border-slate-700/80 rounded-[4px] text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                        >
                                            <span>Details</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        // Compact Card matching mockup
                        return (
                            <div
                                key={item.id}
                                onClick={() => {
                                    setExpandedId(item.id);
                                    onSelectShipment?.(item);
                                }}
                                className={`bg-white dark:bg-[#1e2329] rounded-[4px] border ${
                                    isSelected
                                        ? 'border-[#FF5722] ring-1 ring-[#FF5722]/30'
                                        : 'border-slate-200/90 dark:border-slate-800'
                                } p-2.5 sm:p-3 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#FF5722]/60 dark:hover:border-slate-700 transition-all`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[4px] bg-[#FFF0EB] dark:bg-[#341d16] text-[#FF4A1F] flex items-center justify-center shrink-0">
                                        <Package size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                                            {item.orderNumber || `#ORD-${item.id}`}
                                        </div>
                                        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                                            <Calendar size={11} />
                                            <span>{deliveryDateFormatted}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    {renderStatusBadge(item.status)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
