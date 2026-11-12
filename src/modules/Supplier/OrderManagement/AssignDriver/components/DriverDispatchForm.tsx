import React, { useMemo } from 'react';
import {
    ArrowRight,
    Calendar,
    Layers,
    MapPin,
    Split,
    Truck,
} from 'lucide-react';
import Select from '@/components/ui/select';
import Switch from '@/components/ui/switch';
import Textarea from '@/components/ui/textarea';
import { formatDisplayDate } from '@/lib/utils';
import { SupplierOrderItem } from '../../ActiveJobs/types';
import { checkHasRealDriver } from '../../ActiveJobs/utils/orderMapper';
import {
    FleetDriverItem,
    FleetVehicleItem,
    LegAssignmentState,
} from '../types';
import { LegAssignmentSection } from './LegAssignmentSection';

interface DriverDispatchFormProps {
    orders: SupplierOrderItem[];
    fleetDrivers: FleetDriverItem[];
    fleetVehicles: FleetVehicleItem[];
    subcontractorsList: any[];
    selectedOrderId: string;
    selectedOrder: SupplierOrderItem | null;
    isRelay: boolean;
    onToggleRelay: (relay: boolean) => void;
    pickupLeg: LegAssignmentState;
    deliveryLeg: LegAssignmentState;
    onUpdatePickupLeg: (updates: Partial<LegAssignmentState>) => void;
    onUpdateDeliveryLeg: (updates: Partial<LegAssignmentState>) => void;
    dispatchNote: string;
    onChangeDispatchNote: (note: string) => void;
    isLoading: boolean;
    onSelectOrder: (id: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const DriverDispatchForm: React.FC<DriverDispatchFormProps> = ({
    orders,
    fleetDrivers,
    fleetVehicles,
    subcontractorsList,
    selectedOrderId,
    selectedOrder,
    isRelay,
    onToggleRelay,
    pickupLeg,
    deliveryLeg,
    onUpdatePickupLeg,
    onUpdateDeliveryLeg,
    dispatchNote,
    onChangeDispatchNote,
    isLoading,
    onSelectOrder,
    onSubmit,
}) => {
    const activeDispatchOrders = useMemo(() => {
        return orders.filter((o) => {
            const rawStatus = (o.status_raw || o.status || 'confirmed')
                .toLowerCase()
                .trim();
            return (
                rawStatus !== 'delivered' &&
                rawStatus !== 'completed' &&
                rawStatus !== 'cancelled' &&
                rawStatus !== 'pod accepted' &&
                rawStatus !== 'pod_accepted'
            );
        });
    }, [orders]);

    const jobOptions = useMemo(() => {
        return [
            { id: '', name: '-- Select Active Job / Shipment --' },
            ...activeDispatchOrders.map((o) => {
                const idText = o.order_id || o.order_no || `ORD-${o.id}`;
                const origin =
                    o.pickup_city ||
                    (o.pickup_address
                        ? o.pickup_address.split(',')[0]?.trim()
                        : '') ||
                    'Origin';
                const dest =
                    o.delivery_city ||
                    (o.delivery_address
                        ? o.delivery_address.split(',')[0]?.trim()
                        : '') ||
                    'Destination';
                const assignedTag = checkHasRealDriver(o) ? ' (Assigned)' : '';
                return {
                    id: String(o.id || o.order_id),
                    name: `${idText} • ${origin} → ${dest}${assignedTag}`,
                };
            }),
        ];
    }, [activeDispatchOrders]);

    return (
        <div className="lg:col-span-7 bg-white dark:bg-[#1e2329] rounded-md border border-slate-200 dark:border-slate-800 p-4 md:p-5 space-y-4 font-sans">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Shipment Dispatch Assignment
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Assign drivers and carriers for pickup and delivery legs
                </p>
            </div>

            <form
                id="dispatch-assignment-form"
                onSubmit={onSubmit}
                className="space-y-4"
            >
                {/* 1. Job / Shipment Selector */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 font-sans">
                        Select Job / Shipment{' '}
                        <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    {activeDispatchOrders.length === 0 && !isLoading ? (
                        <p className="text-xs text-slate-500 py-2">
                            No active shipments available for dispatch.
                        </p>
                    ) : (
                        <Select
                            size="md"
                            value={
                                selectedOrder
                                    ? String(selectedOrder.id || selectedOrder.order_id)
                                    : ''
                            }
                            onChange={(val) => {
                                const idVal =
                                    typeof val === 'object' && val?.target
                                        ? val.target.value
                                        : val?.id ?? val?.value ?? val;
                                onSelectOrder(String(idVal));
                            }}
                            showSearch={false}
                            placeholder="Choose an active shipment..."
                            options={jobOptions}
                        />
                    )}
                </div>

                {/* Selected Order Compact Preview */}
                {selectedOrder && (
                    <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                    {selectedOrder.order_id ||
                                        selectedOrder.order_no ||
                                        `ORD-${selectedOrder.id}`}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="truncate text-slate-600 dark:text-slate-300 font-medium">
                                    {selectedOrder.customer_name || 'Shipper'}
                                </span>
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 shrink-0">
                                {selectedOrder.agreed_price || '€0.00'}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                            <MapPin
                                size={12}
                                className="text-slate-400 shrink-0"
                            />
                            <span>{selectedOrder.pickup_city || 'Origin'}</span>
                            <ArrowRight
                                size={11}
                                className="text-slate-400 shrink-0"
                            />
                            <span>
                                {selectedOrder.delivery_city || 'Destination'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/70 dark:border-slate-800 flex-wrap">
                            <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                Pickup:{' '}
                                {formatDisplayDate(
                                    selectedOrder.pickup_date ||
                                        selectedOrder.created_at
                                )}
                            </span>
                            <span className="flex items-center gap-1">
                                <Truck size={11} />
                                Cargo: {selectedOrder.weight || '—'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Layers size={11} />
                                Vehicle: {selectedOrder.vehicle || 'Standard'}
                            </span>
                        </div>
                    </div>
                )}

                {/* 2. Multi-Driver Relay Switch */}
                <div className="flex items-center gap-3 py-1">
                    <Switch
                        checked={isRelay}
                        onCheckedChange={onToggleRelay}
                    />
                    <div className="flex items-start gap-2 min-w-0">
                        <Split
                            size={14}
                            className="text-slate-500 dark:text-slate-400 mt-0.5 shrink-0"
                        />
                        <div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                Multi-Driver Relay Dispatch (2-Leg: Pickup &amp; Delivery)
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Enable to assign different drivers or carriers for pickup and delivery.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Assignment Sections */}
                {!isRelay ? (
                    <LegAssignmentSection
                        title="Dispatch Assignment"
                        subtitle={`${selectedOrder?.pickup_city || 'Origin'} → ${
                            selectedOrder?.delivery_city || 'Destination'
                        }`}
                        legNumber={1}
                        showLegRoute={false}
                        legState={pickupLeg}
                        onChange={onUpdatePickupLeg}
                        fleetDrivers={fleetDrivers}
                        fleetVehicles={fleetVehicles}
                        subcontractorsList={subcontractorsList}
                        isLoading={isLoading}
                    />
                ) : (
                    <div className="space-y-4">
                        <LegAssignmentSection
                            title="Pickup Assignment – Leg 1"
                            subtitle={`${selectedOrder?.pickup_city || 'Origin'} (Pickup)`}
                            legNumber={1}
                            showLegRoute={true}
                            legState={pickupLeg}
                            onChange={onUpdatePickupLeg}
                            fleetDrivers={fleetDrivers}
                            fleetVehicles={fleetVehicles}
                            subcontractorsList={subcontractorsList}
                            isLoading={isLoading}
                        />

                        <LegAssignmentSection
                            title="Delivery Assignment – Leg 2"
                            subtitle={`${selectedOrder?.delivery_city || 'Destination'} (Delivery)`}
                            legNumber={2}
                            showLegRoute={true}
                            legState={deliveryLeg}
                            onChange={onUpdateDeliveryLeg}
                            fleetDrivers={fleetDrivers}
                            fleetVehicles={fleetVehicles}
                            subcontractorsList={subcontractorsList}
                            isLoading={isLoading}
                        />
                    </div>
                )}

                {/* Dispatch Notes using UI Textarea component */}
                <Textarea
                    label="Special Instructions / Dispatch Notes (Optional)"
                    rows={2}
                    placeholder="e.g. Verify cargo seal before loading..."
                    value={dispatchNote}
                    onChange={(e) => onChangeDispatchNote(e.target.value)}
                />
            </form>
        </div>
    );
};

export default DriverDispatchForm;
