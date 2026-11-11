import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Truck } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import { DriverItem } from './types/driverAvailability.types';
import { getDriverAvailabilityColumns } from './components/driverAvailabilityColumns';
import DriverFilterTabs from './components/DriverFilterTabs';
import { DriverRowActions } from './components/DriverRowActions';
import { AssignVehicleModal } from './components/AssignVehicleModal';
import { AssignServiceAreaModal } from './components/AssignServiceAreaModal';
import { DriverAvailabilityHistoryModal } from './components/DriverAvailabilityHistoryModal';
import { DriverActiveJobModal } from './components/DriverActiveJobModal';
import { useDriversAvailability } from './hooks/useDriversAvailability';

export { type DriverItem };

export default function DriversAvailability() {
    const navigate = useNavigate();
    const {
        filteredDrivers,
        isLoading,
        isRefreshing,
        counts,
        filterStatus,
        setFilterStatus,
        fetchDrivers,
        vehicleModalDriver,
        setVehicleModalDriver,
        serviceAreaModalDriver,
        setServiceAreaModalDriver,
        historyModalDriver,
        setHistoryModalDriver,
        handleDriverUpdated,
        handleDutyStatusChange,
        handleAccountStatusChange,
        handleStatusChange,
        handleRemoveVehicle,
        handleRemoveServiceArea,
    } = useDriversAvailability();

    const [activeJobDriver, setActiveJobDriver] = React.useState<DriverItem | null>(null);

    const columns = useMemo(
        () =>
            getDriverAvailabilityColumns({
                navigate,
                onOpenVehicleModal: (driver) => setVehicleModalDriver(driver),
                onOpenServiceAreaModal: (driver) => setServiceAreaModalDriver(driver),
                onStatusChange: handleStatusChange,
            }),
        [navigate, setVehicleModalDriver, setServiceAreaModalDriver, handleStatusChange]
    );

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header matching enterprise mockup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[8px] bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-[#ff4a1f] shrink-0">
                        <Truck size={22} strokeWidth={2.2} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                            Drivers
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                            Manage your drivers, their availability, assignments and dispatch status.
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => navigate('/supplier/team')}
                    className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer rounded-[4px] self-start sm:self-auto"
                >
                    <Plus size={15} strokeWidth={2.5} />
                    <span>Add Driver</span>
                </Button>
            </div>

            {/* Standard Project DataTable */}
            <DataTable
                data={filteredDrivers}
                columns={columns}
                actions={(driver: DriverItem) => (
                    <DriverRowActions
                        row={driver}
                        onAssignVehicle={(d) => setVehicleModalDriver(d)}
                        onAssignServiceArea={(d) => setServiceAreaModalDriver(d)}
                        onDutyStatusChange={handleDutyStatusChange}
                        onAccountStatusChange={handleAccountStatusChange}
                        onViewHistory={(d) => setHistoryModalDriver(d)}
                        onViewActiveJob={(d) => setActiveJobDriver(d)}
                        onStatusChange={handleStatusChange}
                        onRemoveVehicle={handleRemoveVehicle}
                        onRemoveServiceArea={handleRemoveServiceArea}
                    />
                )}
                headerTabs={
                    <DriverFilterTabs
                        activeTab={filterStatus}
                        onSelectTab={setFilterStatus}
                        counts={counts}
                    />
                }
                searchPlaceholder="Search driver by name, phone or ID..."
                compact={true}
                hideViewToggle={true}
                hideColumnToggle={true}
                onRefresh={() => fetchDrivers(true)}
                isRefreshing={isRefreshing}
                tableLayout="fixed"
                tableClassName="w-full min-w-[900px]"
                actionsColumnClassName="w-[124px] min-w-[124px] text-right pr-3.5"
                isLoading={isLoading}
                emptyState={
                    <EmptyState
                        icon={Users}
                        title="No Drivers Found"
                        description="Drivers are created and managed via Team Management. Once added, they will appear here for vehicle & service area assignment."
                        actionLabel="Add Driver"
                        onAction={() => navigate('/supplier/team')}
                    />
                }
            />

            {/* Modal: Assign Vehicle */}
            {vehicleModalDriver && (
                <AssignVehicleModal
                    isOpen={Boolean(vehicleModalDriver)}
                    driver={vehicleModalDriver}
                    onClose={() => setVehicleModalDriver(null)}
                    onSuccess={handleDriverUpdated}
                />
            )}

            {/* Modal: Assign Service Area */}
            {serviceAreaModalDriver && (
                <AssignServiceAreaModal
                    isOpen={Boolean(serviceAreaModalDriver)}
                    driver={serviceAreaModalDriver}
                    onClose={() => setServiceAreaModalDriver(null)}
                    onSuccess={handleDriverUpdated}
                />
            )}

            {/* Modal: Availability History / Audit Logs */}
            {historyModalDriver && (
                <DriverAvailabilityHistoryModal
                    isOpen={Boolean(historyModalDriver)}
                    driver={historyModalDriver}
                    onClose={() => setHistoryModalDriver(null)}
                />
            )}

            {/* Modal: Active Shipment Dispatch Details */}
            {activeJobDriver && (
                <DriverActiveJobModal
                    isOpen={Boolean(activeJobDriver)}
                    driver={activeJobDriver}
                    onClose={() => setActiveJobDriver(null)}
                />
            )}
        </div>
    );
}
