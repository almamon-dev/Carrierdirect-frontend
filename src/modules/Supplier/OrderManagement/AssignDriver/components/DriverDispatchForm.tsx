import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, ArrowRight, Calendar, Truck, Layers, AlertCircle, UserPlus, UserCheck, Mail, ShieldCheck, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';
import FormLabel from '@/components/ui/label';
import Select from '@/components/ui/select';
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
    dispatchNote: string;
    isSubmitting: boolean;
    isLoading: boolean;
    onSelectOrder: (id: string) => void;
    onSelectDriver: (id: string) => void;
    onChangeDispatchNote: (note: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClear: () => void;
}

export const DriverDispatchForm: React.FC<DriverDispatchFormProps> = ({
    orders, fleetDrivers, selectedOrderId, selectedDriverId,
    selectedOrder, selectedDriver, dispatchNote, isSubmitting,
    isLoading, onSelectOrder, onSelectDriver, onChangeDispatchNote,
    onSubmit, onClear,
}) => {
    const navigate = useNavigate();

    // Filter to only unassigned jobs (services that have NOT been allocated a driver yet)
    const unassignedOrders = React.useMemo(() => {
        return orders.filter((o) => {
            const rawStatus = (o.status_raw || o.status || 'confirmed').toLowerCase().trim();
            // Strictly exclude completed / delivered
            if (rawStatus === 'delivered' || rawStatus === 'completed' || rawStatus === 'pod accepted' || rawStatus === 'pod_accepted') {
                return false;
            }

            const hasRealDriver = checkHasRealDriver(o);
            const isAssigned = (rawStatus === 'in_transit' || rawStatus === 'picked_up') || hasRealDriver;

            // Show unassigned orders
            if (!isAssigned) return true;

            // If an order is already assigned but currently selected (e.g., clicked Reassign from queue or URL), preserve it
            if (selectedOrderId && (String(o.id) === String(selectedOrderId) || String(o.order_id) === String(selectedOrderId) || (Boolean(o.rawId) && String(o.rawId) === String(selectedOrderId)))) {
                return true;
            }

            return false;
        });
    }, [orders, selectedOrderId]);

    return (
        <div className="lg:col-span-6 bg-white dark:bg-[#1e2329] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs p-4 md:p-5 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-[#ff4a1f] text-white flex items-center justify-center">
                        <Sparkles size={14} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Driver Allocation Workspace</h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Select job and allocate driver directly from your team</p>
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
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
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
                            showSearch={true}
                            placeholder="Choose an unassigned shipment..."
                            options={[
                                { id: '', name: '-- Select Unassigned Active Job --' },
                                ...unassignedOrders.map((o) => {
                                    const idText = o.order_id || o.order_no || `ORD-${o.id}`;
                                    const origin = o.pickup_city || (o.pickup_address ? o.pickup_address.split(',')[0]?.trim() : '') || 'Origin';
                                    const dest = o.delivery_city || (o.delivery_address ? o.delivery_address.split(',')[0]?.trim() : '') || 'Destination';
                                    const custName = o.customer_name || o.customer?.name || 'Customer';
                                    return { id: String(o.id || o.order_id), name: `${idText} • ${origin} → ${dest} (${custName})` };
                                }),
                            ]}
                        />
                    )}
                </div>

                {/* Selected Order Summary Preview Card */}
                {selectedOrder && (
                    <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-3 border border-slate-200 dark:border-slate-800 space-y-2 text-xs animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedOrder.order_id || selectedOrder.order_no || `ORD-${selectedOrder.id}`}</span>
                                <span className="text-slate-400">•</span>
                                <span className="truncate text-slate-600 dark:text-slate-300 font-medium">{selectedOrder.customer_name || 'Shipper'}</span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{selectedOrder.agreed_price || '€ 0.00'}</span>
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

                {/* 2. Driver Selection directly from Fleet List */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <FormLabel className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        2. Select Driver from Fleet Team <span className="text-rose-500">*</span>
                    </FormLabel>

                    {fleetDrivers.length === 0 && !isLoading ? (
                        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold"><AlertCircle size={15} /><span>No Active Drivers Found</span></div>
                            <p className="text-[11px] text-amber-700 dark:text-amber-400">Only active team members can be allocated to shipments.</p>
                            <Button type="button" variant="outline" size="sm" onClick={() => navigate('/supplier/team')} className="h-7 text-xs bg-white dark:bg-[#1e2329] border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                                <UserPlus size={12} /><span>Go to Team Management</span>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <Select
                                    size="sm" value={selectedDriverId}
                                    onChange={(val) => {
                                        const dId = typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                                        onSelectDriver(String(dId));
                                    }}
                                    showSearch={true} placeholder="Choose a Fleet Driver"
                                    options={[
                                        { id: '', name: '-- Select Fleet Driver --' },
                                        ...fleetDrivers.map((d) => ({ id: d.id, name: `${d.name} (${d.role}) ${d.email ? `• ${d.email}` : ''}` }))
                                    ]}
                                />
                            </div>

                            {selectedDriver && (
                                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-3 border border-slate-200 dark:border-slate-800 space-y-2 text-xs animate-in fade-in duration-150">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-[10px]">
                                                {selectedDriver.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedDriver.name}</span>
                                            <span className="text-slate-400 text-[11px]">({selectedDriver.role})</span>
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{selectedDriver.status || 'Available'}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5"><Mail size={11.5} className="text-slate-400 shrink-0" /><span className="truncate">Email: <strong className="text-slate-700 dark:text-slate-300 font-medium">{selectedDriver.email || selectedDriver.phone || "—"}</strong></span></div>
                                        <div className="flex items-center gap-1.5"><Truck size={11.5} className="text-slate-400 shrink-0" /><span className="truncate">Vehicle: <strong className="text-slate-700 dark:text-slate-300 font-medium">{selectedDriver.vehiclePlate}</strong></span></div>
                                        <div className="flex items-center gap-1.5"><ShieldCheck size={11.5} className="text-slate-400 shrink-0" /><span className="truncate">License: <strong className="text-slate-700 dark:text-slate-300 font-medium">{selectedDriver.license}</strong></span></div>
                                        <div className="flex items-center gap-1.5"><Layers size={11.5} className="text-slate-400 shrink-0" /><span className="truncate">Spec: <strong className="text-slate-700 dark:text-slate-300 font-medium">{selectedDriver.vehicleType}</strong></span></div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Special Instructions / Dispatch Notes (Optional)</FormLabel>
                        <textarea
                            rows={2}
                            placeholder="e.g. Please verify cargo seal before loading..."
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
                    <Button type="submit" variant="primary" size="sm" disabled={isSubmitting || !selectedOrderId || !selectedDriverId} className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs rounded-[4px] px-4">
                        {isSubmitting ? (<><RefreshCw size={13} className="animate-spin" /><span>Dispatching...</span></>) : (
                            <><UserCheck size={14} /><span>{selectedOrder && checkHasRealDriver(selectedOrder) ? "Update Driver & Reassign" : "Confirm Dispatch"}</span></>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DriverDispatchForm;
