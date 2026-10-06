import React, { useState, useMemo } from 'react';
import { Plus, Truck } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Modal from '@/components/modals/modal';
import DataTable, { Column } from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { VehicleRowActions } from './components/VehicleRowActions';
import { useToastStore } from '@/stores/useToastStore';

export type VehicleItem = {
    id: string;
    name: string;
    type: string;
    registrationNo: string;
    capacity: string;
    status: 'Available' | 'On Job' | 'Unavailable';
    assignedDriver?: string;
};

const INITIAL_VEHICLES: VehicleItem[] = [
    {
        id: '1',
        name: 'Mercedes Sprinter',
        type: 'Van',
        registrationNo: 'UK-AB12CD',
        capacity: '1,200 kg',
        status: 'Available',
        assignedDriver: 'John Smith'
    },
    {
        id: '2',
        name: 'Volvo FH16',
        type: 'Truck',
        registrationNo: 'FR-XY342T',
        capacity: '24,000 kg',
        status: 'On Job',
        assignedDriver: 'Michael Brown'
    },
    {
        id: '3',
        name: 'Renault Master',
        type: 'Van',
        registrationNo: 'DE-RT56YU',
        capacity: '1,500 kg',
        status: 'Available',
        assignedDriver: 'Robert Wilson'
    },
    {
        id: '4',
        name: 'Scania R450',
        type: 'Truck',
        registrationNo: 'BE-KL78MN',
        capacity: '20,000 kg',
        status: 'Available',
        assignedDriver: 'David Miller'
    },
    {
        id: '5',
        name: 'Iveco Daily',
        type: 'Van',
        registrationNo: 'NL-PQ90RS',
        capacity: '1,000 kg',
        status: 'Unavailable',
        assignedDriver: 'James Taylor'
    },
    {
        id: '6',
        name: 'MAN TGX',
        type: 'Truck',
        registrationNo: 'DE-KL456M',
        capacity: '18,000 kg',
        status: 'Available',
        assignedDriver: 'Lukas Weber'
    }
];

export default function VehiclesAvailability() {
    const showToast = useToastStore((state) => state.showToast);
    const [vehicles, setVehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Available' | 'Unavailable'>('All');
    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);

    // Form inputs
    const [name, setName] = useState('');
    const [type, setType] = useState('Van');
    const [isCustomType, setIsCustomType] = useState(false);
    const [customType, setCustomType] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');
    const [capacity, setCapacity] = useState('');
    const [status, setStatus] = useState<'Available' | 'On Job' | 'Unavailable'>('Available');

    const totalCount = vehicles.length;
    const availableCount = vehicles.filter(v => v.status === 'Available').length;
    const unavailableCount = vehicles.filter(v => v.status === 'Unavailable' || v.status === 'On Job').length;

    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v => {
            if (filterStatus === 'All') return true;
            if (filterStatus === 'Available') return v.status === 'Available';
            if (filterStatus === 'Unavailable') return v.status === 'Unavailable' || v.status === 'On Job';
            return true;
        });
    }, [vehicles, filterStatus]);

    const handleSaveVehicle = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedReg = registrationNo.trim();
        const effectiveType = (isCustomType ? customType : type).trim();

        if (!trimmedName || !trimmedReg) {
            showToast('Please provide both vehicle name and registration plate.', 'error');
            return;
        }

        if (!effectiveType) {
            showToast('Please specify a vehicle type.', 'error');
            return;
        }

        const formattedCapacity = capacity.trim()
            ? (capacity.toLowerCase().includes('kg') ? capacity.trim() : `${capacity.trim()} kg`)
            : '1,200 kg';

        if (editingVehicle) {
            setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? {
                ...v,
                name: trimmedName,
                type: effectiveType,
                registrationNo: trimmedReg,
                capacity: formattedCapacity,
                status
            } : v));
            showToast(`Vehicle "${trimmedName}" updated successfully!`, 'success');
            setEditingVehicle(null);
        } else {
            const newVehicle: VehicleItem = {
                id: String(Date.now()),
                name: trimmedName,
                type: effectiveType,
                registrationNo: trimmedReg,
                capacity: formattedCapacity,
                status,
                assignedDriver: 'Unassigned'
            };
            setVehicles([newVehicle, ...vehicles]);
            showToast(`Vehicle "${trimmedName}" added to fleet successfully!`, 'success');
        }
        setShowModal(false);
        setName('');
        setRegistrationNo('');
        setCapacity('');
        setIsCustomType(false);
        setCustomType('');
    };

    const handleDelete = (id: string) => {
        const vehicle = vehicles.find(v => v.id === id);
        if (window.confirm(`Are you sure you want to remove ${vehicle?.name || 'this vehicle'}?`)) {
            setVehicles(prev => prev.filter(v => v.id !== id));
            showToast(`Vehicle "${vehicle?.name || id}" removed successfully.`, 'success');
        }
    };

    const openEdit = (vehicle: VehicleItem) => {
        setEditingVehicle(vehicle);
        setName(vehicle.name);
        const standardTypes = ['Van', 'Truck', 'Trailer', 'Box Truck', 'Flatbed Truck', 'Refrigerated Truck'];
        if (standardTypes.includes(vehicle.type)) {
            setType(vehicle.type);
            setIsCustomType(false);
            setCustomType('');
        } else {
            setType(vehicle.type);
            setIsCustomType(true);
            setCustomType(vehicle.type);
        }
        setRegistrationNo(vehicle.registrationNo);
        setCapacity(vehicle.capacity);
        setStatus(vehicle.status);
        setShowModal(true);
    };

    const openNew = () => {
        setEditingVehicle(null);
        setName('');
        setType('Van');
        setIsCustomType(false);
        setCustomType('');
        setRegistrationNo('');
        setCapacity('');
        setStatus('Available');
        setShowModal(true);
    };

    const columns: Column<VehicleItem>[] = useMemo(() => [
        {
            id: 'name',
            label: 'Vehicle',
            sortable: true,
            render: (vehicle) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-700/80">
                        <Truck size={16} className="text-[#ff4a1f]" />
                    </div>
                    <div>
                        <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                            {vehicle.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {vehicle.assignedDriver ? `Driver: ${vehicle.assignedDriver}` : 'Unassigned'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'type',
            label: 'Type',
            render: (vehicle) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                    {vehicle.type}
                </span>
            )
        },
        {
            id: 'registrationNo',
            label: 'Registration No.',
            render: (vehicle) => (
                <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60">
                    {vehicle.registrationNo}
                </span>
            )
        },
        {
            id: 'capacity',
            label: 'Capacity',
            render: (vehicle) => (
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {vehicle.capacity}
                </span>
            )
        },
        {
            id: 'status',
            label: 'Status',
            className: 'text-center',
            render: (vehicle) => {
                const isAvail = vehicle.status === 'Available';
                const isOnJob = vehicle.status === 'On Job';
                return (
                    <div className="flex justify-center">
                        <span className={`px-2.5 py-0.5 rounded-[4px] text-[11px] font-semibold border ${
                            isAvail
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                                : isOnJob
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60'
                        }`}>
                            {vehicle.status}
                        </span>
                    </div>
                );
            }
        }
    ], []);

    const tabs: { id: 'All' | 'Available' | 'Unavailable'; label: string; count: number }[] = [
        { id: 'All', label: 'All', count: totalCount },
        { id: 'Available', label: 'Available', count: availableCount },
        { id: 'Unavailable', label: 'Unavailable', count: unavailableCount },
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
                        Manage your fleet vehicles and their availability.
                    </p>
                </div>

                <Button
                    onClick={openNew}
                    className="h-8 px-3.5 bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer rounded-[4px] self-start sm:self-auto transition-colors"
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
                actionsColumnClassName="w-[50px] min-w-[50px] text-right pr-3.5"
                headerTabs={
                    <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto hide-scrollbar mb-[-1px]">
                        {tabs.map((tab) => {
                            const isActive = filterStatus === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setFilterStatus(tab.id)}
                                    className={`flex items-center gap-1.5 pb-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 text-xs ${
                                        isActive
                                            ? "border-[#ff4a1f] text-[#ff4a1f] font-bold"
                                            : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium"
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`text-[11px] font-medium px-1.5 py-0.2 rounded-full transition-colors ${
                                            isActive
                                                ? "bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f]"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                }
                searchPlaceholder="Search vehicles by model, type, or registration..."
                compact={true}
                hideViewToggle={true}
                tableClassName="w-full"
                emptyState={
                    <EmptyState
                        icon={Truck}
                        title="No Vehicles Found"
                        description="No vehicles found matching your filter. Click 'Add Vehicle' to register new fleet vehicles."
                    />
                }
            />

            {/* Add / Edit Vehicle Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingVehicle(null);
                }}
                title={editingVehicle ? 'Edit Fleet Vehicle' : 'Add New Vehicle'}
                description={
                    editingVehicle
                        ? 'Update vehicle model, type, registration plate and operational availability status.'
                        : 'Register a new fleet vehicle to dispatch with drivers across your coverage areas.'
                }
                size="md"
            >
                <form onSubmit={handleSaveVehicle} className="space-y-4 pt-1">
                    <Input
                        label="Vehicle Model / Name *"
                        type="text"
                        required
                        placeholder="e.g. Mercedes Sprinter, Volvo FH16"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        icon={<Truck size={14} />}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 block">
                                    Vehicle Type <span className="text-red-500 font-bold ml-0.5">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isCustomType) {
                                            setIsCustomType(false);
                                            setType('Van');
                                        } else {
                                            setIsCustomType(true);
                                            setCustomType(type && !['Van', 'Truck', 'Trailer', 'Box Truck', 'Flatbed Truck', 'Refrigerated Truck'].includes(type) ? type : '');
                                        }
                                    }}
                                    className="text-[11px] text-[#ff4a1f] hover:underline font-semibold cursor-pointer"
                                >
                                    {isCustomType ? 'From list' : '+ Custom'}
                                </button>
                            </div>
                            {isCustomType ? (
                                <Input
                                    type="text"
                                    required
                                    placeholder="e.g. Tipper, Tanker, Luton Van"
                                    value={customType}
                                    onChange={(e) => {
                                        setCustomType(e.target.value);
                                        setType(e.target.value);
                                    }}
                                    className="text-xs h-9 rounded-[4px]"
                                    autoFocus
                                />
                            ) : (
                                <Select
                                    value={type}
                                    onChange={(val: any) => {
                                        const v = val?.target?.value !== undefined ? val.target.value : val;
                                        if (v === '__custom__') {
                                            setIsCustomType(true);
                                            setCustomType('');
                                        } else {
                                            setType(v);
                                        }
                                    }}
                                    options={[
                                        { id: 'Van', name: 'Van' },
                                        { id: 'Truck', name: 'Truck' },
                                        { id: 'Trailer', name: 'Trailer' },
                                        { id: 'Box Truck', name: 'Box Truck' },
                                        { id: 'Flatbed Truck', name: 'Flatbed Truck' },
                                        { id: 'Refrigerated Truck', name: 'Refrigerated Truck' },
                                        { id: '__custom__', name: '+ Custom / Other...' },
                                    ]}
                                    placeholder="Select vehicle type..."
                                />
                            )}
                        </div>

                        <div>
                            <Input
                                label="Registration / Plate *"
                                type="text"
                                required
                                placeholder="e.g. UK-AB12CD"
                                value={registrationNo}
                                onChange={(e) => setRegistrationNo(e.target.value.toUpperCase())}
                                className="font-mono uppercase tracking-wider"
                            />
                        </div>
                    </div>

                    <Input
                        label="Payload Capacity"
                        type="text"
                        placeholder="e.g. 1,200 kg or 24,000 kg"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                    />

                    <div>
                        <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Availability Status <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <Select
                            value={status}
                            onChange={(val: any) => {
                                const v = val?.target?.value !== undefined ? val.target.value : val;
                                setStatus(v);
                            }}
                            options={[
                                { id: 'Available', name: 'Available' },
                                { id: 'On Job', name: 'On Job' },
                                { id: 'Unavailable', name: 'Unavailable' },
                            ]}
                            placeholder="Select status..."
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setShowModal(false);
                                setEditingVehicle(null);
                            }}
                            className="text-xs rounded-[4px] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            className="text-xs bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-bold rounded-[4px] cursor-pointer shadow-xs"
                        >
                            {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
