import { API_CONFIG } from '@/config/api';
import { SHARED_PDF_STYLES } from './pdfStyles';
import { downloadBlankPDFTemplate as downloadBlankPDFClient } from './pdfBlankTemplate';
import { downloadSamplePDFWithValues as downloadSamplePDFClient } from './pdfSampleTemplate';

export { SHARED_PDF_STYLES };

/**
 * Downloads the Blank PDF Form directly from the Laravel Backend API.
 * Falls back to client-side preview if network/server is unreachable.
 */
export const downloadBlankPDFTemplate = async () => {
    try {
        const baseUrl = API_CONFIG.baseURL || '';
        const downloadUrl = `${baseUrl}/customer/quote-requests/pdf/template/download`;
        
        const response = await fetch(downloadUrl);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'QuoteRequest-Template.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            return;
        }
    } catch (e) {
        console.warn('API PDF download failed, using client-side fallback:', e);
    }

    // Fallback
    downloadBlankPDFClient();
};

/**
 * Downloads the Sample PDF with Demonstration Values directly from the Laravel Backend API.
 * Falls back to client-side preview if network/server is unreachable.
 */
export const downloadSamplePDFWithValues = async () => {
    try {
        const baseUrl = API_CONFIG.baseURL || '';
        const downloadUrl = `${baseUrl}/customer/quote-requests/pdf/sample/generate`;
        
        const response = await fetch(downloadUrl);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sample-shipping-request.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            return;
        }
    } catch (e) {
        console.warn('API Sample PDF download failed, using client-side fallback:', e);
    }

    // Fallback
    downloadSamplePDFClient();
};

export const downloadPDFTemplate = downloadSamplePDFWithValues;
