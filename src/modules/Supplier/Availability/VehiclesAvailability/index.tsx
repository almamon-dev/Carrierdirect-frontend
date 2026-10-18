import React, { useMemo } from 'react';
import { Plus, Truck } from 'lucide-react';
import Button from '@/components/ui/button';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { VehicleRowActions } from './components/VehicleRowActions';
import { VehicleModal } from './components/VehicleModal';
import { getVehicleColumns } from './components/vehicleColumns';
import { useVehiclesAvailability } from './hooks/useVehiclesAvailability';
import { VehicleItem } from './types/vehicleAvailability.types';

export { type VehicleItem };

export default function VehiclesAvailability() {
    const {
        filteredVehicles,
        filterStatus,
        setFilterStatus,
        showModal,
        setShowModal,
        editingVehicle,
        totalCount,
        activeCount,
        inactiveCount,
        isLoading,
        handleSaveVehicle,
        handleDelete,
        openEdit,
        openNew,
    } = useVehiclesAvailability();

    const columns = useMemo(() => getVehicleColumns(), []);

    const tabs: { id: string; label: string; count: number }[] = [
        { id: 'All', label: 'All', count: totalCount },
        { id: 'Active', label: 'Active', count: activeCount },
        { id: 'Inactive', label: 'Inactive', count: inactiveCount },
    ];

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">


            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Vehicles
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Manage your vehicles and assign them to drivers.
                    </p>
                </div>

                <Button
                    onClick={openNew}
                    className="h-8 px-3.5 bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer rounded-[4px] self-start sm:self-auto transition-colors"
                >
                    <Plus size={15} strokeWidth={2.5} />
                    <span>Add Vehicle</span>
                </Button>
            </div>

            {/* Standard Project DataTable */}
            <DataTable
                data={filteredVehicles}
                columns={columns}
                actions={(vehicle: VehicleItem) => (
                    <VehicleRowActions
                        row={vehicle}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                )}
                actionsColumnClassName="w-[60px] min-w-[60px] text-right pr-3.5"
                headerTabs={
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
                        {tabs.map((tab) => {
                            const isActive = filterStatus === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setFilterStatus(tab.id)}
                                    className={`flex items-center gap-1 pb-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1.5 text-xs ${isActive
                                            ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold'
                                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                                        }`}
                                >
                                    <span>{tab.label}</span>
                                    <span>({tab.count})</span>
                                </button>
                            );
                        })}
                    </div>
                }
                searchPlaceholder="Search vehicle..."
                compact={true}
                hideViewToggle={true}
                tableLayout="fixed"
                tableClassName="min-w-[850px]"
                isLoading={isLoading}
                emptyState={
                    <EmptyState
                        icon={Truck}
                        title="No Vehicles Found"
                        description="Add your fleet vehicles to assign them to drivers and manage transport capacity."
                        actionLabel="Add Vehicle"
                        onAction={openNew}
                    />
                }
            />

            {/* Modal */}
            <VehicleModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                editingVehicle={editingVehicle}
                onSave={handleSaveVehicle}
            />
        </div>
    );
}
