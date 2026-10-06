import { useState, useEffect, useMemo } from 'react';
import { driverApi } from '../../services/driverApi';
import { ShipmentItem, ShipmentStatus } from '../../types';

export function useDriverShipments() {
    const [shipments, setShipments] = useState<ShipmentItem[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'assigned' | 'delivered'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadShipments = async () => {
        try {
            const data = await driverApi.getShipments();
            setShipments(data);
        } catch (err) {
            console.error('Failed to load shipments', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadShipments();
    }, []);

    const filteredShipments = useMemo(() => {
        return shipments.filter((item) => {
            // Tab filter
            if (activeTab === 'active' && item.status !== 'in_transit' && item.status !== 'at_pickup' && item.status !== 'at_delivery') {
                return false;
            }
            if (activeTab === 'assigned' && item.status !== 'assigned' && item.status !== 'accepted') {
                return false;
            }
            if (activeTab === 'delivered' && item.status !== 'delivered') {
                return false;
            }

            // Search query filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchOrder = item.orderNumber.toLowerCase().includes(q);
                const matchTracking = item.trackingNumber.toLowerCase().includes(q);
                const matchShipper = item.shipper.company.toLowerCase().includes(q) || item.shipper.city.toLowerCase().includes(q);
                const matchConsignee = item.consignee.company.toLowerCase().includes(q) || item.consignee.city.toLowerCase().includes(q);
                if (!matchOrder && !matchTracking && !matchShipper && !matchConsignee) return false;
            }

            return true;
        });
    }, [shipments, activeTab, searchQuery]);

    const counts = useMemo(() => {
        return {
            all: shipments.length,
            active: shipments.filter((s) => s.status === 'in_transit' || s.status === 'at_pickup' || s.status === 'at_delivery').length,
            assigned: shipments.filter((s) => s.status === 'assigned' || s.status === 'accepted').length,
            delivered: shipments.filter((s) => s.status === 'delivered').length,
        };
    }, [shipments]);

    return {
        shipments: filteredShipments,
        allShipments: shipments,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        counts,
        isLoading,
        reload: loadShipments,
    };
}
