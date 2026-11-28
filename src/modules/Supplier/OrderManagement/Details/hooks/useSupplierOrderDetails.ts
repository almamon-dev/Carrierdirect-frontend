import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { exportInvoicePdf } from '@/utils/exportInvoicePdf';
import { encryptId, decryptId } from '@/lib/encryption';
import {
    buildSupplierOrderDetails,
    buildSupplierOrderTimeline,
    NormalizedSupplierOrder,
} from '../utils/supplierOrderTrackUtils';
import type { SupplierPayoutStatus } from '../components/SupplierPayoutStatusCard';

export const useSupplierOrderDetails = () => {
    const { slug, id } = useParams<{ slug?: string; id?: string }>();
    const paramId = slug || id;
    const navigate = useNavigate();
    const location = useLocation();

    const [apiOrder, setApiOrder] = useState<any | null>(location.state?.orderData || null);
    const [isLoading, setIsLoading] = useState<boolean>(!location.state?.orderData);
    const [statusOverride, setStatusOverride] = useState<string | null>(null);
    const [assignedDriverOverride, setAssignedDriverOverride] = useState<{
        name: string;
        phone: string;
        email?: string;
        plate: string;
        vehicle_type?: string;
        driverType?: 'internal' | 'subcontractor';
        subcontractorCompany?: string;
        journeyLeg?: string;
    } | null>(null);
    const [isPodUploaded, setIsPodUploaded] = useState<boolean>(false);
    const [payoutStatus, setPayoutStatus] = useState<SupplierPayoutStatus | null>(null);

    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const decryptedRawId = decryptId(paramId);
    const cleanId = decryptedRawId || paramId || '1';

    useEffect(() => {
        if (paramId && !paramId.startsWith('enc_') && !paramId.startsWith('sec_') && !paramId.startsWith('q_')) {
            const encrypted = encryptId(cleanId || paramId);
            navigate(`/supplier/orders/details/${encrypted}`, { replace: true, state: location.state });
        }
    }, [paramId, cleanId, navigate, location.state]);

    const refetch = useCallback(async () => {
        if (!cleanId) return;
        try {
            const [res, payoutRes] = await Promise.all([
                apiClient.get(`/supplier/orders/${cleanId}`),
                apiClient.get(`/supplier/orders/${cleanId}/payout-status`).catch(() => null),
            ]);
            const data = res.data?.data || res.data;
            if (data) {
                setApiOrder(data);
                if (data.status === 'completed' || data.status === 'pod_accepted' || data.pod_status === 'confirmed') {
                    setIsPodUploaded(true);
                }
            }
            const payoutData = payoutRes?.data?.data || payoutRes?.data;
            if (payoutData && payoutData.order_id) {
                setPayoutStatus(payoutData);
            }
        } catch (err) {
            console.warn('Could not fetch supplier order details from API:', err);
        }
    }, [cleanId]);

    useEffect(() => {
        let isMounted = true;
        if (cleanId) {
            setIsLoading(!apiOrder);
            refetch().finally(() => {
                if (isMounted) setIsLoading(false);
            });
        }
        return () => {
            isMounted = false;
        };
    }, [cleanId, refetch]);

    const isPodAccepted = apiOrder?.status === 'completed' || statusOverride === 'completed';

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
                        delivery_at: order.deliveryDate,
                    },
                    payment: order.pricing,
                    raw: apiOrder,
                },
            },
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
                note: `Order status updated to ${newStatus}.`,
            });
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setStatusOverride(newStatus);
            setShowStatusModal(false);
            setActionMessage(`Shipment status updated to ${newStatus.replace(/_/g, ' ')}!`);
            setTimeout(() => setActionMessage(null), 4000);
        }
    };

    const handleUploadPOD = async (formData: FormData) => {
        await apiClient.post(`/supplier/orders/${cleanId}/status`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setIsPodUploaded(true);
        setStatusOverride('delivered');
        setShowUploadModal(false);
        setActionMessage('Proof of Delivery & Signature submitted successfully! Awaiting customer verification.');
        setTimeout(() => setActionMessage(null), 4000);
        await refetch();
    };

    const handleAcceptPayLaterTerms = useCallback(async () => {
        await apiClient.post(`/supplier/orders/${cleanId}/accept-pay-later-terms`, {});
        setActionMessage('Net-30 Pay Later settlement terms confirmed.');
        setTimeout(() => setActionMessage(null), 4000);
        await refetch();
    }, [cleanId, refetch]);

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

    return {
        order,
        timeline,
        payoutStatus,
        isLoading,
        cleanId,
        actionMessage,
        setActionMessage,
        showStatusModal,
        setShowStatusModal,
        showUploadModal,
        setShowUploadModal,
        handleStatusUpdate,
        handleUploadPOD,
        handleAcceptPayLaterTerms,
        handleNavigateAssignDriver,
        handleDownloadInvoice,
        handlePrint,
        handleOpenChat,
        refetch,
        setAssignedDriverOverride,
    };
};

export default useSupplierOrderDetails;
