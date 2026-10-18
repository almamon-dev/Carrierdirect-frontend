import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import SupplierOrderHeader from './components/SupplierOrderHeader';
import SupplierOrderHorizontalStepper from './components/SupplierOrderHorizontalStepper';
import SupplierMapSection from './components/SupplierMapSection';
import SupplierRouteCards from './components/SupplierRouteCards';
import SupplierBottomCards from './components/SupplierBottomCards';
import SupplierCustomerProfile from './components/SupplierCustomerProfile';
import SupplierPODAction from './components/SupplierPODAction';
import SupplierTimelineSection from './components/SupplierTimelineSection';
import { OrderStatusModal } from './components/OrderStatusModal';
import { OrderPODModal } from './components/OrderPODModal';
import { useSupplierOrderDetails } from './hooks/useSupplierOrderDetails';

export default function OrderDetails() {
    const {
        order,
        timeline,
        cleanId,
        actionMessage,
        showStatusModal,
        setShowStatusModal,
        showUploadModal,
        setShowUploadModal,
        handleStatusUpdate,
        handleUploadPOD,
        handleNavigateAssignDriver,
        handleDownloadInvoice,
        handlePrint,
        handleOpenChat,
    } = useSupplierOrderDetails();

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
                onDownloadInvoice={handleDownloadInvoice}
                onPrint={handlePrint}
                onOpenChat={handleOpenChat}
                onUpdateStatus={() => setShowStatusModal(true)}
            />

            {/* Horizontal Milestone Stepper */}
            <SupplierOrderHorizontalStepper timeline={timeline} />

            {/* Main 12-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-2.5">
                    <SupplierMapSection order={order} timeline={timeline} />
                    <SupplierRouteCards order={order} />
                    <SupplierBottomCards order={order} />
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                    <SupplierCustomerProfile
                        customer={order.customer}
                        onOpenChat={handleOpenChat}
                    />

                    <SupplierPODAction
                        order={order}
                        onUploadPOD={() => setShowUploadModal(true)}
                        onAssignDriver={handleNavigateAssignDriver}
                    />

                    <SupplierTimelineSection timeline={timeline} />
                </div>
            </div>

            {/* Order Status Update Modal */}
            <OrderStatusModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                orderId={cleanId}
                newStatus={order.status}
                onStatusChange={handleStatusUpdate}
            />

            {/* Order POD & Signature Upload Modal */}
            <OrderPODModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                orderId={cleanId}
                onSubmit={handleUploadPOD}
            />
        </div>
    );
}
