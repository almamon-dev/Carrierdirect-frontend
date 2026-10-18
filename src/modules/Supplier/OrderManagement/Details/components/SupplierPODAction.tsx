import React, { useState } from 'react';
import { FileText, CheckCircle2, Upload, Eye, UserPlus, RefreshCw, Truck } from 'lucide-react';
import Button from '@/components/ui/button';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';
import SupplierPODDocModal from './SupplierPODDocModal';
import SupplierPODStateCard from './SupplierPODStateCard';

interface SupplierPODActionProps {
    isPodAccepted?: boolean;
    podUploaded?: boolean;
    onOpenUploadModal?: () => void;
    onUploadPOD?: () => void;
    onOpenStatusModal?: () => void;
    onOpenAssignDriver?: () => void;
    onAssignDriver?: () => void;
    order: NormalizedSupplierOrder;
}

export const SupplierPODAction: React.FC<SupplierPODActionProps> = ({
    isPodAccepted = false,
    podUploaded = false,
    onOpenUploadModal,
    onUploadPOD,
    onOpenStatusModal,
    onOpenAssignDriver,
    onAssignDriver,
    order,
}) => {
    const [isOpenPreviewModal, setIsOpenPreviewModal] = useState<boolean>(false);

    const isDriverAssigned = Boolean(
        order.driver?.name &&
        order.driver.name !== 'Unassigned' &&
        order.driver.name !== 'Assigned Fleet Driver' &&
        order.driver.name !== 'Assigned Driver'
    );

    const rawStatus = (order.rawStatus || order.status || '').toLowerCase().trim();
    const triggerUpload = onOpenUploadModal || onUploadPOD;
    const triggerAssign = onOpenAssignDriver || onAssignDriver;

    // State 1: POD Accepted & Escrow Released
    if (isPodAccepted || rawStatus === 'completed') {
        return (
            <>
                <SupplierPODStateCard
                    bgColor="bg-emerald-50/80 dark:bg-emerald-950/30" borderColor="border-emerald-200 dark:border-emerald-800/80"
                    iconBg="bg-emerald-100 dark:bg-emerald-900/50" iconColor="text-emerald-600 dark:text-emerald-400"
                    icon={<CheckCircle2 size={15} />} title="POD Approved • Payout Released" titleColor="text-emerald-900 dark:text-emerald-300"
                    description="The delivery receipt was verified by the customer. Carrier payout has been disbursed."
                    descColor="text-emerald-800/90 dark:text-emerald-400"
                >
                    <Button
                        variant="outline" size="sm" onClick={() => setIsOpenPreviewModal(true)}
                        className="w-full h-8 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 bg-white dark:bg-[#1e2329] cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                        <Eye size={12} /><span>View Verified POD</span>
                    </Button>
                </SupplierPODStateCard>
                {isOpenPreviewModal && <SupplierPODDocModal order={order} onClose={() => setIsOpenPreviewModal(false)} />}
            </>
        );
    }

    // State 2: Driver not assigned yet
    if (!isDriverAssigned) {
        return (
            <SupplierPODStateCard
                bgColor="bg-blue-50/80 dark:bg-blue-950/30" borderColor="border-blue-200 dark:border-blue-800/80"
                iconBg="bg-blue-100 dark:bg-blue-900/50" iconColor="text-blue-600 dark:text-blue-400"
                icon={<UserPlus size={14} />} title="Driver Assignment Required" titleColor="text-blue-900 dark:text-blue-300"
                description="Assign a driver and vehicle plate to dispatch this shipment for pickup."
                descColor="text-blue-800/90 dark:text-blue-400"
            >
                <Button
                    variant="primary" size="sm" onClick={triggerAssign}
                    className="w-full h-8 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                    <UserPlus size={13} /><span>Assign Fleet Driver</span>
                </Button>
            </SupplierPODStateCard>
        );
    }

    // State 3: POD Uploaded & Under Review
    if (podUploaded || order.podUploaded) {
        return (
            <>
                <SupplierPODStateCard
                    bgColor="bg-slate-50/80 dark:bg-slate-800/40" borderColor="border-slate-200 dark:border-slate-800"
                    iconBg="bg-amber-50 dark:bg-amber-950/40" iconColor="text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                    icon={<FileText size={14} />} title="POD Submitted & Under Review" titleColor="text-slate-900 dark:text-slate-100"
                    description="Delivery note receipt is awaiting customer verification before payout release."
                    descColor="text-slate-500 dark:text-slate-400"
                    badge={<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">Under Review</span>}
                >
                    <div className="flex items-center gap-2 pt-1">
                        <Button
                            variant="outline" size="sm" onClick={() => setIsOpenPreviewModal(true)}
                            className="flex-1 h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <Eye size={12} /><span>Preview POD</span>
                        </Button>
                        <Button
                            variant="outline" size="sm" onClick={triggerUpload}
                            className="flex-1 h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <Upload size={12} /><span>Re-upload</span>
                        </Button>
                    </div>
                </SupplierPODStateCard>
                {isOpenPreviewModal && <SupplierPODDocModal order={order} onClose={() => setIsOpenPreviewModal(false)} />}
            </>
        );
    }

    // State 4: Shipment in Transit (Driver Assigned, Picked Up, In Transit)
    const isReadyForPod = rawStatus === 'arrived' || rawStatus === 'delivered' || rawStatus === 'destination reached';

    if (!isReadyForPod) {
        return (
            <SupplierPODStateCard
                bgColor="bg-blue-50/80 dark:bg-blue-950/30"
                borderColor="border-blue-200 dark:border-blue-800/80"
                iconBg="bg-blue-100 dark:bg-blue-900/50"
                iconColor="text-blue-600 dark:text-blue-400"
                icon={<Truck size={14} />}
                title="Shipment In Progress"
                titleColor="text-blue-900 dark:text-blue-300"
                description={`Driver ${order.driver?.name || 'assigned'} is executing the haulage. Update shipment status as milestones are reached.`}
                descColor="text-blue-800/90 dark:text-blue-400"
            >
                {onOpenStatusModal && (
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-full h-8 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                        onClick={onOpenStatusModal}
                    >
                        <RefreshCw size={12} />
                        <span>Update Shipment Status</span>
                    </Button>
                )}
            </SupplierPODStateCard>
        );
    }

    // State 5: Reached Destination / Delivered -> POD Required
    return (
        <SupplierPODStateCard
            bgColor="bg-amber-50/80 dark:bg-amber-950/30"
            borderColor="border-amber-200 dark:border-amber-800/80"
            iconBg="bg-amber-100 dark:bg-amber-900/50"
            iconColor="text-amber-600 dark:text-amber-400"
            icon={<FileText size={14} />}
            title="Proof of Delivery Required"
            titleColor="text-amber-900 dark:text-amber-300"
            description="Shipment arrived at destination. Upload signed delivery receipt from customer to complete order and release payout."
            descColor="text-amber-800/90 dark:text-amber-400"
        >
            <div className="flex items-center gap-2 pt-0.5">
                {onOpenStatusModal && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] cursor-pointer flex items-center justify-center gap-1.5"
                        onClick={onOpenStatusModal}
                    >
                        <RefreshCw size={12} />
                        <span>Update Status</span>
                    </Button>
                )}
                <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 h-8 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                    onClick={triggerUpload}
                >
                    <Upload size={12} />
                    <span>Upload POD</span>
                </Button>
            </div>
        </SupplierPODStateCard>
    );
};

export default SupplierPODAction;
