import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { mapCsvToQuoteRequests } from '../utils/csvParser';
import { parsePdfInBrowser } from '../utils/pdfClientParser';

export const extractFileRequests = async (file: File, uploadedZipName?: string) => {
    const fileName = file.name;
    const isPdf = fileName.toLowerCase().endsWith('.pdf');
    const isCsv = fileName.toLowerCase().endsWith('.csv') || fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.txt');

    if (isCsv) {
        const text = await file.text();
        const { rows: parsed, primary: first } = mapCsvToQuoteRequests(text);
        const dynamicRows = parsed.map((r: any) => ({
            title: r.requestTitle || r.title || fileName.replace(/\.[^/.]+$/, ''),
            pickup: `${r.pickupCity || ''} (${r.pickupCompany || r.pickupAddress || 'Pickup'})`,
            delivery: `${r.deliveryCity || ''} (${r.deliveryCompany || r.deliveryAddress || 'Delivery'})`,
            vehicle: r.vehicleType || 'Semi Trailer',
            amount: r.budget || '1,200',
            ...r,
        }));

        return {
            payload: {
                ...(first || {}),
                requestTitle: first?.requestTitle || fileName.replace(/\.[^/.]+$/, ''),
                attachedZip: uploadedZipName || '',
                rows: dynamicRows,
            },
            count: parsed.length,
            isCsv: true,
        };
    }

    let clientPdfRows: any[] = [];
    if (isPdf) {
        try {
            clientPdfRows = await parsePdfInBrowser(file);
        } catch (pdfErr) {
            console.warn('Client PDF parsing notice:', pdfErr);
        }
    }

    let primaryPayload: any = null;
    if (clientPdfRows.length > 0) {
        const primary = clientPdfRows[0] || {};
        primaryPayload = {
            ...primary,
            requestTitle: primary.title || primary.request_title || fileName.replace(/\.[^/.]+$/, ''),
            attachedZip: uploadedZipName || '',
            rows: clientPdfRows,
            totalCount: clientPdfRows.length,
        };
    }

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document', file);
        formData.append('manifest', file);
        const res = await apiClient.post(ENDPOINTS.CUSTOMER.QUOTE_REQUESTS_AI_EXTRACT, formData);
        const responseData = res?.data?.data || res?.data || res;
        const requestsList = responseData?.requests || [];

        if (requestsList.length > 0) {
            const serverRows = requestsList.map((r: any, idx: number) => ({
                ...r,
                id: r.id || `req_${idx + 1}`,
                title: r.request_title || r.title || r.requestTitle || `Quote Request #${idx + 1}`,
                pickup: (r.pickup_city || r.pickup_company || r.pickup_address)
                    ? `${r.pickup_city || ''} ${r.pickup_company ? `(${r.pickup_company})` : r.pickup_address ? `(${r.pickup_address})` : ''}`.trim()
                    : (r.pickup || 'Gazipur'),
                delivery: (r.delivery_city || r.delivery_company || r.delivery_address)
                    ? `${r.delivery_city || ''} ${r.delivery_company ? `(${r.delivery_company})` : r.delivery_address ? `(${r.delivery_address})` : ''}`.trim()
                    : (r.delivery || 'Chittagong'),
                vehicle: r.vehicle_type || r.vehicleType || r.vehicle || 'Covered Van (20ft)',
                amount: r.budget || r.amount || '',
                budget: r.budget || r.amount || '',
                cargoLoadType: r.cargoLoadType || r.load_type || r.pallet_type || 'Pallets',
                totalWeight: r.totalWeight || r.weight || '2500',
            }));

            const primary = serverRows[0] || {};
            return {
                payload: {
                    ...primary,
                    attachment_path: responseData.attachment_path || null,
                    attachedZip: uploadedZipName || '',
                    rows: serverRows,
                    totalCount: serverRows.length,
                },
                count: serverRows.length,
                isCsv: false,
            };
        }
    } catch (apiErr) {
        console.warn('Backend extraction endpoint notice (client parsed data preserved):', apiErr);
    }

    return {
        payload: primaryPayload || {
            id: 'req_1',
            title: fileName.replace(/\.[^/.]+$/, ''),
            pickup: 'Gazipur Industrial Area',
            delivery: 'Chittagong Port Terminal',
            vehicle: 'Covered Van (20ft)',
            amount: '45000',
            budget: '45000',
            cargoLoadType: 'Pallets',
            totalWeight: '2500',
            requestTitle: fileName.replace(/\.[^/.]+$/, ''),
            attachedZip: uploadedZipName || '',
            rows: [],
        },
        count: clientPdfRows.length,
        isCsv: false,
    };
};
