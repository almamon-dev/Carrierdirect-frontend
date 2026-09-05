import { ParsedQuoteRequestData } from './csvParserTypes';
import { parseCsvRows } from './csvTokenizer';
import { mapSingleCsvRow } from './csvRowMapper';

export * from './csvParserTypes';
export * from './csvTokenizer';
export * from './csvRowMapper';

export function mapCsvToQuoteRequests(csvText: string): { rows: ParsedQuoteRequestData[]; primary: ParsedQuoteRequestData | null } {
    const parsedGrid = parseCsvRows(csvText);
    if (parsedGrid.length < 2) {
        return { rows: [], primary: null };
    }

    const headers = parsedGrid[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const dataRows = parsedGrid.slice(1);

    const requests: ParsedQuoteRequestData[] = dataRows.map((row) => mapSingleCsvRow(headers, row));

    return {
        rows: requests,
        primary: requests[0] || null,
    };
}
