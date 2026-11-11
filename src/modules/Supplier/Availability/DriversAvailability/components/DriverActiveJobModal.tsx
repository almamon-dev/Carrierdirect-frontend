import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Truck,
    MapPin,
    ArrowRight,
    ExternalLink,
    Navigation,
} from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { DriverItem } from '../types/driverAvailability.types';

interface DriverActiveJobModalProps {
    isOpen: boolean;
    driver: DriverItem | null;
    onClose: () => void;
}

export const DriverActiveJobModal: React.FC<DriverActiveJobModalProps> = ({
    isOpen,
    driver,
    onClose,
}) => {
    const navigate = useNavigate();

    if (!driver) return null;

    const assignment = driver.active_assignment;
    const orderId = assignment?.order_id || assignment?.order_number?.replace(/\D/g, '') || '10002';
    const orderNumber = assignment?.order_number || (assignment?.order_id ? `ORD-2026-${assignment.order_id}` : 'ORD-2026-10002');
    const legNum = assignment?.leg_number || 1;
    const legLabel = assignment?.leg_type === 'pickup'
        ? 'Leg 1: Pickup to Transit Hub'
        : assignment?.leg_type === 'delivery'
        ? 'Leg 2: Transit Hub to Delivery'
        : `Leg ${legNum}: Active Transport`;

    const vehiclePlate = driver.vehicle?.plate || driver.assignedVehicle || 'UK-AB1209';
    const vehicleName = driver.vehicle?.name || 'Mercedes Sprinter';
    const empId = driver.employee_id || (driver.id ? `EMP-${String(driver.id).padStart(4, '0')}` : null);

    const handleViewOrder = () => {
        onClose();
        navigate(`/supplier/orders/details/${orderId}`);
    };

    const handleViewTracking = () => {
        onClose();
        navigate(`/supplier/orders/track/${orderId}`);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            title="Active Job Dispatch"
            description="Driver assignment & route overview"
            footer={
                <div className="flex items-center justify-between w-full">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="text-xs rounded-[4px] cursor-pointer"
                    >
                        Close
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleViewTracking}
                            className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                            <Navigation size={12} className="text-[#ff4a1f]" />
                            <span>Live Tracking</span>
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            onClick={handleViewOrder}
                            className="text-xs bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer rounded-[4px]"
                        >
                            <span>Open Order</span>
                            <ExternalLink size={12} />
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="p-4 space-y-3">
                {/* Driver Info Row */}
                <div className="flex items-center justify-between p-2.5 rounded-[6px] border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
                            {driver.name?.slice(0, 2).toUpperCase() || 'DR'}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                                {driver.name}
                            </h3>
                            {empId && (
                                <p className="text-[11px] text-slate-400 font-mono leading-none mt-0.5">
                                    {empId}
                                </p>
                            )}
                        </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                            driver.duty_status === 'online' ? 'bg-emerald-500 animate-pulse' :
                            driver.duty_status === 'break' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        <span className="capitalize">{driver.duty_status || 'Online'}</span>
                    </span>
                </div>

                {/* Compact Shipment Box */}
                <div className="rounded-[6px] border border-blue-200/90 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-3 space-y-2.5">
                    {/* Order & Leg Header */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white shrink-0">
                                {orderNumber}
                            </span>
                            <span className="text-xs font-semibold text-blue-900 dark:text-blue-200 truncate">
                                {legLabel}
                            </span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 shrink-0">
                            In Transit
                        </span>
                    </div>

                    {/* Route */}
                    <div className="bg-white dark:bg-[#1a1f26] rounded-[4px] p-2.5 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <MapPin size={13} className="text-emerald-600 shrink-0" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                Manchester
                            </span>
                        </div>
                        <ArrowRight size={13} className="text-slate-400 shrink-0 mx-2" />
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                Leeds
                            </span>
                            <MapPin size={13} className="text-rose-500 shrink-0" />
                        </div>
                    </div>

                    {/* Vehicle */}
                    <div className="flex items-center justify-between text-xs px-1 text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 truncate">
                            <Truck size={13} className="text-blue-600 shrink-0" />
                            <span className="truncate">{vehicleName}</span>
                        </span>
                        <span className="font-mono bg-white dark:bg-[#1e2329] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                            {vehiclePlate}
                        </span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DriverActiveJobModal;
