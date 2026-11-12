import React from 'react';
import { CheckCircle2, MapPin, Truck, PackageCheck, FileCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { ShipmentItem, ShipmentStatus } from '../../../types';

interface Props {
    shipment?: ShipmentItem;
    status: ShipmentStatus;
    onUpdateStatus: (nextStatus: ShipmentStatus) => void;
    onOpenPOD: () => void;
    onOpenHandover?: () => void;
    onOpenAcceptHandover?: () => void;
}

interface Step {
    key: string;
    title: string;
    desc: string;
    icon: React.ElementType;
}

export const MilestoneStepper: React.FC<Props> = ({
    shipment,
    status,
    onUpdateStatus,
    onOpenPOD,
    onOpenHandover,
    onOpenAcceptHandover,
}) => {
    const isRelay = Boolean(shipment?.isRelay);
    const isLeg2 = Boolean(shipment?.isDeliveryOnly);
    const hubLocation = (shipment?.hubLocation && !shipment.hubLocation.toLowerCase().includes('transit hub'))
        ? shipment.hubLocation
        : 'Intermediate Hub';
    const handover = shipment?.handover;

    // Build steps dynamically based on relay role
    let steps: Step[] = [];
    let currentIndex = 0;

    if (isRelay && !isLeg2) {
        // Leg 1 Driver Steps
        steps = [
            { key: 'assigned', title: '1. Assigned', desc: 'Leg 1 corridor allocated', icon: Truck },
            { key: 'picked_up', title: '2. Picked Up', desc: 'Cargo loaded at origin', icon: PackageCheck },
            { key: 'in_transit', title: '3. En Route to Hub', desc: `Rolling to ${hubLocation}`, icon: Truck },
            { key: 'handover_completed', title: '4. Handover', desc: 'Transferred to Driver 2', icon: ShieldCheck },
        ];

        if (status === 'assigned' || status === 'accepted') {
            currentIndex = 0;
        } else if (status === 'at_pickup' || status === 'picked_up') {
            currentIndex = 1;
        } else if (status === 'in_transit') {
            currentIndex = 2;
        } else if (status === 'at_hub' || status === 'handover_pending') {
            currentIndex = 2; // Arrived at hub / initiating handover
        } else if (handover?.status === 'accepted' || status === 'completed' || status === 'delivered') {
            currentIndex = 4; // Complete
        }
    } else if (isRelay && isLeg2) {
        // Leg 2 Driver Steps
        steps = [
            { key: 'assigned', title: '1. Assigned', desc: 'Leg 2 delivery allocated', icon: Truck },
            { key: 'handover_accepted', title: '2. Cargo Received', desc: 'Accepted from Driver 1', icon: ShieldCheck },
            { key: 'in_transit', title: '3. Final Transit', desc: 'En route to consignee', icon: Truck },
            { key: 'at_delivery', title: '4. At Delivery', desc: 'Arrived at delivery dock', icon: MapPin },
            { key: 'delivered', title: '5. Delivered', desc: 'POD uploaded & signed off', icon: FileCheck },
        ];

        const isAccepted = handover?.status === 'accepted' || status === 'handover_accepted';
        if (status === 'delivered' || status === 'completed') {
            currentIndex = 4;
        } else if (status === 'at_delivery') {
            currentIndex = 3;
        } else if (status === 'in_transit' && isAccepted) {
            currentIndex = 2;
        } else if (isAccepted) {
            currentIndex = 1;
        } else {
            currentIndex = 0; // Awaiting cargo
        }
    } else {
        // Single Driver Standard Steps
        steps = [
            { key: 'assigned', title: '1. Assigned', desc: 'Freight load assigned to truck', icon: Truck },
            { key: 'picked_up', title: '2. Picked Up', desc: 'Loaded at origin facility', icon: PackageCheck },
            { key: 'in_transit', title: '3. In Transit', desc: 'Rolling on highway corridor', icon: Truck },
            { key: 'at_delivery', title: '4. At Delivery', desc: 'Arrived at consignee dock', icon: MapPin },
            { key: 'delivered', title: '5. Delivered', desc: 'POD uploaded & signed off', icon: FileCheck },
        ];

        switch (status) {
            case 'assigned':
            case 'accepted':
                currentIndex = 0;
                break;
            case 'at_pickup':
            case 'picked_up':
                currentIndex = 1;
                break;
            case 'in_transit':
                currentIndex = 2;
                break;
            case 'at_delivery':
                currentIndex = 3;
                break;
            case 'delivered':
            case 'completed':
                currentIndex = 4;
                break;
            default:
                currentIndex = 0;
        }
    }

    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Journey Milestones
                        </h2>
                        {isRelay && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-100 dark:bg-orange-950 text-[#FF4A1F] border border-orange-200 dark:border-orange-800">
                                {isLeg2 ? 'Leg 2 • Final Delivery' : 'Leg 1 • Pickup & Hub Transfer'}
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        {isRelay
                            ? isLeg2
                                ? `Receive cargo at ${hubLocation} and complete final delivery to customer`
                                : `Pick up from origin and hand over cargo to Driver 2 at ${hubLocation}`
                            : 'Direct single-driver delivery from origin to final destination'}
                    </p>
                </div>
            </div>

            {/* Stepper Grid */}
            <div className={`grid grid-cols-2 ${steps.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-5'} gap-2`}>
                {steps.map((step, idx) => {
                    const isPassed = idx < currentIndex;
                    const isCurrent = idx === currentIndex;
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.key}
                            className={`p-2.5 rounded-[4px] border transition-all ${
                                isCurrent
                                    ? 'bg-orange-50/70 dark:bg-orange-950/20 border-[#FF4A1F]'
                                    : isPassed
                                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                                    : 'bg-slate-50/50 dark:bg-[#161a22] border-slate-200/70 dark:border-slate-800 opacity-60'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <div
                                    className={`w-5 h-5 rounded-[3px] flex items-center justify-center text-[10px] font-bold ${
                                        isCurrent
                                            ? 'bg-[#FF4A1F] text-white'
                                            : isPassed
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                    }`}
                                >
                                    {isPassed ? <CheckCircle2 size={12} /> : idx + 1}
                                </div>
                                <Icon
                                    size={14}
                                    className={
                                        isCurrent
                                            ? 'text-[#FF4A1F]'
                                            : isPassed
                                            ? 'text-emerald-600'
                                            : 'text-slate-400'
                                    }
                                />
                            </div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{step.title}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{step.desc}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
