import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Package, FileCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import { useAssignDriverData } from './hooks/useAssignDriverData';
import { DriverDispatchForm } from './components/DriverDispatchForm';
import { DispatchSummaryPanel } from './components/DispatchSummaryPanel';

export default function AssignDriver() {
    const navigate = useNavigate();
    const {
        orders,
        fleetDrivers,
        fleetVehicles,
        subcontractorsList,
        isLoading,
        isRefreshing,
        isSubmitting,
        selectedOrderId,
        selectedOrder,
        isRelay,
        handleToggleRelay,
        pickupLeg,
        deliveryLeg,
        updatePickupLeg,
        updateDeliveryLeg,
        dispatchNote,
        setDispatchNote,
        financialSummary,
        handleSelectOrder,
        handleDispatchSubmit,
        fetchData,
    } = useAssignDriverData();

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-5">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-0.5">
                        Assign Driver &amp; Dispatch
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Select an active shipment and allocate In-House Drivers or Subcontractor Partners per leg.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchData(true)}
                        disabled={isRefreshing || isLoading}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw
                            size={13}
                            className={
                                isRefreshing
                                    ? 'animate-spin text-[#ff4a1f]'
                                    : 'text-slate-500'
                            }
                        />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/supplier/orders/active-jobs')}
                        className="h-8 px-3.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                        <Package size={14} className="text-slate-500" />
                        <span>All Active Jobs</span>
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/supplier/orders/pod')}
                        className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <FileCheck size={14} />
                        <span>Manage PODs</span>
                    </Button>
                </div>
            </div>

            {/* Main 2-Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <DriverDispatchForm
                    orders={orders}
                    fleetDrivers={fleetDrivers}
                    fleetVehicles={fleetVehicles}
                    subcontractorsList={subcontractorsList}
                    selectedOrderId={selectedOrderId}
                    selectedOrder={selectedOrder}
                    isRelay={isRelay}
                    onToggleRelay={handleToggleRelay}
                    pickupLeg={pickupLeg}
                    deliveryLeg={deliveryLeg}
                    onUpdatePickupLeg={updatePickupLeg}
                    onUpdateDeliveryLeg={updateDeliveryLeg}
                    dispatchNote={dispatchNote}
                    onChangeDispatchNote={setDispatchNote}
                    isLoading={isLoading}
                    onSelectOrder={handleSelectOrder}
                    onSubmit={handleDispatchSubmit}
                />

                <DispatchSummaryPanel
                    selectedOrder={selectedOrder}
                    isRelay={isRelay}
                    pickupLeg={pickupLeg}
                    deliveryLeg={deliveryLeg}
                    fleetDrivers={fleetDrivers}
                    fleetVehicles={fleetVehicles}
                    subcontractorsList={subcontractorsList}
                    financialSummary={financialSummary}
                    isSubmitting={isSubmitting}
                    selectedOrderId={selectedOrderId}
                />
            </div>
        </div>
    );
}
