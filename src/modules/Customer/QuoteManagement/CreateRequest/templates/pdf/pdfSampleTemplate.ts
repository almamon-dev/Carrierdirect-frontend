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
    <div class="field-row"><span class="field-label"><span>Request Title<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><strong>5 Pallets Machinery Parts - Gazipur to Chittagong Port</strong></span></div>
    <div class="field-row"><span class="field-label"><span>Priority</span><span>:</span></span><span class="field-val">High</span></div>
    <div class="field-row"><span class="field-label"><span>Shipment Type</span><span>:</span></span><span class="field-val">One Way</span></div>
    <div class="field-row"><span class="field-label"><span>Service Type</span><span>:</span></span><span class="field-val">Express</span></div>
    <div class="field-row"><span class="field-label"><span>Pickup Date<span class="req-star">*</span></span><span>:</span></span><span class="field-val">2026-07-28 &nbsp;&nbsp; <span style="color:#64748b; font-size:11px;">(YYYY-MM-DD)</span></span></div>
    <div class="field-row"><span class="field-label"><span>Pickup Time</span><span>:</span></span><span class="field-val">09:00 AM &nbsp;&nbsp; <span style="color:#64748b; font-size:11px;">(e.g. 09:00 AM)</span></span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Date<span class="req-star">*</span></span><span>:</span></span><span class="field-val">2026-07-30 &nbsp;&nbsp; <span style="color:#64748b; font-size:11px;">(YYYY-MM-DD)</span></span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Time</span><span>:</span></span><span class="field-val">05:00 PM &nbsp;&nbsp; <span style="color:#64748b; font-size:11px;">(e.g. 05:00 PM)</span></span></div>
    <div class="field-row"><span class="field-label"><span>Transit Time (Days)</span><span>:</span></span><span class="field-val">2 Days</span></div>
    <hr />

    <h2>Location Information</h2>
    <h3>Pickup Details</h3>
    <div class="field-row"><span class="field-label"><span>Company Name<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Prime Logistics EPZ Depot</span></div>
    <div class="field-row"><span class="field-label"><span>Contact Person<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Kamal Hossain</span></div>
    <div class="field-row"><span class="field-label"><span>Phone Number<span class="req-star">*</span></span><span>:</span></span><span class="field-val">+8801711234567</span></div>
    <div class="field-row"><span class="field-label"><span>Email</span><span>:</span></span><span class="field-val">dispatch@primelogistics.bd</span></div>
    <div class="field-row"><span class="field-label"><span>Country<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Bangladesh</span></div>
    <div class="field-row"><span class="field-label"><span>State / Division</span><span>:</span></span><span class="field-val">Dhaka Division</span></div>
    <div class="field-row"><span class="field-label"><span>City<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Gazipur</span></div>
    <div class="field-row"><span class="field-label"><span>ZIP Code</span><span>:</span></span><span class="field-val">1700</span></div>
    <div class="field-row"><span class="field-label"><span>Full Address<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Plot 42, Sector 4, Gazipur Industrial Area, Gazipur, Bangladesh (ZIP: 1700)</span></div>
    <div class="field-row"><span class="field-label"><span>Google Map URL</span><span>:</span></span><span class="field-val">https://maps.google.com/?q=Gazipur</span></div>
    <div class="field-row"><span class="field-label"><span>Instructions</span><span>:</span></span><span class="field-val">Report to Gate 3 loading dock upon arrival with gate pass.</span></div>
    <br />

    <h3>Delivery Details</h3>
    <div class="field-row"><span class="field-label"><span>Company Name<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Chittagong Port Maritime Terminal</span></div>
    <div class="field-row"><span class="field-label"><span>Contact Person<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Rahim Uddin</span></div>
    <div class="field-row"><span class="field-label"><span>Phone Number<span class="req-star">*</span></span><span>:</span></span><span class="field-val">+8801819987654</span></div>
    <div class="field-row"><span class="field-label"><span>Email</span><span>:</span></span><span class="field-val">cargo@ctgport.com</span></div>
    <div class="field-row"><span class="field-label"><span>Country<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Bangladesh</span></div>
    <div class="field-row"><span class="field-label"><span>State / Division</span><span>:</span></span><span class="field-val">Chittagong Division</span></div>
    <div class="field-row"><span class="field-label"><span>City<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Chittagong</span></div>
    <div class="field-row"><span class="field-label"><span>ZIP Code</span><span>:</span></span><span class="field-val">4000</span></div>
    <div class="field-row"><span class="field-label"><span>Full Address<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Terminal 2, Berth 5, Port Authority Zone, Chittagong, Bangladesh (ZIP: 4000)</span></div>
    <div class="field-row"><span class="field-label"><span>Google Map URL</span><span>:</span></span><span class="field-val">https://maps.google.com/?q=ChittagongPort</span></div>
    <div class="field-row"><span class="field-label"><span>Instructions</span><span>:</span></span><span class="field-val">Delivery permitted strictly between 08:00 AM and 06:00 PM.</span></div>
    <hr />

    <h2>Load & Vehicle Information</h2>
    <div class="field-row"><span class="field-label"><span>Vehicle Type<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Covered Van (20ft)</span></div>
    <div class="field-row"><span class="field-label"><span>Cargo Load Type<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Pallets</span></div>
    <div class="field-row"><span class="field-label"><span>Items Count</span><span>:</span></span><span class="field-val">10</span></div>
    <div class="field-row"><span class="field-label"><span>Pallets Count</span><span>:</span></span><span class="field-val">5</span></div>
    <div class="field-row"><span class="field-label"><span>Total Weight (kg)<span class="req-star">*</span></span><span>:</span></span><span class="field-val">2500 kg</span></div>
    <div class="field-row"><span class="field-label"><span>Total Volume (m³)</span><span>:</span></span><span class="field-val">15.5 m³</span></div>

    <h3>Cargo Dimensions (L x W x H)</h3>
    <table>
        <thead><tr><th>Length</th><th>Width</th><th>Height</th><th style="width: 50px;">Qty</th><th style="width: 60px;">Unit</th></tr></thead>
        <tbody>
            <tr><td>120</td><td>80</td><td>100</td><td>5</td><td>CM</td></tr>
            <tr><td>40</td><td>40</td><td>40</td><td>10</td><td>CM</td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td><td>CM</td></tr>
        </tbody>
    </table>

    <h3>Special Cargo Requirements & Services</h3>
    <div class="field-row"><span class="field-label"><span>Stackable / Fragile / Hazardous</span><span>:</span></span><span class="field-val">Stackable: Yes &nbsp;|&nbsp; Fragile: Yes &nbsp;|&nbsp; Hazardous: No</span></div>
    <div class="field-row"><span class="field-label"><span>Temperature Controlled / Oversized / Perishable</span><span>:</span></span><span class="field-val">Temp Controlled: No &nbsp;|&nbsp; Oversized: No &nbsp;|&nbsp; Perishable: No</span></div>
    <div class="field-row"><span class="field-label"><span>Loading / Unloading / Packaging Services</span><span>:</span></span><span class="field-val">Loading: Yes &nbsp;|&nbsp; Unloading: Yes &nbsp;|&nbsp; Packaging: No &nbsp;|&nbsp; Insurance: Yes</span></div>
    <hr />

    <h2>Budget & Bidding Preferences</h2>
    <div class="field-row"><span class="field-label"><span>Target Budget Rate (EUR)</span><span>:</span></span><span class="field-val">€48,000</span></div>
    <div class="field-row"><span class="field-label"><span>Allow Negotiation / Multiple Bids</span><span>:</span></span><span class="field-val">Allow Negotiation: Yes &nbsp;|&nbsp; Receive Multiple Bids: Yes</span></div>
    <div class="field-row"><span class="field-label"><span>Auto Expire Duration</span><span>:</span></span><span class="field-val">7 Days</span></div>
    <hr />

    <h2>Notes & Attachments</h2>
    <div class="field-row"><span class="field-label"><span>Customer Notes</span><span>:</span></span><span class="field-val">Fully covered waterproof vehicle required.</span></div>
    <div class="field-row"><span class="field-label"><span>Special Instructions</span><span>:</span></span><span class="field-val">Handle machinery parts with care during loading and unloading.</span></div>
    <div class="field-row"><span class="field-label"><span>Internal Reference ID</span><span>:</span></span><span class="field-val">PO-98765-GAZ</span></div>
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
    <div class="field-row"><span class="field-label"><span>Request Title<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><strong>100 Garment Fabric Rolls - Savar EPZ to Comilla Hub</strong></span></div>
    <div class="field-row"><span class="field-label"><span>Priority</span><span>:</span></span><span class="field-val">Normal</span></div>
    <div class="field-row"><span class="field-label"><span>Shipment Type</span><span>:</span></span><span class="field-val">One Way</span></div>
    <div class="field-row"><span class="field-label"><span>Service Type</span><span>:</span></span><span class="field-val">Standard</span></div>
    <div class="field-row"><span class="field-label"><span>Pickup Date<span class="req-star">*</span></span><span>:</span></span><span class="field-val">2026-08-01 &nbsp;&nbsp; <span style="color:#64748b; font-size:11px;">(YYYY-MM-DD)</span></span></div>
    <div class="field-row"><span class="field-label"><span>Pickup Time</span><span>:</span></span><span class="field-val">10:00 AM &nbsp;&nbsp; <span style="color:#64748b; font-size:11px;">(e.g. 09:00 AM)</span></span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Date<span class="req-star">*</span></span><span>:</span></span><span class="field-val">2026-08-02 &nbsp;&nbsp; <span style="color:#64748b; font-size:11px;">(YYYY-MM-DD)</span></span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Time</span><span>:</span></span><span class="field-val">06:00 PM &nbsp;&nbsp; <span style="color:#64748b; font-size:11px;">(e.g. 05:00 PM)</span></span></div>
    <div class="field-row"><span class="field-label"><span>Transit Time (Days)</span><span>:</span></span><span class="field-val">1 Day</span></div>
    <hr />

    <h2>Location Information</h2>
    <h3>Pickup Details</h3>
    <div class="field-row"><span class="field-label"><span>Company Name<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Savar Textile Depot</span></div>
    <div class="field-row"><span class="field-label"><span>Contact Person<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Shakil Ahmed</span></div>
    <div class="field-row"><span class="field-label"><span>Phone Number<span class="req-star">*</span></span><span>:</span></span><span class="field-val">+8801911334455</span></div>
    <div class="field-row"><span class="field-label"><span>Email</span><span>:</span></span><span class="field-val">dispatch@savartek.bd</span></div>
    <div class="field-row"><span class="field-label"><span>Country<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Bangladesh</span></div>
    <div class="field-row"><span class="field-label"><span>State / Division</span><span>:</span></span><span class="field-val">Dhaka Division</span></div>
    <div class="field-row"><span class="field-label"><span>City<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Savar EPZ</span></div>
    <div class="field-row"><span class="field-label"><span>ZIP Code</span><span>:</span></span><span class="field-val">1340</span></div>
    <div class="field-row"><span class="field-label"><span>Full Address<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Savar EPZ Industrial Zone, Sector 2, Dhaka 1340</span></div>
    <div class="field-row"><span class="field-label"><span>Google Map URL</span><span>:</span></span><span class="field-val">https://maps.google.com/?q=Savar+EPZ</span></div>
    <div class="field-row"><span class="field-label"><span>Instructions</span><span>:</span></span><span class="field-val">Contact Savar supervisor before departure. Keep fabric rolls dry.</span></div>
    <br />

    <h3>Delivery Details</h3>
    <div class="field-row"><span class="field-label"><span>Company Name<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Comilla Maritime Hub</span></div>
    <div class="field-row"><span class="field-label"><span>Contact Person<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Tanvir Hasan</span></div>
    <div class="field-row"><span class="field-label"><span>Phone Number<span class="req-star">*</span></span><span>:</span></span><span class="field-val">+8801711998877</span></div>
    <div class="field-row"><span class="field-label"><span>Email</span><span>:</span></span><span class="field-val">cargo@comillahub.bd</span></div>
    <div class="field-row"><span class="field-label"><span>Country<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Bangladesh</span></div>
    <div class="field-row"><span class="field-label"><span>State / Division</span><span>:</span></span><span class="field-val">Chittagong Division</span></div>
    <div class="field-row"><span class="field-label"><span>City<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Comilla</span></div>
    <div class="field-row"><span class="field-label"><span>ZIP Code</span><span>:</span></span><span class="field-val">3500</span></div>
    <div class="field-row"><span class="field-label"><span>Full Address<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Comilla Highway Hub, Industrial Zone, Comilla 3500</span></div>
    <div class="field-row"><span class="field-label"><span>Google Map URL</span><span>:</span></span><span class="field-val">https://maps.google.com/?q=Comilla+Hub</span></div>
    <div class="field-row"><span class="field-label"><span>Instructions</span><span>:</span></span><span class="field-val">Handle with care. Driver must wear safety vest inside EPZ.</span></div>
    <hr />

    <h2>Load & Vehicle Information</h2>
    <div class="field-row"><span class="field-label"><span>Vehicle Type<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Covered Truck (24ft)</span></div>
    <div class="field-row"><span class="field-label"><span>Cargo Load Type<span class="req-star">*</span></span><span>:</span></span><span class="field-val">Rolls / Textiles</span></div>
    <div class="field-row"><span class="field-label"><span>Items Count</span><span>:</span></span><span class="field-val">100</span></div>
    <div class="field-row"><span class="field-label"><span>Pallets Count</span><span>:</span></span><span class="field-val">0</span></div>
    <div class="field-row"><span class="field-label"><span>Total Weight (kg)<span class="req-star">*</span></span><span>:</span></span><span class="field-val">3200 kg</span></div>
    <div class="field-row"><span class="field-label"><span>Total Volume (m³)</span><span>:</span></span><span class="field-val">18.0 m³</span></div>

    <h3>Cargo Dimensions (L x W x H)</h3>
    <table>
        <thead><tr><th>Length</th><th>Width</th><th>Height</th><th style="width: 50px;">Qty</th><th style="width: 60px;">Unit</th></tr></thead>
        <tbody>
            <tr><td>150</td><td>30</td><td>30</td><td>100</td><td>CM</td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td><td>CM</td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td><td>CM</td></tr>
        </tbody>
    </table>

    <h3>Special Cargo Requirements & Services</h3>
    <div class="field-row"><span class="field-label"><span>Stackable / Fragile / Hazardous</span><span>:</span></span><span class="field-val">Stackable: Yes &nbsp;|&nbsp; Fragile: No &nbsp;|&nbsp; Hazardous: No</span></div>
    <div class="field-row"><span class="field-label"><span>Temperature Controlled / Oversized / Perishable</span><span>:</span></span><span class="field-val">Temp Controlled: No &nbsp;|&nbsp; Oversized: No &nbsp;|&nbsp; Perishable: No</span></div>
    <div class="field-row"><span class="field-label"><span>Loading / Unloading / Packaging Services</span><span>:</span></span><span class="field-val">Loading: Yes &nbsp;|&nbsp; Unloading: Yes &nbsp;|&nbsp; Packaging: No &nbsp;|&nbsp; Insurance: Yes</span></div>
    <hr />

    <h2>Budget & Bidding Preferences</h2>
    <div class="field-row"><span class="field-label"><span>Target Budget Rate (EUR)</span><span>:</span></span><span class="field-val">€38,000</span></div>
    <div class="field-row"><span class="field-label"><span>Allow Negotiation / Multiple Bids</span><span>:</span></span><span class="field-val">Allow Negotiation: Yes &nbsp;|&nbsp; Receive Multiple Bids: Yes</span></div>
    <div class="field-row"><span class="field-label"><span>Auto Expire Duration</span><span>:</span></span><span class="field-val">5 Days</span></div>
    <hr />

    <h2>Notes & Attachments</h2>
    <div class="field-row"><span class="field-label"><span>Customer Notes</span><span>:</span></span><span class="field-val">Contact Savar supervisor before departure. Keep fabric rolls dry.</span></div>
    <div class="field-row"><span class="field-label"><span>Special Instructions</span><span>:</span></span><span class="field-val">Handle with care. Driver must wear safety vest inside EPZ.</span></div>
    <div class="field-row"><span class="field-label"><span>Internal Reference ID</span><span>:</span></span><span class="field-val">PO-55443-SAV</span></div>
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
