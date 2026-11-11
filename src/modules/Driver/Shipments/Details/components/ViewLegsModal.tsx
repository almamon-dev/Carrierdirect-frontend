import React from 'react';
import { X, GitFork, Truck, User, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { ShipmentItem } from '../../../types';

interface ViewLegsModalProps {
    isOpen: boolean;
    shipment: ShipmentItem;
    onClose: () => void;
}

export const ViewLegsModal: React.FC<ViewLegsModalProps> = ({ isOpen, shipment, onClose }) => {
    if (!isOpen) return null;

    const fromCity = shipment.shipper.city || 'Origin';
    const toCity = shipment.consignee.city || 'Destination';
    const hubLocation = shipment.hubLocation || 'Transit Hub';
    const relayLegs = shipment.relayLegs || [];
    const handover = shipment.handover;

    // Resolve leg 1 & leg 2 details
    const leg1 = relayLegs.find((l) => l.leg_number === 1) || {
        leg_number: 1,
        leg_type: 'pickup',
        journey_leg: `${fromCity} ➔ ${hubLocation}`,
        status: shipment.status === 'at_hub' || shipment.status === 'handover_pending' ? 'at_hub' : (shipment.currentActiveLeg && shipment.currentActiveLeg > 1 ? 'completed' : shipment.status),
        execution_mode: shipment.driverType || 'in_house',
        driver_name: shipment.isDeliveryOnly ? shipment.partnerDriver?.driver_name : shipment.driver?.name,
        driver_phone: shipment.isDeliveryOnly ? shipment.partnerDriver?.driver_phone : shipment.driver?.phone,
        vehicle_plate: shipment.isDeliveryOnly ? shipment.partnerDriver?.vehicle_plate : shipment.driver?.vehiclePlate,
        vehicle_type: shipment.isDeliveryOnly ? shipment.partnerDriver?.vehicle_type : shipment.driver?.vehicleType,
    };

    const leg2 = relayLegs.find((l) => l.leg_number === 2) || {
        leg_number: 2,
        leg_type: 'delivery',
        journey_leg: `${hubLocation} ➔ ${toCity}`,
        status: shipment.currentActiveLeg === 2 ? shipment.status : (handover?.status === 'accepted' ? 'in_transit' : 'assigned'),
        execution_mode: 'in_house',
        driver_name: shipment.isDeliveryOnly ? shipment.driver?.name : shipment.partnerDriver?.driver_name,
        driver_phone: shipment.isDeliveryOnly ? shipment.driver?.phone : shipment.partnerDriver?.driver_phone,
        vehicle_plate: shipment.isDeliveryOnly ? shipment.driver?.vehiclePlate : shipment.partnerDriver?.vehicle_plate,
        vehicle_type: shipment.isDeliveryOnly ? shipment.driver?.vehicleType : shipment.partnerDriver?.vehicle_type,
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto font-sans">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#15191e]/60">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-900/60 font-bold">
                            <GitFork size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Multi-Driver Relay Legs Manifest
                                </h3>
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                    2 Legs
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Shipment #{shipment.orderNumber} • Relay Corridor Overview
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Corridor Visual */}
                    <div className="p-3 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 rounded flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-emerald-600" />
                            <span>{fromCity}</span>
                        </span>
                        <ArrowRight size={13} className="text-slate-400" />
                        <span className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
                            <GitFork size={13} />
                            <span>{hubLocation}</span>
                        </span>
                        <ArrowRight size={13} className="text-slate-400" />
                        <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#FF4A1F]" />
                            <span>{toCity}</span>
                        </span>
                    </div>

                    {/* Leg 1 Card */}
                    <div className="p-4 bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 rounded-[4px] space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                                    1
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Leg 1: Pickup ➔ Transit Hub
                                </h4>
                            </div>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                {leg1.status.replace('_', ' ')}
                            </span>
                        </div>

                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <span>{fromCity}</span>
                            <ArrowRight size={11} className="text-slate-400" />
                            <span>{hubLocation}</span>
                        </p>

                        <div className="p-2.5 bg-slate-50 dark:bg-[#1a1f26] rounded border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold shrink-0">
                                    <User size={15} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                                        {leg1.driver_name || 'Assigned Driver 1'}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        Driver (Leg 1) {leg1.vehicle_plate && leg1.vehicle_plate !== '—' ? `• ${leg1.vehicle_plate}` : ''}
                                    </div>
                                </div>
                            </div>
                            {leg1.driver_phone && leg1.driver_phone !== '—' && (
                                <a
                                    href={`tel:${leg1.driver_phone}`}
                                    className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1 hover:bg-slate-50 shadow-2xs"
                                >
                                    <Phone size={11} className="text-[#FF4A1F]" />
                                    <span>Call</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Transit Hub Section */}
                    <div className="p-3 bg-violet-50/60 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/40 rounded flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 flex items-center justify-center">
                                <MapPin size={14} />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-violet-800 dark:text-violet-300 block">
                                    Intermediate Relay Hub
                                </span>
                                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                                    {hubLocation}
                                </span>
                            </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#1a1f26] border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300">
                            {handover?.status === 'accepted' ? 'Handover Completed' : (handover?.status === 'pending_acceptance' ? 'Awaiting Acceptance' : 'Pending Arrival')}
                        </span>
                    </div>

                    {/* Leg 2 Card */}
                    <div className="p-4 bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 rounded-[4px] space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                                    2
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Leg 2: Transit Hub ➔ Final Consignee
                                </h4>
                            </div>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {leg2.status.replace('_', ' ')}
                            </span>
                        </div>

                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <span>{hubLocation}</span>
                            <ArrowRight size={11} className="text-slate-400" />
                            <span>{toCity}</span>
                        </p>

                        <div className="p-2.5 bg-slate-50 dark:bg-[#1a1f26] rounded border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold shrink-0">
                                    <User size={15} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                                        {leg2.driver_name || 'Assigned Driver 2'}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        Driver (Leg 2) {leg2.vehicle_plate && leg2.vehicle_plate !== '—' ? `• ${leg2.vehicle_plate}` : ''}
                                    </div>
                                </div>
                            </div>
                            {leg2.driver_phone && leg2.driver_phone !== '—' && (
                                <a
                                    href={`tel:${leg2.driver_phone}`}
                                    className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1 hover:bg-slate-50 shadow-2xs"
                                >
                                    <Phone size={11} className="text-[#FF4A1F]" />
                                    <span>Call</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

