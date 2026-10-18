import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import { DriverItem } from './types/driverAvailability.types';
import { getDriverAvailabilityColumns } from './components/driverAvailabilityColumns';
import { DriverFilterTabs } from './components/DriverFilterTabs';
import { DriverRowActions } from './components/DriverRowActions';
import { AssignVehicleModal } from './components/AssignVehicleModal';
import { AssignServiceAreaModal } from './components/AssignServiceAreaModal';
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
        vehicleModalDriver,
        setVehicleModalDriver,
        serviceAreaModalDriver,
        setServiceAreaModalDriver,
        handleDriverUpdated,
        handleStatusChange,
        handleRemoveVehicle,
        handleRemoveServiceArea,
    } = useDriversAvailability();

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


            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Drivers
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Manage your drivers, their availability and status.
                    </p>
                </div>

                <Button
                    onClick={() => navigate('/supplier/team')}
                    className="h-8 px-3.5 bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer rounded-[4px] self-start sm:self-auto"
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
                searchPlaceholder="Search driver..."
                compact={true}
                hideViewToggle={true}
                tableLayout="fixed"
                tableClassName="min-w-[850px]"
                actionsColumnClassName="w-[60px] min-w-[60px] text-right pr-3.5"
                isLoading={isLoading || isRefreshing}
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
        </div>
    );
}
