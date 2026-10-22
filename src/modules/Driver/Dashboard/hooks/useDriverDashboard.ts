import { useState, useEffect, useCallback } from 'react';
import { driverApi } from '../../services/driverApi';
import { ShipmentItem } from '../../types';
import { echo } from '@/lib/echo';

export function useDriverDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [activeTrip, setActiveTrip] = useState<any>(null);
    const [telemetry, setTelemetry] = useState<any>(null);
    const [shipments, setShipments] = useState<ShipmentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async (silent = false) => {
        if (!silent) {
            setIsLoading(true);
        }
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
            if (!silent) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        loadData();

        // 1. Sync on any in-app notification or status event
        const handleSync = () => {
            loadData(true);
        };

        window.addEventListener('carrierdirect_notif_update', handleSync);
        window.addEventListener('order-status-updated', handleSync);
        window.addEventListener('carrierdirect_shipment_updated', handleSync);

        // 2. Real-time WebSocket subscription via Laravel Echo / Reverb
        let channel: any = null;
        try {
            const userStr = localStorage.getItem('user');
            const parsedUser = userStr ? JSON.parse(userStr) : null;
            const uid = parsedUser?.id;

            if (uid && echo) {
                channel = echo.private(`App.Models.User.${uid}`);
                channel.notification(() => {
                    loadData(true);
                });
                channel.listen('.DriverShipmentUpdated', () => {
                    loadData(true);
                });
                channel.listen('.OrderAssigned', () => {
                    loadData(true);
                });
            }
        } catch (e) {
            console.warn('Driver Dashboard Echo subscription error:', e);
        }

        // 3. Fallback poller every 10 seconds for real-time freshness
        const pollInterval = setInterval(() => {
            loadData(true);
        }, 10000);

        return () => {
            window.removeEventListener('carrierdirect_notif_update', handleSync);
            window.removeEventListener('order-status-updated', handleSync);
            window.removeEventListener('carrierdirect_shipment_updated', handleSync);
            clearInterval(pollInterval);
            if (channel) {
                try {
                    channel.stopListening('.DriverShipmentUpdated');
                    channel.stopListening('.OrderAssigned');
                } catch (_) {}
            }
        };
    }, [loadData]);

    return {
        metrics,
        activeTrip,
        telemetry,
        shipments,
        isLoading,
        reload: loadData,
    };
}
