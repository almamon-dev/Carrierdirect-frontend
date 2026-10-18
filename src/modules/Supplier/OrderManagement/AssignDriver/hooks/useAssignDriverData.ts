import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { SupplierOrderItem } from '../../ActiveJobs/types';
import { mapApiToSupplierOrderItem, checkHasRealDriver } from '../../ActiveJobs/utils/orderMapper';
import { FleetDriverItem } from '../types';

const matchOrder = (o: SupplierOrderItem, id: string) =>
    String(o.id) === id || String(o.order_id) === id || String(o.order_no) === id || String(o.slug) === id || (o.rawId && String(o.rawId) === id);

export const useAssignDriverData = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<SupplierOrderItem[]>([]);
    const [fleetDrivers, setFleetDrivers] = useState<FleetDriverItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
        const stateOrder = location.state?.selectedOrder || location.state?.orderData || location.state?.order;
        return stateOrder ? String(stateOrder.id || stateOrder.order_id || stateOrder.order_no || stateOrder.slug || '') : '';
    });
    const [selectedDriverId, setSelectedDriverId] = useState<string>('');
    const [dispatchNote, setDispatchNote] = useState<string>('');

    const [queueTab, setQueueTab] = useState<'pending' | 'assigned'>('pending');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fetchData = useCallback(async (refresh = false) => {
        if (refresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const [ordersRes, teamRes] = await Promise.allSettled([
                apiClient.get('/supplier/orders', { params: { tab: 'active', per_page: 100 } }),
                apiClient.get('/supplier/team/members?status=active&per_page=100'),
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

            let loadedDrivers: FleetDriverItem[] = [];
            if (teamRes.status === 'fulfilled') {
                const rawMembers = teamRes.value.data?.data?.data || teamRes.value.data?.data || teamRes.value.data || [];
                if (Array.isArray(rawMembers)) {
                    const activeMembers = rawMembers.filter((m: any) => {
                        const st = String(m.status || m.user_status || 'active').toLowerCase().trim();
                        return st === 'active' || st === 'active & ready' || st === 'available';
                    });

                    loadedDrivers = activeMembers.map((m: any, idx: number) => ({
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
                    setFleetDrivers(loadedDrivers);
                }
            }

            // Auto-select driver if selected order already has one
            const stateOrder = location.state?.selectedOrder || location.state?.orderData || location.state?.order;
            const targetId = stateOrder ? String(stateOrder.id || stateOrder.order_id || stateOrder.order_no || stateOrder.slug || '') : '';
            if (targetId && mappedOrders.length > 0 && loadedDrivers.length > 0) {
                const target = mappedOrders.find(o => matchOrder(o, targetId));
                if (target) {
                    const dName = target.driver_name || (typeof target.driver === 'string' ? target.driver : (target.driver as any)?.name) || '';
                    if (dName) {
                        const matched = loadedDrivers.find(d => d.name.toLowerCase() === dName.toLowerCase());
                        if (matched) {
                            setSelectedDriverId(prev => prev || matched.id);
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
            const dName = target.driver_name || (typeof target.driver === 'string' ? target.driver : (target.driver as any)?.name) || '';
            const matched = fleetDrivers.find(d => d.name.toLowerCase() === dName.toLowerCase());
            if (matched) setSelectedDriverId(matched.id);
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

    const handleDispatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) {
            toast({ title: "Select a Job", description: "Please select an active job first.", variant: "destructive" });
            return;
        }
        if (!selectedDriver) {
            toast({ title: "Driver Required", description: "Please select a registered driver.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const cleanId = String(selectedOrder.rawId || selectedOrder.id || selectedOrder.order_id || '1');
            await apiClient.patch(`/supplier/orders/${cleanId}/status`, {
                status: 'driver_assigned',
                driver_id: selectedDriver.rawId || selectedDriver.id,
                driver_name: selectedDriver.name,
                driver_phone: selectedDriver.phone,
                driver_email: selectedDriver.email || undefined,
                vehicle_plate: selectedDriver.vehiclePlate || 'GB-24-TRK',
                vehicle_type: selectedDriver.vehicleType || 'Covered Van (20ft)',
                note: dispatchNote || `Driver ${selectedDriver.name} allocated with vehicle ${selectedDriver.vehiclePlate || 'GB-24-TRK'}.`
            });

            toast({
                title: "Driver Assigned & Dispatched!",
                description: `${selectedDriver.name} allocated to job ${selectedOrder.order_id || cleanId}.`
            });
            setDispatchNote('');

            // Redirect directly to Active Jobs list page
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
        if (rawStatus === 'completed' || rawStatus === 'pod accepted' || rawStatus === 'cancelled') {
            return true;
        }
        if (rawStatus === 'in_transit' || rawStatus === 'picked_up' || rawStatus === 'on_the_way') {
            return true;
        }
        return checkHasRealDriver(o);
    };

    const filteredQueue = useMemo(() => {
        return orders.filter((o) => {
            const isAssigned = isAssignedCheck(o);

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

    const pendingCount = useMemo(() => orders.filter(o => {
        const s = (o.status_raw || o.status || 'confirmed').toLowerCase().trim();
        if (s === 'delivered' || s === 'completed') return false;
        return !isAssignedCheck(o);
    }).length, [orders]);

    const assignedCount = useMemo(() => orders.filter(o => {
        const s = (o.status_raw || o.status || 'confirmed').toLowerCase().trim();
        if (s === 'delivered' || s === 'completed') return false;
        return isAssignedCheck(o);
    }).length, [orders]);

    return {
        orders, fleetDrivers, isLoading, isRefreshing, isSubmitting,
        selectedOrderId, setSelectedOrderId, selectedDriverId, setSelectedDriverId,
        dispatchNote, setDispatchNote, queueTab, setQueueTab, searchQuery, setSearchQuery,
        selectedOrder, selectedDriver, handleSelectOrder, handleDispatchSubmit,
        filteredQueue, pendingCount, assignedCount, fetchData,
    };
};

export default useAssignDriverData;
