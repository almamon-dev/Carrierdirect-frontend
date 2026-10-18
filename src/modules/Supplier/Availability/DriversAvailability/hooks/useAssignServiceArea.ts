import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { DriverItem } from '../types/driverAvailability.types';
import { ServiceAreaOption } from '../components/AssignServiceAreaFormFields';

export function useAssignServiceArea(
    driver: DriverItem | null,
    isOpen: boolean,
    onSuccess: (updatedDriver: DriverItem) => void,
    onClose: () => void
) {
    const showToast = useToastStore((state) => state.showToast);
    const [serviceAreas, setServiceAreas] = useState<ServiceAreaOption[]>([]);
    const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
    const [isLoadingAreas, setIsLoadingAreas] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        async function fetchServiceAreas() {
            setIsLoadingAreas(true);
            try {
                const res = await apiClient.get('/supplier/service-areas');
                const rawList = res.data?.data || res.data || [];
                if (Array.isArray(rawList) && isMounted) {
                    const mapped: ServiceAreaOption[] = rawList.map((item: any) => {
                        const parts = [item.city, item.state, item.country].filter(Boolean);
                        let formatted = parts.length > 0 ? parts.join(', ') : `Whole Country (${item.country})`;
                        if (item.postal_code) {
                            formatted += ` (${item.postal_code})`;
                        }
                        return {
                            id: item.id,
                            country: item.country || 'Unknown',
                            state: item.state,
                            city: item.city,
                            postal_code: item.postal_code,
                            radius_km: item.radius_km,
                            formatted,
                            is_active: Boolean(item.is_active ?? true),
                        };
                    });
                    setServiceAreas(mapped);

                    // Initialize assigned service areas for driver
                    if (driver) {
                        if (Array.isArray(driver.service_area_ids) && driver.service_area_ids.length > 0) {
                            setSelectedAreaIds(driver.service_area_ids.map(String));
                        } else if (Array.isArray(driver.service_areas) && driver.service_areas.length > 0) {
                            setSelectedAreaIds(driver.service_areas.map((a: any) => String(a.id || a)));
                        } else if (driver.service_area_id) {
                            setSelectedAreaIds([String(driver.service_area_id)]);
                        } else if (driver.assignedServiceArea && typeof driver.assignedServiceArea === 'string') {
                            const names = driver.assignedServiceArea.split(',').map(s => s.trim().toLowerCase());
                            const matched = mapped.filter(a =>
                                names.some(n => a.formatted.toLowerCase().includes(n) || (a.city && a.city.toLowerCase().includes(n)))
                            );
                            if (matched.length > 0) {
                                setSelectedAreaIds(matched.map(m => String(m.id)));
                            } else {
                                setSelectedAreaIds([]);
                            }
                        } else {
                            setSelectedAreaIds([]);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load service areas:', err);
            } finally {
                if (isMounted) setIsLoadingAreas(false);
            }
        }

        fetchServiceAreas();
        return () => { isMounted = false; };
    }, [isOpen, driver]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!driver) return;
        if (selectedAreaIds.length === 0) {
            showToast('Please select at least one service area to assign.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const numericIds = selectedAreaIds.map(Number).filter(Boolean);
            const primaryId = numericIds[0];

            const payload = {
                service_area_id: primaryId,
                service_area_ids: numericIds,
                service_areas: numericIds,
            };

            const res = await apiClient.post(`/supplier/availability/drivers/${driver.id}/assign-service-area`, payload);

            const isSuccess = res?.success ?? res?.data?.success ?? true;
            const resData = res?.data?.data || res?.data || res;

            const matchedAreas = serviceAreas.filter(a => selectedAreaIds.includes(String(a.id)));
            const formattedNames = matchedAreas.map(a => a.city || a.formatted).join(', ');

            const updatedDriver: DriverItem = {
                ...driver,
                ...(typeof resData === 'object' ? resData : {}),
                service_area_id: primaryId,
                service_area_ids: numericIds,
                service_area: matchedAreas[0] ? {
                    id: matchedAreas[0].id,
                    country: matchedAreas[0].country,
                    state: matchedAreas[0].state,
                    city: matchedAreas[0].city,
                    postal_code: matchedAreas[0].postal_code,
                    radius_km: matchedAreas[0].radius_km,
                    formatted: matchedAreas[0].formatted,
                    is_active: matchedAreas[0].is_active,
                } : driver.service_area,
                service_areas: matchedAreas,
                assignedServiceArea: formattedNames || matchedAreas[0]?.formatted || driver.assignedServiceArea,
            };

            showToast(`${matchedAreas.length} service area${matchedAreas.length > 1 ? 's' : ''} assigned to ${driver.name} successfully!`, 'success');
            onSuccess(updatedDriver);
            onClose();
        } catch (err: any) {
            console.error('Assign service area error:', err);
            showToast(err.response?.data?.message || 'Failed to assign service area.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = async () => {
        if (!driver) return;
        if (!window.confirm(`Are you sure you want to remove all assigned service areas from ${driver.name}?`)) {
            return;
        }

        setIsRemoving(true);
        try {
            await apiClient.delete(`/supplier/availability/drivers/${driver.id}/remove-service-area`).catch(() => {
                return apiClient.post(`/supplier/availability/drivers/${driver.id}/assign-service-area`, {
                    service_area_id: null,
                    service_area_ids: [],
                    service_areas: [],
                });
            });

            const updatedDriver: DriverItem = {
                ...driver,
                service_area_id: null,
                service_area_ids: [],
                service_area: null,
                service_areas: [],
                assignedServiceArea: null,
            };

            showToast(`Service areas removed from ${driver.name} successfully.`, 'success');
            onSuccess(updatedDriver);
            onClose();
        } catch (err: any) {
            console.error('Remove service area error:', err);
            showToast(err.response?.data?.message || 'Failed to remove service area.', 'error');
        } finally {
            setIsRemoving(false);
        }
    };

    return {
        serviceAreas,
        selectedAreaIds,
        setSelectedAreaIds,
        isLoadingAreas,
        isSubmitting,
        isRemoving,
        handleSubmit,
        handleRemove,
    };
}
