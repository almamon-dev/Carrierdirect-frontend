import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSupplierOrderBySlug, SupplierOrder, OrderStatus, mapApiOrderToSupplierOrder } from '../data/ordersData';
import { apiClient } from '@/lib/axios';
import { OrderHeader } from './components/OrderHeader';
import { OrderOverviewCards } from './components/OrderOverviewCards';
import { OrderTimeline } from './components/OrderTimeline';
import { OrderRouteAndPOD } from './components/OrderRouteAndPOD';
import { OrderStatusModal } from './components/OrderStatusModal';
import { OrderPODModal } from './components/OrderPODModal';

export default function OrderDetails() {
    const { slug } = useParams<{ slug?: string }>();

    const [order, setOrder] = useState<SupplierOrder>(() => getSupplierOrderBySlug(slug));
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [podUploaded, setPodUploaded] = useState<boolean>(order.podStatus === 'Approved' || order.podStatus === 'Pending Review');

    useEffect(() => {
        let isMounted = true;
        const cleanId = slug ? slug.replace('ORD-', '') : '';
        if (cleanId) {
            apiClient.get(`/supplier/orders/${cleanId}`)
                .then(res => {
                    const raw = res.data?.data || res.data;
                    if (!isMounted || !raw) return;
                    const mapped: SupplierOrder = mapApiOrderToSupplierOrder(raw);
                    setOrder(mapped);
                    setCurrentStatus(mapped.status);
                    setNewStatus(mapped.status);
                    setPodUploaded(mapped.podStatus === 'Approved' || mapped.podStatus === 'Pending Review');
                })
                .catch(err => {
                    console.error('Failed to fetch order details from API:', err);
                    const data = getSupplierOrderBySlug(slug);
                    if (isMounted) {
                        setOrder(data);
                        setCurrentStatus(data.status);
                        setNewStatus(data.status);
                        setPodUploaded(data.podStatus === 'Approved' || data.podStatus === 'Pending Review');
                    }
                });
        }
        return () => { isMounted = false; };
    }, [slug]);

    const handleStatusUpdate = async () => {
        try {
            const cleanId = slug ? slug.replace('ORD-', '') : '';
            await apiClient.patch(`/supplier/orders/${cleanId}/status`, { status: newStatus });
        } catch (err) {
            console.error('Error updating order status:', err);
        }
        setCurrentStatus(newStatus);
        setShowStatusModal(false);
    };

    const handleUploadPOD = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const cleanId = slug ? slug.replace('ORD-', '') : '';
            await apiClient.post(`/supplier/orders/${cleanId}/pod`);
        } catch (err) {
            console.error('Error uploading POD:', err);
        }
        setPodUploaded(true);
        setShowUploadModal(false);
    };

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-6 bg-[#f8fafc] dark:bg-[#12161c]">
            <OrderHeader
                order={order}
                currentStatus={currentStatus}
                onOpenStatusModal={() => setShowStatusModal(true)}
                onOpenUploadModal={() => setShowUploadModal(true)}
            />

            <OrderOverviewCards order={order} />

            <OrderTimeline timeline={order.timeline} />

            <OrderRouteAndPOD
                order={order}
                podUploaded={podUploaded}
                onOpenUploadModal={() => setShowUploadModal(true)}
            />

            <OrderStatusModal
                isOpen={showStatusModal}
                orderId={order.id}
                newStatus={newStatus}
                onStatusChange={setNewStatus}
                onSave={handleStatusUpdate}
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
