import { toast } from '@/hooks/use-toast';
import apiClient from '@/lib/axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SupplierOrderItem } from '../../ActiveJobs/types';
import {
    checkHasRealDriver,
    mapApiToSupplierOrderItem,
} from '../../ActiveJobs/utils/orderMapper';
import {
    FleetDriverItem,
    FleetVehicleItem,
    LegAssignmentState,
    ShipmentLegApiItem,
} from '../types';
import {
    buildLegApiPayload,
    calculateDispatchFinancials,
    createDefaultLegState,
    validateLegAssignment,
} from '../utils/dispatchHelpers';

const matchOrder = (o: SupplierOrderItem, id: string) =>
    String(o.id) === id ||
    String(o.order_id) === id ||
    String(o.order_no) === id ||
    String(o.slug) === id ||
    (o.rawId && String(o.rawId) === id);

const hydrateLegFromOrder = (
    order: SupplierOrderItem,
    legNumber: 1 | 2,
    drivers: FleetDriverItem[],
    vehicles: FleetVehicleItem[],
    subs: any[]
): LegAssignmentState => {
    const legType = legNumber === 1 ? 'pickup' : 'delivery';
    const fromCity = order.pickup_city || '';
    const toCity = order.delivery_city || '';
    const defaultRoute =
        legNumber === 1
            ? order.is_relay
                ? `${fromCity} → Transit Hub`
                : `${fromCity} → ${toCity}`
            : `Transit Hub → ${toCity}`;

    const apiLegs: ShipmentLegApiItem[] =
        (Array.isArray(order.shipment_legs) && order.shipment_legs.length > 0
            ? order.shipment_legs
            : Array.isArray((order.raw as any)?.shipment_legs)
                ? (order.raw as any).shipment_legs
                : []) || [];

    const apiLeg = apiLegs.find((l) => Number(l.leg_number) === legNumber);

    if (apiLeg) {
        const mode = apiLeg.execution_mode === 'subcontractor' ? 'subcontractor' : 'in_house';
        let resolvedVehicleId = apiLeg.vehicle_id ? String(apiLeg.vehicle_id) : '';
        if (!resolvedVehicleId && mode === 'in_house' && apiLeg.vehicle_plate) {
            const norm = apiLeg.vehicle_plate.replace(/[\s-]/g, '').toUpperCase();
            const foundVeh = vehicles.find(
                (v) => v.registration_no?.replace(/[\s-]/g, '').toUpperCase() === norm
            );
            if (foundVeh) resolvedVehicleId = String(foundVeh.id);
        }

        let resolvedSubId = apiLeg.subcontractor_id ? String(apiLeg.subcontractor_id) : '';
        if (!resolvedSubId && mode === 'subcontractor' && apiLeg.subcontractor_company) {
            const foundSub = subs.find(
                (s) => s.name?.toLowerCase() === apiLeg.subcontractor_company?.toLowerCase()
            );
            resolvedSubId = foundSub ? String(foundSub.id) : 'custom';
        }

        return {
            legNumber,
            legType,
            executionMode: mode,
            driverId: apiLeg.driver_id ? String(apiLeg.driver_id) : '',
            vehicleId: resolvedVehicleId,
            subcontractorId: resolvedSubId,
            subcontractorCompany: apiLeg.subcontractor_company || '',
            subcontractorDriverId: 'custom',
            subcontractorDriverName: apiLeg.subcontractor_driver_name || '',
            subcontractorDriverPhone: apiLeg.subcontractor_driver_phone || '',
            subcontractorDriverEmail: '',
            subcontractorVehiclePlate: apiLeg.subcontractor_vehicle_plate || '',
            subcontractorVehicleType: apiLeg.vehicle_type || '',
            subcontractorCost:
                mode === 'subcontractor' && apiLeg.subcontractor_cost !== undefined
                    ? String(apiLeg.subcontractor_cost)
                    : '',
            journeyLeg: apiLeg.journey_leg || defaultRoute,
            status: apiLeg.status || 'pending',
        };
    }

    // Legacy fallback if order has no shipment_legs yet
    if (legNumber === 1) {
        const isSub = order.driver_type === 'subcontractor';
        const matchedDriver = order.driver_id
            ? drivers.find((d) => String(d.rawId) === String(order.driver_id))
            : drivers.find(
                (d) =>
                    order.driver_name &&
                    d.name.toLowerCase() === order.driver_name.toLowerCase()
            );
        const normPlate = (order.vehicle_plate || '').replace(/[\s-]/g, '').toUpperCase();
        const matchedVehicle = normPlate
            ? vehicles.find(
                (v) => v.registration_no?.replace(/[\s-]/g, '').toUpperCase() === normPlate
            )
            : undefined;
        const foundSub = order.subcontractor_company
            ? subs.find(
                (s) =>
                    s.name?.toLowerCase() === order.subcontractor_company?.toLowerCase()
            )
            : undefined;

        return {
            legNumber: 1,
            legType: 'pickup',
            executionMode: isSub ? 'subcontractor' : 'in_house',
            driverId: !isSub && matchedDriver ? String(matchedDriver.rawId) : '',
            vehicleId: !isSub && matchedVehicle ? String(matchedVehicle.id) : '',
            subcontractorId: isSub ? (foundSub ? String(foundSub.id) : 'custom') : '',
            subcontractorCompany: isSub ? order.subcontractor_company || '' : '',
            subcontractorDriverId: 'custom',
            subcontractorDriverName: isSub ? order.driver_name || '' : '',
            subcontractorDriverPhone: isSub ? order.driver_phone || '' : '',
            subcontractorDriverEmail: isSub ? order.driver_email || '' : '',
            subcontractorVehiclePlate: isSub ? order.vehicle_plate || '' : '',
            subcontractorVehicleType: order.vehicle_type || '',
            subcontractorCost: isSub
                ? String((order.raw as any)?.subcontractor_cost ?? '')
                : '',
            journeyLeg: order.subcontractor_journey_leg || defaultRoute,
            status: 'pending',
        };
    }

    // Leg 2 legacy fallback
    const isLeg2Sub = order.leg2_driver_type === 'subcontractor';
    const matchedDriver2 = order.leg2_driver_id
        ? drivers.find((d) => String(d.rawId) === String(order.leg2_driver_id))
        : drivers.find(
            (d) =>
                order.leg2_driver_name &&
                d.name.toLowerCase() === order.leg2_driver_name.toLowerCase()
        );
    const normPlate2 = (order.leg2_vehicle_plate || '').replace(/[\s-]/g, '').toUpperCase();
    const matchedVehicle2 = normPlate2
        ? vehicles.find(
            (v) => v.registration_no?.replace(/[\s-]/g, '').toUpperCase() === normPlate2
        )
        : undefined;
    const foundSub2 = order.leg2_subcontractor_company
        ? subs.find(
            (s) =>
                s.name?.toLowerCase() ===
                order.leg2_subcontractor_company?.toLowerCase()
        )
        : undefined;

    return {
        legNumber: 2,
        legType: 'delivery',
        executionMode: isLeg2Sub ? 'subcontractor' : 'in_house',
        driverId: !isLeg2Sub && matchedDriver2 ? String(matchedDriver2.rawId) : '',
        vehicleId: !isLeg2Sub && matchedVehicle2 ? String(matchedVehicle2.id) : '',
        subcontractorId: isLeg2Sub ? (foundSub2 ? String(foundSub2.id) : 'custom') : '',
        subcontractorCompany: isLeg2Sub ? order.leg2_subcontractor_company || '' : '',
        subcontractorDriverId: 'custom',
        subcontractorDriverName: isLeg2Sub ? order.leg2_driver_name || '' : '',
        subcontractorDriverPhone: isLeg2Sub ? order.leg2_driver_phone || '' : '',
        subcontractorDriverEmail: isLeg2Sub ? order.leg2_driver_email || '' : '',
        subcontractorVehiclePlate: isLeg2Sub ? order.leg2_vehicle_plate || '' : '',
        subcontractorVehicleType: order.leg2_vehicle_type || 'Curtainsider 40ft',
        subcontractorCost: isLeg2Sub && order.leg2_cost ? String(order.leg2_cost) : '',
        journeyLeg: order.leg2_journey_leg || defaultRoute,
        status: 'pending',
    };
};

export const useAssignDriverData = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<SupplierOrderItem[]>([]);
    const [fleetDrivers, setFleetDrivers] = useState<FleetDriverItem[]>([]);
    const [fleetVehicles, setFleetVehicles] = useState<FleetVehicleItem[]>([]);
    const [subcontractorsList, setSubcontractorsList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
        const stateOrder =
            location.state?.selectedOrder ||
            location.state?.orderData ||
            location.state?.order;
        return stateOrder
            ? String(
                stateOrder.id ||
                stateOrder.order_id ||
                stateOrder.order_no ||
                stateOrder.slug ||
                ''
            )
            : '';
    });

    const [isRelay, setIsRelay] = useState<boolean>(false);
    const [pickupLeg, setPickupLeg] = useState<LegAssignmentState>(() =>
        createDefaultLegState(1, 'pickup', 'Full Journey')
    );
    const [deliveryLeg, setDeliveryLeg] = useState<LegAssignmentState>(() =>
        createDefaultLegState(2, 'delivery', 'Transit Hub → Final Delivery')
    );
    const [dispatchNote, setDispatchNote] = useState<string>('');

    const [queueTab, setQueueTab] = useState<'pending' | 'assigned'>('pending');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fetchData = useCallback(
        async (refresh = false) => {
            if (refresh) setIsRefreshing(true);
            else setIsLoading(true);

            try {
                const [ordersRes, driversRes, vehiclesRes, subsRes] =
                    await Promise.allSettled([
                        apiClient.get('/supplier/orders', {
                            params: { tab: 'active', per_page: 100 },
                        }),
                        apiClient.get('/supplier/availability/drivers'),
                        apiClient.get('/supplier/availability/vehicles'),
                        apiClient.get('/supplier/subcontractors'),
                    ]);

                let mappedOrders: SupplierOrderItem[] = [];
                if (ordersRes.status === 'fulfilled') {
                    const val = ordersRes.value;
                    const rawList =
                        (Array.isArray(val?.data?.orders) && val.data.orders) ||
                        (Array.isArray(val?.data?.data?.orders) &&
                            val.data.data.orders) ||
                        (Array.isArray(val?.data?.data) && val.data.data) ||
                        (Array.isArray(val?.orders) && val.orders) ||
                        (Array.isArray(val?.data) && val.data) ||
                        [];

                    mappedOrders = rawList.map(mapApiToSupplierOrderItem);
                    const stateOrder =
                        location.state?.selectedOrder ||
                        location.state?.orderData ||
                        location.state?.order;
                    if (stateOrder) {
                        const targetId = String(
                            stateOrder.id ||
                            stateOrder.order_id ||
                            stateOrder.order_no ||
                            stateOrder.slug ||
                            ''
                        );
                        if (!mappedOrders.some((o) => matchOrder(o, targetId))) {
                            mappedOrders.unshift(
                                mapApiToSupplierOrderItem(stateOrder)
                            );
                        }
                        setSelectedOrderId((prev) => prev || targetId);
                    }
                    setOrders(mappedOrders);
                }

                let loadedDrivers: FleetDriverItem[] = [];
                if (driversRes.status === 'fulfilled') {
                    const rawDrivers =
                        driversRes.value.data?.data?.drivers ||
                        driversRes.value.data?.drivers ||
                        driversRes.value.data?.data ||
                        [];
                    if (Array.isArray(rawDrivers)) {
                        loadedDrivers = rawDrivers.map((d: any, idx: number) => {
                            const statusNorm = String(d.status || 'Available');
                            const avail = statusNorm;
                            return {
                                id: `inhouse_${d.user_id || d.id || idx}`,
                                rawId: d.user_id || d.id || idx,
                                user_id: d.user_id || Number(d.id),
                                name: d.name || `Driver ${idx + 1}`,
                                phone: d.phone || '—',
                                license: d.license || 'DL-VERIFIED',
                                vehiclePlate:
                                    d.vehicle?.registration_no ||
                                    d.vehicle?.plate ||
                                    '',
                                vehicleType: d.vehicle?.type || 'Standard Fleet',
                                role: d.role || 'In-House Fleet',
                                status: statusNorm,
                                availabilityStatus: avail,
                                account_status: d.account_status || 'active',
                                duty_status: d.duty_status || 'online',
                                job_status: d.job_status || (statusNorm === 'On Job' ? 'on_job' : 'available'),
                                is_eligible: typeof d.is_eligible === 'boolean' ? d.is_eligible : (statusNorm === 'Available'),
                                disqualification_reason: d.disqualification_reason || null,
                                active_assignment: d.active_assignment || null,
                                dutyStatus: d.duty_status,
                                userStatus: d.account_status || d.user_status,
                                email: d.email || '',
                                driverType: 'internal',
                            };
                        });
                    }
                }
                setFleetDrivers(loadedDrivers);

                let loadedVehicles: FleetVehicleItem[] = [];
                if (vehiclesRes.status === 'fulfilled') {
                    const rawVehicles =
                        vehiclesRes.value.data?.data?.vehicles ||
                        vehiclesRes.value.data?.vehicles ||
                        vehiclesRes.value.data?.data ||
                        [];
                    if (Array.isArray(rawVehicles)) {
                        loadedVehicles = rawVehicles.map((v: any) => ({
                            id: String(v.id),
                            name: v.name || 'Fleet Vehicle',
                            type: v.type || 'Van',
                            registration_no: v.registration_no || v.plate || '',
                            capacity: v.capacity || '',
                            capacity_kg: v.capacity_kg,
                            status: v.status || 'Active',
                            assigned_driver: v.assigned_driver,
                            driver_id: v.driver_id,
                            current_order_id: v.current_order_id,
                            current_order_number: v.current_order_number,
                        }));
                    }
                }
                setFleetVehicles(loadedVehicles);

                let loadedSubs: any[] = [];
                if (subsRes.status === 'fulfilled') {
                    const subs =
                        subsRes.value.data?.data || subsRes.value.data || [];
                    if (Array.isArray(subs)) {
                        loadedSubs = subs;
                        setSubcontractorsList(subs);
                    }
                }

                // Hydrate legs if order came via location.state
                const stateOrder =
                    location.state?.selectedOrder ||
                    location.state?.orderData ||
                    location.state?.order;
                const targetId = stateOrder
                    ? String(
                        stateOrder.id ||
                        stateOrder.order_id ||
                        stateOrder.order_no ||
                        stateOrder.slug ||
                        ''
                    )
                    : '';
                if (targetId && mappedOrders.length > 0) {
                    const target = mappedOrders.find((o) =>
                        matchOrder(o, targetId)
                    );
                    if (target) {
                        const relayActive = Boolean(
                            target.is_relay ||
                            target.leg2_driver_name ||
                            (Array.isArray(target.shipment_legs) &&
                                target.shipment_legs.length > 1)
                        );
                        setIsRelay(relayActive);
                        setPickupLeg(
                            hydrateLegFromOrder(
                                target,
                                1,
                                loadedDrivers,
                                loadedVehicles,
                                loadedSubs
                            )
                        );
                        setDeliveryLeg(
                            hydrateLegFromOrder(
                                target,
                                2,
                                loadedDrivers,
                                loadedVehicles,
                                loadedSubs
                            )
                        );
                    }
                }
            } catch (err) {
                console.error('Error fetching dispatch data:', err);
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [location.state]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const selectedOrder = useMemo(() => {
        if (!selectedOrderId) return null;
        return orders.find((o) => matchOrder(o, selectedOrderId)) || null;
    }, [orders, selectedOrderId]);

    const handleSelectOrder = (idVal: string) => {
        setSelectedOrderId(idVal);
        if (!idVal) {
            setIsRelay(false);
            setPickupLeg(createDefaultLegState(1, 'pickup', 'Full Journey'));
            setDeliveryLeg(
                createDefaultLegState(
                    2,
                    'delivery',
                    'Transit Hub → Final Delivery'
                )
            );
            return;
        }

        const target = orders.find((o) => matchOrder(o, idVal));
        if (target) {
            const relayActive = Boolean(
                target.is_relay ||
                target.leg2_driver_name ||
                (Array.isArray(target.shipment_legs) &&
                    target.shipment_legs.length > 1)
            );
            setIsRelay(relayActive);
            setPickupLeg(
                hydrateLegFromOrder(
                    target,
                    1,
                    fleetDrivers,
                    fleetVehicles,
                    subcontractorsList
                )
            );
            setDeliveryLeg(
                hydrateLegFromOrder(
                    target,
                    2,
                    fleetDrivers,
                    fleetVehicles,
                    subcontractorsList
                )
            );
        }
    };

    const handleToggleRelay = (relay: boolean) => {
        setIsRelay(relay);
        const fromCity = selectedOrder?.pickup_city || 'Origin';
        const toCity = selectedOrder?.delivery_city || 'Destination';
        setPickupLeg((prev) => ({
            ...prev,
            journeyLeg: relay
                ? prev.journeyLeg === `${fromCity} → ${toCity}` ||
                    prev.journeyLeg === 'Full Journey'
                    ? `${fromCity} → Transit Hub`
                    : prev.journeyLeg
                : `${fromCity} → ${toCity}`,
        }));
        if (relay) {
            setDeliveryLeg((prev) => ({
                ...prev,
                journeyLeg:
                    prev.journeyLeg && prev.journeyLeg !== 'Transit Hub → Final Delivery'
                        ? prev.journeyLeg
                        : `Transit Hub → ${toCity}`,
            }));
        }
    };

    const updatePickupLeg = (updates: Partial<LegAssignmentState>) => {
        setPickupLeg((prev) => ({ ...prev, ...updates }));
    };

    const updateDeliveryLeg = (updates: Partial<LegAssignmentState>) => {
        setDeliveryLeg((prev) => ({ ...prev, ...updates }));
    };

    const customerPriceNum = useMemo(() => {
        if (!selectedOrder) return 0;
        if (
            typeof selectedOrder.amount_raw === 'number' &&
            !Number.isNaN(selectedOrder.amount_raw) &&
            selectedOrder.amount_raw > 0
        ) {
            return selectedOrder.amount_raw;
        }
        const raw = String(
            selectedOrder.agreed_price || selectedOrder.total_amount || '0'
        ).replace(/[^0-9.]/g, '');
        return parseFloat(raw) || 0;
    }, [selectedOrder]);

    const financialSummary = useMemo(
        () =>
            calculateDispatchFinancials(
                customerPriceNum,
                isRelay,
                pickupLeg,
                deliveryLeg
            ),
        [customerPriceNum, isRelay, pickupLeg, deliveryLeg]
    );

    const handleClear = () => {
        setSelectedOrderId('');
        setIsRelay(false);
        setPickupLeg(createDefaultLegState(1, 'pickup', 'Full Journey'));
        setDeliveryLeg(
            createDefaultLegState(2, 'delivery', 'Transit Hub → Final Delivery')
        );
        setDispatchNote('');
    };

    const handleDispatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) {
            toast({
                title: 'Select a Shipment',
                description: 'Please select an active shipment first.',
                variant: 'destructive',
            });
            return;
        }

        const leg1Error = validateLegAssignment(
            pickupLeg,
            isRelay ? 'Pickup Assignment (Leg 1)' : 'Dispatch Assignment',
            fleetDrivers,
            fleetVehicles
        );
        if (leg1Error) {
            toast({
                title: 'Validation Error',
                description: leg1Error,
                variant: 'destructive',
            });
            return;
        }

        if (isRelay) {
            const leg2Error = validateLegAssignment(
                deliveryLeg,
                'Delivery Assignment (Leg 2)',
                fleetDrivers,
                fleetVehicles
            );
            if (leg2Error) {
                toast({
                    title: 'Validation Error',
                    description: leg2Error,
                    variant: 'destructive',
                });
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const cleanId = String(
                selectedOrder.rawId ||
                selectedOrder.id ||
                selectedOrder.order_id
            );

            const payload: Record<string, any> = {
                is_relay: isRelay,
                dispatch_note: dispatchNote.trim() || undefined,
                pickup_leg: buildLegApiPayload(pickupLeg),
            };

            if (isRelay) {
                payload.delivery_leg = buildLegApiPayload(deliveryLeg);
            }

            await apiClient.post(
                `/supplier/orders/${cleanId}/assign-driver`,
                payload
            );

            toast({
                title: isRelay
                    ? 'Multi-Leg Relay Dispatched!'
                    : 'Shipment Dispatched!',
                description: isRelay
                    ? `Pickup (Leg 1) and Delivery (Leg 2) allocated for #${selectedOrder.order_id || cleanId
                    }.`
                    : `Driver allocated for #${selectedOrder.order_id || cleanId
                    }.`,
            });

            setDispatchNote('');
            navigate('/supplier/orders/active-jobs');
        } catch (err: any) {
            console.error('Error dispatching shipment:', err);
            toast({
                title: 'Dispatch Failed',
                description:
                    err?.response?.data?.message ||
                    'Failed to update dispatch assignment.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAssignedCheck = (o: SupplierOrderItem) => {
        const rawStatus = (o.status_raw || o.status || 'confirmed')
            .toLowerCase()
            .trim();
        const hasRealDriver = checkHasRealDriver(o);
        return (
            rawStatus === 'in_transit' ||
            rawStatus === 'picked_up' ||
            rawStatus === 'driver_assigned' ||
            hasRealDriver
        );
    };

    const pendingOrders = useMemo(
        () => orders.filter((o) => !isAssignedCheck(o)),
        [orders]
    );
    const assignedOrders = useMemo(
        () => orders.filter((o) => isAssignedCheck(o)),
        [orders]
    );

    const filteredQueue = useMemo(() => {
        const base = queueTab === 'pending' ? pendingOrders : assignedOrders;
        if (!searchQuery) return base;
        const q = searchQuery.toLowerCase();
        return base.filter(
            (o) =>
                (o.order_id && o.order_id.toLowerCase().includes(q)) ||
                (o.customer_name &&
                    o.customer_name.toLowerCase().includes(q)) ||
                (o.pickup_city && o.pickup_city.toLowerCase().includes(q)) ||
                (o.delivery_city && o.delivery_city.toLowerCase().includes(q))
        );
    }, [queueTab, pendingOrders, assignedOrders, searchQuery]);

    return {
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
        queueTab,
        setQueueTab,
        searchQuery,
        setSearchQuery,
        filteredQueue,
        pendingCount: pendingOrders.length,
        assignedCount: assignedOrders.length,
        handleSelectOrder,
        handleDispatchSubmit,
        handleClear,
        fetchData,
    };
};

export default useAssignDriverData;
