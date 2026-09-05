import { SHARED_PDF_STYLES } from './pdfStyles';

const renderSampleOrder1 = () => `
    <div class="brand-header">
        <span class="brand-logo">CarrierDirect Logistics</span>
        <span class="brand-tag">Shipping Order PDF Template (Sample 1)</span>
    </div>
    <h1>Shipping Request Order</h1>
    <div class="mandatory-note">Fields marked with <span class="req-star">*</span> are mandatory required fields.</div>
    <hr />
    <h2>Basic Information</h2>
    <div class="field-row"><span class="field-label"><span>Request Title<span class="req-star">*</span></span><span>:</span></span><span class="field-val">5 Pallets Machinery Parts - Gazipur to Chittagong Port</span></div>
    <div class="field-row"><span class="field-label"><span>Priority / Shipment / Service</span><span>:</span></span><span class="field-val">High | One Way | Express</span></div>
    <div class="field-row"><span class="field-label"><span>Pickup Date<span class="req-star">*</span> / Time</span><span>:</span></span><span class="field-val">2026-07-28 09:00 AM</span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Date<span class="req-star">*</span> / Time</span><span>:</span></span><span class="field-val">2026-07-30 05:00 PM (Transit: 2 Days)</span></div>
    <hr />
    <h2>Location Information</h2>
    <h3>Pickup: Prime Logistics EPZ Depot (Kamal Hossain - +8801711234567)</h3>
    <div class="field-row"><span class="field-label"><span>Address<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Plot 42, Sector 4, Gazipur Industrial Area, Gazipur, Bangladesh (ZIP: 1700)</span></div>
    <div class="field-row"><span class="field-label"><span>Instructions</span><span>:</span></span><span class="field-val">Report to Gate 3 loading dock upon arrival with gate pass.</span></div>
    <br />
    <h3>Delivery: Chittagong Port Maritime Terminal (Rahim Uddin - +8801819987654)</h3>
    <div class="field-row"><span class="field-label"><span>Address<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Terminal 2, Berth 5, Port Authority Zone, Chittagong, Bangladesh (ZIP: 4000)</span></div>
    <div class="field-row"><span class="field-label"><span>Instructions</span><span>:</span></span><span class="field-val">Delivery permitted strictly between 08:00 AM and 06:00 PM.</span></div>
    <hr />
    <h2>Load & Vehicle Information</h2>
    <div class="field-row"><span class="field-label"><span>Vehicle & Load Type<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Covered Van (20ft) | Pallets (5 Pallets, 10 Items, 2500 kg, 15.5 m³)</span></div>
    <h3>Cargo Dimensions</h3>
    <table>
        <thead><tr><th>Length</th><th>Width</th><th>Height</th><th>Qty</th><th>Unit</th></tr></thead>
        <tbody>
            <tr><td>120</td><td>80</td><td>100</td><td>5</td><td>CM</td></tr>
            <tr><td>40</td><td>40</td><td>40</td><td>10</td><td>CM</td></tr>
        </tbody>
    </table>
    <div class="field-row"><span class="field-label"><span>Requirements</span><span>:</span></span><span class="field-val">Stackable: Yes | Fragile: Yes | Temp: No | Loading/Unloading: Yes</span></div>
    <hr />
    <h2>Budget, Notes & Attachments</h2>
    <div class="field-row"><span class="field-label"><span>Target Budget</span><span>:</span></span><span class="field-val">€48,000 (Auto Expire: 7 Days, Negotiation: Yes)</span></div>
    <div class="field-row"><span class="field-label"><span>Ref & Notes</span><span>:</span></span><span class="field-val">PO-98765-GAZ - Fully covered waterproof vehicle required.</span></div>
`;

const renderSampleOrder2 = () => `
    <div class="brand-header">
        <span class="brand-logo">CarrierDirect Logistics</span>
        <span class="brand-tag">Shipping Order PDF Template (Sample 2)</span>
    </div>
    <h1>Shipping Request Order</h1>
    <div class="mandatory-note">Fields marked with <span class="req-star">*</span> are mandatory required fields.</div>
    <hr />
    <h2>Basic Information</h2>
    <div class="field-row"><span class="field-label"><span>Request Title<span class="req-star">*</span></span><span>:</span></span><span class="field-val">100 Garment Fabric Rolls - Savar EPZ to Comilla Hub</span></div>
    <div class="field-row"><span class="field-label"><span>Priority / Shipment / Service</span><span>:</span></span><span class="field-val">Normal | One Way | Standard</span></div>
    <div class="field-row"><span class="field-label"><span>Pickup Date<span class="req-star">*</span> / Time</span><span>:</span></span><span class="field-val">2026-08-01 10:00 AM</span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Date<span class="req-star">*</span> / Time</span><span>:</span></span><span class="field-val">2026-08-02 08:00 AM (Transit: 1 Day)</span></div>
    <hr />
    <h2>Location Information</h2>
    <h3>Pickup: Savar Textile Depot (Shakil Ahmed - +8801911334455)</h3>
    <div class="field-row"><span class="field-label"><span>Address<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Savar EPZ Industrial Zone, Sector 2, Dhaka 1340</span></div>
    <br />
    <h3>Delivery: Comilla Maritime Hub (Tanvir Hasan - +8801711998877)</h3>
    <div class="field-row"><span class="field-label"><span>Address<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Comilla Highway Industrial Zone, Comilla 3500</span></div>
    <hr />
    <h2>Load & Vehicle Information</h2>
    <div class="field-row"><span class="field-label"><span>Vehicle & Load Type<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Box Truck | Boxes (3200 kg)</span></div>
    <h3>Cargo Dimensions</h3>
    <table>
        <thead><tr><th>Length</th><th>Width</th><th>Height</th><th>Qty</th><th>Unit</th></tr></thead>
        <tbody><tr><td>150</td><td>30</td><td>30</td><td>100</td><td>CM</td></tr></tbody>
    </table>
    <hr />
    <h2>Budget, Notes & Attachments</h2>
    <div class="field-row"><span class="field-label"><span>Budget / Ref / Notes</span><span>:</span></span><span class="field-val">€38,000 | Ref: PO-55443-SAV | Contact Savar supervisor before departure.</span></div>
`;

/**
 * PDF Print Template Generator filled with Sample Demonstration Values.
 */
export const downloadSamplePDFWithValues = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Shipping Request Order (Sample Template) - CarrierDirect</title>
    <style>${SHARED_PDF_STYLES}</style>
</head>
<body>
    <button class="print-bar" onclick="window.print()">🖨️ Save / Print Sample PDF</button>
    ${renderSampleOrder1()}
    <div style="page-break-after: always; margin: 30px 0; border-top: 2px dashed #cbd5e1; text-align: center; padding-top: 15px; font-weight: bold; color: #64748b; font-size: 12px;">
        ✂️ --- PAGE BREAK: REPEAT SECTIONS BELOW FOR MULTIPLE ORDERS ---
    </div>
    ${renderSampleOrder2()}
</body>
</html>
    `);
    printWindow.document.close();
};

export const downloadPDFTemplate = downloadSamplePDFWithValues;
