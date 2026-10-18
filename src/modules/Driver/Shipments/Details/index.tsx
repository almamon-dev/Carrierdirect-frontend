import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { encryptId, decryptId } from '@/lib/encryption';
import { Truck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { driverApi } from '../../services/driverApi';
import { ShipmentItem, ShipmentStatus } from '../../types';
import { requireDriverCompliance } from '../../Compliance';

import { DriverShipmentHeader } from './components/DriverShipmentHeader';
import { DriverShipmentMapSection } from './components/DriverShipmentMapSection';
import { DriverShipmentLocationsCard } from './components/DriverShipmentLocationsCard';
import { DriverShipmentCargoSpecsCard } from './components/DriverShipmentCargoSpecsCard';
import { DriverShipmentActionCard } from './components/DriverShipmentActionCard';
import { DriverShipmentSidebarTimeline } from './components/DriverShipmentSidebarTimeline';
import { DriverShipmentDetailsSkeleton } from './components/DriverShipmentDetailsSkeleton';
import { PODUploadModal } from './components/PODUploadModal';
import { CustomerRatingModal } from './components/CustomerRatingModal';
import { GPSComingSoonModal } from '@/components/modals';
import { echo } from '@/lib/echo';

export default function DriverShipmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [shipment, setShipment] = useState<ShipmentItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPODOpen, setIsPODOpen] = useState(false);
    const [isGPSOpen, setIsGPSOpen] = useState(false);
    const [gpsDestination, setGpsDestination] = useState<string | undefined>(undefined);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    const decryptedRawId = decryptId(id);
    const cleanId = decryptedRawId 
        ? String(decryptedRawId).replace(/^ORD-0*/i, '') 
        : (id ? String(id).replace(/^ORD-0*/i, '') : '1');

    // Obfuscate URL: If accessed via unencrypted ID (e.g. /driver/shipments/1), silently encrypt
    useEffect(() => {
        if (id && !id.startsWith('enc_') && !id.startsWith('sec_') && !id.startsWith('q_')) {
            const encrypted = encryptId(cleanId || id);
            navigate(`/driver/shipments/${encrypted}`, { replace: true, state: location.state });
        }
    }, [id, cleanId, navigate, location.state]);

    const loadShipment = async () => {
        if (!cleanId && !id) return;
        try {
            const targetId = cleanId || id || '1';
            const data = await driverApi.getShipmentById(targetId);
            setShipment(data);
        } catch (err) {
            console.error('Failed to load shipment details', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadShipment();

        const targetId = String(cleanId || id || "");

        const handleRealtimeUpdate = (data: any) => {
            if (!data) {
                loadShipment();
                return;
            }
            const eventOrderId = String(data.order_id || data.id || "");
            const eventOrderNumber = String(data.order_number || "");
            if (
                !eventOrderId ||
                eventOrderId === targetId ||
                eventOrderNumber === targetId ||
                (shipment && eventOrderNumber === shipment.orderNumber)
            ) {
                loadShipment();
                if (data.action === "delivery_accepted" || data.status === "completed" || data.type === "delivery_accepted") {
                    setActionMessage("Customer has approved Proof of Delivery! Shipment completed successfully.");
                    setTimeout(() => setActionMessage(null), 6000);
                }
            }
        };

        const handleCustomEvent = (e: any) => handleRealtimeUpdate(e.detail);

        window.addEventListener("driver-shipment-updated", handleCustomEvent);
        window.addEventListener("order-status-updated", handleCustomEvent);

        let orderChannel: any = null;
        if (targetId) {
            try {
                orderChannel = echo.private(`orders.${targetId}`);
                orderChannel.listen(".ShipmentStatusUpdated", (event: any) => {
                    handleRealtimeUpdate(event);
                });
                orderChannel.listen("ShipmentStatusUpdated", (event: any) => {
                    handleRealtimeUpdate(event);
                });
            } catch (err) {
                console.warn("Echo orders channel subscription skipped:", err);
            }
        }

        return () => {
            window.removeEventListener("driver-shipment-updated", handleCustomEvent);
            window.removeEventListener("order-status-updated", handleCustomEvent);
            if (orderChannel) {
                orderChannel.stopListening(".ShipmentStatusUpdated");
                orderChannel.stopListening("ShipmentStatusUpdated");
            }
        };
    }, [cleanId, id, shipment?.orderNumber]);

    useEffect(() => {
        if (!shipment || shipment.status !== 'completed') return;

        const checkRatingEligibility = async () => {
            const sid = cleanId || shipment.id;
            const alreadyRated = localStorage.getItem(`driver_rated_${sid}`) === 'true';
            if (alreadyRated) return;

            const skippedTimestamp = Number(localStorage.getItem(`driver_rate_skip_${sid}`) || 0);
            const oneDayMs = 24 * 60 * 60 * 1000;
            if (Date.now() - skippedTimestamp < oneDayMs) return;

            const hasRatedBackend = await driverApi.checkCustomerReview(sid);
            if (hasRatedBackend) {
                localStorage.setItem(`driver_rated_${sid}`, 'true');
                return;
            }

            setIsRatingModalOpen(true);
        };

        checkRatingEligibility();
    }, [shipment, cleanId]);

    const handleSkipRating = () => {
        const sid = cleanId || (shipment ? shipment.id : '');
        localStorage.setItem(`driver_rate_skip_${sid}`, String(Date.now()));
        setIsRatingModalOpen(false);
    };

    const handleSubmitRating = async (data: { rating: number; skills: string[]; comment: string }) => {
        const sid = cleanId || (shipment ? shipment.id : '');
        await driverApi.submitCustomerReview(sid, data);
        localStorage.setItem(`driver_rated_${sid}`, 'true');
        setIsRatingModalOpen(false);
        setActionMessage('Thank you! Your facility and customer review has been submitted.');
        setTimeout(() => setActionMessage(null), 5000);
    };

    
    const handleOpenGPS = (dest?: string) => {
        requireDriverCompliance(() => {
            setGpsDestination(dest || (shipment ? `${shipment.consignee.address}, ${shipment.consignee.city}` : undefined));
            setIsGPSOpen(true);
        }, 'Live GPS Navigation');
    };

    const handleUpdateMilestone = async (nextStatus: ShipmentStatus) => {
        requireDriverCompliance(async () => {
            if (!shipment) return;
            const updated = await driverApi.updateShipmentMilestone(shipment.id, nextStatus);
            setShipment(updated);
            setActionMessage(`Shipment milestone successfully updated to "${nextStatus.replace('_', ' ')}"!`);
            setTimeout(() => setActionMessage(null), 4500);
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
        setIsPODOpen(false);
        setActionMessage('Proof of Delivery (POD) confirmed and saved successfully!');
        setTimeout(() => setActionMessage(null), 5000);
    };

    if (isLoading) {
        return <DriverShipmentDetailsSkeleton />;
    }

    if (!shipment) {
        return (
            <div className="w-full max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-[#1e2329] rounded-lg border border-slate-200 dark:border-slate-800 text-center space-y-3 font-sans">
                <Truck size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Assigned Load Not Found</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    The requested load ID could not be retrieved from your driver manifest.
                </p>
                <div className="pt-2">
                    <Link
                        to="/driver/shipments"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={13} />
                        <span>Return to Assigned Loads</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2.5 sm:p-4 w-full flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-8 space-y-2.5 text-slate-800 dark:text-slate-200 antialiased">
            {/* Top Action Notification Banner */}
            {actionMessage && (
                <div className="p-2.5 px-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{actionMessage}</span>
                </div>
            )}

            {/* Top Full-Width Minimal Header Bar with Live GPS Tracking */}
            <DriverShipmentHeader
                shipment={shipment}
                onOpenGPS={() => handleOpenGPS(shipment ? `${shipment.consignee.address}, ${shipment.consignee.city}` : undefined)}
            />

            {/* Main 12-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-2.5">
                    {/* Live Corridor Map & Visual Progress Stepper */}
                    <DriverShipmentMapSection shipment={shipment} />

                    {/* Facility Pickup & Delivery Location Card (Clean 2-Column Split, NO footer buttons) */}
                    <DriverShipmentLocationsCard shipment={shipment} />

                    {/* Vehicle & Cargo Specs Card */}
                    <DriverShipmentCargoSpecsCard
                        cargo={shipment.cargo}
                        route={shipment.route}
                    />
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                    {/* Milestone Action & Delivery Sign-Off Card */}
                    <DriverShipmentActionCard
                        shipment={shipment}
                        onUpdateStatus={handleUpdateMilestone}
                        onOpenPOD={handleOpenPOD}
                    />

                    {/* Activity Log & Direct Dispatch Contacts Card */}
                    <DriverShipmentSidebarTimeline shipment={shipment} />
                </div>
            </div>

            {/* Proof of Delivery Upload Modal */}
            <PODUploadModal
                isOpen={isPODOpen}
                orderNumber={shipment.orderNumber}
                onClose={() => setIsPODOpen(false)}
                onSubmitPOD={handlePODSubmit}
            />

            {/* GPS Coming Soon Modal */}
            <GPSComingSoonModal
                isOpen={isGPSOpen}
                destination={gpsDestination}
                onClose={() => setIsGPSOpen(false)}
            />

            {/* Customer Rating Modal on Completed Shipment */}
            {shipment && (
                <CustomerRatingModal
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    customerName={shipment.consignee.company || shipment.shipper.company || 'Customer'}
                    orderNumber={shipment.orderNumber}
                    onSubmit={handleSubmitRating}
                    onSkip={handleSkipRating}
                />
            )}
        </div>
    );
}
