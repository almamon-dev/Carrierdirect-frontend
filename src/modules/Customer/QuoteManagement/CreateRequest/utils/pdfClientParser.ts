import * as pdfjsLib from "pdfjs-dist";
import { mapPdfBlockToRequest } from "./pdfBlockMapper";

export * from "./pdfBlockMapper";

if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjsLib.version + "/pdf.worker.min.js";
}

export async function parsePdfInBrowser(file: File): Promise<any[]> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        let fullText = "";
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str || "").join(" ");
            fullText += pageText + "\n---PAGE_BREAK---\n";
        }

        const blocks = fullText
            .split(/(?:---PAGE_BREAK---|(?=Shipping\s+Request\s+Order\s*(?:#?\d+|\(#?\d+\))?)|(?=Quote\s+Request\s*(?:#?\d+|\(#?\d+\))?))/i)
            .filter(b => b.includes("Basic Information") || b.includes("Request Title:") || b.includes("Pickup Details") || b.includes("BASIC INFORMATION") || b.includes("PICKUP & DELIVERY"));

        if (!blocks || blocks.length === 0) {
            return [];
        }

        return blocks.map((block, idx) => mapPdfBlockToRequest(block, idx));
    } catch (err) {
        console.error("Error parsing PDF in browser:", err);
        return [];
    }
}
