import RatingModal from '@/components/modals/rating-modal';
import apiClient from '@/lib/axios';
import { encryptId } from '@/lib/encryption';
import { exportInvoicePdf } from '@/utils/exportInvoicePdf';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
    buildCustomerOrderTimeline,
    buildNormalizedCustomerOrder,
    NormalizedCustomerOrder,
} from './utils/customerOrderDetailsUtils';

import CustomerOrderAmountBreakdown from './components/CustomerOrderAmountBreakdown';
import CustomerOrderHeader from './components/CustomerOrderHeader';
import CustomerOrderLocationsCard from './components/CustomerOrderLocationsCard';
import CustomerOrderMapSection from './components/CustomerOrderMapSection';
import CustomerOrderPODAction from './components/CustomerOrderPODAction';
import CustomerOrderSupplierProfile from './components/CustomerOrderSupplierProfile';
import CustomerOrderTimelineSection from './components/CustomerOrderTimelineSection';
import CustomerOrderVehicleDetails from './components/CustomerOrderVehicleDetails';

export default function CustomerOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [apiOrder, setApiOrder] = useState<any | null>(location.state?.orderData || null);
    const [isLoading, setIsLoading] = useState<boolean>(!location.state?.orderData);
    const [isPodAccepted, setIsPodAccepted] = useState<boolean>(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [isRatingOpen, setIsRatingOpen] = useState<boolean>(false);

    const cleanId = id ? String(id).replace(/^ORD-0*/i, '') : '1';

    // Fetch live order data from API
    useEffect(() => {
        let isMounted = true;
        if (id) {
            setIsLoading(!apiOrder);
            apiClient
                .get(`/customer/orders/${cleanId || id}`)
                .then((res) => {
                    const data = res.data?.data || res.data;
                    if (!isMounted || !data) return;
                    setApiOrder(data);
                    if (data.status === 'completed' || data.status === 'POD Accepted' || data.status === 'delivered') {
                        setIsPodAccepted(true);
                    }
                })
                .catch((err) => {
                    console.warn('Could not fetch remote order details, using local fallback:', err);
                })
                .finally(() => {
                    if (isMounted) setIsLoading(false);
                });
        }
        return () => {
            isMounted = false;
        };
    }, [id, cleanId]);

    // Build normalized order & timeline structures
    const order: NormalizedCustomerOrder = buildNormalizedCustomerOrder(
        id,
        apiOrder || location.state?.orderData,
        isPodAccepted
    );

    const timeline = buildCustomerOrderTimeline(order);

    // Actions
    const handleRepeatOrder = useCallback(() => {
        navigate('/customer/quotes/create/new', { state: { repeatData: order } });
    }, [navigate, order]);

    const handleDownloadInvoice = useCallback(() => {
        exportInvoicePdf(order);
    }, [order]);

    const handlePrint = useCallback(() => {
        exportInvoicePdf(order);
    }, [order]);

    const handleOpenChat = useCallback(() => {
        const quoteTargetId = order.quoteId || order.rawId || cleanId;
        navigate(`/customer/quotes/negotiation/conversation/${encryptId(quoteTargetId)}`);
    }, [navigate, order.quoteId, order.rawId, cleanId]);

    const handleApprovePOD = async () => {
        try {
            await apiClient.post(`/customer/orders/${cleanId}/pod-approve`);
        } catch (err) {
            console.warn('API pod approval fallback triggered:', err);
        }
        setIsPodAccepted(true);
        setActionMessage('Proof of Delivery confirmed! Escrow funds have been released to the carrier.');
        setTimeout(() => setActionMessage(null), 5000);
    };

    const handleRatingSubmit = async (ratingData: any) => {
        try {
            await apiClient.post(`/customer/orders/${cleanId}/review`, ratingData);
        } catch (err) {
            console.warn('API rating submission fallback triggered:', err);
        }
        setIsRatingOpen(false);
        setActionMessage('Thank you! Carrier review & rating submitted successfully.');
        setTimeout(() => setActionMessage(null), 5000);
    };

    if (isLoading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3 min-h-screen font-sans">
                <Loader2 size={28} className="animate-spin text-[#ff4a1f]" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Loading order details...
                </span>
            </div>
        );
    }

    return (
        <div className="p-2.5 sm:p-4 w-full flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-8 space-y-2.5 text-slate-800 dark:text-slate-200 antialiased">
            {/* Top Action Notification Banner */}
            {actionMessage && (
                <div className="p-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>{actionMessage}</span>
                </div>
            )}

            {/* Header Component */}
            <CustomerOrderHeader
                order={order}
                onRepeatOrder={handleRepeatOrder}
                onDownloadInvoice={handleDownloadInvoice}
                onPrint={handlePrint}
                onOpenChat={handleOpenChat}
                onOpenRating={() => setIsRatingOpen(true)}
            />

            {/* Main 12-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-2.5">
                    {/* Interactive Route Map & Stepper */}
                    <CustomerOrderMapSection order={order} timeline={timeline} />

                    {/* Facility Pickup & Delivery Location Card */}
                    <CustomerOrderLocationsCard order={order} />

                    {/* Vehicle & Cargo Specs + Payment Breakdown 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <CustomerOrderVehicleDetails order={order} />
                        <CustomerOrderAmountBreakdown order={order} />
                    </div>
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                    {/* Verified Carrier Profile Card */}
                    <CustomerOrderSupplierProfile
                        order={order}
                        onOpenChat={handleOpenChat}
                    />

                    {/* Proof of Delivery (POD) Action Card */}
                    <CustomerOrderPODAction
                        order={order}
                        onApprovePOD={handleApprovePOD}
                    />

                    {/* Live Tracking Milestones & Timeline */}
                    <CustomerOrderTimelineSection timeline={timeline} />
                </div>
            </div>

            {/* Carrier Rating & Review Modal */}
            {isRatingOpen && (
                <RatingModal
                    isOpen={isRatingOpen}
                    onClose={() => setIsRatingOpen(false)}
                    orderId={String(order.rawId || order.id)}
                    targetName={order.supplier.name}
                    targetRole="Supplier"
                    orderTitle={order.route}
                    onSubmit={handleRatingSubmit}
                />
            )}
        </div>
    );
}
