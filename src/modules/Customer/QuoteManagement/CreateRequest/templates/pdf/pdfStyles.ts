/**
 * Shared CSS styles for printable PDF Quote Request forms
 */
export const SHARED_PDF_STYLES = `
    * {
        box-sizing: border-box;
    }
    @page { size: A4; margin: 15mm; }
    body { 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
        color: #0f172a; 
        padding: 30px; 
        max-width: 820px; 
        margin: 0 auto; 
        line-height: 1.5; 
        background: #fff; 
    }
    
    .brand-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 12px;
        margin-bottom: 18px;
    }
    .brand-logo {
        font-size: 22px;
        font-weight: 800;
        color: #ff4a1f;
        letter-spacing: -0.5px;
    }
    .brand-tag {
        background: #f1f5f9;
        color: #475569;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;
    }

    h1 { font-size: 22px; font-weight: 800; color: #000; margin: 0 0 4px 0; letter-spacing: -0.5px; }
    .mandatory-note { font-size: 11.5px; color: #64748b; margin-bottom: 8px; }
    .req-star { color: #dc2626; font-weight: 800; margin-left: 2px; font-size: 13.5px; }

    hr { border: none; border-top: 1.5px solid #cbd5e1; margin: 14px 0 16px 0; }
    h2 { font-size: 15px; font-weight: 800; color: #000; margin: 0 0 10px 0; letter-spacing: 0.3px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    h3 { font-size: 13.5px; font-weight: 700; color: #111; margin: 14px 0 8px 0; }

    /* Label : Value Two-Column Aligned Row */
    .field-row {
        display: flex;
        align-items: baseline;
        font-size: 13px;
        margin-bottom: 7px;
        color: #1e293b;
    }
    .field-label {
        width: 240px;
        min-width: 240px;
        max-width: 240px;
        font-weight: 700;
        color: #000;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding-right: 20px;
        flex-shrink: 0;
    }
    .field-val {
        flex: 1;
        color: #0f172a;
        word-break: break-word;
    }
    
    .blank-line { 
        border-bottom: 1px dotted #94a3b8; 
        display: inline-block; 
        min-width: 260px; 
        height: 16px; 
        vertical-align: middle; 
    }
    .blank-line-full { 
        border-bottom: 1px dotted #94a3b8; 
        display: inline-block; 
        width: 100%; 
        max-width: 500px;
        height: 16px; 
        vertical-align: middle; 
    }

    table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 14px; font-size: 12.5px; }
    th, td { border: 1px solid #94a3b8; padding: 6px 10px; text-align: left; }
    th { font-weight: 700; color: #000; background: #f8fafc; }
    td { height: 22px; }

    .print-bar { 
        position: fixed; 
        top: 15px; 
        right: 20px; 
        background: #ff4a1f; 
        color: #fff; 
        border: none; 
        padding: 8px 18px; 
        font-weight: bold; 
        border-radius: 6px; 
        cursor: pointer; 
        font-size: 13px; 
        box-shadow: 0 4px 12px rgba(255,74,31,0.3); 
    }
    @media print { .print-bar { display: none; } body { padding: 0; } }
`;
