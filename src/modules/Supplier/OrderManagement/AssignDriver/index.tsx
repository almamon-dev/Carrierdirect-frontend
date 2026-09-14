import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    UserCheck,
    Truck,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Calendar,
    Clock,
    RefreshCw,
    Search,
    AlertCircle,
    Package,
    ShieldCheck,
    Navigation,
    Layers,
    Sparkles,
    ChevronRight,
    FileCheck,
    Users,
    UserPlus,
    ExternalLink
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import apiClient from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { formatDisplayDate } from '@/lib/utils';
import { SupplierOrderItem } from '../ActiveJobs/types';

interface FleetDriverItem {
    id: string;
    rawId: string | number;
    name: string;
    phone: string;
    license: string;
    vehiclePlate: string;
    vehicleType: string;
    role: string;
    status: string;
    email?: string;
}

const normalizeOrderItem = (o: any): SupplierOrderItem => {
    const shippingObj = o?.shipping || {};
    const trackingObj = o?.tracking || {};
    const clientObj = o?.client || o?.customer || {};
    const paymentObj = o?.payment || {};
    const shipmentObj = o?.shipment || {};

    const customerName = clientObj.name || o?.customer_name || o?.client_name || o?.user?.name || (typeof o?.customer === 'string' ? o.customer : '') || 'Verified Customer';
    const customerAvatar = clientObj.avatar || o?.customer_avatar || o?.customer_profile_picture;
    const pickupFull = shippingObj.from || o?.pickup_address || o?.pickup_full_address || [o?.pickup_city, o?.pickup_country].filter(Boolean).join(', ') || o?.from || 'Dhaka, Bangladesh';
    const deliveryFull = shippingObj.to || o?.delivery_address || o?.delivery_full_address || [o?.delivery_city, o?.delivery_country].filter(Boolean).join(', ') || o?.to || 'Chittagong, Bangladesh';

    const pickupCity = o?.pickup_city || (pickupFull.split(',')[0] || pickupFull).trim();
    const deliveryCity = o?.delivery_city || (deliveryFull.split(',')[0] || deliveryFull).trim();
    const routeDisplay = `${pickupCity} → ${deliveryCity}`;

    const vehicle = shippingObj.service || o?.vehicle || o?.vehicle_type || o?.truck_type || o?.service || 'Pallet Transport';
    
    const rawWeight = shipmentObj.total_weight || o?.total_weight || o?.weight || o?.cargo_weight;
    let weightVal = '1,500 KG';
    if (rawWeight && !String(rawWeight).toUpperCase().includes('N/A') && rawWeight !== '0 kg' && rawWeight !== 0) {
        weightVal = String(rawWeight).toUpperCase().includes('KG') ? String(rawWeight).toUpperCase() : `${rawWeight} KG`;
    }

    const palletsVal = shipmentObj.description || o?.type_of_pallets || o?.pallets || o?.load_type || 'Pallet Load';

    let formattedAmt = '€ 0.00';
    const rawTotal = paymentObj.total ?? o?.total_amount ?? o?.amount ?? o?.net_payout ?? o?.agreed_price;
    if (paymentObj.formatted) {
        formattedAmt = paymentObj.formatted;
    } else if (typeof rawTotal === 'number') {
        formattedAmt = `€ ${rawTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
    } else if (typeof rawTotal === 'string' && rawTotal) {
        formattedAmt = rawTotal.startsWith('€') || rawTotal.startsWith('$') ? rawTotal : `€ ${rawTotal}`;
    }

    const rawStatus = (o?.status_raw || o?.status || 'confirmed').toLowerCase().trim();
    let displayStatus = 'Confirmed';
    if (rawStatus === 'completed' || rawStatus === 'pod accepted' || rawStatus === 'delivered') {
        displayStatus = 'Delivered';
    } else if (rawStatus.includes('cancel')) {
        displayStatus = 'Cancelled';
    } else if (rawStatus.includes('review') || rawStatus.includes('pod_uploaded')) {
        displayStatus = 'POD Review';
    } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
        displayStatus = 'In Transit';
    } else if (rawStatus === 'picked_up' || rawStatus === 'in_progress') {
        displayStatus = 'Picked Up';
    } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'dispatched') {
        displayStatus = 'Driver Assigned';
    } else if (rawStatus === 'confirmed' || rawStatus === 'scheduled' || rawStatus === 'pending') {
        displayStatus = 'Confirmed';
    } else {
        displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
    }

    const pickupDateVal = shippingObj.pickup_at || o?.pickup_date || o?.order_date || o?.date || o?.created_at || '';
    const deliveryEtaDate = shippingObj.delivery_at || o?.delivery_date || o?.estimated_delivery || o?.eta || '';
    const driverName = o?.driver?.name || o?.driver_name || (typeof o?.driver === 'string' ? o.driver : '');

    return {
        id: o?.id || '1',
        rawId: o?.id,
        slug: String(o?.slug || o?.id || ''),
        order_id: o?.order_no || o?.order_number || (o?.id ? `ORD-${o.id}` : 'ORD-0001'),
        order_no: o?.order_no || o?.order_number,
        order_number: o?.order_number || o?.order_no,
        quote_id: o?.quote_id,
        customer_name: customerName,
        customer_avatar: customerAvatar,
        customer_phone: o?.customer?.phone || o?.client_phone || o?.customer_phone || '+44 7700 900077',
        customer_email: o?.customer?.email || o?.client_email || o?.customer_email || 'client@example.com',
        customer_rating: o?.customer?.rating || o?.rating || '4.9',
        customer_verified: o?.customer?.is_verified ?? true,
        customer: {
            name: customerName,
            avatar: customerAvatar,
            rating: o?.customer?.rating || o?.rating || '4.9',
            is_verified: true,
            completed_orders: o?.customer?.completed_orders || '120+ shipments'
        },
        pickup_city: pickupCity,
        pickup_address: pickupFull,
        pickup_full_address: pickupFull,
        delivery_city: deliveryCity,
        delivery_address: deliveryFull,
        delivery_full_address: deliveryFull,
        route: routeDisplay,
        vehicle,
        vehicle_type: vehicle,
        vehicle_plate: o?.vehicle?.plate || o?.vehicle_plate || 'GB-24-TRK',
        driver: driverName || 'Pending Assignment',
        driver_name: driverName || 'Pending Assignment',
        driver_phone: o?.driver?.phone || o?.driver_phone || '',
        weight: weightVal,
        cargo_weight: weightVal,
        pallets: palletsVal,
        type_of_pallets: palletsVal,
        load_type: palletsVal,
        amount: formattedAmt,
        total_amount: formattedAmt,
        net_payout: formattedAmt,
        status: displayStatus,
        status_raw: rawStatus,
        pickup_date: pickupDateVal,
        pickup_time_window: o?.pickup_time_window || shippingObj.pickup_time || '08:00 – 12:00',
        delivery_date: deliveryEtaDate,
        delivery_time_window: o?.delivery_time_window || shippingObj.delivery_time || '14:00 – 18:00'
    };
};

export default function AssignDriverPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Data states
    const [orders, setOrders] = useState<SupplierOrderItem[]>([]);
    const [fleetDrivers, setFleetDrivers] = useState<FleetDriverItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Selected order for assignment
    const [selectedOrderId, setSelectedOrderId] = useState<string>('');

    // Selected Driver
    const [selectedDriverId, setSelectedDriverId] = useState<string>('');
    const [dispatchNote, setDispatchNote] = useState<string>('');

    // Queue filter tab & search
    const [queueTab, setQueueTab] = useState<'all' | 'pending' | 'assigned'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Fetch real orders & team members
    const fetchData = async (refresh = false) => {
        if (refresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const [ordersRes, teamRes] = await Promise.allSettled([
                apiClient.get('/supplier/orders'),
                apiClient.get('/supplier/team/members?status=active&per_page=100')
            ]);

            let mappedOrders: SupplierOrderItem[] = [];
            if (ordersRes.status === 'fulfilled') {
                const rawList = ordersRes.value.data?.data?.orders || ordersRes.value.data?.data || ordersRes.value.data || [];
                if (Array.isArray(rawList)) {
                    mappedOrders = rawList.map(normalizeOrderItem);
                    setOrders(mappedOrders);
                }
            }

            if (teamRes.status === 'fulfilled') {
                const rawMembers = teamRes.value.data?.data?.data || teamRes.value.data?.data || teamRes.value.data || [];
                if (Array.isArray(rawMembers)) {
                    // Filter strictly for active drivers & team members
                    const activeMembers = rawMembers.filter((m: any) => {
                        const st = String(m.status || m.user_status || 'active').toLowerCase().trim();
                        return st === 'active' || st === 'active & ready' || st === 'available';
                    });

                    const formattedTeam: FleetDriverItem[] = activeMembers.map((m: any, idx: number) => ({
                        id: String(m.id || idx),
                        rawId: m.id || idx,
                        name: m.name || m.user?.name || `Driver ${m.id || idx + 1}`,
                        phone: m.phone || m.user?.phone || '—',
                        license: m.license || m.driving_license || m.license_number || 'DL-8839-BD',
                        vehiclePlate: m.vehicle_plate || m.vehicle_number || m.plate || 'GB-24-TRK',
                        vehicleType: m.vehicle_type || m.vehicle || 'Covered Van (20ft)',
                        role: m.role?.name || m.role || m.supplier_role?.name || 'Fleet Driver',
                        status: m.status || 'Active',
                        email: m.email || m.user?.email || ''
                    }));
                    setFleetDrivers(formattedTeam);
                    if (formattedTeam.length > 0 && !selectedDriverId) {
                        setSelectedDriverId(formattedTeam[0].id);
                    }
                }
            }

            // Auto-select first order if none selected
            if (mappedOrders.length > 0 && !selectedOrderId) {
                setSelectedOrderId(String(mappedOrders[0].id || mappedOrders[0].order_id));
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Check if an order was passed via router navigation state
    useEffect(() => {
        const stateOrder = location.state?.selectedOrder || location.state?.orderData || location.state?.order;
        if (stateOrder) {
            const targetId = stateOrder.id || stateOrder.order_id || stateOrder.order_no || stateOrder.slug;
            if (targetId) {
                handleSelectOrder(String(targetId));
            }
        }
    }, [location.state]);

    // Currently selected order object
    const selectedOrder = useMemo(() => {
        if (!selectedOrderId) return null;
        return orders.find(
            (o) => String(o.id) === String(selectedOrderId) ||
                   String(o.order_id) === String(selectedOrderId) ||
                   String(o.order_no) === String(selectedOrderId) ||
                   String(o.slug) === String(selectedOrderId)
        ) || null;
    }, [orders, selectedOrderId]);

    // Currently selected driver object
    const selectedDriver = useMemo(() => {
        if (!selectedDriverId) return null;
        return fleetDrivers.find(d => d.id === selectedDriverId) || null;
    }, [fleetDrivers, selectedDriverId]);

    // When an order is selected
    const handleSelectOrder = (idVal: string) => {
        setSelectedOrderId(idVal);
        const target = orders.find(
            (o) => String(o.id) === String(idVal) ||
                   String(o.order_id) === String(idVal) ||
                   String(o.order_no) === String(idVal) ||
                   String(o.slug) === String(idVal)
        );

        if (target) {
            const dName = target.driver_name || (typeof target.driver === 'string' ? target.driver : (target.driver as any)?.name) || '';
            const matchedDriver = fleetDrivers.find(d => d.name.toLowerCase() === dName.toLowerCase());
            if (matchedDriver) {
                setSelectedDriverId(matchedDriver.id);
            }
        }
    };

    // Handle Form Submit
    const handleDispatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) {
            toast({
                title: "Select a Job",
                description: "Please select an active job from the dropdown or queue first.",
                variant: "destructive"
            });
            return;
        }

        if (!selectedDriver) {
            toast({
                title: "Driver Required",
                description: "Please select a registered driver from your fleet team.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const cleanId = String(selectedOrder.id || selectedOrder.order_id || '1').replace('ORD-', '');
            await apiClient.patch(`/supplier/orders/${cleanId}/status`, {
                status: 'driver_assigned',
                driver_id: selectedDriver.rawId || selectedDriver.id,
                driver_name: selectedDriver.name,
                driver_phone: selectedDriver.phone,
                driver_email: selectedDriver.email || undefined,
                vehicle_plate: selectedDriver.vehiclePlate,
                vehicle_type: selectedDriver.vehicleType,
                note: dispatchNote || `Driver ${selectedDriver.name} (${selectedDriver.phone}) assigned with vehicle ${selectedDriver.vehiclePlate}.`
            });

            toast({
                title: "Driver Assigned & Dispatched!",
                description: `${selectedDriver.name} assigned to job ${selectedOrder.order_id || cleanId}. Live tracking initiated.`
            });

            // Refresh data
            fetchData(true);
            setDispatchNote('');
        } catch (err: any) {
            console.error('Error dispatching driver:', err);
            toast({
                title: "Dispatch Failed",
                description: err?.response?.data?.message || "Failed to update driver assignment. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter queue list
    const filteredQueue = useMemo(() => {
        return orders.filter((o) => {
            const rawStatus = (o.status_raw || o.status || 'confirmed').toLowerCase().trim();
            const isAssigned = rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'in_transit' || rawStatus === 'picked_up' || rawStatus === 'in_progress';
            
            if (queueTab === 'pending' && isAssigned) return false;
            if (queueTab === 'assigned' && !isAssigned) return false;

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const idStr = String(o.order_id || o.order_no || o.id || '').toLowerCase();
                const custStr = String(o.customer_name || o.customer?.name || '').toLowerCase();
                const routeStr = String(o.route || `${o.pickup_city} ${o.delivery_city}` || '').toLowerCase();
                const driverStr = String(o.driver_name || o.driver || '').toLowerCase();
                return idStr.includes(q) || custStr.includes(q) || routeStr.includes(q) || driverStr.includes(q);
            }

            return true;
        });
    }, [orders, queueTab, searchQuery]);

    // KPI Counters
    const pendingCount = useMemo(() => {
        return orders.filter(o => {
            const s = (o.status_raw || o.status || 'confirmed').toLowerCase().trim();
            return s === 'confirmed' || s === 'pending' || s === 'scheduled';
        }).length;
    }, [orders]);

    const assignedCount = useMemo(() => {
        return orders.filter(o => {
            const s = (o.status_raw || o.status || 'confirmed').toLowerCase().trim();
            return s === 'driver_assigned' || s === 'assigned' || s === 'in_transit' || s === 'picked_up';
        }).length;
    }, [orders]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] space-y-5">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#ff4a1f]/10 text-[#ff4a1f] flex items-center justify-center font-bold">
                            <UserCheck size={18} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Assign Driver & Dispatch
                        </h1>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Select an active shipment and allocate a driver from your fleet team to begin delivery.
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
                        <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
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

            {/* Quick KPI Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="bg-white dark:bg-[#1e2329] p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0">
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-medium">Pending Assignment</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{pendingCount} <span className="text-xs font-normal text-slate-400">jobs</span></p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2329] p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Navigation size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-medium">Dispatched & Active</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{assignedCount} <span className="text-xs font-normal text-slate-400">jobs</span></p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2329] p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Users size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-medium">Fleet Drivers</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{fleetDrivers.length} <span className="text-xs font-normal text-slate-400">members</span></p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2329] p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <Package size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-medium">Total Active Jobs</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{orders.length} <span className="text-xs font-normal text-slate-400">total</span></p>
                    </div>
                </div>
            </div>

            {/* Main Content Workspace: Left Assignment Form / Right Jobs Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Form: Dispatch & Assignment Workspace */}
                <div className="lg:col-span-6 bg-white dark:bg-[#1e2329] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs p-4 md:p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-[#ff4a1f] text-white flex items-center justify-center">
                                <Sparkles size={14} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Driver Allocation Workspace
                                </h2>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Select job and allocate driver directly from your team
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleDispatchSubmit} className="space-y-4 font-sans">
                        {/* 1. Job Selector */}
                        <div className="space-y-1.5">
                            <FormLabel className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                1. Select Active Job / Shipment <span className="text-rose-500">*</span>
                            </FormLabel>
                            {orders.length === 0 && !isLoading ? (
                                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                                    No active shipments found.
                                </div>
                            ) : (
                                <Select
                                    size="sm"
                                    value={selectedOrderId}
                                    onChange={(val) => {
                                        const idVal = typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                                        handleSelectOrder(String(idVal));
                                    }}
                                    showSearch={true}
                                    placeholder="Choose an active shipment..."
                                    options={[
                                        { id: '', name: '-- Select Active Job --' },
                                        ...orders.map((o) => {
                                            const idText = o.order_id || o.order_no || `ORD-${o.id}`;
                                            const origin = o.pickup_city || 'Origin';
                                            const dest = o.delivery_city || 'Destination';
                                            const custName = o.customer_name || 'Customer';
                                            const statusTxt = o.status || 'Confirmed';
                                            return {
                                                id: String(o.id || o.order_id),
                                                name: `${idText} • ${origin} → ${dest} (${custName}) [${statusTxt}]`
                                            };
                                        })
                                    ]}
                                />
                            )}
                        </div>

                        {/* Selected Order Summary Preview Card - Minimal */}
                        {selectedOrder && (
                            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-3.5 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-150">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                            {selectedOrder.order_id || selectedOrder.order_no || `ORD-${selectedOrder.id}`}
                                        </span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                                            {selectedOrder.customer_name || 'Customer'}
                                        </span>
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                                        {selectedOrder.net_payout || selectedOrder.amount || '—'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                                    <MapPin size={12} className="text-slate-400 shrink-0" />
                                    <span className="text-slate-900 dark:text-slate-100 font-semibold">{selectedOrder.pickup_city || 'Origin'}</span>
                                    <ArrowRight size={10} className="text-slate-400 shrink-0" />
                                    <span className="text-slate-900 dark:text-slate-100 font-semibold">{selectedOrder.delivery_city || 'Destination'}</span>
                                </div>

                                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={11.5} className="text-slate-400" />
                                        <span>Pickup: {formatDisplayDate(selectedOrder.pickup_date || selectedOrder.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Truck size={11.5} className="text-slate-400" />
                                        <span>Cargo: {selectedOrder.weight || '1,500 KG'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Layers size={11.5} className="text-slate-400" />
                                        <span>Vehicle: {selectedOrder.vehicle || 'Standard'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Driver Selection directly from Fleet List */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            <FormLabel className="text-xs font-bold text-slate-800 dark:text-slate-200 font-medium block">
                                2. Select Driver from Fleet Team <span className="text-rose-500">*</span>
                            </FormLabel>

                            {fleetDrivers.length === 0 && !isLoading ? (
                                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold">
                                        <AlertCircle size={15} />
                                        <span>No Active Drivers Found</span>
                                    </div>
                                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                                        Only active team members can be allocated to shipments. Pending invited drivers must accept their invitation first.
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate('/supplier/team')}
                                        className="h-7 text-xs bg-white dark:bg-[#1e2329] border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 flex items-center gap-1.5"
                                    >
                                        <UserPlus size={12} />
                                        <span>Go to Team Management</span>
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {/* Clean Driver Dropdown */}
                                    <div className="space-y-1">
                                        <Select
                                            size="sm"
                                            value={selectedDriverId}
                                            onChange={(val) => {
                                                const dId = typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                                                setSelectedDriverId(String(dId));
                                            }}
                                            showSearch={true}
                                            placeholder="Choose a Fleet Driver"
                                            options={[
                                                { id: '', name: '-- Select Fleet Driver --' },
                                                ...fleetDrivers.map((d) => ({
                                                    id: d.id,
                                                    name: `${d.name} (${d.role}) ${d.email ? `• ${d.email}` : ''}`
                                                }))
                                            ]}
                                        />
                                    </div>

                                    {/* Driver Allocation Details Card - Minimal */}
                                    {selectedDriver && (
                                        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-3.5 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-150">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-[10px]">
                                                        {selectedDriver.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {selectedDriver.name}
                                                    </span>
                                                    <span className="text-slate-400 text-[11px]">({selectedDriver.role})</span>
                                                </div>
                                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                    {selectedDriver.status || 'Available'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail size={11.5} className="text-slate-400 shrink-0" />
                                                    <span className="truncate">Email: <strong className="text-slate-700 dark:text-slate-300 font-medium">{selectedDriver.email || selectedDriver.phone || "—"}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Truck size={11.5} className="text-slate-400 shrink-0" />
                                                    <span className="truncate">Vehicle: <strong className="text-slate-700 dark:text-slate-300 font-medium">{selectedDriver.vehiclePlate}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <ShieldCheck size={11.5} className="text-slate-400 shrink-0" />
                                                    <span className="truncate">License: <strong className="text-slate-700 dark:text-slate-300 font-medium">{selectedDriver.license}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Layers size={11.5} className="text-slate-400 shrink-0" />
                                                    <span className="truncate">Spec: <strong className="text-slate-700 dark:text-slate-300 font-medium">{selectedDriver.vehicleType}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Dispatch Instructions */}
                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Special Instructions / Dispatch Notes (Optional)
                                </FormLabel>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Please verify cargo seal before loading..."
                                    value={dispatchNote}
                                    onChange={(e) => setDispatchNote(e.target.value)}
                                    className="w-full text-xs p-2.5 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#12161c] text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#ff4a1f]"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedOrderId('');
                                    setDispatchNote('');
                                }}
                                className="text-xs rounded-[4px]"
                            >
                                Clear Selection
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                disabled={isSubmitting || !selectedOrderId || !selectedDriverId}
                                className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs rounded-[4px] px-4"
                            >
                                {isSubmitting ? (
                                    <>
                                        <RefreshCw size={13} className="animate-spin" />
                                        <span>Dispatching...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserCheck size={14} />
                                        <span>{selectedOrder && ((selectedOrder.status_raw || selectedOrder.status || '').toLowerCase().includes('assign') || (selectedOrder.status_raw || selectedOrder.status || '').toLowerCase().includes('transit')) ? "Update Driver & Reassign" : "Confirm & Dispatch Driver"}</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Right Panel: Active & Pending Orders Dispatch Queue */}
                <div className="lg:col-span-6 bg-white dark:bg-[#1e2329] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs p-4 md:p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                Shipments Dispatch Queue
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Select a job below to instantly allocate your driver
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs">
                            <button
                                type="button"
                                onClick={() => setQueueTab('all')}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                                    queueTab === 'all'
                                        ? 'bg-white dark:bg-[#1e2329] text-[#ff4a1f] shadow-2xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                All ({orders.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setQueueTab('pending')}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                                    queueTab === 'pending'
                                        ? 'bg-white dark:bg-[#1e2329] text-[#ff4a1f] shadow-2xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                Pending ({pendingCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setQueueTab('assigned')}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                                    queueTab === 'assigned'
                                        ? 'bg-white dark:bg-[#1e2329] text-[#ff4a1f] shadow-2xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                Dispatched ({assignedCount})
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div>
                        <Input
                            type="text"
                            icon={<Search size={14} className="text-slate-400" />}
                            placeholder="Search by Job ID, customer, route, or driver..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8 text-xs rounded-[4px]"
                        />
                    </div>

                    {/* Orders Queue List */}
                    <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                        {filteredQueue.length === 0 ? (
                            <div className="py-8 text-center text-slate-400 text-xs">
                                <Package size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                <p className="font-semibold">No shipments in this queue</p>
                                <p className="text-[11px]">All matching active shipments have been dispatched.</p>
                            </div>
                        ) : (
                            filteredQueue.map((item) => {
                                const rawStatus = (item.status_raw || item.status || 'confirmed').toLowerCase().trim();
                                const isAssigned = rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'in_transit' || rawStatus === 'picked_up';
                                const isSelected = String(item.id) === String(selectedOrderId) || String(item.order_id) === String(selectedOrderId);

                                const dName = item.driver_name || (typeof item.driver === 'string' ? item.driver : (item.driver as any)?.name);
                                const hasRealDriver = dName && !dName.toLowerCase().includes('assigned driver') && !dName.toLowerCase().includes('unassigned') && !dName.toLowerCase().includes('pending');

                                const origin = item.pickup_city || 'Origin';
                                const dest = item.delivery_city || 'Destination';

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSelectOrder(String(item.id))}
                                        className={`p-3 rounded-lg border transition-all cursor-pointer text-xs ${
                                            isSelected
                                                ? 'border-[#ff4a1f] bg-orange-50/50 dark:bg-[#ff4a1f]/10 shadow-xs'
                                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#12161c]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-[#ff4a1f]">
                                                    {item.order_id || item.order_no || `ORD-${item.id}`}
                                                </span>
                                                <span className="text-slate-700 dark:text-slate-200 font-semibold truncate max-w-[140px]">
                                                    {item.customer_name || 'Customer'}
                                                </span>
                                            </div>

                                            {isAssigned ? (
                                                <Badge variant="info" className="text-[10px] font-bold">
                                                    ✓ {hasRealDriver ? dName : 'Driver Assigned'}
                                                </Badge>
                                            ) : (
                                                <Badge variant="warning" className="text-[10px] font-bold animate-pulse">
                                                    Pending Dispatch
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={12} className="text-[#ff4a1f] shrink-0" />
                                                <span>{origin}</span>
                                                <ArrowRight size={10} className="text-slate-400 shrink-0" />
                                                <span>{dest}</span>
                                            </div>

                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                {item.net_payout || item.amount || '—'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-1">
                                                <Clock size={11} />
                                                <span>Pickup: {formatDisplayDate(item.pickup_date || item.created_at)}</span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectOrder(String(item.id));
                                                }}
                                                className={`text-[11px] font-bold flex items-center gap-1 hover:underline cursor-pointer ${
                                                    isSelected ? 'text-[#ff4a1f]' : 'text-slate-600 dark:text-slate-400'
                                                }`}
                                            >
                                                <span>{isAssigned ? 'Reassign Driver' : 'Assign This Job'}</span>
                                                <ChevronRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}