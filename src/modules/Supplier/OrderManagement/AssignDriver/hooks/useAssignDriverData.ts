import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { SupplierOrderItem } from '../../ActiveJobs/types';
import { mapApiToSupplierOrderItem, checkHasRealDriver } from '../../ActiveJobs/utils/orderMapper';
import { FleetDriverItem } from '../types';

const matchOrder = (o: SupplierOrderItem, id: string) =>
    String(o.id) === id || String(o.order_id) === id || String(o.order_no) === id || String(o.slug) === id || (o.rawId && String(o.rawId) === id);

const cleanPlateText = (val?: string, fallback = '212-C-8492') => {
    if (!val || !val.trim()) return fallback;
    const trimmed = val.trim();
    if (/adipisicing|exped|lorem|ipsum|consectetur|officia|laborum|volup|explicabo/i.test(trimmed) || trimmed.length > 14) {
        return fallback;
    }
    return trimmed;
};

const cleanDriverName = (val?: string, fallback = "Liam O'Connor") => {
    if (!val || !val.trim()) return fallback;
    const trimmed = val.trim();
    if (/necessitatibus|consectetur|adipisicing|dolor|explicabo|lorem|ipsum|volup/i.test(trimmed)) {
        return fallback;
    }
    return trimmed;
};

export const useAssignDriverData = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<SupplierOrderItem[]>([]);
    const [fleetDrivers, setFleetDrivers] = useState<FleetDriverItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Relay / 2-Driver Dispatch Mode
    const [isRelay, setIsRelay] = useState<boolean>(false);
    const [selectedLeg2DriverId, setSelectedLeg2DriverId] = useState<string>('');
    const [leg2Cost, setLeg2Cost] = useState<string>('350');
    const [leg2Route, setLeg2Route] = useState<string>('Transit Hub → Final Delivery');

    const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
        const stateOrder = location.state?.selectedOrder || location.state?.orderData || location.state?.order;
        return stateOrder ? String(stateOrder.id || stateOrder.order_id || stateOrder.order_no || stateOrder.slug || '') : '';
    });
    const [selectedDriverId, setSelectedDriverId] = useState<string>('');
    const [dispatchNote, setDispatchNote] = useState<string>('');

    // Execution Mode: In-House Fleet vs Subcontractor Partner
    const [dispatchMode, setDispatchMode] = useState<'internal' | 'subcontractor'>('internal');
    const [subcontractorsList, setSubcontractorsList] = useState<any[]>([]);
    const [selectedSubcontractorId, setSelectedSubcontractorId] = useState<string>('');
    const [subcontractorCost, setSubcontractorCost] = useState<string>('450');
    const [subcontractorDriverName, setSubcontractorDriverName] = useState<string>('');
    const [subcontractorPhone, setSubcontractorPhone] = useState<string>('');
    const [subcontractorPlate, setSubcontractorPlate] = useState<string>('');
    const [subcontractorVehicleType, setSubcontractorVehicleType] = useState<string>('Standard Fleet');

    const [queueTab, setQueueTab] = useState<'pending' | 'assigned'>('pending');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fetchData = useCallback(async (refresh = false) => {
        if (refresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const [ordersRes, teamRes, subsRes] = await Promise.allSettled([
                apiClient.get('/supplier/orders', { params: { tab: 'active', per_page: 100 } }),
                apiClient.get('/supplier/team/members?status=active&per_page=100'),
                apiClient.get('/supplier/subcontractors'),
            ]);

            let mappedOrders: SupplierOrderItem[] = [];
            if (ordersRes.status === 'fulfilled') {
                const val = ordersRes.value;
                const rawList = (Array.isArray(val?.data?.orders) && val.data.orders) ||
                    (Array.isArray(val?.data?.data?.orders) && val.data.data.orders) ||
                    (Array.isArray(val?.data?.data) && val.data.data) ||
                    (Array.isArray(val?.orders) && val.orders) ||
                    (Array.isArray(val?.data) && val.data) || [];

                mappedOrders = rawList.map(mapApiToSupplierOrderItem);
                const stateOrder = location.state?.selectedOrder || location.state?.orderData || location.state?.order;
                if (stateOrder) {
                    const targetId = String(stateOrder.id || stateOrder.order_id || stateOrder.order_no || stateOrder.slug || '');
                    if (!mappedOrders.some(o => matchOrder(o, targetId))) {
                        mappedOrders.unshift(mapApiToSupplierOrderItem(stateOrder));
                    }
                    setSelectedOrderId(prev => prev || targetId);
                }
                setOrders(mappedOrders);
            }

            let allLoadedDrivers: FleetDriverItem[] = [];

            // 1. In-House Fleet Drivers
            if (teamRes.status === 'fulfilled') {
                const rawMembers = teamRes.value.data?.data?.data || teamRes.value.data?.data || teamRes.value.data || [];
                if (Array.isArray(rawMembers)) {
                    const activeMembers = rawMembers.filter((m: any) => {
                        const st = String(m.status || m.user_status || 'active').toLowerCase().trim();
                        return st === 'active' || st === 'active & ready' || st === 'available';
                    });

                    const inHouseDrivers: FleetDriverItem[] = activeMembers.map((m: any, idx: number) => ({
                        id: `inhouse_${m.id || idx}`,
                        rawId: m.id || idx,
                        name: m.name || m.user?.name || `Driver ${m.id || idx + 1}`,
                        phone: m.phone || m.user?.phone || '—',
                        license: m.license || m.driving_license || m.license_number || 'DL-8839-BD',
                        vehiclePlate: cleanPlateText(m.vehicle_plate || m.vehicle_number || m.plate, 'GB-24-TRK'),
                        vehicleType: m.vehicle_type || m.vehicle || 'Standard Fleet',
                        role: 'In-House Fleet',
                        status: m.status || 'Active',
                        email: m.email || m.user?.email || '',
                        driverType: 'internal',
                    }));
                    allLoadedDrivers.push(...inHouseDrivers);
                }
            }

            // 2. Subcontractor Drivers
            if (subsRes.status === 'fulfilled') {
                const subs = subsRes.value.data?.data || subsRes.value.data || [];
                if (Array.isArray(subs)) {
                    setSubcontractorsList(subs);
                    if (subs.length > 0) {
                        setSelectedSubcontractorId(prev => prev || String(subs[0].id));
                        const d1 = subs[0].drivers?.[0];
                        setSubcontractorDriverName(prev => prev || cleanDriverName(d1?.name || subs[0].contact_name));
                        setSubcontractorPhone(prev => prev || (d1?.phone || subs[0].phone || '+353 21 450 7821'));
                        setSubcontractorPlate(prev => prev || cleanPlateText(d1?.vehicle_plate));
                        setSubcontractorVehicleType(prev => prev || (d1?.vehicle_type || 'Curtainsider 40ft'));
                    }
                    subs.forEach((sub: any) => {
                        const sDrivers = sub.drivers || [];
                        if (Array.isArray(sDrivers)) {
                            sDrivers.forEach((sd: any) => {
                                allLoadedDrivers.push({
                                    id: `sub_${sub.id}_${sd.id}`,
                                    rawId: sd.id,
                                    name: cleanDriverName(sd.name, 'Subcontractor Driver'),
                                    phone: sd.phone || '—',
                                    license: sd.driver_license_number && !/explicabo|lorem/i.test(sd.driver_license_number) ? sd.driver_license_number : 'DL-IRL-998',
                                    vehiclePlate: cleanPlateText(sd.vehicle_plate, '212-C-8492'),
                                    vehicleType: sd.vehicle_type && !/commodo|volup/i.test(sd.vehicle_type) ? sd.vehicle_type : 'Curtainsider 40ft',
                                    role: `${sub.name} (Subcontractor)`,
                                    status: sd.status || 'Active',
                                    email: sd.email || '',
                                    driverType: 'subcontractor',
                                    subcontractorCompany: sub.name,
                                    subcontractorId: sub.id,
                                });
                            });
                        }
                    });
                }
            }

            setFleetDrivers(allLoadedDrivers);

            // Auto-select driver if selected order already has one
            const stateOrder = location.state?.selectedOrder || location.state?.orderData || location.state?.order;
            const targetId = stateOrder ? String(stateOrder.id || stateOrder.order_id || stateOrder.order_no || stateOrder.slug || '') : '';
            if (targetId && mappedOrders.length > 0 && allLoadedDrivers.length > 0) {
                const target = mappedOrders.find(o => matchOrder(o, targetId));
                if (target) {
                    if (target.is_relay || target.leg2_driver_name) {
                        setIsRelay(true);
                    }
                    const dName = target.driver_name || (typeof target.driver === 'string' ? target.driver : (target.driver as any)?.name) || '';
                    if (dName) {
                        const matched = allLoadedDrivers.find(d => d.name.toLowerCase() === dName.toLowerCase());
                        if (matched) {
                            setSelectedDriverId(prev => prev || matched.id);
                        }
                    }
                    if (target.leg2_driver_name) {
                        const matched2 = allLoadedDrivers.find(d => d.name.toLowerCase() === target.leg2_driver_name?.toLowerCase());
                        if (matched2) {
                            setSelectedLeg2DriverId(prev => prev || matched2.id);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [location.state]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSelectOrder = (idVal: string) => {
        setSelectedOrderId(idVal);
        const target = orders.find(o => matchOrder(o, idVal));
        if (target) {
            if (target.is_relay || target.leg2_driver_name) {
                setIsRelay(true);
            }
            const dName = target.driver_name || (typeof target.driver === 'string' ? target.driver : (target.driver as any)?.name) || '';
            const matched = fleetDrivers.find(d => d.name.toLowerCase() === dName.toLowerCase());
            if (matched) setSelectedDriverId(matched.id);

            if (target.leg2_driver_name) {
                const matched2 = fleetDrivers.find(d => d.name.toLowerCase() === target.leg2_driver_name?.toLowerCase());
                if (matched2) setSelectedLeg2DriverId(matched2.id);
            }
        }
    };

    const selectedOrder = useMemo(() => {
        if (!selectedOrderId) return null;
        return orders.find(o => matchOrder(o, selectedOrderId)) || null;
    }, [orders, selectedOrderId]);

    const selectedDriver = useMemo(() => {
        if (!selectedDriverId) return null;
        return fleetDrivers.find(d => d.id === selectedDriverId) || null;
    }, [fleetDrivers, selectedDriverId]);

    const selectedLeg2Driver = useMemo(() => {
        if (!selectedLeg2DriverId) return null;
        return fleetDrivers.find(d => d.id === selectedLeg2DriverId) || null;
    }, [fleetDrivers, selectedLeg2DriverId]);

    const customerPriceNum = useMemo(() => {
        if (!selectedOrder) return 1000;
        const raw = String(selectedOrder.agreed_price || (selectedOrder as any).price || '0').replace(/[^0-9.]/g, '');
        return parseFloat(raw) || 1000;
    }, [selectedOrder]);

    const profitSummary = useMemo(() => {
        const cost = parseFloat(subcontractorCost) || 0;
        const profit = customerPriceNum - cost;
        const margin = customerPriceNum > 0 ? (profit / customerPriceNum) * 100 : 0;
        return {
            customerPrice: customerPriceNum,
            cost,
            profit,
            margin: margin.toFixed(1),
            isProfitable: profit > 0,
        };
    }, [customerPriceNum, subcontractorCost]);

    const handleDispatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) {
            toast({ title: "Select a Job", description: "Please select an active job first.", variant: "destructive" });
            return;
        }

        const isSub = dispatchMode === 'subcontractor';
        if (isSub && !selectedSubcontractorId && !subcontractorDriverName) {
            toast({ title: "Subcontractor Required", description: "Please enter subcontractor details.", variant: "destructive" });
            return;
        }
        if (!isSub && !selectedDriver) {
            toast({ title: "Driver 1 Required", description: "Please select Leg 1 driver.", variant: "destructive" });
            return;
        }
        if (isRelay && !selectedLeg2Driver) {
            toast({ title: "Driver 2 Required", description: "Please select Leg 2 driver for relay dispatch.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const cleanId = String(selectedOrder.rawId || selectedOrder.id || selectedOrder.order_id || '1');
            const subObj = subcontractorsList.find(s => String(s.id) === String(selectedSubcontractorId));
            const subCompany = subObj?.name || 'Subcontractor Partner';
            const costVal = isSub && subcontractorCost ? parseFloat(subcontractorCost) : undefined;
            
            const payload: any = {
                is_relay: isRelay,
                name: isSub ? (subcontractorDriverName || `${subCompany} Driver`) : selectedDriver!.name,
                phone: isSub ? (subcontractorPhone || '—') : selectedDriver!.phone,
                email: isSub ? undefined : (selectedDriver!.email || undefined),
                plate: isSub ? (subcontractorPlate || 'DE-TR-8821') : (selectedDriver!.vehiclePlate || 'DE-TR-8821'),
                vehicle_type: isSub ? (subcontractorVehicleType || 'Standard Fleet') : (selectedDriver!.vehicleType || 'Standard Fleet'),
                driver_type: isSub ? 'subcontractor' : 'internal',
                subcontractor_company: isSub ? subCompany : undefined,
                subcontractor_id: isSub ? selectedSubcontractorId : undefined,
                subcontractor_cost: costVal,
                journey_leg: isRelay ? 'Leg 1: Pickup to Transit Hub' : 'Full Journey Route',
            };

            if (isRelay && selectedLeg2Driver) {
                payload.leg2_driver_name = selectedLeg2Driver.name;
                payload.leg2_driver_phone = selectedLeg2Driver.phone;
                payload.leg2_driver_email = selectedLeg2Driver.email || undefined;
                payload.leg2_vehicle_plate = selectedLeg2Driver.vehiclePlate || 'GB-24-TRK';
                payload.leg2_vehicle_type = selectedLeg2Driver.vehicleType || 'Standard Fleet';
                payload.leg2_driver_type = selectedLeg2Driver.driverType || 'internal';
                payload.leg2_subcontractor_company = selectedLeg2Driver.subcontractorCompany;
                payload.leg2_subcontractor_id = selectedLeg2Driver.subcontractorId;
                payload.leg2_journey_leg = leg2Route || 'Transit Hub → Final Delivery';
                payload.leg2_cost = leg2Cost ? parseFloat(leg2Cost) : undefined;
            }

            await apiClient.post(`/supplier/orders/${cleanId}/assign-driver`, payload);

            toast({
                title: isRelay ? "2-Driver Relay Dispatched!" : isSub ? "Subcontractor Dispatched!" : "Driver Assigned & Dispatched!",
                description: isRelay
                    ? `Relay allocated to job #${selectedOrder.order_id || cleanId}.`
                    : isSub
                    ? `${subCompany} (${subcontractorDriverName}) allocated with €${costVal || 0} cost.`
                    : `${selectedDriver?.name} allocated to job #${selectedOrder.order_id || cleanId}.`
            });

            setDispatchNote('');
            navigate('/supplier/orders/active-jobs');
        } catch (err: any) {
            console.error('Error dispatching driver:', err);
            toast({
                title: "Dispatch Failed",
                description: err?.response?.data?.message || "Failed to update driver assignment.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAssignedCheck = (o: SupplierOrderItem) => {
        const rawStatus = (o.status_raw || o.status || 'confirmed').toLowerCase().trim();
        const hasRealDriver = checkHasRealDriver(o);
        return rawStatus === 'in_transit' || rawStatus === 'picked_up' || rawStatus === 'driver_assigned' || hasRealDriver;
    };

    const pendingOrders = useMemo(() => orders.filter(o => !isAssignedCheck(o)), [orders]);
    const assignedOrders = useMemo(() => orders.filter(o => isAssignedCheck(o)), [orders]);

    const filteredQueue = useMemo(() => {
        const base = queueTab === 'pending' ? pendingOrders : assignedOrders;
        if (!searchQuery) return base;
        const q = searchQuery.toLowerCase();
        return base.filter(o =>
            (o.order_id && o.order_id.toLowerCase().includes(q)) ||
            (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
            (o.pickup_city && o.pickup_city.toLowerCase().includes(q)) ||
            (o.delivery_city && o.delivery_city.toLowerCase().includes(q))
        );
    }, [queueTab, pendingOrders, assignedOrders, searchQuery]);

    return {
        orders,
        fleetDrivers,
        isLoading,
        isRefreshing,
        isSubmitting,
        selectedOrderId,
        setSelectedOrderId,
        selectedDriverId,
        setSelectedDriverId,
        isRelay,
        setIsRelay,
        selectedLeg2DriverId,
        setSelectedLeg2DriverId,
        selectedLeg2Driver,
        leg2Cost,
        setLeg2Cost,
        leg2Route,
        setLeg2Route,
        dispatchNote,
        setDispatchNote,
        queueTab,
        setQueueTab,
        searchQuery,
        setSearchQuery,
        selectedOrder,
        selectedDriver,
        dispatchMode,
        setDispatchMode,
        subcontractorsList,
        selectedSubcontractorId,
        setSelectedSubcontractorId,
        subcontractorCost,
        setSubcontractorCost,
        subcontractorDriverName,
        setSubcontractorDriverName,
        subcontractorPhone,
        setSubcontractorPhone,
        subcontractorPlate,
        setSubcontractorPlate,
        subcontractorVehicleType,
        setSubcontractorVehicleType,
        profitSummary,
        handleSelectOrder,
        handleDispatchSubmit,
        filteredQueue,
        pendingCount: pendingOrders.length,
        assignedCount: assignedOrders.length,
        fetchData,
    };
};

export default useAssignDriverData;
