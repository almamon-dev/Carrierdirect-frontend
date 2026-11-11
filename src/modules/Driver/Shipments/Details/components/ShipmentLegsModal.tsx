import React from 'react';
import { X, GitFork, User, Phone, Truck, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { ShipmentItem, RelayLegInfo } from '../../../types';

interface ShipmentLegsModalProps {
    isOpen: boolean;
    shipment: ShipmentItem;
    onClose: () => void;
}

export const ShipmentLegsModal: React.FC<ShipmentLegsModalProps> = ({
    isOpen,
    shipment,
    onClose,
}) => {
    if (!isOpen) return null;

    const fromCity = shipment.shipper?.city || 'Dhaka';
    const toCity = shipment.consignee?.city || 'Chattogram';
    const hubLocation = shipment.hubLocation || 'Transit Hub';

    const legs: RelayLegInfo[] = (shipment.relayLegs && shipment.relayLegs.length > 0)
        ? shipment.relayLegs
        : [
            {
                leg_number: 1,
                leg_type: 'pickup',
                journey_leg: `${fromCity} ➔ ${hubLocation}`,
                status: (shipment.currentActiveLeg && shipment.currentActiveLeg > 1) ? 'completed' : 'in_progress',
                execution_mode: 'in_house',
                driver_name: shipment.isDeliveryOnly ? (shipment.partnerDriver?.driver_name || 'Liam O\'Connor') : (shipment.driver?.name || 'Liam O\'Connor'),
                driver_phone: '+880 1711-000001',
                vehicle_plate: 'DH-11-2041',
                vehicle_type: 'Mercedes Sprinter',
            },
            {
                leg_number: 2,
                leg_type: 'delivery',
                journey_leg: `${hubLocation} ➔ ${toCity}`,
                status: (shipment.currentActiveLeg && shipment.currentActiveLeg >= 2) ? 'in_progress' : 'pending',
                execution_mode: 'in_house',
                driver_name: shipment.isDeliveryOnly ? (shipment.driver?.name || 'Driver 2') : (shipment.partnerDriver?.driver_name || 'Driver 2'),
                driver_phone: '+880 1722-000002',
                vehicle_plate: 'CH-24-9982',
                vehicle_type: 'Mercedes Sprinter',
            },
        ];

    const activeLeg = shipment.currentActiveLeg || 1;

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xl bg-white dark:bg-[#1a1f26] rounded-[6px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden font-sans flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-900/60 font-bold">
                            <GitFork size={16} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Multi-Driver Journey Legs
                                </h3>
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                    {legs.length} Legs Total
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Order #{shipment.orderNumber} • Corridors & Driver Assignments
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body: Legs List */}
                <div className="p-4 space-y-3 overflow-y-auto">
                    {legs.map((leg, idx) => {
                        const legNum = leg.leg_number || idx + 1;
                        const isActive = legNum === activeLeg;
                        const isCompleted = legNum < activeLeg || leg.status === 'completed';

                        return (
                            <div
                                key={legNum}
                                className={`p-3.5 rounded-[6px] border transition-all ${
                                    isActive
                                        ? 'bg-orange-50/60 dark:bg-orange-950/20 border-[#FF4A1F]'
                                        : 'bg-white dark:bg-[#161a22] border-slate-200 dark:border-slate-800'
                                }`}
                            >
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                            Leg {legNum}
                                        </span>
                                        <span className="text-slate-300 dark:text-slate-700">•</span>
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {leg.journey_leg || (legNum === 1 ? `${fromCity} ➔ ${hubLocation}` : `${hubLocation} ➔ ${toCity}`)}
                                        </span>
                                    </div>

                                    {isActive ? (
                                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-100 dark:bg-orange-950 text-[#FF4A1F] border border-orange-200 dark:border-orange-900 shadow-2xs">
                                            Active Leg
                                        </span>
                                    ) : isCompleted ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                            <CheckCircle2 size={11} /> Completed
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            Pending
                                        </span>
                                    )}
                                </div>

                                <div className="pt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                            <User size={12} />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[10px] text-slate-400 block leading-tight">Driver</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                                                {leg.driver_name || 'Unassigned'}
                                            </span>
                                        </div>
                                    </div>

                                    {leg.driver_phone && leg.driver_phone !== '—' && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#FF4A1F] shrink-0">
                                                <Phone size={12} />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[10px] text-slate-400 block leading-tight">Contact</span>
                                                <a href={`tel:${leg.driver_phone}`} className="font-semibold text-slate-700 dark:text-slate-300 hover:text-[#FF4A1F]">
                                                    {leg.driver_phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {leg.vehicle_plate && leg.vehicle_plate !== '—' && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                                <Truck size={12} />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[10px] text-slate-400 block leading-tight">Vehicle</span>
                                                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                    {leg.vehicle_plate} ({leg.vehicle_type || 'Fleet'})
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                            <ShieldCheck size={12} />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[10px] text-slate-400 block leading-tight">Mode</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                {leg.execution_mode === 'subcontractor' ? 'Subcontractor Carrier' : 'In-House Fleet'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#15191e]/50 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShipmentLegsModal;

