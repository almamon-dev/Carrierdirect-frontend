import React, { useState } from 'react';
import { Truck, CheckCircle2, ShieldCheck, ArrowRight, FileCheck, Eye, ExternalLink, X } from 'lucide-react';
import { ShipmentItem, ShipmentStatus } from '../../../types';
import { requireDriverCompliance } from '../../../Compliance';
import { getStatusDisplay } from '../utils/statusDisplayConfig';
import { DriverShipmentNextActionBox } from './DriverShipmentNextActionBox';

interface Props {
    shipment: ShipmentItem;
    onUpdateStatus: (nextStatus: ShipmentStatus) => void;
    onOpenPOD: () => void;
    onOpenGPS?: () => void;
}

export const DriverShipmentActionCard: React.FC<Props> = ({
    shipment,
    onUpdateStatus,
    onOpenPOD,
    onOpenGPS,
}) => {
    const status = shipment.status;
    const isDeliveredOrCompleted = status === 'delivered' || status === 'completed';
    const displayPod = shipment.podData || (isDeliveredOrCompleted ? {
        receiverName: shipment.consignee.name || shipment.consignee.company || 'Consignee Receiver',
        uploadedAt: shipment.updatedAt || shipment.createdAt,
        signatureUrl: undefined,
        documentPhotos: [],
        notes: '',
    } : undefined);
    const [viewDocUrl, setViewDocUrl] = useState<string | null>(null);

    const fromCity = shipment.shipper.city || 'Origin';
    const toCity = shipment.consignee.city || 'Destination';

    const pickupLat = shipment.route?.originCoords?.lat;
    const pickupLng = shipment.route?.originCoords?.lng;
    const deliveryLat = shipment.route?.destinationCoords?.lat;
    const deliveryLng = shipment.route?.destinationCoords?.lng;

    const hasExactCoords = Boolean(
        pickupLat !== undefined && pickupLat !== null && !isNaN(Number(pickupLat)) &&
        pickupLng !== undefined && pickupLng !== null && !isNaN(Number(pickupLng)) &&
        deliveryLat !== undefined && deliveryLat !== null && !isNaN(Number(deliveryLat)) &&
        deliveryLng !== undefined && deliveryLng !== null && !isNaN(Number(deliveryLng))
    );

    const googleMapsUrl = hasExactCoords
        ? `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${deliveryLat},${deliveryLng}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(shipment.shipper.address || shipment.shipper.city)}&destination=${encodeURIComponent(shipment.consignee.address || shipment.consignee.city)}&travelmode=driving`;

    const statusConfig = getStatusDisplay(shipment);

    const handlePrimaryAction = () => {
        if (statusConfig.actionType === 'pickup') {
            requireDriverCompliance(() => onUpdateStatus('at_pickup'), 'Confirm Goods Picked Up');
        } else if (statusConfig.actionType === 'transit') {
            requireDriverCompliance(() => onUpdateStatus('in_transit'), 'Start Highway Transit');
        } else if (statusConfig.actionType === 'navigate') {
            if (onOpenGPS) {
                onOpenGPS();
            } else {
                window.open(googleMapsUrl, '_blank');
            }
        } else if (statusConfig.actionType === 'pod') {
            requireDriverCompliance(() => onOpenPOD(), 'Upload Proof of Delivery');
        }
    };

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs font-sans overflow-hidden">
            {/* Header with Live Badge */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Current Status
                </h3>
                {status === 'in_transit' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] text-[11px] font-bold bg-orange-50 dark:bg-orange-950/50 text-[#FF4A1F] border border-orange-200 dark:border-orange-900/60 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A1F] animate-pulse" />
                        Live
                    </span>
                ) : status === 'delivered' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] text-[11px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Awaiting Review
                    </span>
                ) : status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={11} />
                        Completed
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] text-[11px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        Active
                    </span>
                )}
            </div>

            {/* Status Visual and Corridor */}
            <div className="p-4 space-y-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center text-[#FF4A1F] shrink-0 shadow-2xs">
                        <Truck size={24} />
                    </div>
                    <div>
                        <h2 className={`text-xl font-extrabold tracking-tight ${statusConfig.color}`}>
                            {statusConfig.label}
                        </h2>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                            <span>{fromCity}</span>
                            <ArrowRight size={11} className="text-slate-400" />
                            <span>{toCity}</span>
                        </p>
                    </div>
                </div>

                {/* Next Action Box */}
                <DriverShipmentNextActionBox
                    status={status}
                    statusConfig={statusConfig}
                    handlePrimaryAction={handlePrimaryAction}
                    onOpenPOD={onOpenPOD}
                />

                {/* POD Summary if present */}
                {displayPod && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between pb-1">
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <FileCheck size={13} /> Proof of Delivery (POD) Sign-Off
                            </span>
                            <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                Verified
                            </span>
                        </div>

                        <div className="grid grid-cols-[110px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Signed By</span>
                            <span className="text-[#FF4A1F] font-bold text-center">:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">{displayPod.receiverName || shipment.consignee.name || shipment.consignee.company || 'Consignee Receiver'}</span>
                        </div>
                        <div className="grid grid-cols-[110px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Time & Date</span>
                            <span className="text-[#FF4A1F] font-bold text-center">:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                {displayPod.uploadedAt ? new Date(displayPod.uploadedAt).toLocaleString() : '-'}
                            </span>
                        </div>

                        {/* Signature Preview */}
                        {displayPod.signatureUrl && (
                            <div className="mt-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={displayPod.signatureUrl}
                                        alt="Receiver Signature"
                                        className="h-8 max-w-[120px] object-contain border border-slate-200 dark:border-slate-700 rounded bg-white px-1"
                                    />
                                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                                        E-Signature
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setViewDocUrl(displayPod.signatureUrl!)}
                                    className="px-2 py-1 text-[10.5px] font-semibold text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                    <Eye size={12} />
                                    <span>View</span>
                                </button>
                            </div>
                        )}

                        {/* Attached Cargo / Paper BOL Photo Preview */}
                        {displayPod.documentPhotos && displayPod.documentPhotos[0] && (
                            <div className="mt-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                    <img
                                        src={displayPod.documentPhotos[0]}
                                        alt="Paper BOL"
                                        className="w-9 h-9 object-cover rounded border border-slate-200 dark:border-slate-700 shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                                            Signed Paper BOL / Cargo Photo
                                        </p>
                                        <p className="text-[10px] text-slate-400">Attached Delivery Proof</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setViewDocUrl(displayPod.documentPhotos![0])}
                                    className="px-2 py-1 text-[10.5px] font-semibold text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                                >
                                    <Eye size={12} />
                                    <span>View Photo</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Document / Photo View Lightbox */}
                {viewDocUrl && (
                    <div
                        className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                        onClick={() => setViewDocUrl(null)}
                    >
                        <div
                            className="relative max-w-4xl max-h-[90vh] bg-[#12161c] rounded-[4px] border border-slate-800 overflow-hidden flex flex-col shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white">
                                <span className="text-xs font-bold flex items-center gap-2">
                                    <FileCheck size={15} className="text-emerald-500" />
                                    Proof of Delivery Sign-Off Document
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setViewDocUrl(null)}
                                    className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-3 flex-1 overflow-auto flex items-center justify-center max-h-[calc(90vh-50px)]">
                                <img
                                    src={viewDocUrl}
                                    alt="POD Document"
                                    className="max-w-full max-h-[80vh] object-contain rounded"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Compliance Footer */}
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#15191e]/50 text-xs">
                <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span>Driver Compliance</span>
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                        Verified Active
                    </span>
                </div>
            </div>
        </div>
    );
};
