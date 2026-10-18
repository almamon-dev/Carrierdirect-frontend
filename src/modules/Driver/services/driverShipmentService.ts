import apiClient from '@/lib/axios';
import { ShipmentItem, ShipmentStatus } from '../types';
import { mapBackendShipmentToShipmentItem } from './shipmentMapper';

export const driverShipmentService = {
    async getShipments(): Promise<ShipmentItem[]> {
        try {
            const res = await apiClient.get('/driver/shipments');
            const rawList =
                res.data?.shipments ||
                res.shipments ||
                res.data?.data?.shipments ||
                (Array.isArray(res.data) ? res.data : null) ||
                (Array.isArray(res) ? res : null);

            if (Array.isArray(rawList)) {
                return rawList.map(mapBackendShipmentToShipmentItem);
            }
        } catch (err) {
            console.error('API Error in getShipments:', err);
        }
        return [];
    },

    async getShipmentById(id: string): Promise<ShipmentItem | null> {
        try {
            const res = await apiClient.get('/driver/shipments/' + id);
            const raw = res.data?.data || res.data || res;
            if (raw && (raw.id || raw.order_number)) {
                return mapBackendShipmentToShipmentItem(raw);
            }
        } catch (err) {
            console.error('API Error in getShipmentById:', err);
        }
        return null;
    },

    async updateShipmentMilestone(id: string, newStatus: ShipmentStatus): Promise<ShipmentItem> {
        const statusMap: Record<string, string> = {
            assigned: 'assigned',
            accepted: 'in_progress',
            at_pickup: 'picked_up',
            in_transit: 'in_transit',
            at_delivery: 'arrived',
            delivered: 'delivered',
            cancelled: 'cancelled',
        };
        const backendStatus = statusMap[newStatus] || newStatus;
        const res = await apiClient.patch('/driver/shipments/' + id + '/status', { status: backendStatus });
        const raw = res.data?.data || res.data || res;
        return mapBackendShipmentToShipmentItem(raw);
    },

    async submitPOD(
        id: string,
        podData: {
            receiverName: string;
            signatureUrl?: string;
            documentPhotos?: string[];
            file?: File | null;
            notes?: string;
        }
    ): Promise<ShipmentItem> {
        const formData = new FormData();
        formData.append('status', 'delivered');
        if (podData.receiverName) formData.append('receiver_name', podData.receiverName);
        if (podData.notes) formData.append('note', podData.notes);
        if (podData.signatureUrl) formData.append('signature', podData.signatureUrl);

        if (podData.file instanceof File) {
            formData.append('proof_of_delivery', podData.file, podData.file.name);
            formData.append('proof', podData.file, podData.file.name);
        } else if (podData.documentPhotos && podData.documentPhotos[0]) {
            const rawPhoto: any = podData.documentPhotos[0];
            if (rawPhoto instanceof File) {
                formData.append('proof_of_delivery', rawPhoto, rawPhoto.name);
                formData.append('proof', rawPhoto, rawPhoto.name);
            } else if (typeof rawPhoto === 'string' && rawPhoto.startsWith('data:')) {
                try {
                    const arr = rawPhoto.split(',');
                    const mimeMatch = arr[0].match(/:(.*?);/);
                    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
                    const bstr = atob(arr[1]);
                    let n = bstr.length;
                    const u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    const ext = mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : mime.includes('pdf') ? 'pdf' : 'png';
                    const fileObj = new File([u8arr], `proof_of_delivery_${Date.now()}.${ext}`, { type: mime });
                    formData.append('proof_of_delivery', fileObj, fileObj.name);
                    formData.append('proof', fileObj, fileObj.name);
                } catch {
                    formData.append('proof_of_delivery', rawPhoto);
                    formData.append('proof', rawPhoto);
                }
            } else if (typeof rawPhoto === 'string') {
                formData.append('proof_of_delivery', rawPhoto);
                formData.append('proof', rawPhoto);
            }
        }

        const res = await apiClient.post('/driver/shipments/' + id + '/status', formData);
        const raw = res.data?.data || res.data || res;
        return mapBackendShipmentToShipmentItem(raw);
    },

    async checkCustomerReview(id: string): Promise<boolean> {
        try {
            const res = await apiClient.get('/driver/shipments/' + id + '/rating');
            return Boolean(res?.data?.has_rated || res?.has_rated);
        } catch {
            return false;
        }
    },

    async submitCustomerReview(
        id: string,
        data: { rating: number; skills: string[]; comment: string }
    ): Promise<boolean> {
        try {
            await apiClient.post('/driver/shipments/' + id + '/rate', data);
            return true;
        } catch (err) {
            console.error('Failed to submit customer review', err);
            return false;
        }
    },
};
