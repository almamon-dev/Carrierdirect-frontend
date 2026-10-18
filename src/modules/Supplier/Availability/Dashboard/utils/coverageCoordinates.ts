import apiClient from '@/lib/axios';
import { ServiceAreaSummary } from '../types/coverage.types';

let cachedGoogleKey: string | null = null;

export const fetchGoogleMapsApiKey = async (): Promise<string | null> => {
    if (cachedGoogleKey) return cachedGoogleKey;
    try {
        const res: any = await apiClient.get('/maps-config', { silent: true });
        const key = res?.google_maps_key || res?.data?.google_maps_key;
        if (key) {
            cachedGoogleKey = key;
            return key;
        }
    } catch {
        // fallback
    }
    return null;
};

export const CHART_COLORS = [
    '#ff4a1f', // Primary Orange
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#8b5cf6', // Violet
    '#f59e0b', // Amber
    '#ec4899', // Pink
];

export const getCoordinatesForArea = (area: ServiceAreaSummary): [number, number] | null => {
    if (area.latitude !== undefined && area.longitude !== undefined && !isNaN(Number(area.latitude)) && !isNaN(Number(area.longitude))) {
        return [Number(area.latitude), Number(area.longitude)];
    }
    if (Array.isArray(area.coordinates) && area.coordinates.length === 2 && !isNaN(Number(area.coordinates[0])) && !isNaN(Number(area.coordinates[1]))) {
        return [Number(area.coordinates[0]), Number(area.coordinates[1])];
    }
    return null;
};
