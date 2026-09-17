import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Navigation, FileCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { driverApi } from '../../services/driverApi';
import { ShipmentItem, ShipmentStatus } from '../../types';
import { ShipmentStatusBadge } from '../components/ShipmentStatusBadge';
import { MilestoneStepper } from './components/MilestoneStepper';
import { CargoSpecsCard } from './components/CargoSpecsCard';
import { ContactPartyCard } from './components/ContactPartyCard';
import { PODUploadModal } from './components/PODUploadModal';

import { requireDriverCompliance } from '../../Compliance';

export default function ShipmentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [shipment, setShipment] = useState<ShipmentItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPODOpen, setIsPODOpen] = useState(false);

    const loadShipment = async () => {
        if (!id) return;
        try {
            const data = await driverApi.getShipmentById(id);
            setShipment(data);
        } catch (err) {
            console.error('Failed to load shipment details', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadShipment();
    }, [id]);

    const handleUpdateMilestone = async (nextStatus: ShipmentStatus) => {
        requireDriverCompliance(async () => {
            if (!shipment) return;
            const updated = await driverApi.updateShipmentMilestone(shipment.id, nextStatus);
            setShipment(updated);
        }, 'Update Delivery Milestone');
    };

    const handleOpenPOD = () => {
        requireDriverCompliance(() => {
            setIsPODOpen(true);
        }, 'Upload Proof of Delivery (POD)');
    };

    const handlePODSubmit = async (podData: any) => {
        if (!shipment) return;
        const updated = await driverApi.submitPOD(shipment.id, podData);
        setShipment(updated);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-[#FF4A1F]" />
            </div>
        );
    }

    if (!shipment) {
        return (
            <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <Truck size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Shipment Not Found</h2>
                <Link to="/driver/shipments">
                    <button
                        type="button"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-[4px] text-xs font-bold transition-colors cursor-pointer"
                    >
                        Back to Shipments
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-5 space-y-3.5 sm:space-y-4 max-w-5xl mx-auto pb-16 animate-in fade-in duration-150">
            {/* Top Back & Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-3">
                    <Link
                        to="/driver/shipments"
                        className="p-1.5 rounded-[4px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                                {shipment.orderNumber}
                            </h1>
                            <ShipmentStatusBadge status={shipment.status} />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Tracking: <span className="font-mono font-semibold">{shipment.trackingNumber}</span> • Priority: {shipment.priority}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => {
                            requireDriverCompliance(() => {
                                window.open(
                                    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shipment.consignee.address + ', ' + shipment.consignee.city)}`,
                                    '_blank'
                                );
                            }, 'Live GPS Navigation');
                        }}
                        className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100/80 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/60 dark:border-orange-900/40 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <Navigation size={13} />
                        <span>Launch GPS</span>
                    </button>

                    {shipment.status !== 'delivered' && (
                        <button
                            type="button"
                            onClick={handleOpenPOD}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                            <FileCheck size={13} />
                            <span>Upload POD</span>
                        </button>
                    )}
                </div>
            </div>

            {/* 1. Milestone Stepper & Status Action */}
            <MilestoneStepper
                status={shipment.status}
                onUpdateStatus={handleUpdateMilestone}
                onOpenPOD={handleOpenPOD}
            />

            {/* 2. Route Map & Addresses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                <ContactPartyCard title="Origin / Pickup Facility" type="shipper" party={shipment.shipper} />
                <ContactPartyCard title="Destination / Consignee" type="consignee" party={shipment.consignee} />
            </div>

            {/* 3. Cargo Specifications & Payout details */}
            <CargoSpecsCard cargo={shipment.cargo} payout={shipment.payout} />

            {/* 4. Verified POD Result (if delivered) */}
            {shipment.podData && (
                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-[4px] p-3.5 sm:p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>Proof of Delivery (POD) Sign-Off Verified</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <div>
                            <span className="text-slate-400 text-[11px] block">Signed By:</span>
                            <span className="font-bold">{shipment.podData.receiverName}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 text-[11px] block">Timestamp:</span>
                            <span className="font-bold">{new Date(shipment.podData.uploadedAt).toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 text-[11px] block">Notes:</span>
                            <span>{shipment.podData.notes || 'Delivered in good condition.'}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* POD Modal */}
            <PODUploadModal
                isOpen={isPODOpen}
                orderNumber={shipment.orderNumber}
                onClose={() => setIsPODOpen(false)}
                onSubmitPOD={handlePODSubmit}
            />
        </div>
    );
}
