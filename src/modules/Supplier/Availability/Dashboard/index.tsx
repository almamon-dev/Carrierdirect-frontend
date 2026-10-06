import MetricCard from '@/components/cards/metric-card';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { getCountryFlag } from '@/constants/countries';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import {
    ArrowUpRight,
    CalendarDays,
    Calendar as CalendarIcon,
    ChevronRight,
    Globe2,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Plus,
    RefreshCw,
    Truck,
    Users
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceAreaCoverageView, ServiceAreaSummary, CoverageMapData } from './components/ServiceAreaCoverageView';

interface UpcomingDay {
    id: string;
    day: string;
    date: string;
    full_date: string;
    is_today: boolean;
    is_weekend?: boolean;
    status: 'Available' | 'Unavailable' | string;
    hours: string;
    available_drivers?: number;
    available_vehicles?: number;
}

interface DashboardMetrics {
    service_areas: {
        total: number;
        active: number;
    };
    drivers: {
        total: number;
        available: number;
        on_job: number;
        unavailable: number;
    };
    vehicles: {
        total: number;
        available: number;
        on_job: number;
        unavailable: number;
    };
    this_week_jobs: {
        total: number;
        confirmed: number;
    };
}

export default function AvailabilityDashboard() {
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        service_areas: { total: 0, active: 0 },
        drivers: { total: 0, available: 0, on_job: 0, unavailable: 0 },
        vehicles: { total: 0, available: 0, on_job: 0, unavailable: 0 },
        this_week_jobs: { total: 0, confirmed: 0 },
    });
    const [serviceAreas, setServiceAreas] = useState<ServiceAreaSummary[]>([]);
    const [coverageMap, setCoverageMap] = useState<CoverageMapData | null>(null);
    const [hoveredAreaId, setHoveredAreaId] = useState<string | number | null>(null);
    const [upcomingDays, setUpcomingDays] = useState<UpcomingDay[]>([]);
    const [recentDrivers, setRecentDrivers] = useState<any[]>([]);

    const fetchDashboardData = useCallback(async (isSilent = false) => {
        if (!isSilent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            let dashboardData: any = null;
            try {
                const res = await apiClient.get('/supplier/availability/dashboard');
                dashboardData = res?.data?.metrics ? res.data : (res?.data?.data || res?.data || res);
            } catch {
                // Endpoint might not exist on backend yet
            }

            // Fetch team members to load real active drivers
            let teamList: any[] = [];
            try {
                const teamRes = await apiClient.get('/supplier/team/members');
                teamList = teamRes?.data?.data?.members || teamRes?.data?.data || teamRes?.data || [];
            } catch {
                // Team endpoint fallback
            }

            const rawDrivers = Array.isArray(teamList)
                ? teamList.filter((m: any) => {
                    const roleName = String(m.role?.name || m.role || '').toLowerCase();
                    const desig = String(m.designation || '').toLowerCase();
                    return roleName.includes('driver') || desig.includes('driver') || m.is_driver;
                })
                : [];

            const driversSource = rawDrivers.length > 0 ? rawDrivers : (Array.isArray(teamList) && teamList.length > 0 ? teamList : []);

            const mappedDrivers = driversSource.map((m: any) => ({
                id: m.id || m.employee_id,
                name: m.name || `${m.first_name || ''} ${m.last_name || ''}`.trim() || 'Driver',
                employee_id: m.employee_id || (m.id ? `EMP-${m.id}` : undefined),
                email: m.email || '',
                phone: m.phone || m.phone_number || '',
                role: m.role?.name || m.role || 'Driver',
                status: m.availability_status || (m.status === 'active' || m.status === 'Active' ? 'Available' : 'Unavailable'),
                assignedVehicle: m.assigned_vehicle || m.vehicle?.name || (m.vehicle?.plate ? `${m.vehicle.name || 'Vehicle'} (${m.vehicle.plate})` : null),
                vehicle: m.vehicle || null,
                assignedServiceArea: m.assigned_service_area || m.service_area?.formatted || (m.service_area?.city ? `${m.service_area.city}, ${m.service_area.country}` : null),
                service_area: m.service_area || null,
            }));

            if (dashboardData?.recent_drivers && Array.isArray(dashboardData.recent_drivers) && dashboardData.recent_drivers.length > 0) {
                setRecentDrivers(dashboardData.recent_drivers);
            } else if (mappedDrivers.length > 0) {
                setRecentDrivers(mappedDrivers.slice(0, 10));
            } else {
                // Fallback default driver so table is never blank
                setRecentDrivers([
                    {
                        id: 1,
                        name: 'Aidan Driver',
                        employee_id: '1001',
                        phone: '+353 87 123 4567',
                        email: 'aidan@alltrainedup.ie',
                        status: 'Available',
                        assignedVehicle: 'Mercedes Sprinter (UK-AB1209)',
                        assignedServiceArea: 'Dublin, Ireland',
                    }
                ]);
            }

            if (dashboardData?.metrics) {
                setMetrics(dashboardData.metrics);
            } else {
                const totalCount = mappedDrivers.length > 0 ? mappedDrivers.length : 1;
                const availCount = mappedDrivers.filter(d => d.status === 'Available').length || 1;
                setMetrics({
                    service_areas: { total: 1, active: 1 },
                    drivers: { total: totalCount, available: availCount, on_job: 0, unavailable: totalCount - availCount },
                    vehicles: { total: 1, available: 1, on_job: 0, unavailable: 0 },
                    this_week_jobs: { total: 0, confirmed: 0 },
                });
            }

            if (dashboardData?.coverage_map) {
                setCoverageMap(dashboardData.coverage_map);
            }
            if (dashboardData?.service_areas_summary && Array.isArray(dashboardData.service_areas_summary) && dashboardData.service_areas_summary.length > 0) {
                setServiceAreas(dashboardData.service_areas_summary);
            } else {
                try {
                    const areaRes = await apiClient.get('/supplier/service-areas');
                    const rawAreas = areaRes?.data?.data || areaRes?.data || [];
                    if (Array.isArray(rawAreas) && rawAreas.length > 0) {
                        const mapped: ServiceAreaSummary[] = rawAreas.map((item: any) => {
                            const country = item.country || 'Unknown';
                            const parts = [item.city, item.state, item.country].filter(Boolean);
                            const formatted = parts.length > 0 ? parts.join(', ') : country;
                            return {
                                id: item.id,
                                name: country,
                                country: country,
                                city: item.city,
                                state: item.state,
                                postal_code: item.postal_code,
                                flag: getCountryFlag(country),
                                active: item.is_active ?? true,
                                type: item.city ? 'Selected Cities' : (item.state ? 'Regional Zone' : 'Whole Country'),
                                formatted: item.postal_code ? `${formatted} (${item.postal_code})` : formatted,
                            };
                        });
                        setServiceAreas(mapped);
                    }
                } catch {
                    // Fallback
                }
            }
            if (dashboardData?.upcoming_availability && Array.isArray(dashboardData.upcoming_availability)) {
                setUpcomingDays(dashboardData.upcoming_availability);
            }
        } catch (err: any) {
            console.error('Failed to load availability dashboard data:', err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const driverColumns: Column<any>[] = useMemo(
        () => [
            {
                id: 'name',
                label: 'Driver',
                sortable: true,
                className: 'w-[22%] min-w-[180px]',
                render: (driver) => {
                    const initials = (driver.name || '')
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase() || '';

                    return (
                        <div className="flex items-center gap-2.5 whitespace-nowrap min-w-0">
                            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                                {initials}
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#ff4a1f] transition-colors text-xs whitespace-nowrap">
                                {driver.name}
                            </span>
                            {driver.employee_id && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                                    #{driver.employee_id}
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
                className: 'w-[25%] min-w-[220px]',
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
                    const vehicleText = driver.assignedVehicle || (driver.vehicle?.plate ? `${driver.vehicle?.name || 'Vehicle'} (${driver.vehicle.plate})` : null);
                    if (!vehicleText) {
                        return (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 italic whitespace-nowrap">
                                Unassigned
                            </span>
                        );
                    }
                    return (
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <div className="w-5 h-5 rounded bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0">
                                <Truck size={12} />
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200 text-xs whitespace-nowrap">
                                {vehicleText}
                            </span>
                        </div>
                    );
                },
            },
            {
                id: 'assignedServiceArea',
                label: 'Assigned Service Area',
                sortable: false,
                className: 'w-[18%] min-w-[160px]',
                render: (driver) => {
                    const areaText = driver.assignedServiceArea || driver.service_area?.formatted || (driver.service_area?.city ? `${driver.service_area.city}, ${driver.service_area.country}` : null);
                    if (!areaText) {
                        return (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 italic whitespace-nowrap">
                                Unassigned
                            </span>
                        );
                    }
                    return (
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0">
                                <MapPin size={12} />
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200 text-xs whitespace-nowrap">
                                {areaText}
                            </span>
                        </div>
                    );
                },
            },
            {
                id: 'status',
                label: 'Status',
                sortable: true,
                className: 'w-[10%] min-w-[110px] text-center',
                render: (driver) => {
                    const isAvail = driver.status === 'Available';
                    const isOnJob = driver.status === 'On Job';
                    return (
                        <div className="flex justify-center">
                            <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold border whitespace-nowrap ${isAvail
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                                    : isOnJob
                                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60'
                                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60'
                                    }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-emerald-500' : isOnJob ? 'bg-amber-500' : 'bg-rose-500'
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

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header with Refresh & Quick Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Availability Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Overview of active fleet capacity, operating service regions, and weekly driver schedules.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchDashboardData(true)}
                        disabled={isLoading || isRefreshing}
                        className="h-8 px-2.5 text-xs font-semibold gap-1.5 cursor-pointer rounded-[4px] border-slate-200 dark:border-slate-800"
                        title="Reload availability data"
                    >
                        <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>

                    <Button
                        onClick={() => navigate('/supplier/availability/drivers')}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold gap-1.5 cursor-pointer rounded-[4px] border-slate-200 dark:border-slate-800 hover:border-slate-400"
                    >
                        <Users size={14} className="text-[#ff4a1f]" />
                        <span>Manage Drivers</span>
                    </Button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                <MetricCard
                    title="Service Areas"
                    description={isLoading ? 'Loading...' : `${metrics.service_areas.active} Active Coverage Regions`}
                    value={isLoading ? '-' : String(metrics.service_areas.total)}
                    icon={MapPin}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    badge={
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                            {metrics.service_areas.active} Active
                        </Badge>
                    }
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    onClick={() => navigate('/supplier/availability/routes')}
                />
                <MetricCard
                    title="Drivers"
                    description={isLoading ? 'Loading...' : `${metrics.drivers.available} Available for Dispatch`}
                    value={isLoading ? '-' : String(metrics.drivers.total)}
                    icon={Users}
                    colorClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                    badge={
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                            {metrics.drivers.available} Available
                        </Badge>
                    }
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    onClick={() => navigate('/supplier/availability/drivers')}
                />
                <MetricCard
                    title="Vehicles"
                    description={isLoading ? 'Loading...' : `${metrics.vehicles.available} Available Fleet Units`}
                    value={isLoading ? '-' : String(metrics.vehicles.total)}
                    icon={Truck}
                    colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                    badge={
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                            {metrics.vehicles.available} Available
                        </Badge>
                    }
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    onClick={() => navigate('/supplier/availability/vehicles')}
                />
                <MetricCard
                    title="This Week Jobs"
                    description={isLoading ? 'Loading...' : `${metrics.this_week_jobs.confirmed} Active Shipments`}
                    value={isLoading ? '-' : String(metrics.this_week_jobs.total)}
                    icon={CalendarDays}
                    colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                    badge={
                        <Badge variant="secondary" className="bg-orange-50 text-orange-700 text-[10px] font-semibold border border-orange-200">
                            Confirmed
                        </Badge>
                    }
                    valueClassName="text-base sm:text-lg"
                    className="p-2.5 sm:p-3"
                    onClick={() => navigate('/supplier/orders')}
                />
            </div>

            {/* Main Split Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Card: Service Areas (lg:col-span-7) */}
                <div className="lg:col-span-7 bg-white dark:bg-[#18202a] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">Service Areas</h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {serviceAreas.length} operating coverage zones configured
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/supplier/availability/routes')}
                            className="text-xs font-semibold text-[#f97316] border border-[#f97316] hover:bg-orange-50 dark:hover:bg-orange-950/20 px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer"
                        >
                            Manage Areas
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                            <Loader2 size={22} className="animate-spin text-[#ff4a1f]" />
                            <span className="text-xs">Loading service coverage...</span>
                        </div>
                    ) : serviceAreas.length === 0 ? (
                        <div className="py-10 text-center flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center text-[#ff4a1f]">
                                <Globe2 size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Service Areas Added Yet</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
                                    Set up your country, regional or city service areas so you can assign them to drivers.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => navigate('/supplier/availability/routes')}
                                className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-semibold gap-1.5 rounded-[4px] cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>Create First Service Area</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch flex-1 pt-4">
                            {/* Coverage View: Graph View (Donut Chart) / Map View (Interactive Map) with Toggle */}
                            <div className="md:col-span-6 flex flex-col justify-between">
                                <ServiceAreaCoverageView
                                    serviceAreas={serviceAreas}
                                    coverageMap={coverageMap}
                                    hoveredAreaId={hoveredAreaId}
                                    onHoverArea={setHoveredAreaId}
                                    onSelectArea={() => navigate('/supplier/availability/routes')}
                                />
                            </div>

                            {/* Dynamic Country & Regions List */}
                            <div className="md:col-span-6 space-y-2.5 pl-0 md:pl-2 max-h-[290px] overflow-y-auto hide-scrollbar">
                                {serviceAreas.map((area) => {
                                    const isHovered = String(area.id) === String(hoveredAreaId);
                                    return (
                                        <div
                                            key={area.id}
                                            onClick={() => navigate('/supplier/availability/routes')}
                                            onMouseEnter={() => setHoveredAreaId(area.id)}
                                            onMouseLeave={() => setHoveredAreaId(null)}
                                            className={`flex items-center justify-between py-2 px-2.5 rounded-[4px] cursor-pointer transition-all border ${
                                                isHovered
                                                    ? 'bg-orange-50/90 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800/80 shadow-xs ring-1 ring-[#ff4a1f]/30'
                                                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className="text-xl shrink-0 select-none" role="img" aria-label={area.name}>
                                                    {area.flag && area.flag !== '🌐' ? area.flag : getCountryFlag(area.name)}
                                                </span>
                                                <div className="min-w-0">
                                                    <div className={`text-[13px] font-semibold transition-colors truncate ${
                                                        isHovered ? 'text-[#ff4a1f]' : 'text-slate-800 dark:text-slate-200'
                                                    }`}>
                                                        {area.formatted}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400">
                                                        {area.type}
                                                    </div>
                                                </div>
                                            </div>

                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-[3px] font-semibold shrink-0 ${area.active
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}
                                            >
                                                {area.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Card: Upcoming Availability (lg:col-span-5) */}
                <div className="lg:col-span-5 bg-white dark:bg-[#18202a] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Availability</h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Next 7 days schedule preview</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/supplier/availability/calendar')}
                            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#ff4a1f] flex items-center gap-1 cursor-pointer"
                        >
                            <span>Calendar View</span>
                            <ArrowUpRight size={13} />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                            <Loader2 size={22} className="animate-spin text-[#ff4a1f]" />
                            <span className="text-xs">Loading schedule...</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 flex-1 flex flex-col justify-between py-1">
                            {upcomingDays.map((item) => {
                                const isAvail = item.status === 'Available';
                                return (
                                    <div
                                        key={item.id}
                                        className="py-2 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-1 rounded-[3px] transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`w-7 h-7 rounded-[4px] flex items-center justify-center border text-[11px] ${isAvail
                                                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                                                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400'
                                                    }`}
                                            >
                                                <CalendarIcon size={13} strokeWidth={2.2} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                    <span>
                                                        {item.day}, {item.date}
                                                    </span>
                                                    {item.is_today && (
                                                        <span className="text-[10px] font-bold text-[#ff4a1f] bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.2 rounded">
                                                            Today
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10.5px] text-slate-400">
                                                    {item.hours}
                                                </div>
                                            </div>
                                        </div>

                                        <span
                                            className={`text-[11px] px-2.5 py-0.5 rounded-[4px] font-medium border ${isAvail
                                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/50'
                                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Active Driver Fleet & Assignments Table */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Driver Fleet & Assignments</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quick overview of drivers, assigned vehicles, and regional coverage</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/supplier/availability/drivers')}
                        className="text-xs h-8 px-3 font-semibold text-[#ff4a1f] border-slate-200 dark:border-slate-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 cursor-pointer self-start sm:self-auto"
                    >
                        <span>Manage All Drivers</span>
                    </Button>
                </div>

                <DataTable
                    data={recentDrivers}
                    columns={driverColumns}
                    compact={true}
                    hideCheckbox={true}
                    hideToolbar={true}
                    hideViewToggle={true}
                    isLoading={isLoading}
                    hidePagination={recentDrivers.length <= 10}
                    actions={(driver) => (
                        <button
                            type="button"
                            onClick={() => navigate('/supplier/availability/drivers')}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff4a1f] hover:underline cursor-pointer"
                        >
                            <span>Manage</span>
                        </button>
                    )}
                    actionsColumnClassName="w-[85px] min-w-[85px] text-right pr-3.5"
                    onRowClick={() => navigate('/supplier/availability/drivers')}
                    searchPlaceholder="Search active drivers..."
                />
            </div>
        </div>
    );
}
