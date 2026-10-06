import { useState, useEffect } from 'react';
import { driverApi } from '../../services/driverApi';
import { ShipmentItem } from '../../types';

export function useDriverDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [activeTrip, setActiveTrip] = useState<any>(null);
    const [telemetry, setTelemetry] = useState<any>(null);
    const [shipments, setShipments] = useState<ShipmentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        try {
            const [m, t, tel, s] = await Promise.all([
                driverApi.getDashboardMetrics(),
                driverApi.getActiveTripSummary(),
                driverApi.getTelemetry(),
                driverApi.getShipments(),
            ]);
            setMetrics(m);
            setActiveTrip(t);
            setTelemetry(tel);
            setShipments(s);
        } catch (err) {
            console.error('Failed to load driver dashboard data', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return {
        metrics,
        activeTrip,
        telemetry,
        shipments,
        isLoading,
        reload: loadData,
    };
}
