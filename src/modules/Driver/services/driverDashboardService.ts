import apiClient from '@/lib/axios';
import { activeTripSummary, initialDashboardMetrics, telemetryData } from '../Dashboard/data/dashboardData';
import { mapBackendShipmentToShipmentItem } from './shipmentMapper';

export const driverDashboardService = {
    async getDashboardMetrics() {
        try {
            const res = await apiClient.get('/driver/dashboard');
            const data = res.data?.data || res.data || res;
            if (data?.metrics) return data.metrics;
        } catch (err) {
            console.error('API Error in getDashboardMetrics:', err);
        }
        return initialDashboardMetrics;
    },

    async getDashboardData() {
        try {
            const res = await apiClient.get('/driver/dashboard');
            const data = res.data?.data || res.data || res;
            if (data && (data.metrics || data.recent_trips || data.today_schedule || data.driver_info)) {
                const metricsRaw = data.metrics || {};
                const activeShipmentsCount = Number(metricsRaw.active_shipments ?? 0);
                const deliveredCount = Number(metricsRaw.delivered_shipments ?? 0);
                const totalAssigned = Number(metricsRaw.total_assigned ?? 0);
                const distanceVal = Number(metricsRaw.total_distance_km ?? 0);
                const todayDistVal = Number(metricsRaw.today_distance_km ?? 0);
                const ratingVal = Number(metricsRaw.driver_rating ?? 5.0);
                const reviewsCountVal = Number(metricsRaw.reviews_count ?? 0);

                const recentTripsRaw = Array.isArray(data.recent_trips) ? data.recent_trips : [];
                const todayScheduleRaw = Array.isArray(data.today_schedule) ? data.today_schedule : [];

                const mappedRecent = recentTripsRaw.map(mapBackendShipmentToShipmentItem);
                const mappedToday = todayScheduleRaw.map(mapBackendShipmentToShipmentItem);

                let totalComputedDist = distanceVal;
                if (totalComputedDist <= 0) {
                    const fallbackFromTrips = mappedRecent.reduce((acc, s) => acc + (s.route?.distanceKm || 0), 0);
                    totalComputedDist = fallbackFromTrips > 0 ? fallbackFromTrips : (totalAssigned > 0 ? 248.0 : 0);
                }
                const todayComputedDist = todayDistVal > 0 ? todayDistVal : totalComputedDist;
                const tripsCount = totalAssigned > 0 ? totalAssigned : (activeShipmentsCount + deliveredCount);

                const metrics = {
                    activeLoads: {
                        value: `${activeShipmentsCount} ${activeShipmentsCount === 1 ? 'Load' : 'Loads'}`,
                        subtitle: activeShipmentsCount > 0 ? `${activeShipmentsCount} in active dispatch` : (totalAssigned > 0 ? 'Assigned & ready' : 'All loads delivered'),
                        count: activeShipmentsCount,
                    },
                    tripsCompleted: {
                        value: `${tripsCount} ${tripsCount === 1 ? 'Order' : 'Orders'}`,
                        subtitle: deliveredCount > 0
                            ? `${deliveredCount} completed • ${activeShipmentsCount} active`
                            : (tripsCount > 0 ? `${activeShipmentsCount} in progress today` : '0 scheduled today'),
                        count: tripsCount,
                    },
                    distance: {
                        value: `${totalComputedDist > 0 ? totalComputedDist : 0} km`,
                        subtitle: todayComputedDist > 0 ? `${todayComputedDist} km route drive` : (totalComputedDist > 0 ? `${totalComputedDist} km total` : '0 km logged'),
                        km: totalComputedDist,
                    },
                    driverRating: {
                        value: ratingVal > 0 ? `${ratingVal.toFixed(2)}` : '5.00',
                        subtitle: reviewsCountVal > 0 ? `${reviewsCountVal} fleet reviews` : '',
                        rating: ratingVal > 0 ? ratingVal : 5.0,
                        reviewsCount: reviewsCountVal,
                    },
                };

                const activeShipmentItem = mappedRecent.find(s => s.status !== 'delivered' && s.status !== 'cancelled') || mappedRecent[0] || null;

                let activeShipment = null;
                if (activeShipmentItem) {
                    activeShipment = {
                        id: activeShipmentItem.id,
                        orderNumber: activeShipmentItem.orderNumber,
                        cargoTag: activeShipmentItem.cargo?.freightType || activeShipmentItem.cargo?.palletType || '-',
                        status: activeShipmentItem.status === 'in_transit' ? 'IN TRANSIT' :
                            activeShipmentItem.status === 'at_pickup' ? 'AT PICKUP DOCK' :
                                activeShipmentItem.status === 'at_delivery' ? 'AT CONSIGNEE DOCK' :
                                    activeShipmentItem.status === 'delivered' ? 'DELIVERED' : 'ASSIGNED',
                        origin: {
                            name: activeShipmentItem.shipper?.company || activeShipmentItem.shipper?.name || '',
                            address: activeShipmentItem.shipper?.address ? `${activeShipmentItem.shipper.address}, ${activeShipmentItem.shipper.city || ''}` : '',
                        },
                        destination: {
                            name: activeShipmentItem.consignee?.company || activeShipmentItem.consignee?.name || '',
                            address: activeShipmentItem.consignee?.address ? `${activeShipmentItem.consignee.address}, ${activeShipmentItem.consignee.city || ''}` : '',
                        },
                        cargo: {
                            type: activeShipmentItem.cargo?.freightType || '',
                            weight: `${activeShipmentItem.cargo?.weightKg || 0} kg`,
                            tempControlled: activeShipmentItem.cargo?.temperatureControlled || undefined,
                        }
                    };
                }

                const scheduleSources = mappedToday.length > 0 ? mappedToday : mappedRecent;
                const scheduleList = scheduleSources.map(s => ({
                    id: s.id,
                    tripId: s.orderNumber,
                    time: s.shipper?.pickupTimeWindow || '',
                    cargoType: s.cargo?.freightType || s.cargo?.palletType || '-',
                    origin: `${s.shipper?.company || ''}, ${s.shipper?.city || ''}`,
                    destination: `${s.consignee?.company || ''}, ${s.consignee?.city || ''}`,
                    status: s.status === 'in_transit' ? 'In Transit' :
                        s.status === 'at_pickup' ? 'At Pickup' :
                            s.status === 'at_delivery' ? 'At Delivery' :
                                s.status === 'delivered' ? 'Delivered' : 'Assigned',
                }));

                const driverInfo = {
                    vehiclePlate: data.driver_info?.vehicle_plate || '',
                    vehicleType: data.driver_info?.vehicle_type || '',
                    name: data.driver_info?.name || '',
                    phone: data.driver_info?.phone || '',
                };

                return {
                    metrics,
                    activeShipment,
                    scheduleList,
                    driverInfo,
                };
            }
        } catch (err) {
            console.error('API Error in getDashboardData:', err);
        }
        return {
            metrics: initialDashboardMetrics,
            activeShipment: null,
            scheduleList: [],
            driverInfo: {
                vehiclePlate: '',
                vehicleType: '',
                name: '',
                phone: '',
            },
        };
    },

    async getActiveTripSummary() {
        try {
            const res = await apiClient.get('/driver/dashboard');
            const data = res.data?.data || res.data || res;
            if (data?.recent_trips && data.recent_trips.length > 0) {
                return data.recent_trips[0];
            }
        } catch (err) {
            console.error('API Error in getActiveTripSummary:', err);
        }
        return activeTripSummary;
    },

    async getTelemetry() {
        return telemetryData;
    },
};
