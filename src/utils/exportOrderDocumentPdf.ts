import apiClient from '@/lib/axios';

/**
 * Downloads or previews official backend-rendered PDFs (CMR Waybill, GIT Insurance, Commercial Invoice)
 * for the given order and document type.
 */
export const exportOrderDocumentPdf = async (
    orderId: string | number,
    type: 'invoice' | 'cmr' | 'insurance' | 'pod' | string,
    fileName?: string,
    action: 'preview' | 'download' = 'preview'
): Promise<boolean> => {
    try {
        const cleanId = String(orderId).replace(/^ORD-0*/i, '').replace(/\D/g, '') || orderId;
        const url = `/supplier/orders/${cleanId}/documents/${type}`;

        const blob = await apiClient.getBlob(url);
        if (blob && blob.size > 100) {
            const pdfBlob = new Blob([blob], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(pdfBlob);

            if (action === 'download') {
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = fileName || `${type.toUpperCase()}_ORD_${cleanId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                return true;
            }

            const win = window.open(pdfUrl, '_blank');
            if (win) {
                win.focus();
            } else {
                // Fallback to download if browser blocked popup
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = fileName || `${type.toUpperCase()}_ORD_${cleanId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
            return true;
        }
        return false;
    } catch (err) {
        console.warn(`Backend stream for ${type} failed, opening in-browser view fallback:`, err);
        return false;
    }
};

export default exportOrderDocumentPdf;

