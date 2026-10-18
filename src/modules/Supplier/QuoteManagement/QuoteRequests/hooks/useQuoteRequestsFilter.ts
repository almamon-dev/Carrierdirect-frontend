import { useMemo, useState } from 'react';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { RequestFilterTab } from '../components/QuoteRequestsFilterTabs';

export function useQuoteRequestsFilter(requests: QuoteRequest[]) {
    const [activeTab, setActiveTab] = useState<RequestFilterTab>('new');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [vehicleFilter, setVehicleFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleResetFilters = () => {
        setPriorityFilter('all');
        setStatusFilter('all');
        setVehicleFilter('all');
        setStartDate('');
        setEndDate('');
        // Preserve activeTab as per specification
    };

    const filteredRequests = useMemo(() => {
        return requests.filter((item) => {
            if (!item) return false;

            const isExp = Boolean(item.isExpired || (item as any).is_expired || (item.status || '').toLowerCase() === 'expired');
            const hasQuoted = Boolean(item.hasQuoted || item.isQuoted || (item.status || "").toLowerCase() === "quoted");
            const hasViewed = Boolean((item as any).hasViewed || (item as any).isViewed || item.supplierStatus === "Viewed" || (item.status || "").toLowerCase() === "viewed");

            if (activeTab === 'new') {
                if (isExp || hasQuoted || hasViewed) return false;
            } else if (activeTab === 'viewed') {
                if (isExp || hasQuoted || !hasViewed) return false;
            } else if (activeTab === 'expired') {
                if (!isExp) return false;
            }

            if (priorityFilter !== 'all') {
                const normPriority = (item.priority || '').toLowerCase();
                if (!normPriority.includes(priorityFilter.toLowerCase())) return false;
            }

            if (statusFilter !== 'all') {
                const normStatus = (item.status || '').toLowerCase();
                if (!normStatus.includes(statusFilter.toLowerCase())) return false;
            }

            if (vehicleFilter !== 'all') {
                const normVehicle = (item.vehicleType || '').toLowerCase().replace(/[\s_-]+/g, '');
                const targetVehicle = vehicleFilter.toLowerCase().replace(/[\s_-]+/g, '');
                if (!normVehicle.includes(targetVehicle)) return false;
            }

            if (startDate || endDate) {
                const dateVal = item.pickupDate || item.requestDate;
                if (dateVal) {
                    try {
                        const itemTime = new Date(dateVal).getTime();
                        if (!isNaN(itemTime)) {
                            if (startDate) {
                                const start = new Date(startDate);
                                start.setHours(0, 0, 0, 0);
                                if (itemTime < start.getTime()) return false;
                            }
                            if (endDate) {
                                const end = new Date(endDate);
                                end.setHours(23, 59, 59, 999);
                                if (itemTime > end.getTime()) return false;
                            }
                        }
                    } catch { }
                }
            }

            return true;
        });
    }, [requests, activeTab, priorityFilter, statusFilter, vehicleFilter, startDate, endDate]);

    return {
        activeTab,
        setActiveTab,
        priorityFilter,
        setPriorityFilter,
        statusFilter,
        setStatusFilter,
        vehicleFilter,
        setVehicleFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleResetFilters,
        filteredRequests,
    };
}
