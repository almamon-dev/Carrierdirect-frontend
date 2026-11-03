import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, LayoutGrid, MapPin, Truck, Building2, FileText, ArrowRight } from 'lucide-react';
import SupplierOrderHeader from './components/SupplierOrderHeader';
import SupplierOrderHorizontalStepper from './components/SupplierOrderHorizontalStepper';
import SupplierMapSection from './components/SupplierMapSection';
import SupplierRouteCards from './components/SupplierRouteCards';
import SupplierBottomCards from './components/SupplierBottomCards';
import SupplierCustomerProfile from './components/SupplierCustomerProfile';
import SupplierPODAction from './components/SupplierPODAction';
import SupplierTimelineSection from './components/SupplierTimelineSection';
import SubcontractorCostsSection from './components/SubcontractorCostsSection';
import { AssignDriverModal } from './components/AssignDriverModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { OrderPODModal } from './components/OrderPODModal';
import { useSupplierOrderDetails } from './hooks/useSupplierOrderDetails';

export type SupplierOrderDetailsTab =
    | 'overview'
    | 'journey'
    | 'drivers'
    | 'subcontractor_costs'
    | 'documents';

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

    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') as SupplierOrderDetailsTab | null;
    const [activeTab, setActiveTab] = useState<SupplierOrderDetailsTab>(tabParam || 'overview');

    useEffect(() => {
        if (tabParam && tabParam !== activeTab) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = (tab: SupplierOrderDetailsTab) => {
        setActiveTab(tab);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('tab', tab);
            return next;
        });
    };
    const [showAssignDriverModal, setShowAssignDriverModal] = useState<boolean>(false);
    const [assignedDriverInfo, setAssignedDriverInfo] = useState<{
        name: string;
        phone: string;
        email?: string;
        plate: string;
        driverType?: 'internal' | 'subcontractor';
        subcontractorCompany?: string;
        journeyLeg?: string;
    } | null>(null);

    const effectiveDriver = assignedDriverInfo
        ? {
              ...order.driver,
              name: assignedDriverInfo.name,
              phone: assignedDriverInfo.phone,
              email: assignedDriverInfo.email || order.driver?.email || '',
              driverType: assignedDriverInfo.driverType,
              subcontractorCompany: assignedDriverInfo.subcontractorCompany,
          }
        : order.driver;

    const effectiveVehiclePlate = assignedDriverInfo?.plate || order.vehicle?.number || 'Standard Fleet';

    const handleSaveDriver = (driverData: any) => {
        setAssignedDriverInfo(driverData);
        setShowAssignDriverModal(false);
    };

    const customerRevenueNum = order.pricing?.total || order.pricing?.base || 1000.0;
    const platformFeeNum = order.pricing?.commissionFee || 50.0;

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

            {/* Clean Tab Navigation Bar matching the reference design */}
            <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-bold pt-1">
                <button
                    type="button"
                    onClick={() => handleTabChange('overview')}
                    className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                        activeTab === 'overview'
                            ? 'border-[#ff4a1f] text-[#ff4a1f]'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    <LayoutGrid size={13} />
                    <span>Overview</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleTabChange('journey')}
                    className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                        activeTab === 'journey'
                            ? 'border-[#ff4a1f] text-[#ff4a1f]'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    <MapPin size={13} />
                    <span>Journey</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleTabChange('drivers')}
                    className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                        activeTab === 'drivers'
                            ? 'border-[#ff4a1f] text-[#ff4a1f]'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    <Truck size={13} />
                    <span>Drivers</span>
                    {effectiveDriver.driverType === 'subcontractor' && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                            Subcontractor
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => handleTabChange('subcontractor_costs')}
                    className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                        activeTab === 'subcontractor_costs'
                            ? 'border-[#ff4a1f] text-[#ff4a1f]'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    <Building2 size={13} />
                    <span>Subcontractor Costs</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#ff4a1f] text-white">
                        NEW
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => handleTabChange('documents')}
                    className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                        activeTab === 'documents'
                            ? 'border-[#ff4a1f] text-[#ff4a1f]'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    <FileText size={13} />
                    <span>Documents</span>
                </button>
            </div>

            {/* TAB CONTENT: 1. OVERVIEW (100% existing design, unchanged) */}
            {activeTab === 'overview' && (
                <>
                    {/* Horizontal Milestone Stepper */}
                    <SupplierOrderHorizontalStepper timeline={timeline} />

                    {/* Quick Access to Subcontractor Costs & Profit */}
                    <div className="p-3 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-[#1e2329] dark:to-slate-800 rounded-[4px] border border-orange-200/80 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2 shadow-2xs">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#ff4a1f] text-white flex items-center justify-center shrink-0">
                                <Building2 size={16} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    <span>Subcontractor Costs & Profit Overview</span>
                                    <span className="text-[10px] bg-[#ff4a1f] text-white px-1.5 py-0.5 rounded font-bold">Step 2 - 6</span>
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Manage external carrier costs, upload subcontractor invoices, and view order net profit.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleTabChange('subcontractor_costs')}
                            className="px-3 py-1.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] shadow-2xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                            <span>Open Subcontractor Costs</span>
                            <ArrowRight size={12} />
                        </button>
                    </div>

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
                </>
            )}

            {/* TAB CONTENT: 2. SUBCONTRACTOR COSTS */}
            {activeTab === 'subcontractor_costs' && (
                <SubcontractorCostsSection
                    orderId={order.orderNumber || cleanId}
                    routeFrom={order.from}
                    routeTo={order.to}
                    customerRevenue={customerRevenueNum}
                    platformFee={platformFeeNum}
                />
            )}

            {/* TAB CONTENT: 3. JOURNEY */}
            {activeTab === 'journey' && (
                <div className="space-y-3">
                    <SupplierMapSection order={order} timeline={timeline} />
                    <SupplierRouteCards order={order} />
                </div>
            )}

            {/* TAB CONTENT: 4. DRIVERS */}
            {activeTab === 'drivers' && (
                <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Assigned Drivers & Fleet
                                </h3>
                                {effectiveDriver.driverType === 'subcontractor' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                                        External Subcontractor: {effectiveDriver.subcontractorCompany || 'ABC Logistics'}
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        In-House Fleet Driver
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Subcontractor drivers are assigned per journey leg and isolated from company access.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAssignDriverModal(true)}
                            className="px-3.5 py-1.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] shadow-2xs cursor-pointer flex items-center gap-1.5"
                        >
                            <Truck size={13} />
                            <span>Assign / Change Driver</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider">
                                    Assigned Driver
                                </span>
                                {effectiveDriver.driverType === 'subcontractor' && (
                                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                        External Contractor
                                    </span>
                                )}
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {effectiveDriver?.name || 'No Driver Assigned Yet'}
                            </p>
                            {effectiveDriver?.phone && (
                                <p className="text-slate-500 dark:text-slate-400">
                                    Phone (App Login): <strong className="text-slate-700 dark:text-slate-200">{effectiveDriver.phone}</strong>
                                </p>
                            )}
                            {effectiveDriver?.email && (
                                <p className="text-slate-500 dark:text-slate-400">
                                    Email: <strong className="text-slate-700 dark:text-slate-200">{effectiveDriver.email}</strong>
                                </p>
                            )}
                            {assignedDriverInfo?.journeyLeg && (
                                <p className="text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700">
                                    Assigned Leg: <strong className="text-orange-600 dark:text-orange-400">{assignedDriverInfo.journeyLeg}</strong>
                                </p>
                            )}
                        </div>

                        <div className="p-3.5 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
                            <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider">
                                Assigned Vehicle Plate
                            </span>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {effectiveVehiclePlate}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                                Status: <strong className="text-emerald-600">Active Telematics</strong>
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700">
                                Driver App Access: <span className="font-semibold text-slate-700 dark:text-slate-300">Enabled (Shipment ID #{cleanId})</span>
                            </p>
                        </div>
                    </div>
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
                currentDriver={effectiveDriver}
                currentVehiclePlate={effectiveVehiclePlate}
                onSave={handleSaveDriver}
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
        </div>
    );
}
