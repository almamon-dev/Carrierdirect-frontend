import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Check,
    Info,
    Package,
    RefreshCw,
    Send,
} from 'lucide-react';
import Button from '@/components/ui/button';
import { formatDisplayDate } from '@/lib/utils';
import { SupplierOrderItem } from '../../ActiveJobs/types';
import { checkHasRealDriver } from '../../ActiveJobs/utils/orderMapper';
import {
    DispatchFinancialSummary,
    FleetDriverItem,
    FleetVehicleItem,
    LegAssignmentState,
} from '../types';

interface DispatchSummaryPanelProps {
    selectedOrder: SupplierOrderItem | null;
    isRelay: boolean;
    pickupLeg: LegAssignmentState;
    deliveryLeg: LegAssignmentState;
    fleetDrivers: FleetDriverItem[];
    fleetVehicles: FleetVehicleItem[];
    subcontractorsList: any[];
    financialSummary: DispatchFinancialSummary;
    isSubmitting: boolean;
    selectedOrderId: string;
}

const formatEuro = (val: number) =>
    `€${val.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export const DispatchSummaryPanel: React.FC<DispatchSummaryPanelProps> = ({
    selectedOrder,
    isRelay,
    pickupLeg,
    deliveryLeg,
    fleetDrivers,
    fleetVehicles,
    subcontractorsList,
    financialSummary,
    isSubmitting,
    selectedOrderId,
}) => {
    const navigate = useNavigate();

    const resolveLegDisplay = (leg: LegAssignmentState) => {
        if (leg.executionMode === 'in_house') {
            const driver = fleetDrivers.find(
                (d) =>
                    String(d.rawId) === String(leg.driverId) ||
                    String(d.id) === String(leg.driverId)
            );
            return {
                isAssigned: Boolean(driver),
                modeLabel: 'In-House',
                modeTitle: 'In-House Driver',
                actorName: driver?.name || 'Select Driver',
                phone: driver?.phone || '',
            };
        }

        const sub = subcontractorsList.find(
            (s) => String(s.id) === String(leg.subcontractorId)
        );
        const carrierName =
            leg.subcontractorCompany || sub?.name || 'Select Carrier';
        return {
            isAssigned: Boolean(
                (leg.subcontractorId && leg.subcontractorId !== 'custom') ||
                    leg.subcontractorCompany.trim()
            ),
            modeLabel: 'Subcontractor',
            modeTitle: 'Subcontractor',
            actorName: carrierName,
            phone: leg.subcontractorDriverPhone || sub?.phone || '',
        };
    };

    const leg1Display = resolveLegDisplay(pickupLeg);
    const leg2Display = resolveLegDisplay(deliveryLeg);

    return (
        <div className="lg:col-span-5 space-y-4 font-sans">
            {/* 1. Shipment Summary Card */}
            <div className="bg-white dark:bg-[#1e2329] rounded-md border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Shipment Summary
                    </h3>
                </div>

                {!selectedOrder ? (
                    <div className="py-5 text-center text-xs text-slate-400">
                        <Package size={20} className="mx-auto mb-1 opacity-60" />
                        <p>Select a shipment to view summary</p>
                    </div>
                ) : (
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 dark:text-slate-400">
                                Job ID
                            </span>
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                {selectedOrder.order_id ||
                                    selectedOrder.order_no ||
                                    `ORD-${selectedOrder.id}`}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 dark:text-slate-400">
                                Customer
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {selectedOrder.customer_name || 'Shipper'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 dark:text-slate-400">
                                Route
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                                {selectedOrder.pickup_city || 'Origin'} →{' '}
                                {selectedOrder.delivery_city || 'Destination'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 dark:text-slate-400">
                                Pickup Date
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {formatDisplayDate(
                                    selectedOrder.pickup_date ||
                                        selectedOrder.created_at
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 dark:text-slate-400">
                                Cargo
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                                {selectedOrder.weight || '—'}
                                {selectedOrder.pallets
                                    ? ` • ${selectedOrder.pallets}`
                                    : ''}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 dark:text-slate-400">
                                Vehicle
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {selectedOrder.vehicle || 'Standard'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Financial Summary Card */}
            <div className="bg-white dark:bg-[#1e2329] rounded-md border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Financial Summary
                    </h3>
                </div>

                <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                            Customer Price
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                            {formatEuro(financialSummary.customerPrice)}
                        </span>
                    </div>

                    {isRelay ? (
                        <>
                            {pickupLeg.executionMode === 'subcontractor' && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Subcontractor Cost (Leg 1)
                                    </span>
                                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                                        {formatEuro(
                                            financialSummary.pickupSubcontractorCost
                                        )}
                                    </span>
                                </div>
                            )}

                            {deliveryLeg.executionMode === 'subcontractor' && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Subcontractor Cost (Leg 2)
                                    </span>
                                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                                        {formatEuro(
                                            financialSummary.deliverySubcontractorCost
                                        )}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-400">
                                    Total Subcontractor Cost
                                </span>
                                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                    {formatEuro(
                                        financialSummary.totalSubcontractorCost
                                    )}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400">
                                Total Subcontractor Cost
                            </span>
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                {formatEuro(
                                    financialSummary.totalSubcontractorCost
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {/* Net Profit Row */}
                <div
                    className={`rounded-md border px-3 py-2 flex items-center justify-between gap-2 ${
                        financialSummary.isProfitable
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                    }`}
                >
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <span>Net Profit</span>
                        <Info size={12} className="text-slate-400" />
                    </span>

                    <div className="flex items-center gap-2">
                        <span
                            className={`text-sm font-bold font-mono ${
                                financialSummary.isProfitable
                                    ? 'text-emerald-700 dark:text-emerald-300'
                                    : 'text-rose-600 dark:text-rose-400'
                            }`}
                        >
                            {financialSummary.netProfit < 0 ? '-' : ''}
                            {formatEuro(Math.abs(financialSummary.netProfit))}
                        </span>
                        <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono text-white ${
                                financialSummary.isProfitable
                                    ? 'bg-emerald-600'
                                    : 'bg-rose-600'
                            }`}
                        >
                            {financialSummary.profitMarginPercent.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Dispatch Flow Card */}
            <div className="bg-white dark:bg-[#1e2329] rounded-md border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Dispatch Flow
                    </h3>
                </div>

                <div className="space-y-0 text-xs">
                    {/* Node 1 */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                            <div className="flex flex-col items-center pt-0.5">
                                <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                        leg1Display.isAssigned
                                            ? 'bg-emerald-600 text-white'
                                            : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                    }`}
                                >
                                    {leg1Display.isAssigned && (
                                        <Check size={11} strokeWidth={3} />
                                    )}
                                </span>
                                {isRelay && (
                                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 my-1" />
                                )}
                            </div>
                            <div className="min-w-0 pb-1">
                                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {isRelay ? 'Pickup' : 'Dispatch'} –{' '}
                                    {leg1Display.modeTitle}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                    {selectedOrder?.pickup_city || 'Origin'} •{' '}
                                    {leg1Display.actorName}
                                    {leg1Display.phone
                                        ? ` (${leg1Display.phone})`
                                        : ''}
                                </div>
                            </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                            {leg1Display.modeLabel}
                        </span>
                    </div>

                    {/* Node 2 */}
                    {isRelay && (
                        <div className="flex items-start justify-between gap-2 pt-0.5">
                            <div className="flex items-start gap-2.5 min-w-0">
                                <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                        leg2Display.isAssigned
                                            ? 'bg-emerald-600 text-white'
                                            : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                    }`}
                                >
                                    {leg2Display.isAssigned && (
                                        <Check size={11} strokeWidth={3} />
                                    )}
                                </span>
                                <div className="min-w-0">
                                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                        Delivery – {leg2Display.modeTitle}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                        {selectedOrder?.delivery_city ||
                                            'Destination'}{' '}
                                        • {leg2Display.actorName}
                                        {leg2Display.phone
                                            ? ` (${leg2Display.phone})`
                                            : ''}
                                    </div>
                                </div>
                            </div>

                            <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                                {leg2Display.modeLabel}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Action Buttons */}
            <div className="flex items-center gap-2.5">
                <Button
                    type="submit"
                    form="dispatch-assignment-form"
                    variant="primary"
                    disabled={isSubmitting || !selectedOrderId}
                    className="flex-1 h-9 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center justify-center gap-2 rounded-md cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Dispatching...</span>
                        </>
                    ) : (
                        <>
                            <Send size={14} />
                            <span>
                                {selectedOrder && checkHasRealDriver(selectedOrder)
                                    ? 'Update Dispatch'
                                    : 'Assign Dispatch'}
                            </span>
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/supplier/orders/active-jobs')}
                    className="h-9 px-5 text-xs font-semibold rounded-md bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default DispatchSummaryPanel;
