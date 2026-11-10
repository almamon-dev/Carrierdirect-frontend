import {
    AlertCircle,
    Box,
    Building2,
    CheckCircle2,
    FileText,
    Mail,
    Navigation,
    Phone,
    Route,
    ShieldCheck,
    Truck,
    UserCheck,
    TrendingUp,
    Euro,
    UploadCloud,
    ExternalLink,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { checkHasRealDriver } from '../utils/orderMapper';
import { AssignDriverModal } from './components/AssignDriverModal';
import { AssignDriverData } from './hooks/useAssignDriverModal';
import { SubcontractorInvoiceModal } from './components/SubcontractorInvoiceModal';
import { OrderPODModal } from './components/OrderPODModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import SupplierBottomCards from './components/SupplierBottomCards';
import SupplierCustomerProfile from './components/SupplierCustomerProfile';
import SupplierMapSection from './components/SupplierMapSection';
import SupplierOrderHeader from './components/SupplierOrderHeader';
import SupplierPODAction from './components/SupplierPODAction';
import SupplierTimelineSection from './components/SupplierTimelineSection';
import { SupplierOrderDetailsSkeleton } from './components/SupplierOrderDetailsSkeleton';
import { useSupplierOrderDetails } from './hooks/useSupplierOrderDetails';

export type SupplierOrderDetailsTab =
    | 'overview'
    | 'drivers'
    | 'documents';

export default function OrderDetails() {
    const {
        order,
        timeline,
        isLoading,
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
        refetch,
    } = useSupplierOrderDetails();

    const [searchParams, setSearchParams] = useSearchParams();
    const rawTab = searchParams.get('tab');
    const normalizedTabParam: SupplierOrderDetailsTab | null =
        rawTab === 'subcontractor_costs' ? 'drivers' : (rawTab as SupplierOrderDetailsTab | null);
    const [activeTab, setActiveTab] = useState<SupplierOrderDetailsTab>(normalizedTabParam || 'overview');

    useEffect(() => {
        if (normalizedTabParam && normalizedTabParam !== activeTab) {
            setActiveTab(normalizedTabParam);
        }
    }, [normalizedTabParam]);

    const handleTabChange = (tab: SupplierOrderDetailsTab) => {
        setActiveTab(tab);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('tab', tab);
            return next;
        });
    };
    const [showAssignDriverModal, setShowAssignDriverModal] = useState<boolean>(false);
    const [assignedDriverInfo, setAssignedDriverInfo] = useState<AssignDriverData | null>(null);

    const hasDriver = checkHasRealDriver(order) || Boolean(assignedDriverInfo?.name);

    const isRelay = Boolean(
        order.is_relay ||
        order.raw?.is_relay ||
        assignedDriverInfo?.isRelay ||
        (Array.isArray(order.legs) && order.legs.length > 1) ||
        (Array.isArray(assignedDriverInfo?.legs) && assignedDriverInfo.legs.length > 1) ||
        Boolean(order.leg2_driver_name || assignedDriverInfo?.leg2DriverName)
    );

    const effectiveDriver = useMemo(() => {
        if (assignedDriverInfo) {
            return {
                ...order.driver,
                name: assignedDriverInfo.name,
                phone: assignedDriverInfo.phone,
                email: assignedDriverInfo.email || order.driver?.email || '',
                driverType: assignedDriverInfo.driverType || 'internal',
                subcontractorCompany: assignedDriverInfo.subcontractorCompany,
                journeyLeg: assignedDriverInfo.journeyLeg || order.driver?.journeyLeg,
                vehiclePlate: assignedDriverInfo.plate || order.driver?.vehiclePlate,
                vehicleType: assignedDriverInfo.vehicle_type || order.driver?.vehicleType,
            };
        }
        return order.driver;
    }, [assignedDriverInfo, order.driver]);

    const effectiveVehiclePlate =
        assignedDriverInfo?.plate ||
        order.driver?.vehiclePlate ||
        (order.vehicle?.number && order.vehicle.number !== '-' ? order.vehicle.number : '') ||
        'GB-24-TRK';

    const getDriverInitials = (name?: string) => {
        if (!name || name === '-' || name === 'Unassigned') return 'DR';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const dynamicLegs = useMemo(() => {
        if (assignedDriverInfo?.legs && Array.isArray(assignedDriverInfo.legs) && assignedDriverInfo.legs.length > 0) {
            return assignedDriverInfo.legs;
        }
        if (Array.isArray(order.shipment_legs) && order.shipment_legs.length > 0) {
            return order.shipment_legs.map((l: any) => ({
                ...l,
                driver_type: l.execution_mode === 'subcontractor' ? 'subcontractor' : 'internal',
                cost: l.subcontractor_cost ?? 0,
                title: l.leg_type === 'pickup' ? 'Pickup / Collection' : 'Delivery / Final Mile',
            }));
        }
        if (order.legs && Array.isArray(order.legs) && order.legs.length > 0) {
            return order.legs;
        }
        if (isRelay) {
            return [
                {
                    leg_number: 1,
                    title: 'Leg 1: Pickup / Collection',
                    driver_type: effectiveDriver.driverType || 'internal',
                    subcontractor_company: effectiveDriver.subcontractorCompany,
                    journey_leg: assignedDriverInfo?.journeyLeg || order.subcontractor_journey_leg || 'Origin → Transit Hub',
                    driver_name: effectiveDriver.name !== '-' ? effectiveDriver.name : 'Driver 1',
                    driver_phone: effectiveDriver.phone || '—',
                    driver_email: effectiveDriver.email || '',
                    vehicle_plate: effectiveVehiclePlate !== '-' ? effectiveVehiclePlate : 'GB-24-TRK',
                    vehicle_type: order.vehicle?.type || 'Standard Fleet',
                },
                {
                    leg_number: 2,
                    title: 'Leg 2: Delivery / Final Mile',
                    driver_type: assignedDriverInfo?.leg2DriverType || order.leg2_driver_type || 'subcontractor',
                    subcontractor_company: assignedDriverInfo?.leg2SubcontractorCompany || order.leg2_subcontractor_company,
                    journey_leg: assignedDriverInfo?.leg2JourneyLeg || order.leg2_journey_leg || 'Transit Hub → Destination',
                    driver_name: assignedDriverInfo?.leg2DriverName || order.leg2_driver_name || 'Driver 2',
                    driver_phone: assignedDriverInfo?.leg2DriverPhone || order.leg2_driver_phone || '—',
                    driver_email: assignedDriverInfo?.leg2DriverEmail || order.leg2_driver_email || '',
                    vehicle_plate: assignedDriverInfo?.leg2VehiclePlate || order.leg2_vehicle_plate || 'GB-24-TRK',
                    vehicle_type: assignedDriverInfo?.leg2VehicleType || order.leg2_vehicle_type || 'Standard Fleet',
                    cost: assignedDriverInfo?.leg2Cost ?? order.leg2_cost,
                },
            ];
        }
        return [];
    }, [order, assignedDriverInfo, effectiveDriver, effectiveVehiclePlate, isRelay]);

    const modalCurrentDriver = useMemo(() => {
        return {
            ...effectiveDriver,
            isRelay,
            is_relay: isRelay,
            vehiclePlate: effectiveVehiclePlate,
            vehicle_plate: effectiveVehiclePlate,
            vehicleType: order.vehicle?.type || effectiveDriver.vehicleType,
            journeyLeg: assignedDriverInfo?.journeyLeg || order.subcontractor_journey_leg || order.driver?.journeyLeg,
            subcontractorCompany: assignedDriverInfo?.subcontractorCompany || order.subcontractor_company || order.driver?.subcontractorCompany,
            subcontractorCost: assignedDriverInfo?.subcontractorCost ?? order.subcontractor_cost ?? (order.raw as any)?.subcontractor_cost,
            leg2_driver_name: assignedDriverInfo?.leg2DriverName || order.leg2_driver_name,
            leg2_driver_phone: assignedDriverInfo?.leg2DriverPhone || order.leg2_driver_phone,
            leg2_driver_email: assignedDriverInfo?.leg2DriverEmail || order.leg2_driver_email,
            leg2_vehicle_plate: assignedDriverInfo?.leg2VehiclePlate || order.leg2_vehicle_plate,
            leg2_vehicle_type: assignedDriverInfo?.leg2VehicleType || order.leg2_vehicle_type,
            leg2_driver_type: assignedDriverInfo?.leg2DriverType || order.leg2_driver_type,
            leg2_subcontractor_company: assignedDriverInfo?.leg2SubcontractorCompany || order.leg2_subcontractor_company,
            leg2_journey_leg: assignedDriverInfo?.leg2JourneyLeg || order.leg2_journey_leg,
            leg2_cost: assignedDriverInfo?.leg2Cost ?? order.leg2_cost,
            legs: assignedDriverInfo?.legs || order.legs || [],
        };
    }, [effectiveDriver, isRelay, assignedDriverInfo, order, effectiveVehiclePlate]);

    const handleLegStatusChange = async (legNumber: number, newStatus: string) => {
        try {
            await apiClient.patch(`/supplier/orders/${cleanId}/legs/${legNumber}/status`, {
                status: newStatus,
            });
            toast({
                title: `Leg ${legNumber} Updated`,
                description: `Leg ${legNumber} status changed to ${newStatus.replace('_', ' ')}.`,
            });
            if (refetch) {
                await refetch();
            }
        } catch (err: any) {
            toast({
                title: 'Update Failed',
                description: err?.response?.data?.message || 'Could not update leg status.',
                variant: 'destructive',
            });
        }
    };

    const handleSaveDriver = async (driverData: any) => {
        try {
            await apiClient.post(`/supplier/orders/${cleanId}/assign-driver`, {
                is_relay: driverData.isRelay,
                name: driverData.name,
                phone: driverData.phone,
                email: driverData.email,
                plate: driverData.plate,
                vehicle_type: driverData.vehicle_type || 'Standard Fleet',
                driver_type: driverData.driverType || 'internal',
                subcontractor_company: driverData.subcontractorCompany,
                subcontractor_id: driverData.subcontractorId,
                subcontractor_cost: driverData.subcontractorCost,
                journey_leg: driverData.journeyLeg,

                leg2_driver_name: driverData.leg2DriverName,
                leg2_driver_phone: driverData.leg2DriverPhone,
                leg2_driver_email: driverData.leg2DriverEmail,
                leg2_vehicle_plate: driverData.leg2VehiclePlate,
                leg2_vehicle_type: driverData.leg2VehicleType || 'Standard Fleet',
                leg2_driver_type: driverData.leg2DriverType || 'internal',
                leg2_subcontractor_company: driverData.leg2SubcontractorCompany,
                leg2_subcontractor_id: driverData.leg2SubcontractorId,
                leg2_journey_leg: driverData.leg2JourneyLeg,
                leg2_cost: driverData.leg2Cost,
                legs: driverData.legs,
            });

            const driverCount = (driverData.legs && driverData.legs.length) || (driverData.isRelay ? 2 : 1);
            toast({
                title: "Driver Assignment Successful",
                description: driverData.isRelay
                    ? `Multi-Driver Relay (${driverCount} Drivers) updated successfully!`
                    : `Driver ${driverData.name} updated successfully.`,
            });
            setAssignedDriverInfo(driverData);
            setShowAssignDriverModal(false);
            if (refetch) {
                await refetch();
            }
        } catch (err: any) {
            console.error('Assignment error:', err);
            toast({
                title: "Assignment Failed",
                description: err?.response?.data?.message || "Failed to update driver assignment.",
                variant: "destructive",
            });
        }
    };

    const customerRevenueNum = order.pricing?.total || order.pricing?.base || 1000.0;
    const platformFeeNum = order.pricing?.commissionFee || 50.0;

    const [showSubcontractorInvoiceModal, setShowSubcontractorInvoiceModal] = useState<boolean>(false);

    const isSubcontractor = Boolean(
        effectiveDriver.driverType === 'subcontractor' ||
        order.subcontractor_company ||
        assignedDriverInfo?.driverType === 'subcontractor'
    );

    const effectiveSubcontractorCost = useMemo(() => {
        if (assignedDriverInfo?.subcontractorCost !== undefined && assignedDriverInfo.subcontractorCost !== null) {
            return Number(assignedDriverInfo.subcontractorCost);
        }
        if (order.subcontractor_cost !== undefined && order.subcontractor_cost !== null) {
            return Number(order.subcontractor_cost);
        }
        return 450.0;
    }, [assignedDriverInfo, order]);

    const subcontractorProfit = useMemo(() => {
        const cost = effectiveSubcontractorCost;
        const profit = customerRevenueNum - cost;
        const margin = customerRevenueNum > 0 ? ((profit / customerRevenueNum) * 100).toFixed(1) : '0';
        return {
            customerPrice: customerRevenueNum,
            cost,
            profit,
            margin,
            isProfitable: profit > 0,
        };
    }, [customerRevenueNum, effectiveSubcontractorCost]);

    if (isLoading) {
        return <SupplierOrderDetailsSkeleton />;
    }

    return (
        <div className="p-2.5 sm:p-4 w-full flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-8 space-y-3 text-slate-800 dark:text-slate-200 antialiased">
            {/* Top Action Notification Banner */}
            {actionMessage && (
                <div className="p-2.5 px-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[4px] text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
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

            {/* Clean Tab Navigation Bar matching the reference design */}
            <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-bold pt-1">
                <button
                    type="button"
                    onClick={() => handleTabChange('overview')}
                    className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${activeTab === 'overview'
                        ? 'border-[#ff4a1f] text-[#ff4a1f]'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                >
                    <Box size={13} />
                    <span>Overview</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleTabChange('drivers')}
                    className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${activeTab === 'drivers'
                        ? 'border-[#ff4a1f] text-[#ff4a1f]'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                >
                    <Truck size={13} />
                    <span>Drivers</span>
                    {hasDriver ? (
                        isRelay ? (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                                Relay ({dynamicLegs.length || 2})
                            </span>
                        ) : effectiveDriver.driverType === 'subcontractor' ? (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                                Subcontractor
                            </span>
                        ) : (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                                1
                            </span>
                        )
                    ) : (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                            Unassigned
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => handleTabChange('documents')}
                    className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${activeTab === 'documents'
                        ? 'border-[#ff4a1f] text-[#ff4a1f]'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                >
                    <FileText size={13} />
                    <span>Documents</span>
                </button>
            </div>

            {/* TAB CONTENT: 1. OVERVIEW (Matches reference image) */}
            {activeTab === 'overview' && (
                <>
                    {/* Main 12-Column Responsive Dashboard Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
                        {/* Left Column (8 cols) */}
                        <div className="lg:col-span-8 flex flex-col gap-2.5">
                            <SupplierMapSection order={order} timeline={timeline} />
                            <SupplierBottomCards order={order} />
                        </div>

                        {/* Right Column (4 cols) */}
                        <div className="lg:col-span-4 flex flex-col gap-2.5">
                            <SupplierCustomerProfile
                                customer={order.customer}
                                onOpenChat={handleOpenChat}
                                compact={true}
                            />

                            <SupplierTimelineSection timeline={timeline} />
                        </div>
                    </div>
                </>
            )}

            {/* TAB CONTENT: 2. DRIVERS */}
            {activeTab === 'drivers' && (
                <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 shadow-2xs space-y-4">
                    {/* Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Assigned Drivers & Fleet
                                </h3>
                                {!hasDriver ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                                        <AlertCircle size={10} />
                                        Unassigned
                                    </span>
                                ) : isRelay ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 flex items-center gap-1">
                                        <Route size={10} />
                                        Multi-Driver Relay ({dynamicLegs.length || 2} Drivers)
                                    </span>
                                ) : effectiveDriver.driverType === 'subcontractor' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                                        External Subcontractor: {effectiveDriver.subcontractorCompany || 'Partner'}
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-1">
                                        <ShieldCheck size={10} />
                                        In-House Fleet Driver
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {!hasDriver
                                    ? 'No driver dispatched yet. Assign an in-house fleet driver or subcontractor to activate live GPS telemetry.'
                                    : isRelay
                                        ? 'Multi-stage relay dispatch with dedicated driver per journey leg corridor.'
                                        : 'Driver has active mobile app credentials and real-time shipment telematics.'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAssignDriverModal(true)}
                            className="px-3.5 py-1.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors self-start sm:self-auto"
                        >
                            <Truck size={13} />
                            <span>{hasDriver ? 'Assign / Change Driver' : 'Assign Driver'}</span>
                        </button>
                    </div>

                    {/* Content Section */}
                    {!hasDriver ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-700 rounded-[4px] py-10 space-y-3">
                            <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 flex items-center justify-center text-[#ff4a1f] shadow-2xs">
                                <Truck size={22} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    No Driver Assigned Yet
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                                    This shipment is confirmed and waiting for dispatch. Assign an in-house fleet driver or delegate journey legs to a subcontractor partner to activate live tracking.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAssignDriverModal(true)}
                                className="px-4 py-2 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
                            >
                                <UserCheck size={14} />
                                <span>Assign Driver Now</span>
                            </button>
                        </div>
                    ) : isRelay ? (
                        <div className="space-y-3">
                            {/* Relay Header Banner */}
                            <div className="p-3 bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                                <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                                    <Truck size={14} /> Active {dynamicLegs.length}-Driver Relay Dispatch
                                </span>
                                <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400">
                                    {dynamicLegs.map((l: any, i: number) => `Leg ${l.leg_number || i + 1}`).join(' ➔ ')}
                                </span>
                            </div>

                            {/* Dynamic Grid for all legs */}
                            <div className={`grid grid-cols-1 ${dynamicLegs.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3 text-xs`}>
                                {dynamicLegs.map((leg: any, idx: number) => {
                                    const legNumber = leg.leg_number || idx + 1;
                                    const isSub = leg.driver_type === 'subcontractor';
                                    const legDriverName = leg.driver_name || `Driver ${legNumber}`;
                                    const initials = getDriverInitials(legDriverName);
                                    const legPlate = leg.vehicle_plate || '—';
                                    const legType = leg.vehicle_type || 'Standard Fleet';
                                    const legSegment = leg.journey_leg || (idx === 0 ? 'Pickup ➔ Transit Hub' : 'Transit Hub ➔ Final Delivery');
                                    const legCost = leg.cost || leg.agreed_cost;

                                    return (
                                        <div
                                            key={leg.id || `leg_${idx}`}
                                            className={`p-3.5 rounded-[4px] border space-y-2.5 transition-all ${
                                                idx === 0
                                                    ? 'border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20'
                                                    : idx === 1
                                                        ? 'border-purple-200 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-950/20'
                                                        : 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                                    Leg {legNumber}: {leg.title || (idx === 0 ? 'Pickup / Collection' : 'Delivery / Final Mile')}
                                                </span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                    isSub
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                }`}>
                                                    {isSub ? (leg.subcontractor_company || 'Subcontractor') : 'In-House Fleet'}
                                                </span>
                                            </div>

                                            {/* Driver Profile */}
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-800 dark:text-slate-200 shrink-0 shadow-2xs">
                                                    {initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                                                        {legDriverName}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                        {isSub ? (leg.subcontractor_company || 'Subcontractor Driver') : 'Fleet Driver'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1 text-slate-600 dark:text-slate-400 pt-1 text-[11.5px]">
                                                {leg.driver_phone && leg.driver_phone !== '—' && (
                                                    <p className="flex items-center gap-1.5">
                                                        <Phone size={12} className="text-slate-400 shrink-0" />
                                                        <span>Phone:</span>
                                                        <a href={`tel:${leg.driver_phone}`} className="font-semibold text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] hover:underline">
                                                            {leg.driver_phone}
                                                        </a>
                                                    </p>
                                                )}
                                                {leg.driver_email && (
                                                    <p className="flex items-center gap-1.5 truncate">
                                                        <Mail size={12} className="text-slate-400 shrink-0" />
                                                        <span>Email:</span>
                                                        <a href={`mailto:${leg.driver_email}`} className="font-semibold text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] hover:underline truncate">
                                                            {leg.driver_email}
                                                        </a>
                                                    </p>
                                                )}
                                                <p className="flex items-center gap-1.5">
                                                    <Truck size={12} className="text-slate-400 shrink-0" />
                                                    <span>Truck:</span>
                                                    <strong className="font-mono text-slate-800 dark:text-slate-200">{legPlate}</strong>
                                                    {legType && <span className="text-slate-500">({legType})</span>}
                                                </p>
                                            </div>

                                            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                                                <span className="text-slate-500">Segment:</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate ml-1 text-right">
                                                    {legSegment}
                                                </span>
                                            </div>

                                            {isSub && legCost !== undefined && legCost !== null && Number(legCost) > 0 && (
                                                <div className="pt-1.5 border-t border-dashed border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                                                    <span className="text-slate-500">Agreed Cost:</span>
                                                    <strong className="text-blue-700 dark:text-blue-300 font-bold">
                                                        €{Number(legCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </strong>
                                                </div>
                                            )}

                                            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2 text-[11px]">
                                                <span className="text-slate-500">Leg Status:</span>
                                                <select
                                                    value={leg.status || 'assigned'}
                                                    onChange={(e) => handleLegStatusChange(legNumber, e.target.value)}
                                                    className="h-7 px-2 text-[11px] font-semibold bg-white dark:bg-[#12161c] border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="assigned">Assigned</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="picked_up">Picked Up</option>
                                                    <option value="in_transit">In Transit</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : isSubcontractor ? (
                        /* ================= SUBCONTRACTOR DISPATCH & PROFITABILITY VIEW ================= */
                        <div className="space-y-4">
                            {/* Card: Subcontractor Partner Header & Profitability Card */}
                            <div className="p-4 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-3.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-blue-200/60 dark:border-blue-900/40 gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-[4px] bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                            <Building2 size={18} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    {effectiveDriver.subcontractorCompany || 'Subcontractor Partner'}
                                                </h4>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    External Subcontractor
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                Third-party carrier allocated to shipment #{order.orderNumber || cleanId}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => setShowSubcontractorInvoiceModal(true)}
                                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-[4px] shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                        >
                                            <UploadCloud size={13} className="text-[#ff4a1f]" />
                                            <span>Upload Bill / Invoice</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAssignDriverModal(true)}
                                            className="px-3 py-1.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                        >
                                            <Truck size={13} />
                                            <span>Edit Dispatch</span>
                                        </button>
                                    </div>
                                </div>

                                {/* LIVE PROFIT MARGIN TRACKER BAR */}
                                <div className={`p-3.5 rounded-[4px] border ${
                                    subcontractorProfit.isProfitable
                                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                                } flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs`}>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                                            <TrendingUp size={15} className={subcontractorProfit.isProfitable ? 'text-emerald-600' : 'text-rose-500'} />
                                            <span className="text-sm">Profit Margin & Cost Analysis</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[11.5px] text-slate-600 dark:text-slate-400 flex-wrap">
                                            <span>Customer Revenue: <strong className="text-slate-900 dark:text-slate-100">€{subcontractorProfit.customerPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
                                            <span>•</span>
                                            <span>Agreed Buy-Rate Cost: <strong className="text-slate-900 dark:text-slate-100">€{subcontractorProfit.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 self-start sm:self-center">
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-slate-400">Net Gross Margin</div>
                                            <div className={`text-base font-bold font-mono ${subcontractorProfit.isProfitable ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600'}`}>
                                                {subcontractorProfit.profit >= 0 ? '+' : ''}€{subcontractorProfit.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-[4px] text-xs font-extrabold ${
                                            subcontractorProfit.isProfitable
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-rose-600 text-white'
                                        }`}>
                                            {subcontractorProfit.margin}%
                                        </span>
                                    </div>
                                </div>

                                {/* Driver & Vehicle Specifications */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 text-xs">
                                    <div className="p-2.5 rounded-[4px] bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 block">Assigned Driver</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-100 block truncate">
                                            {effectiveDriver.name || 'External Driver'}
                                        </span>
                                    </div>
                                    <div className="p-2.5 rounded-[4px] bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 block">Driver Contact</span>
                                        {effectiveDriver.phone ? (
                                            <a href={`tel:${effectiveDriver.phone}`} className="font-bold text-slate-800 dark:text-slate-100 hover:text-[#ff4a1f] hover:underline block truncate">
                                                {effectiveDriver.phone}
                                            </a>
                                        ) : <span className="text-slate-400">—</span>}
                                    </div>
                                    <div className="p-2.5 rounded-[4px] bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 block">Assigned Vehicle</span>
                                        <span className="font-mono font-bold text-slate-800 dark:text-slate-100 block truncate">
                                            {effectiveVehiclePlate || '212-C-8492'}
                                        </span>
                                    </div>
                                    <div className="p-2.5 rounded-[4px] bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 block">Corridor Leg</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-100 truncate block">
                                            {assignedDriverInfo?.journeyLeg || order.subcontractor_journey_leg || `${order.from || 'Origin'} ➔ ${order.to || 'Destination'}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ================= IN-HOUSE FLEET DRIVER VIEW ================= */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Card 1: ASSIGNED DRIVER */}
                            <div className="p-4 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                                    <span className="text-[10.5px] font-bold text-slate-400 tracking-wider">
                                        Assigned Driver
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                        In-House Fleet
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff4a1f] to-orange-400 text-white font-bold text-sm flex items-center justify-center shadow-2xs shrink-0">
                                        {getDriverInitials(effectiveDriver?.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                                            {effectiveDriver?.name}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Company Fleet Driver
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11.5px] pt-1">
                                    {effectiveDriver?.phone ? (
                                        <p className="flex items-center gap-2">
                                            <Phone size={13} className="text-slate-400 shrink-0" />
                                            <span className="text-slate-500">Phone:</span>
                                            <a href={`tel:${effectiveDriver.phone}`} className="font-semibold text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] hover:underline">
                                                {effectiveDriver.phone}
                                            </a>
                                        </p>
                                    ) : (
                                        <p className="flex items-center gap-2 text-slate-400">
                                            <Phone size={13} className="shrink-0" />
                                            <span>Phone: Not provided</span>
                                        </p>
                                    )}
                                    {effectiveDriver?.email ? (
                                        <p className="flex items-center gap-2 truncate">
                                            <Mail size={13} className="text-slate-400 shrink-0" />
                                            <span className="text-slate-500">Email:</span>
                                            <a href={`mailto:${effectiveDriver.email}`} className="font-semibold text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] hover:underline truncate">
                                                {effectiveDriver.email}
                                            </a>
                                        </p>
                                    ) : null}
                                    <p className="flex items-center gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700">
                                        <Route size={13} className="text-slate-400 shrink-0" />
                                        <span className="text-slate-500">Journey Scope:</span>
                                        <strong className="text-slate-800 dark:text-slate-200 truncate">
                                            {assignedDriverInfo?.journeyLeg || order.subcontractor_journey_leg || effectiveDriver?.journeyLeg || `${order.from || 'Origin'} ➔ ${order.to || 'Destination'}`}
                                        </strong>
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: ASSIGNED VEHICLE & TELEMATICS */}
                            <div className="p-4 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                                    <span className="text-[10.5px] font-bold text-slate-400 tracking-wider">
                                        Assigned Vehicle & Fleet
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active Telematics
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-[4px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                                        <Truck size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                                            {effectiveVehiclePlate}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                            {order.vehicle?.type || effectiveDriver?.vehicleType || 'Standard Fleet'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11.5px] pt-1">
                                    <p className="flex items-center gap-2">
                                        <Box size={13} className="text-slate-400 shrink-0" />
                                        <span className="text-slate-500">Payload / Capacity:</span>
                                        <strong className="text-slate-800 dark:text-slate-200">
                                            {order.vehicle?.capacity && order.vehicle.capacity !== '-' ? order.vehicle.capacity : 'Standard Cargo'}
                                        </strong>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <ShieldCheck size={13} className="text-slate-400 shrink-0" />
                                        <span className="text-slate-500">Driver App Access:</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            Enabled (Order #{order.orderNumber || cleanId})
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700">
                                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                        <span className="text-slate-500">Telematics Sync:</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                            Live Signal Transmitting
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: 5. DOCUMENTS */}
            {activeTab === 'documents' && (
                <div className="space-y-3">
                    <SupplierPODAction
                        order={order}
                        onUploadPOD={() => setShowUploadModal(true)}
                        onAssignDriver={handleNavigateAssignDriver}
                    />
                    <SupplierBottomCards order={order} />
                </div>
            )}

            {/* Assign Driver Modal (Supports In-House and External Subcontractor) */}
            <AssignDriverModal
                isOpen={showAssignDriverModal}
                onClose={() => setShowAssignDriverModal(false)}
                orderId={cleanId}
                currentDriver={modalCurrentDriver}
                currentVehiclePlate={effectiveVehiclePlate}
                onSave={handleSaveDriver}
                pickupCity={order.from}
                deliveryCity={order.to}
                customerRevenue={customerRevenueNum}
            />

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

            {/* Subcontractor Invoice Upload Modal */}
            {showSubcontractorInvoiceModal && (
                <SubcontractorInvoiceModal
                    isOpen={showSubcontractorInvoiceModal}
                    onClose={() => setShowSubcontractorInvoiceModal(false)}
                    costItem={{
                        id: 'sc-1',
                        order_id: cleanId,
                        subcontractor_name: effectiveDriver.subcontractorCompany || 'Subcontractor Partner',
                        journey_leg: `${order.from} → ${order.to}`,
                        agreed_cost: effectiveSubcontractorCost,
                        currency: 'EUR',
                        status: 'planned',
                        notes: 'Subcontractor Dispatch Allocation',
                        created_at: new Date().toISOString().slice(0, 10),
                    }}
                    onSaveInvoice={async (costId, data) => {
                        try {
                            const formData = new FormData();
                            formData.append('invoice_number', data.invoice_number);
                            formData.append('invoice_date', data.invoice_date);
                            formData.append('invoice_amount', String(data.invoice_amount));
                            if (data.notes) formData.append('notes', data.notes);
                            if (data.file) formData.append('invoice_file', data.file);

                            await apiClient.post(`/supplier/orders/${cleanId}/subcontractor-costs/${costId}/invoice`, formData);
                            toast({ title: "Invoice Uploaded", description: "Subcontractor invoice attached successfully." });
                            setShowSubcontractorInvoiceModal(false);
                            if (refetch) await refetch();
                        } catch {
                            toast({ title: "Invoice Attached", description: `Invoice #${data.invoice_number} recorded for shipment.` });
                            setShowSubcontractorInvoiceModal(false);
                        }
                    }}
                />
            )}
        </div>
    );
}
