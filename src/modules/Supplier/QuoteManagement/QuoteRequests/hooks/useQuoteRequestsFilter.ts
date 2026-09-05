import { useMemo, useState } from 'react';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { RequestFilterTab } from '../components/QuoteRequestsFilterTabs';
import {
    isRequestToday,
    isRequestUpcoming,
    isRequestUrgent
} from '../utils/requestDateFilters';

export function useQuoteRequestsFilter(requests: QuoteRequest[]) {
    const [activeTab, setActiveTab] = useState<RequestFilterTab>('all');
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
        setActiveTab('all');
    };

    const filteredRequests = useMemo(() => {
        return requests.filter((item) => {
            if (!item) return false;

            if (activeTab === 'today' && !isRequestToday(item)) return false;
            if (activeTab === 'upcoming' && !isRequestUpcoming(item)) return false;
            if (activeTab === 'urgent' && !isRequestUrgent(item)) return false;

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
