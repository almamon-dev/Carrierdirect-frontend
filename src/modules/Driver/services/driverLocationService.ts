import apiClient from '@/lib/axios';

export interface DriverLocationRecord {
    latitude: number;
    longitude: number;
    current_location?: string;
    last_updated_at?: string;
    duty_status?: string;
}

export const driverLocationService = {
    /**
     * Get Driver's Last Known Coordinates from backend API (`GET /v1/driver/location`)
     */
    async getLastKnownLocation(): Promise<DriverLocationRecord | null> {
        try {
            const res = await apiClient.get('/v1/driver/location', { silent: true });
            const payload = res?.data?.data || res?.data || res;
            if (payload?.latitude && payload?.longitude && !isNaN(Number(payload.latitude)) && !isNaN(Number(payload.longitude))) {
                return {
                    latitude: Number(payload.latitude),
                    longitude: Number(payload.longitude),
                    current_location: payload.current_location,
                    last_updated_at: payload.last_updated_at,
                    duty_status: payload.duty_status,
                };
            }
        } catch (_) {
            // Silently handled - fallback to browser GPS
        }
        return null;
    },

    /**
     * Synchronize Driver's live GPS coordinates to backend (`POST /v1/driver/location`)
     * Exactly matching Flutter mobile driver app's OrderGpsTrackerService
     */
    async updateLiveLocation(payload: {
        latitude: number;
        longitude: number;
        speed?: number;
        heading?: number;
        order_id?: string | number;
        address?: string;
    }): Promise<boolean> {
        try {
            await apiClient.post('/v1/driver/location', payload, { silent: true });
            return true;
        } catch (_) {
            return false;
        }
    },
};
