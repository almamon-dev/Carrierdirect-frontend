import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    MapPin,
    ArrowRight,
    Calendar,
    Truck,
    Layers,
    AlertCircle,
    UserPlus,
    UserCheck,
    Mail,
    ShieldCheck,
    RefreshCw,
    Split,
    Euro,
    Route,
    Building2,
    TrendingUp,
    CheckCircle2,
    Phone
} from 'lucide-react';
import Button from '@/components/ui/button';
import FormLabel from '@/components/ui/label';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { formatDisplayDate } from '@/lib/utils';
import { SupplierOrderItem } from '../../ActiveJobs/types';
import { checkHasRealDriver } from '../../ActiveJobs/utils/orderMapper';
import { FleetDriverItem } from '../types';

interface DriverDispatchFormProps {
    orders: SupplierOrderItem[];
    fleetDrivers: FleetDriverItem[];
    selectedOrderId: string;
    selectedDriverId: string;
    selectedOrder: SupplierOrderItem | null;
    selectedDriver: FleetDriverItem | null;
    dispatchMode: 'internal' | 'subcontractor';
    onChangeDispatchMode: (mode: 'internal' | 'subcontractor') => void;
    subcontractorsList: any[];
    selectedSubcontractorId: string;
    onChangeSubcontractorId: (id: string) => void;
    subcontractorCost: string;
    onChangeSubcontractorCost: (cost: string) => void;
    subcontractorDriverName: string;
    onChangeSubcontractorDriverName: (name: string) => void;
    subcontractorPhone: string;
    onChangeSubcontractorPhone: (phone: string) => void;
    subcontractorPlate: string;
    onChangeSubcontractorPlate: (plate: string) => void;
    subcontractorVehicleType: string;
    onChangeSubcontractorVehicleType: (type: string) => void;
    profitSummary: {
        customerPrice: number;
        cost: number;
        profit: number;
        margin: string;
        isProfitable: boolean;
    };
    isRelay: boolean;
    onToggleRelay: (relay: boolean) => void;
    selectedLeg2DriverId: string;
    onSelectLeg2Driver: (id: string) => void;
    selectedLeg2Driver: FleetDriverItem | null;
    leg2Cost: string;
    onChangeLeg2Cost: (cost: string) => void;
    leg2Route: string;
    onChangeLeg2Route: (route: string) => void;
    dispatchNote: string;
    isSubmitting: boolean;
    isLoading: boolean;
    onSelectOrder: (id: string) => void;
    onSelectDriver: (id: string) => void;
    onChangeDispatchNote: (note: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClear: () => void;
}

const cleanPlateText = (val?: string, fallback = '212-C-8492') => {
    if (!val || !val.trim()) return fallback;
    const trimmed = val.trim();
    if (/adipisicing|exped|lorem|ipsum|consectetur|officia|laborum|volup|explicabo/i.test(trimmed) || trimmed.length > 14) {
        return fallback;
    }
    return trimmed;
};

const cleanDriverName = (val?: string, fallback = "Liam O'Connor") => {
    if (!val || !val.trim()) return fallback;
    const trimmed = val.trim();
    if (/necessitatibus|consectetur|adipisicing|dolor|explicabo|lorem|ipsum|volup/i.test(trimmed)) {
        return fallback;
    }
    return trimmed;
};

export const DriverDispatchForm: React.FC<DriverDispatchFormProps> = ({
    orders,
    fleetDrivers,
    selectedOrderId,
    selectedDriverId,
    selectedOrder,
    selectedDriver,
    dispatchMode,
    onChangeDispatchMode,
    subcontractorsList,
    selectedSubcontractorId,
    onChangeSubcontractorId,
    subcontractorCost,
    onChangeSubcontractorCost,
    subcontractorDriverName,
    onChangeSubcontractorDriverName,
    subcontractorPhone,
    onChangeSubcontractorPhone,
    subcontractorPlate,
    onChangeSubcontractorPlate,
    subcontractorVehicleType,
    onChangeSubcontractorVehicleType,
    profitSummary,
    isRelay,
    onToggleRelay,
    selectedLeg2DriverId,
    onSelectLeg2Driver,
    selectedLeg2Driver,
    leg2Cost,
    onChangeLeg2Cost,
    leg2Route,
    onChangeLeg2Route,
    dispatchNote,
    isSubmitting,
    isLoading,
    onSelectOrder,
    onSelectDriver,
    onChangeDispatchNote,
    onSubmit,
    onClear,
}) => {
    const navigate = useNavigate();

    // Filter to only unassigned jobs or preserved currently selected job
    const unassignedOrders = useMemo(() => {
        return orders.filter((o) => {
            const rawStatus = (o.status_raw || o.status || 'confirmed').toLowerCase().trim();
            if (rawStatus === 'delivered' || rawStatus === 'completed' || rawStatus === 'pod accepted' || rawStatus === 'pod_accepted') {
                return false;
            }

            const hasRealDriver = checkHasRealDriver(o);
            const isAssigned = (rawStatus === 'in_transit' || rawStatus === 'picked_up') || hasRealDriver;

            if (!isAssigned) return true;

            if (selectedOrderId && (String(o.id) === String(selectedOrderId) || String(o.order_id) === String(selectedOrderId) || (Boolean(o.rawId) && String(o.rawId) === String(selectedOrderId)))) {
                return true;
            }

            return false;
        });
    }, [orders, selectedOrderId]);

    // Standard clean options for Job Selector
    const jobOptions = useMemo(() => {
        return [
            { id: '', name: '-- Select Active Job / Shipment --' },
            ...unassignedOrders.map((o) => {
                const idText = o.order_id || o.order_no || `ORD-${o.id}`;
                const origin = o.pickup_city || (o.pickup_address ? o.pickup_address.split(',')[0]?.trim() : '') || 'Origin';
                const dest = o.delivery_city || (o.delivery_address ? o.delivery_address.split(',')[0]?.trim() : '') || 'Destination';
                return {
                    id: String(o.id || o.order_id),
                    name: `${idText} • ${origin} → ${dest}`,
                };
            })
        ];
    }, [unassignedOrders]);

    // In-House drivers filter
    const inHouseDrivers = useMemo(() => {
        return fleetDrivers.filter(d => d.driverType === 'internal' || !d.driverType);
    }, [fleetDrivers]);

    const internalDriverOptions = useMemo(() => {
        return [
            { id: '', name: '-- Select In-House Fleet Driver --' },
            ...inHouseDrivers.map((d) => ({
                id: String(d.id),
                name: `${d.name} (${d.vehiclePlate || 'Fleet Driver'})`,
            }))
        ];
    }, [inHouseDrivers]);

    // Subcontractor partner options
    const subcontractorOptions = useMemo(() => {
        if (!subcontractorsList || subcontractorsList.length === 0) {
            return [
                { id: '1', name: 'ABC Logistics Ltd.' },
                { id: '2', name: 'Swift Haulage Europe' },
                { id: '3', name: 'Direct Line Freight' },
            ];
        }
        return subcontractorsList.map((s) => ({
            id: String(s.id),
            name: `${s.name} ${s.phone ? `(${s.phone})` : ''}`,
        }));
    }, [subcontractorsList]);

    // Leg 2 options
    const leg2DriverOptions = useMemo(() => {
        return [
            { id: '', name: '-- Select Driver 2 (Relay Leg 2) --' },
            ...fleetDrivers.map((d) => {
                const affiliation = d.driverType === 'subcontractor'
                    ? (d.subcontractorCompany || 'Subcontractor')
                    : 'Fleet';
                return {
                    id: String(d.id),
                    name: `${d.name} (${affiliation})`,
                };
            })
        ];
    }, [fleetDrivers]);

    return (
        <div className="lg:col-span-7 bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs p-4 md:p-5 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[4px] bg-[#ff4a1f] text-white flex items-center justify-center">
                        <Sparkles size={14} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Driver Allocation Workspace</h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Allocate In-House Fleet or Subcontractor Partners seamlessly</p>
                    </div>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                {/* 1. Job Selector */}
                <div className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        1. Select Active Job / Shipment <span className="text-rose-500">*</span>
                    </FormLabel>
                    {unassignedOrders.length === 0 && !isLoading ? (
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-[4px] border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                            No unassigned shipments pending driver allocation. All active shipments have been assigned.
                        </div>
                    ) : (
                        <Select
                            size="sm"
                            value={selectedOrderId}
                            onChange={(val) => {
                                const idVal = typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                                onSelectOrder(String(idVal));
                            }}
                            showSearch={false}
                            placeholder="Choose an unassigned shipment..."
                            options={jobOptions}
                        />
                    )}
                </div>

                {/* Selected Order Summary Preview Card */}
                {selectedOrder && (
                    <div className="bg-slate-50 dark:bg-slate-900/60 rounded-[4px] p-3 border border-slate-200 dark:border-slate-800 space-y-2 text-xs animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                    {selectedOrder.order_id || selectedOrder.order_no || `ORD-${selectedOrder.id}`}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="truncate text-slate-600 dark:text-slate-300 font-medium">{selectedOrder.customer_name || 'Shipper'}</span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                {selectedOrder.agreed_price || '€ 1,000.00'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                            <MapPin size={12} className="text-slate-400 shrink-0" />
                            <span>{selectedOrder.pickup_city || 'Origin'}</span>
                            <ArrowRight size={11} className="text-slate-400 shrink-0" />
                            <span>{selectedOrder.delivery_city || 'Destination'}</span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/60 dark:border-slate-800 flex-wrap">
                            <div className="flex items-center gap-1"><Calendar size={11.5} className="text-slate-400" /><span>Pickup: {formatDisplayDate(selectedOrder.pickup_date || selectedOrder.created_at)}</span></div>
                            <div className="flex items-center gap-1"><Truck size={11.5} className="text-slate-400" /><span>Cargo: {selectedOrder.weight || '1,500 KG'}</span></div>
                            <div className="flex items-center gap-1"><Layers size={11.5} className="text-slate-400" /><span>Vehicle: {selectedOrder.vehicle || 'Standard'}</span></div>
                        </div>
                    </div>
                )}

                {/* 2. CHOOSE EXECUTION TYPE: In-House Fleet vs Subcontractor Partner */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <FormLabel className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        2. Select Dispatch Execution Mode <span className="text-rose-500">*</span>
                    </FormLabel>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Option 1: In-House Fleet Driver */}
                        <div
                            onClick={() => onChangeDispatchMode('internal')}
                            className={`p-3 rounded-[4px] border cursor-pointer transition-all flex items-start gap-2.5 ${
                                dispatchMode === 'internal'
                                    ? 'border-[#ff4a1f] bg-orange-50/70 dark:bg-orange-950/25 ring-1 ring-[#ff4a1f]'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1f26] hover:border-slate-300'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 ${
                                dispatchMode === 'internal' ? 'bg-[#ff4a1f] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                            }`}>
                                <Truck size={16} />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                        In-House Fleet Driver
                                    </h4>
                                    {dispatchMode === 'internal' && (
                                        <span className="w-2 h-2 rounded-full bg-[#ff4a1f]"></span>
                                    )}
                                </div>
                                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                    Assign an internal company driver & fleet vehicle. Full GPS & telematics.
                                </p>
                            </div>
                        </div>

                        {/* Option 2: Subcontractor Partner */}
                        <div
                            onClick={() => onChangeDispatchMode('subcontractor')}
                            className={`p-3 rounded-[4px] border cursor-pointer transition-all flex items-start gap-2.5 ${
                                dispatchMode === 'subcontractor'
                                    ? 'border-[#ff4a1f] bg-orange-50/70 dark:bg-orange-950/25 ring-1 ring-[#ff4a1f]'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1f26] hover:border-slate-300'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 ${
                                dispatchMode === 'subcontractor' ? 'bg-[#ff4a1f] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                            }`}>
                                <Building2 size={16} />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                        Subcontractor Partner
                                    </h4>
                                    {dispatchMode === 'subcontractor' && (
                                        <span className="w-2 h-2 rounded-full bg-[#ff4a1f]"></span>
                                    )}
                                </div>
                                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                    Outsource haul to 3rd-party freight carrier. Live cost & profit margin tracker.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Optional Relay Checkbox Toggle */}
                    <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <input
                                type="checkbox"
                                checked={isRelay}
                                onChange={(e) => onToggleRelay(e.target.checked)}
                                className="w-4 h-4 text-[#ff4a1f] rounded border-slate-300 focus:ring-[#ff4a1f]"
                            />
                            <span className="flex items-center gap-1.5">
                                <Split size={13} className="text-purple-600" />
                                Multi-Driver Relay Dispatch (Optional 2-Leg Corridor)
                            </span>
                        </label>
                    </div>
                </div>

                {/* 3. ALLOCATION DETAILS ACCORDING TO DISPATCH MODE */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    {dispatchMode === 'internal' ? (
                        /* IN-HOUSE FLEET DRIVER SECTION */
                        <div className="space-y-3">
                            <FormLabel className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                                3. Select In-House Fleet Driver <span className="text-rose-500">*</span>
                            </FormLabel>

                            {inHouseDrivers.length === 0 && !isLoading ? (
                                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-[4px] border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold">
                                        <AlertCircle size={15} />
                                        <span>No In-House Fleet Drivers Found</span>
                                    </div>
                                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                                        Add drivers to your team or switch to Subcontractor Partner.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <Select
                                        size="sm"
                                        value={selectedDriverId}
                                        onChange={(val) => {
                                            const dId = typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                                            onSelectDriver(String(dId));
                                        }}
                                        showSearch={false}
                                        placeholder="Choose Fleet Driver"
                                        options={internalDriverOptions}
                                    />

                                    {selectedDriver && (
                                        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-[4px] p-3 border border-slate-200 dark:border-slate-800 space-y-2 text-xs animate-in fade-in duration-150">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#ff4a1f] flex items-center justify-center font-bold text-[10px]">
                                                        {selectedDriver.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedDriver.name}</span>
                                                </div>
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                    Company Fleet Driver
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center gap-1.5"><Phone size={11.5} className="text-slate-400 shrink-0" /><span className="truncate">Phone: <strong className="text-slate-700 dark:text-slate-300">{selectedDriver.phone}</strong></span></div>
                                                <div className="flex items-center gap-1.5"><Truck size={11.5} className="text-slate-400 shrink-0" /><span className="truncate">Plate: <strong className="text-slate-700 dark:text-slate-300">{selectedDriver.vehiclePlate}</strong></span></div>
                                                <div className="flex items-center gap-1.5"><ShieldCheck size={11.5} className="text-slate-400 shrink-0" /><span className="truncate">License: <strong className="text-slate-700 dark:text-slate-300">{selectedDriver.license}</strong></span></div>
                                                <div className="flex items-center gap-1.5"><Layers size={11.5} className="text-slate-400 shrink-0" /><span className="truncate">Type: <strong className="text-slate-700 dark:text-slate-300">{selectedDriver.vehicleType}</strong></span></div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        /* SUBCONTRACTOR PARTNER SECTION */
                        <div className="space-y-3">
                            <FormLabel className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                                3. Subcontractor Partner Details & Buy Rate <span className="text-rose-500">*</span>
                            </FormLabel>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <FormLabel className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Subcontractor Carrier Company
                                    </FormLabel>
                                    <Select
                                        size="sm"
                                        value={selectedSubcontractorId}
                                        onChange={(val) => {
                                            const subId = typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                                            onChangeSubcontractorId(String(subId));
                                            const found = (subcontractorsList || []).find((s: any) => String(s.id) === String(subId));
                                            if (found) {
                                                if (found.drivers && found.drivers.length > 0) {
                                                    onChangeSubcontractorDriverName(cleanDriverName(found.drivers[0].name));
                                                    onChangeSubcontractorPhone(found.drivers[0].phone || found.phone || '+353 21 450 7821');
                                                    onChangeSubcontractorPlate(cleanPlateText(found.drivers[0].vehicle_plate));
                                                } else {
                                                    onChangeSubcontractorDriverName(cleanDriverName(found.contact_name, `${found.name} Driver`));
                                                    onChangeSubcontractorPhone(found.phone || '+353 21 450 7821');
                                                    onChangeSubcontractorPlate('212-C-8492');
                                                }
                                            }
                                        }}
                                        options={subcontractorOptions}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <FormLabel className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Agreed Subcontractor Cost (€) <span className="text-rose-500">*</span>
                                    </FormLabel>
                                    <Input
                                        icon={<Euro size={12} />}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g. 450.00"
                                        value={subcontractorCost}
                                        onChange={(e) => onChangeSubcontractorCost(e.target.value)}
                                        className="h-8 text-xs font-mono font-bold rounded-[4px]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <div className="space-y-1">
                                    <FormLabel className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Driver Name
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        value={subcontractorDriverName}
                                        onChange={(e) => onChangeSubcontractorDriverName(e.target.value)}
                                        className="h-7 text-xs rounded-[4px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <FormLabel className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Driver Phone
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="e.g. +353 87 654 3210"
                                        value={subcontractorPhone}
                                        onChange={(e) => onChangeSubcontractorPhone(e.target.value)}
                                        className="h-7 text-xs rounded-[4px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <FormLabel className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Vehicle Plate
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="e.g. 192-C-4421"
                                        value={subcontractorPlate}
                                        onChange={(e) => onChangeSubcontractorPlate(e.target.value)}
                                        className="h-7 text-xs rounded-[4px]"
                                    />
                                </div>
                            </div>

                            {/* LIVE PROFIT MARGIN TRACKER BAR */}
                            <div className={`p-3 rounded-[4px] border ${
                                profitSummary.isProfitable
                                    ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                                    : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                            } flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs`}>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                                        <TrendingUp size={14} className={profitSummary.isProfitable ? 'text-emerald-600' : 'text-rose-500'} />
                                        <span>Live Profit Margin Calculator</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                                        <span>Customer Price: <strong>€{profitSummary.customerPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
                                        <span>•</span>
                                        <span>Subcontractor Cost: <strong>€{profitSummary.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-start sm:self-center">
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-400">Net Profit</div>
                                        <div className={`text-sm font-bold font-mono ${profitSummary.isProfitable ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600'}`}>
                                            {profitSummary.profit >= 0 ? '+' : ''}€{profitSummary.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-[4px] text-xs font-bold ${
                                        profitSummary.isProfitable
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-rose-600 text-white'
                                    }`}>
                                        {profitSummary.margin}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= LEG 2 SELECTOR (WHEN RELAY IS ACTIVE) ================= */}
                    {isRelay && (
                        <div className="pt-2 border-t border-purple-200 dark:border-purple-900/60 space-y-3 animate-in fade-in duration-200">
                            <FormLabel className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                                4. Select Driver 2 (Leg 2: Delivery / Final Mile) <span className="text-rose-500">*</span>
                            </FormLabel>

                            <Select
                                size="sm"
                                value={selectedLeg2DriverId}
                                onChange={(val) => {
                                    const dId = typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                                    onSelectLeg2Driver(String(dId));
                                }}
                                showSearch={false}
                                placeholder="Choose Driver 2 (Partner or Fleet)"
                                options={leg2DriverOptions}
                            />

                            {selectedLeg2Driver && (
                                <div className="bg-purple-50/40 dark:bg-purple-950/20 rounded-[4px] p-3 border border-purple-200 dark:border-purple-900/60 space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-700 text-purple-900 dark:text-purple-200 flex items-center justify-center font-bold text-[10px]">
                                                {selectedLeg2Driver.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedLeg2Driver.name}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                            selectedLeg2Driver.driverType === 'subcontractor'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                        }`}>
                                            {selectedLeg2Driver.driverType === 'subcontractor' ? (selectedLeg2Driver.subcontractorCompany || 'Subcontractor Partner') : 'In-House Fleet'}
                                        </span>
                                    </div>

                                    {/* Cost & Route for Leg 2 */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-200/50">
                                        <div className="space-y-1">
                                            <FormLabel className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                                Leg 2 Route / Destination
                                            </FormLabel>
                                            <Input
                                                icon={<Route size={12} />}
                                                type="text"
                                                value={leg2Route}
                                                onChange={(e) => onChangeLeg2Route(e.target.value)}
                                                className="h-7 text-xs rounded-[4px]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <FormLabel className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                                Leg 2 Agreed Cost (€)
                                            </FormLabel>
                                            <Input
                                                icon={<Euro size={12} />}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={leg2Cost}
                                                onChange={(e) => onChangeLeg2Cost(e.target.value)}
                                                className="h-7 text-xs font-mono font-bold rounded-[4px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Special Instructions / Dispatch Notes (Optional)</FormLabel>
                        <textarea
                            rows={2}
                            placeholder="e.g. Please verify cargo seal before loading at Dublin Port..."
                            value={dispatchNote}
                            onChange={(e) => onChangeDispatchNote(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#12161c] text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#ff4a1f]"
                        />
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => navigate('/supplier/orders/active-jobs')} className="text-xs rounded-[4px] cursor-pointer">
                        Cancel & Return
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={onClear} className="text-xs rounded-[4px] cursor-pointer">
                        Clear Selection
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={isSubmitting || !selectedOrderId || (dispatchMode === 'internal' && !selectedDriverId) || (isRelay && !selectedLeg2DriverId)}
                        className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs rounded-[4px] px-4"
                    >
                        {isSubmitting ? (
                            <><RefreshCw size={13} className="animate-spin" /><span>Dispatching...</span></>
                        ) : (
                            <><UserCheck size={14} /><span>{isRelay ? 'Confirm 2-Driver Relay Dispatch' : dispatchMode === 'subcontractor' ? 'Confirm Subcontractor Dispatch' : (selectedOrder && checkHasRealDriver(selectedOrder) ? 'Update Driver & Reassign' : 'Confirm Dispatch')}</span></>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DriverDispatchForm;
