import * as pdfjsLib from 'pdfjs-dist';
import { mapPdfBlockToRequest } from './pdfBlockMapper';

export * from './pdfBlockMapper';

if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/' + pdfjsLib.version + '/pdf.worker.min.js';
}

export async function parsePdfInBrowser(file: File): Promise<any[]> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        let fullText = '';
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str || '').join(' ');
            fullText += pageText + '\n---PAGE_BREAK---\n';
        }

        const splitRegex = /(?:---PAGE_BREAK---|(?=(?:CarrierDirect\s+Logistics\s+)?Shipping\s+(?:Request\s+)?Order)|(?=Quote\s+Request)|(?=---\s*PAGE\s*BREAK))/i;
        const rawBlocks = fullText.split(splitRegex);
        
        const validBlocks = rawBlocks.filter(b => {
            const trimmed = b.trim();
            if (!trimmed || trimmed.length < 50) return false;
            return (
                trimmed.includes('Basic Information') || 
                trimmed.includes('Request Title') || 
                trimmed.includes('Pickup Details') || 
                trimmed.includes('BASIC INFORMATION') || 
                trimmed.includes('PICKUP & DELIVERY') ||
                (trimmed.includes('Pickup') && trimmed.includes('Delivery'))
            );
        });

        if (!validBlocks || validBlocks.length === 0) {
            // Fallback if no delimiter was hit but whole document has pickup/delivery
            if (fullText.includes('Pickup') && fullText.includes('Delivery')) {
                return [mapPdfBlockToRequest(fullText, 0)];
            }
            return [];
        }

        return validBlocks.map((block, idx) => mapPdfBlockToRequest(block, idx));
    } catch (err) {
        console.error('Error parsing PDF in browser:', err);
        return [];
    }
}
