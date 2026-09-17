import apiClient from '@/lib/axios';

/**
 * Opens the real backend-rendered PDF (from resources/views/pdf/invoice.blade.php)
 * in a preview window / new tab so the user can view, zoom, download, or print.
 */
export const openInvoicePreview = async (data: any): Promise<boolean> => {
    if (!data) return false;

    try {
        const id = data.rawId || data.id;
        const cleanId = String(id).replace(/^ORD-0*/i, '').replace(/^INV-0*/i, '');
        const isOrder = Boolean(data.order_number || data.order_id || data.pickup_address || data.tracking || String(id).startsWith('ORD-'));
        
        let url = isOrder 
            ? `/customer/orders/${cleanId || id}/invoice-download`
            : `/customer/invoices/${cleanId || id}/download`;

        let blob: Blob | null = null;
        try {
            blob = await apiClient.getBlob(url);
        } catch (apiErr) {
            console.warn('Primary endpoint failed, trying fallback...', apiErr);
            const altUrl = isOrder 
                ? `/customer/invoices/${cleanId || id}/download`
                : `/customer/orders/${cleanId || id}/invoice-download`;
            blob = await apiClient.getBlob(altUrl);
        }

        if (blob && blob.size > 100) {
            const pdfBlob = new Blob([blob], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(pdfBlob);

            const previewWindow = window.open(pdfUrl, '_blank');
            if (previewWindow) {
                previewWindow.focus();
            } else {
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = `Invoice-${data.invoice_number || data.order_number || data.order_id || data.id || 'document'}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
            return true;
        }
        return false;
    } catch (err) {
        console.error('Failed to preview backend invoice PDF:', err);
        return false;
    }
};

export const exportInvoicePdf = openInvoicePreview;
export const printInvoice = openInvoicePreview;
export const downloadBackendInvoice = openInvoicePreview;
