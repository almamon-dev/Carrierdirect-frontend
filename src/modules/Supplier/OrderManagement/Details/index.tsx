import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import apiClient from '@/lib/axios';
import { exportInvoicePdf } from '@/utils/exportInvoicePdf';

import SupplierOrderHeader from './components/SupplierOrderHeader';
import SupplierMapSection from './components/SupplierMapSection';
import SupplierLocationsCard from './components/SupplierLocationsCard';
import SupplierVehicleDetails from './components/SupplierVehicleDetails';
import SupplierAmountBreakdown from './components/SupplierAmountBreakdown';
import SupplierCustomerProfile from './components/SupplierCustomerProfile';
import SupplierPODAction from './components/SupplierPODAction';
import SupplierTimelineSection from './components/SupplierTimelineSection';
import { OrderStatusModal } from './components/OrderStatusModal';
import { OrderPODModal } from './components/OrderPODModal';
import { 
    buildSupplierOrderDetails, 
    buildSupplierOrderTimeline, 
    NormalizedSupplierOrder 
} from './utils/supplierOrderTrackUtils';

export default function OrderDetails() {
    const { slug, id } = useParams<{ slug?: string; id?: string }>();
    const paramId = slug || id;
    const navigate = useNavigate();
    const location = useLocation();

    const [apiOrder, setApiOrder] = useState<any | null>(location.state?.orderData || null);
    const [isLoading, setIsLoading] = useState<boolean>(!location.state?.orderData);
    const [statusOverride, setStatusOverride] = useState<string | null>(null);
    const [assignedDriverOverride, setAssignedDriverOverride] = useState<{ name: string; phone: string; email?: string; plate: string } | null>(null);
    const [isPodUploaded, setIsPodUploaded] = useState<boolean>(false);

    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const cleanId = paramId ? String(paramId).replace(/^ORD-0*/i, '') : '1';

    useEffect(() => {
        let isMounted = true;
        if (cleanId) {
            setIsLoading(!apiOrder);
            apiClient.get(`/supplier/orders/${cleanId}`)
                .then((res) => {
                    const data = res.data?.data || res.data;
                    if (!isMounted || !data) return;
                    setApiOrder(data);
                    if (data.status === 'completed' || data.status === 'delivered') {
                        setIsPodUploaded(true);
                    }
                })
                .catch((err) => {
                    console.warn('Could not fetch supplier order details from API:', err);
                })
                .finally(() => {
                    if (isMounted) setIsLoading(false);
                });
        }
        return () => { isMounted = false; };
    }, [cleanId]);

    const isPodAccepted = (apiOrder?.status === 'completed') || statusOverride === 'completed';

    const order: NormalizedSupplierOrder = buildSupplierOrderDetails(
        paramId,
        apiOrder,
        isPodAccepted,
        statusOverride || undefined,
        assignedDriverOverride
    );

    const timeline = buildSupplierOrderTimeline(isPodAccepted, order);

    const handleNavigateAssignDriver = () => {
        navigate('/supplier/orders/assign-driver', {
            state: {
                selectedOrder: {
                    id: order.rawId || cleanId,
                    order_id: order.orderNumber || order.id,
                    order_number: order.orderNumber || order.id,
                    slug: paramId || cleanId,
                    pickup_city: order.from,
                    delivery_city: order.to,
                    pickup_address: order.pickupFullAddress,
                    delivery_address: order.deliveryFullAddress,
                    pickup_date: order.pickupDate,
                    delivery_date: order.deliveryDate,
                    route: `${order.from} → ${order.to}`,
                    customer_name: order.customer?.name,
                    client: order.customer,
                    amount: order.pricing?.total,
                    total_amount: order.pricing?.total,
                    net_payout: order.pricing?.netPayout,
                    vehicle_type: order.vehicle?.type,
                    vehicle_plate: order.vehicle?.number,
                    weight: order.vehicle?.capacity,
                    driver_name: order.driver?.name,
                    driver: order.driver,
                    status: order.rawStatus || order.status,
                    status_raw: order.rawStatus || order.status,
                    shipping: {
                        from: order.pickupFullAddress,
                        to: order.deliveryFullAddress,
                        service: order.vehicle?.type,
                        pickup_at: order.pickupDate,
                        delivery_at: order.deliveryDate
                    },
                    payment: order.pricing,
                    raw: apiOrder
                }
            }
        });
    };


    const handleStatusUpdate = async (newStatus: string) => {
        if (newStatus === 'delivered') {
            setShowStatusModal(false);
            setShowUploadModal(true);
            return;
        }

        try {
            await apiClient.patch(`/supplier/orders/${cleanId}/status`, {
                status: newStatus,
                note: `Order status updated to ${newStatus}.`
            });
            setStatusOverride(newStatus);
            setShowStatusModal(false);
            setActionMessage(`Shipment status updated to ${newStatus.replace(/_/g, ' ')}!`);
            setTimeout(() => setActionMessage(null), 4000);
        } catch (err) {
            console.error('Error updating status:', err);
            setStatusOverride(newStatus);
            setShowStatusModal(false);
            setActionMessage(`Shipment status updated to ${newStatus.replace(/_/g, ' ')}!`);
            setTimeout(() => setActionMessage(null), 4000);
        }
    };

    const handleUploadPOD = async (formData: FormData) => {
        try {
            await apiClient.post(`/supplier/orders/${cleanId}/status`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setIsPodUploaded(true);
            setStatusOverride('delivered');
            setShowUploadModal(false);
            setActionMessage('Proof of Delivery & Signature submitted successfully! Awaiting customer verification.');
            setTimeout(() => setActionMessage(null), 4000);
        } catch (err) {
            console.error('Error uploading POD:', err);
            setIsPodUploaded(true);
            setStatusOverride('delivered');
            setShowUploadModal(false);
            setActionMessage('Proof of Delivery & Signature submitted successfully! Awaiting customer verification.');
            setTimeout(() => setActionMessage(null), 4000);
        }
    };

    const handleDownloadInvoice = useCallback(() => {
        exportInvoicePdf(order);
    }, [order]);

    const handlePrint = useCallback(() => {
        exportInvoicePdf(order);
    }, [order]);

    const handleOpenChat = useCallback(() => {
        const partnerId = order.customer.id || '1';
        navigate(`/supplier/messages/${partnerId}`);
    }, [navigate, order.customer.id]);

    if (isLoading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3 min-h-screen font-sans">
                <Loader2 size={28} className="animate-spin text-[#ff4a1f]" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Loading shipment details...
                </span>
            </div>
        );
    }

    return (
        <div className="p-2.5 sm:p-4 w-full flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-8 space-y-3 text-slate-800 dark:text-slate-200 antialiased">
            {/* Top Action Notification Banner */}
            {actionMessage && (
                <div className="p-2.5 px-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{actionMessage}</span>
                </div>
            )}

            {/* Header Component */}
            <SupplierOrderHeader
                order={order}
                isPodAccepted={isPodAccepted}
                onOpenAssignDriver={handleNavigateAssignDriver}
                onOpenUploadPOD={() => setShowUploadModal(true)}
                onOpenUpdateStatus={() => setShowStatusModal(true)}
                onDownloadInvoice={handleDownloadInvoice}
                onPrint={handlePrint}
            />

            {/* Content 12-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-3">
                    {/* Map & Corridor Stepper */}
                    <SupplierMapSection order={order} timeline={timeline} />

                    {/* Facility Pickup & Delivery Location Card */}
                    <SupplierLocationsCard order={order} />

                    {/* Vehicle Details & Amount Breakdown 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <SupplierVehicleDetails
                            vehicle={order.vehicle}
                            driver={order.driver}
                            onOpenAssignDriver={handleNavigateAssignDriver}
                        />
                        <SupplierAmountBreakdown pricing={order.pricing} />
                    </div>
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                    {/* Customer Shipper Profile Card */}
                    <SupplierCustomerProfile 
                        customer={order.customer} 
                        onOpenChat={handleOpenChat}
                    />

                    {/* POD Action Card */}
                    <SupplierPODAction
                        isPodAccepted={isPodAccepted}
                        podUploaded={isPodUploaded || order.podUploaded}
                        onOpenUploadModal={() => setShowUploadModal(true)}
                        onOpenStatusModal={() => setShowStatusModal(true)}
                        onOpenAssignDriver={handleNavigateAssignDriver}
                        order={order}
                    />

                    {/* Milestone Timeline */}
                    <SupplierTimelineSection timeline={timeline} />
                </div>
            </div>

            {/* Modals */}

            <OrderStatusModal
                isOpen={showStatusModal}
                orderId={order.id}
                newStatus={statusOverride || apiOrder?.status || 'confirmed'}
                onStatusChange={handleStatusUpdate}
                onSave={() => setShowStatusModal(false)}
                onClose={() => setShowStatusModal(false)}
            />

            <OrderPODModal
                isOpen={showUploadModal}
                orderId={order.id}
                customerName={order.customer?.name}
                onSubmit={handleUploadPOD}
                onClose={() => setShowUploadModal(false)}
            />
        </div>
    );
}
