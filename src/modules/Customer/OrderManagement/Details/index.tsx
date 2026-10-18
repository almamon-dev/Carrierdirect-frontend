import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import RatingModal from '@/components/modals/rating-modal';

import { useOrderDetails } from './hooks/useOrderDetails';
import CustomerOrderHeader from './components/CustomerOrderHeader';
import CustomerOrderHorizontalStepper from './components/CustomerOrderHorizontalStepper';
import CustomerOrderMapSection from './components/CustomerOrderMapSection';
import CustomerOrderRouteCards from './components/CustomerOrderRouteCards';
import CustomerOrderBottomCards from './components/CustomerOrderBottomCards';
import CustomerOrderSupplierProfile from './components/CustomerOrderSupplierProfile';
import CustomerOrderPODAction from './components/CustomerOrderPODAction';
import CustomerOrderTimelineSection from './components/CustomerOrderTimelineSection';

export default function CustomerOrderDetailPage() {
    const {
        order,
        timeline,
        actionMessage,
        isRatingOpen,
        setIsRatingOpen,
        handleRepeatOrder,
        handleDownloadInvoice,
        handlePrint,
        handleOpenChat,
        handleApprovePOD,
        handleRatingSubmit,
    } = useOrderDetails();

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

            {/* Horizontal Milestone Stepper */}
            <CustomerOrderHorizontalStepper timeline={timeline} />

            {/* Main 12-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-2.5">
                    <CustomerOrderMapSection order={order} timeline={timeline} />
                    <CustomerOrderRouteCards order={order} />
                    <CustomerOrderBottomCards order={order} />
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                    <CustomerOrderSupplierProfile
                        order={order}
                        onOpenChat={handleOpenChat}
                    />
                    <CustomerOrderPODAction
                        order={order}
                        onApprovePOD={handleApprovePOD}
                    />
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
