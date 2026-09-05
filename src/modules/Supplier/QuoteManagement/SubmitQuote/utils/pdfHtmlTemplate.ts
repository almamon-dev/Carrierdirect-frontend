import { QuoteRequest } from '../../data/quoteRequestsData';

export const PDF_STYLES = `
    * { box-sizing: border-box; }
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; padding: 30px; max-width: 820px; margin: 0 auto; line-height: 1.5; background: #fff; }
    .brand-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 18px; }
    .brand-logo { font-size: 22px; font-weight: 800; color: #ff4a1f; letter-spacing: -0.5px; }
    .brand-tag { background: #f1f5f9; color: #475569; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; }
    h1 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; letter-spacing: -0.5px; }
    .subtitle-note { font-size: 11.5px; color: #64748b; margin-bottom: 12px; }
    hr { border: none; border-top: 1.5px solid #cbd5e1; margin: 14px 0 16px 0; }
    h2 { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; letter-spacing: 0.2px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    h3 { font-size: 13px; font-weight: 700; color: #1e293b; margin: 12px 0 6px 0; }
    .field-row { display: flex; align-items: baseline; font-size: 12.5px; margin-bottom: 6px; color: #1e293b; }
    .field-label { width: 220px; min-width: 220px; max-width: 220px; font-weight: 700; color: #0f172a; display: flex; justify-content: space-between; align-items: baseline; padding-right: 18px; flex-shrink: 0; }
    .field-val { flex: 1; color: #334155; word-break: break-word; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 14px; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; }
    th { font-weight: 700; color: #0f172a; background: #f8fafc; }
    td { height: 22px; color: #334155; }
    .badge-status { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
    .badge-budget { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 12px; background: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; }
    .blank-line-full { border-bottom: 1px dotted #94a3b8; display: inline-block; width: 100%; max-width: 500px; height: 16px; vertical-align: middle; }
    .print-bar { position: fixed; top: 15px; right: 20px; background: #ff4a1f; color: #fff; border: none; padding: 8px 18px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 13px; box-shadow: 0 4px 12px rgba(255,74,31,0.3); transition: background 0.2s; }
    .print-bar:hover { background: #e03e15; }
    @media print { .print-bar { display: none; } body { padding: 0; } }
`;

export const generateQuoteRequestPdfHtml = (requestDetails: QuoteRequest, printDate: string, formattedDate: string) => {
    const dimensions = requestDetails.dimensions || [];
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>CarrierDirect_Quote_Request_${requestDetails.id || 'REQ'}_${formattedDate}</title>
    <style>${PDF_STYLES}</style>
</head>
<body>
    <button class="print-bar" onclick="window.print()">🖨️ Save / Print PDF</button>
    <div class="brand-header">
        <span class="brand-logo">CarrierDirect Logistics</span>
        <span class="brand-tag">Quote Request Specification - ${requestDetails.id || 'REQ-1'}</span>
    </div>
    <h1>Shipping Request Order (${requestDetails.id || 'REQ-1'})</h1>
    <div class="subtitle-note">Generated on ${printDate} • Verified Transport Specification</div>
    <hr />
    <h2>1. Basic Information</h2>
    <div class="field-row"><span class="field-label"><span>Quote Request ID</span><span>:</span></span><span class="field-val"><strong>${requestDetails.id || 'REQ-1'}</strong></span></div>
    <div class="field-row"><span class="field-label"><span>Customer / Shipper</span><span>:</span></span><span class="field-val">${requestDetails.customer || 'Customer'}</span></div>
    <div class="field-row"><span class="field-label"><span>Request Date</span><span>:</span></span><span class="field-val">${requestDetails.requestDate || printDate}</span></div>
    <div class="field-row"><span class="field-label"><span>Request Status</span><span>:</span></span><span class="field-val"><span class="badge-status">${requestDetails.status || 'Active'}</span></span></div>
    <div class="field-row"><span class="field-label"><span>Priority Level</span><span>:</span></span><span class="field-val">${requestDetails.priority || 'Normal'}</span></div>
    <div class="field-row"><span class="field-label"><span>Target Budget</span><span>:</span></span><span class="field-val"><span class="badge-budget">${requestDetails.budget || 'Negotiable'}</span></span></div>
    <hr />
    <h2>2. Route & Location Details</h2>
    <h3>Pickup Information</h3>
    <div class="field-row"><span class="field-label"><span>Pickup Location</span><span>:</span></span><span class="field-val"><strong>${requestDetails.pickup || '—'}</strong></span></div>
    <div class="field-row"><span class="field-label"><span>Full Address</span><span>:</span></span><span class="field-val">${requestDetails.pickupFullAddress || requestDetails.pickup || '—'}</span></div>
    <div class="field-row"><span class="field-label"><span>Pickup Date</span><span>:</span></span><span class="field-val">${requestDetails.pickupDate || requestDetails.requestDate || '—'}</span></div>
    <div class="field-row"><span class="field-label"><span>Pickup Time Slot</span><span>:</span></span><span class="field-val">${requestDetails.pickupTimeWindow || '09:00 AM – 05:00 PM'}</span></div>
    <br />
    <h3>Delivery Information</h3>
    <div class="field-row"><span class="field-label"><span>Delivery Location</span><span>:</span></span><span class="field-val"><strong>${requestDetails.delivery || '—'}</strong></span></div>
    <div class="field-row"><span class="field-label"><span>Full Address</span><span>:</span></span><span class="field-val">${requestDetails.deliveryFullAddress || requestDetails.delivery || '—'}</span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Date</span><span>:</span></span><span class="field-val">${requestDetails.deliveryDate || '—'}</span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Time Slot</span><span>:</span></span><span class="field-val">${requestDetails.deliveryTimeWindow || '09:00 AM – 05:00 PM'}</span></div>
    <div class="field-row"><span class="field-label"><span>Transit Distance</span><span>:</span></span><span class="field-val">${requestDetails.distance || '—'} (Standard Transit)</span></div>
    <hr />
    <h2>3. Load & Vehicle Information</h2>
    <div class="field-row"><span class="field-label"><span>Vehicle Type Required</span><span>:</span></span><span class="field-val"><strong>${requestDetails.vehicleType || '—'}</strong></span></div>
    <div class="field-row"><span class="field-label"><span>Total Weight</span><span>:</span></span><span class="field-val">${requestDetails.weight || '—'}</span></div>
    <div class="field-row"><span class="field-label"><span>Total Volume</span><span>:</span></span><span class="field-val">${requestDetails.volume || '—'}</span></div>
    <div class="field-row"><span class="field-label"><span>Cargo Load Type</span><span>:</span></span><span class="field-val">${requestDetails.loadType || '—'}</span></div>
    <div class="field-row"><span class="field-label"><span>Items Summary</span><span>:</span></span><span class="field-val">${requestDetails.itemsCount || '—'}</span></div>
    <h3>Cargo Dimensions</h3>
    <table>
        <thead><tr><th style="width: 45px;">#</th><th>Length</th><th>Width</th><th>Height</th><th style="width: 60px; text-align: center;">Qty</th><th style="width: 60px; text-align: center;">Unit</th></tr></thead>
        <tbody>
            ${dimensions.length > 0 
                ? dimensions.map((dim, i) => `<tr><td>#${i + 1}</td><td>${dim.length}</td><td>${dim.width}</td><td>${dim.height}</td><td style="text-align: center; font-weight: bold;">${dim.qty}</td><td style="text-align: center;">${(dim.unit || 'cm').toUpperCase()}</td></tr>`).join('')
                : '<tr><td colspan="6" style="text-align: center; color: #94a3b8;">No cargo dimensions specified</td></tr>'
            }
        </tbody>
    </table>
    <hr />
    <h2>4. Special Instructions & Documents</h2>
    <div class="field-row"><span class="field-label"><span>Pickup Instructions</span><span>:</span></span><span class="field-val">${requestDetails.pickupInstructions || '<span class="blank-line-full"></span>'}</span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Instructions</span><span>:</span></span><span class="field-val">${requestDetails.deliveryInstructions || '<span class="blank-line-full"></span>'}</span></div>
    <div class="field-row"><span class="field-label"><span>Attached Documents</span><span>:</span></span><span class="field-val">${(requestDetails.documents && requestDetails.documents.length > 0) ? requestDetails.documents.map(d => d.name).join(', ') : '<span class="blank-line-full"></span>'}</span></div>
</body>
</html>`;
};
