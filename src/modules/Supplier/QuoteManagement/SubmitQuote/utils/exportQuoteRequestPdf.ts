import { QuoteRequest } from '../../data/quoteRequestsData';
import { generateQuoteRequestPdfHtml } from './pdfHtmlTemplate';

export const exportQuoteRequestPDF = (requestDetails: QuoteRequest) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow pop-ups in your browser to generate and print the PDF.');
        return;
    }

    const formattedDate = new Date().toISOString().split('T')[0];
    const printDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const htmlContent = generateQuoteRequestPdfHtml(requestDetails, printDate, formattedDate);

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };
};
