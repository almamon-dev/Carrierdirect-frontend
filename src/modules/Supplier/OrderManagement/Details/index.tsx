import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, UserPlus, RefreshCw, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import apiClient from '@/lib/axios';

import SupplierMapSection from './components/SupplierMapSection';
import SupplierVehicleDetails from './components/SupplierVehicleDetails';
import SupplierAmountBreakdown from './components/SupplierAmountBreakdown';
import SupplierCustomerProfile from './components/SupplierCustomerProfile';
import SupplierPODAction from './components/SupplierPODAction';
import SupplierTimelineSection from './components/SupplierTimelineSection';
import { AssignDriverModal } from './components/AssignDriverModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { OrderPODModal } from './components/OrderPODModal';
import { buildSupplierOrderDetails, buildSupplierOrderTimeline } from './utils/supplierOrderTrackUtils';

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

    const [showAssignDriverModal, setShowAssignDriverModal] = useState<boolean>(false);
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
                    console.error('Failed to fetch order details from API:', err);
                })
                .finally(() => {
                    if (isMounted) setIsLoading(false);
                });
        }
        return () => { isMounted = false; };
    }, [cleanId]);

    const isPodAccepted = (statusOverride || apiOrder?.status) === 'completed' || apiOrder?.status === 'Completed';

    const order = buildSupplierOrderDetails(
        paramId,
        apiOrder,
        isPodAccepted,
        statusOverride || undefined,
        assignedDriverOverride
    );

    const timeline = buildSupplierOrderTimeline(isPodAccepted, order);

    const handleAssignDriver = async (driverData: { name: string; phone: string; email?: string; plate: string }) => {
        try {
            await apiClient.patch(`/supplier/orders/${cleanId}/status`, {
                status: 'driver_assigned',
                driver_name: driverData.name,
                driver_phone: driverData.phone,
                driver_email: driverData.email,
                vehicle_plate: driverData.plate,
                note: `Driver ${driverData.name} assigned with vehicle ${driverData.plate}.`
            });
            setAssignedDriverOverride(driverData);
            setStatusOverride('driver_assigned');
            setShowAssignDriverModal(false);
            setActionMessage('Driver assigned and dispatched successfully!');
            setTimeout(() => setActionMessage(null), 4000);
        } catch (err) {
            console.error('Error assigning driver:', err);
            alert('Failed to update driver assignment. Please try again.');
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            await apiClient.patch(`/supplier/orders/${cleanId}/status`, {
                status: newStatus,
                note: `Order status updated to ${newStatus}.`
            });
            setStatusOverride(newStatus);
            setShowStatusModal(false);
            setActionMessage(`Shipment status updated to ${newStatus}!`);
            setTimeout(() => setActionMessage(null), 4000);
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update order status. Please try again.');
        }
    };

    const handleUploadPOD = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.patch(`/supplier/orders/${cleanId}/status`, {
                status: 'delivered',
                note: 'Proof of Delivery (POD) submitted by carrier.'
            });
            setIsPodUploaded(true);
            setStatusOverride('delivered');
            setShowUploadModal(false);
            setActionMessage('Proof of Delivery (POD) uploaded successfully!');
            setTimeout(() => setActionMessage(null), 4000);
        } catch (err) {
            console.error('Error uploading POD:', err);
            alert('Failed to upload POD. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="p-12 flex items-center justify-center text-slate-500 gap-2 min-h-screen">
                <Loader2 size={24} className="animate-spin text-[#ff4a1f]" />
                <span>Loading shipment details...</span>
            </div>
        );
    }

    return (
        <div className="p-3.5 md:p-5 w-full mx-auto flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-16 space-y-4">
            {/* Top Action Notification Banner */}
            {actionMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{actionMessage}</span>
                </div>
            )}

            {/* Header Bar matching CarrierDirect design standard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 border-b border-slate-200 dark:border-slate-800 pb-3.5">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <button
                            onClick={() => navigate('/supplier/orders/active-jobs')}
                            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center transition-colors font-medium cursor-pointer"
                        >
                            <ArrowLeft size={13} className="mr-1" /> Back to Active Jobs
                        </button>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                            Track Shipment <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold">{order.id}</span>
                        </h1>
                        <Badge className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                            isPodAccepted
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                                : 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800'
                        }`}>
                            {order.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        <span>Route:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{order.from}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{order.to}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] text-xs shadow-2xs">
                        <span className="text-slate-400 font-medium">ETA:</span>
                        <strong className="text-slate-800 dark:text-slate-100 font-semibold">{order.estArrival}</strong>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 sm:h-9 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                        onClick={() => setShowAssignDriverModal(true)}
                    >
                        <UserPlus size={13} />
                        <span>{order.driver?.name && order.driver.name !== 'Unassigned' ? 'Re-assign Driver' : 'Assign Driver'}</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 sm:h-9 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                        onClick={() => setShowUploadModal(true)}
                    >
                        <Upload size={13} />
                        <span>Upload POD</span>
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        className="h-8 sm:h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        onClick={() => setShowStatusModal(true)}
                    >
                        <RefreshCw size={13} />
                        <span>Update Status</span>
                    </Button>
                </div>
            </div>

            {/* Content 12-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <SupplierMapSection order={order} timeline={timeline} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SupplierVehicleDetails
                            vehicle={order.vehicle}
                            driver={order.driver}
                            onOpenAssignDriver={() => setShowAssignDriverModal(true)}
                        />
                        <SupplierAmountBreakdown pricing={order.pricing} />
                    </div>
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <SupplierCustomerProfile customer={order.customer} />
                    <SupplierPODAction
                        isPodAccepted={isPodAccepted}
                        podUploaded={isPodUploaded || order.podUploaded}
                        onOpenUploadModal={() => setShowUploadModal(true)}
                        onOpenStatusModal={() => setShowStatusModal(true)}
                        onOpenAssignDriver={() => setShowAssignDriverModal(true)}
                        order={order}
                    />
                    <SupplierTimelineSection timeline={timeline} />
                </div>
            </div>

            {/* Modals */}
            <AssignDriverModal
                isOpen={showAssignDriverModal}
                orderId={order.id}
                currentDriver={order.driver}
                currentVehiclePlate={order.vehicle?.number}
                onSave={handleAssignDriver}
                onClose={() => setShowAssignDriverModal(false)}
            />

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
                onSubmit={handleUploadPOD}
                onClose={() => setShowUploadModal(false)}
            />
        </div>
    );
}
