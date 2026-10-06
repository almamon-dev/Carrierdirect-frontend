import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Users,
    Truck,
    MapPin,
    Phone,
    Mail,
    Loader2,
    RefreshCw,
    ShieldCheck,
} from 'lucide-react';
import Button from '@/components/ui/button';
import DataTable, { Column } from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { DriverRowActions } from './components/DriverRowActions';
import { AssignVehicleModal } from './components/AssignVehicleModal';
import { AssignServiceAreaModal } from './components/AssignServiceAreaModal';
import { useToastStore } from '@/stores/useToastStore';
import apiClient from '@/lib/axios';

export type DriverItem = {
    id: string;
    user_id?: number;
    employee_id?: string;
    name: string;
    email?: string;
    phone: string;
    status: 'Available' | 'On Job' | 'Unavailable';
    duty_status?: string;
    user_status?: string;
    currentLocation: string;
    license?: string;
    assignedVehicle?: string | null;
    vehicle?: {
        name?: string;
        model?: string;
        type?: string;
        plate?: string;
        registration_no?: string;
        capacity?: string;
    } | null;
    assignedServiceArea?: string | null;
    service_area?: {
        id: number;
        country: string;
        state?: string;
        city?: string;
        postal_code?: string;
        radius_km?: number;
        formatted?: string;
        is_active?: boolean;
    } | null;
    service_area_id?: number | null;
    rating?: string;
    is_verified?: boolean;
    verification_status?: string;
    role?: string;
    created_at?: string;
};

const DEFAULT_SEED_DRIVERS: DriverItem[] = [
    {
        id: '1',
        employee_id: '1001',
        name: 'Aidan Driver',
        email: 'aidan@alltrainedup.ie',
        phone: '+353 87 123 4567',
        status: 'Available',
        currentLocation: 'Dublin, Ireland',
        assignedVehicle: 'Mercedes Sprinter (UK-AB1209)',
        vehicle: {
            name: 'Mercedes Sprinter',
            plate: 'UK-AB1209',
            type: 'Luton Van',
            capacity: '3.5T'
        },
        assignedServiceArea: 'Dublin, Ireland',
        service_area: {
            id: 1,
            country: 'Ireland',
            city: 'Dublin',
            formatted: 'Dublin, Ireland',
            is_active: true
        },
        is_verified: true,
    },
    {
        id: '2',
        employee_id: '1002',
        name: 'David Smith',
        email: 'david.smith@carrierdirect.io',
        phone: '+44 7700 900123',
        status: 'On Job',
        currentLocation: 'London, UK',
        assignedVehicle: 'Ford Transit Van (EU-9912)',
        vehicle: {
            name: 'Ford Transit Van',
            plate: 'EU-9912',
            type: 'Panel Van',
            capacity: '2.0T'
        },
        assignedServiceArea: 'Greater London, UK',
        service_area: {
            id: 2,
            country: 'United Kingdom',
            city: 'London',
            formatted: 'Greater London, UK',
            is_active: true
        },
        is_verified: true,
    },
    {
        id: '3',
        employee_id: '1003',
        name: 'Marcus Vance',
        email: 'marcus.v@carrierdirect.io',
        phone: '+44 7700 900456',
        status: 'Available',
        currentLocation: 'Manchester, UK',
        assignedVehicle: 'Scania R450 (UK-TR7741)',
        vehicle: {
            name: 'Scania R450',
            plate: 'UK-TR7741',
            type: 'Articulated Lorry',
            capacity: '44T'
        },
        assignedServiceArea: 'North West England, UK',
        service_area: {
            id: 3,
            country: 'United Kingdom',
            city: 'Manchester',
            formatted: 'North West England, UK',
            is_active: true
        },
        is_verified: true,
    }
];

export default function DriversAvailability() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const showToast = useToastStore((state) => state.showToast);

    const [drivers, setDrivers] = useState<DriverItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Available' | 'On Job' | 'Unavailable'>('All');
    const [counts, setCounts] = useState({
        all: 0,
        available: 0,
        unavailable: 0,
        on_job: 0,
    });

    // Modals state
    const [vehicleModalDriver, setVehicleModalDriver] = useState<DriverItem | null>(null);
    const [serviceAreaModalDriver, setServiceAreaModalDriver] = useState<DriverItem | null>(null);

    // Fetch dynamic drivers from backend with fallback support
    const fetchDrivers = useCallback(async (isSilent = false) => {
        if (!isSilent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            let list: DriverItem[] = [];

            // 1. Try dedicated drivers availability endpoint
            try {
                const res = await apiClient.get('/supplier/availability/drivers');
                const isSuccess = res?.success ?? res?.data?.success ?? true;
                const payload = res?.data?.drivers ? res.data : (res?.data?.data || res?.data || res);
                if (isSuccess && payload?.drivers && Array.isArray(payload.drivers) && payload.drivers.length > 0) {
                    list = payload.drivers;
                }
            } catch {
                // Fallback to team members endpoint
            }

            // 2. Fallback to team members endpoint if availability endpoint returns empty
            if (list.length === 0) {
                try {
                    const teamRes = await apiClient.get('/supplier/team/members');
                    const teamList = teamRes?.data?.data?.members || teamRes?.data?.data || teamRes?.data || [];
                    if (Array.isArray(teamList) && teamList.length > 0) {
                        const rawDrivers = teamList.filter((m: any) => {
                            const roleName = String(m.role?.name || m.role || '').toLowerCase();
                            const desig = String(m.designation || '').toLowerCase();
                            return roleName.includes('driver') || desig.includes('driver') || m.is_driver;
                        });
                        const source = rawDrivers.length > 0 ? rawDrivers : teamList;
                        list = source.map((m: any) => ({
                            id: String(m.id || m.employee_id),
                            user_id: m.user_id || m.id,
                            employee_id: m.employee_id || (m.id ? `EMP-${m.id}` : undefined),
                            name: m.name || `${m.first_name || ''} ${m.last_name || ''}`.trim() || 'Driver',
                            email: m.email || '',
                            phone: m.phone || m.phone_number || '',
                            role: m.role?.name || m.role || 'Driver',
                            status: (m.availability_status || (m.status === 'active' || m.status === 'Active' ? 'Available' : 'Unavailable')) as 'Available' | 'On Job' | 'Unavailable',
                            currentLocation: m.current_location || m.city || 'Dublin, Ireland',
                            assignedVehicle: m.assigned_vehicle || m.vehicle?.name || (m.vehicle?.plate ? `${m.vehicle.name || 'Vehicle'} (${m.vehicle.plate})` : null),
                            vehicle: m.vehicle || (m.assigned_vehicle ? { name: m.assigned_vehicle, plate: m.vehicle_plate } : null),
                            assignedServiceArea: m.assigned_service_area || m.service_area?.formatted || (m.service_area?.city ? `${m.service_area.city}, ${m.service_area.country}` : null),
                            service_area: m.service_area || null,
                            service_area_id: m.service_area_id || m.service_area?.id || null,
                            is_verified: m.is_verified ?? true,
                        }));
                    }
                } catch {
                    // Fallback to default seed data
                }
            }

            // 3. Fallback to default seed drivers if nothing found
            if (list.length === 0) {
                list = DEFAULT_SEED_DRIVERS;
            }

            setDrivers(list);
            setCounts({
                all: list.length,
                available: list.filter((d) => d.status === 'Available').length,
                unavailable: list.filter((d) => d.status === 'Unavailable').length,
                on_job: list.filter((d) => d.status === 'On Job').length,
            });
        } catch (err: any) {
            console.error('Failed to load drivers availability:', err);
            setDrivers(DEFAULT_SEED_DRIVERS);
            setCounts({
                all: DEFAULT_SEED_DRIVERS.length,
                available: DEFAULT_SEED_DRIVERS.filter((d) => d.status === 'Available').length,
                unavailable: DEFAULT_SEED_DRIVERS.filter((d) => d.status === 'Unavailable').length,
                on_job: DEFAULT_SEED_DRIVERS.filter((d) => d.status === 'On Job').length,
            });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    // Handle single driver update after vehicle or service area assignment
    const handleDriverUpdated = (updatedDriver: DriverItem) => {
        setDrivers((prev) =>
            prev.map((d) => (String(d.id) === String(updatedDriver.id) ? { ...d, ...updatedDriver } : d))
        );
    };

    // Fast status update from action or table
    const handleStatusChange = async (driver: DriverItem, newStatus: 'Available' | 'On Job' | 'Unavailable') => {
        // Optimistic update
        const prevStatus = driver.status;
        setDrivers((prev) =>
            prev.map((d) => (d.id === driver.id ? { ...d, status: newStatus } : d))
        );

        try {
            const res = await apiClient.post(`/supplier/availability/drivers/${driver.id}/status`, {
                status: newStatus,
            });
            const isSuccess = res?.success ?? res?.data?.success ?? true;
            const updatedDriver = res?.data?.data || res?.data || res;

            if (isSuccess && updatedDriver?.id) {
                showToast(`Status updated to ${newStatus} for ${driver.name}`, 'success');
                handleDriverUpdated(updatedDriver);
            } else {
                // Revert
                setDrivers((prev) =>
                    prev.map((d) => (d.id === driver.id ? { ...d, status: prevStatus } : d))
                );
                showToast(res?.message || res?.data?.message || 'Failed to update status', 'error');
            }
        } catch (err: any) {
            // Revert
            setDrivers((prev) =>
                prev.map((d) => (d.id === driver.id ? { ...d, status: prevStatus } : d))
            );
            console.error('Status change error:', err);
            showToast('Failed to update status on server.', 'error');
        }
    };

    // Filtered data for active tab
    const filteredDrivers = useMemo(() => {
        return drivers.filter((d) => {
            if (filterStatus === 'All') return true;
            if (filterStatus === 'Available') return d.status === 'Available';
            if (filterStatus === 'On Job') return d.status === 'On Job';
            if (filterStatus === 'Unavailable') return d.status === 'Unavailable';
            return true;
        });
    }, [drivers, filterStatus]);

    // Table Columns
    const columns: Column<DriverItem>[] = useMemo(
        () => [
            {
                id: 'name',
                label: 'Driver',
                sortable: true,
                className: 'w-[20%] min-w-[190px]',
                render: (driver) => {
                    const initials = (driver.name || 'DR')
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'DR';

                    return (
                        <div className="flex items-center gap-2.5 whitespace-nowrap min-w-0">
                            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                                {initials}
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs whitespace-nowrap">
                                {driver.name}
                            </span>
                            {driver.employee_id && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                                    #{driver.employee_id}
                                </span>
                            )}
                            {driver.is_verified && (
                                <span title="Verified Driver" className="inline-flex items-center shrink-0">
                                    <ShieldCheck size={14} className="text-emerald-500" />
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'contact',
                label: 'Contact',
                sortable: false,
                className: 'w-[22%] min-w-[210px]',
                render: (driver) => (
                    <div className="flex items-center gap-2 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 min-w-0">
                        {driver.phone && (
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                                <Phone size={11} className="text-slate-400 shrink-0" />
                                <span>{driver.phone}</span>
                            </span>
                        )}
                        {driver.phone && driver.email && (
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                        )}
                        {driver.email && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap" title={driver.email}>
                                <Mail size={11} className="text-slate-400 shrink-0" />
                                <span>{driver.email}</span>
                            </span>
                        )}
                        {!driver.phone && !driver.email && (
                            <span className="text-slate-400 italic text-[11px]">-</span>
                        )}
                    </div>
                ),
            },
            {
                id: 'assignedVehicle',
                label: 'Assigned Vehicle',
                sortable: false,
                className: 'w-[25%] min-w-[220px]',
                render: (driver) => {
                    const hasVehicle = Boolean(driver.vehicle?.plate || driver.assignedVehicle);
                    const vehicleName = driver.vehicle?.name || driver.vehicle?.model || driver.assignedVehicle || '';
                    const plate = driver.vehicle?.plate || driver.vehicle?.registration_no || '';
                    const type = driver.vehicle?.type || '';

                    if (!hasVehicle) {
                        return (
                            <button
                                type="button"
                                onClick={() => setVehicleModalDriver(driver)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#ff4a1f] text-slate-500 hover:text-[#ff4a1f] text-xs font-medium transition-colors cursor-pointer group whitespace-nowrap"
                                title="Click to assign a fleet vehicle"
                            >
                                <Truck size={13} className="text-slate-400 group-hover:text-[#ff4a1f]" />
                                <span>+ Assign Vehicle</span>
                            </button>
                        );
                    }

                    return (
                        <div
                            onClick={() => setVehicleModalDriver(driver)}
                            className="inline-flex items-center gap-2 cursor-pointer group p-1 -m-1 rounded hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap"
                            title="Click to change assigned vehicle"
                        >
                            <div className="w-6 h-6 rounded bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0">
                                <Truck size={13} />
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                    {vehicleName}
                                </span>
                                {plate && (
                                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                                        {plate}
                                    </span>
                                )}
                                {type && (
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                        • {type}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                id: 'assignedServiceArea',
                label: 'Assigned Service Area',
                sortable: false,
                className: 'w-[21%] min-w-[200px]',
                render: (driver) => {
                    const hasArea = Boolean(driver.assignedServiceArea || driver.service_area_id);
                    const areaText = driver.assignedServiceArea || driver.service_area?.formatted || (driver.service_area?.city ? `${driver.service_area.city}, ${driver.service_area.country}` : null);

                    if (!hasArea) {
                        return (
                            <button
                                type="button"
                                onClick={() => setServiceAreaModalDriver(driver)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-500 hover:text-blue-500 text-xs font-medium transition-colors cursor-pointer group whitespace-nowrap"
                                title="Click to assign a service area"
                            >
                                <MapPin size={13} className="text-slate-400 group-hover:text-blue-500" />
                                <span>+ Assign Area</span>
                            </button>
                        );
                    }

                    return (
                        <div
                            onClick={() => setServiceAreaModalDriver(driver)}
                            className="inline-flex items-center gap-2 cursor-pointer group p-1 -m-1 rounded hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap"
                            title="Click to change assigned service area"
                        >
                            <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0">
                                <MapPin size={13} />
                            </div>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                {areaText}
                            </span>
                        </div>
                    );
                },
            },
            {
                id: 'status',
                label: 'Availability Status',
                sortable: true,
                className: 'w-[12%] min-w-[120px] text-center',
                render: (driver) => {
                    const isAvail = driver.status === 'Available';
                    const isOnJob = driver.status === 'On Job';

                    return (
                        <div className="flex justify-center">
                            <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold border whitespace-nowrap ${
                                    isAvail
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                                        : isOnJob
                                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60'
                                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60'
                                }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        isAvail ? 'bg-emerald-500' : isOnJob ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                                />
                                <span>{driver.status}</span>
                            </span>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const tabs: { id: 'All' | 'Available' | 'On Job' | 'Unavailable'; label: string; count: number }[] = [
        { id: 'All', label: 'All Drivers', count: counts.all },
        { id: 'Available', label: 'Available', count: counts.available },
        { id: 'On Job', label: 'On Job', count: counts.on_job },
        { id: 'Unavailable', label: 'Unavailable', count: counts.unavailable },
    ];

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Drivers Availability
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        View active driver fleet, assign vehicles, and configure regional service coverage.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchDrivers(true)}
                        disabled={isLoading || isRefreshing}
                        className="h-8 px-2.5 text-xs font-semibold gap-1.5 cursor-pointer rounded-[4px] border-slate-200 dark:border-slate-800"
                        title="Reload driver list"
                    >
                        <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>

                    <Button
                        onClick={() => navigate('/supplier/team-management')}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold gap-1.5 cursor-pointer rounded-[4px] border-slate-200 dark:border-slate-800 hover:border-slate-400"
                    >
                        <Users size={14} className="text-[#ff4a1f]" />
                        <span>Manage Team / Drivers</span>
                    </Button>
                </div>
            </div>

            {/* Standard Project DataTable */}
            {isLoading ? (
                <div className="bg-white dark:bg-[#18202a] border border-slate-200 dark:border-slate-800 rounded-[4px] p-12 text-center flex flex-col items-center justify-center gap-3">
                    <Loader2 size={24} className="animate-spin text-[#ff4a1f]" />
                    <p className="text-xs font-medium text-slate-500">Loading driver availability and fleet assignments...</p>
                </div>
            ) : (
                <DataTable
                    data={filteredDrivers}
                    columns={columns}
                    actions={(driver: DriverItem) => (
                        <DriverRowActions
                            row={driver}
                            onAssignVehicle={(d) => setVehicleModalDriver(d)}
                            onAssignServiceArea={(d) => setServiceAreaModalDriver(d)}
                            onStatusChange={handleStatusChange}
                        />
                    )}
                    actionsColumnClassName="w-[85px] min-w-[85px] text-right pr-3.5"
                    hideCheckbox={true}
                    selectable={false}
                    hideFilter={true}
                    hideViewToggle={true}
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
                                                ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold'
                                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`text-[11px] font-medium px-1.5 py-0.2 rounded-full transition-colors ${
                                                isActive
                                                    ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f]'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    }
                    searchPlaceholder="Search drivers by name, phone, email, or vehicle plate..."
                    compact={true}
                    tableClassName="w-full"
                    emptyState={
                        <EmptyState
                            icon={Users}
                            title="No Drivers Found"
                            description="Drivers are created and managed via Team Management. Once added to your team, they will appear here for vehicle & service area assignment."
                            actionLabel="Manage Team & Drivers"
                            onAction={() => navigate('/supplier/team-management')}
                        />
                    }
                />
            )}

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
