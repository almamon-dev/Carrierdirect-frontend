import { SHARED_PDF_STYLES } from './pdfStyles';

/**
 * Generates and opens a printable BLANK Shipping Request Form Template with aligned Label : Value pairs.
 */
export const downloadBlankPDFTemplate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Shipping Request Order (Blank Template) - CarrierDirect</title>
    <style>${SHARED_PDF_STYLES}</style>
</head>
<body>
    <button class="print-bar" onclick="window.print()">🖨️ Save / Print Blank PDF</button>

    <div class="brand-header">
        <span class="brand-logo">CarrierDirect Logistics</span>
        <span class="brand-tag">Shipping Order PDF Template (Blank)</span>
    </div>

    <h1>Shipping Request Order</h1>
    <div class="mandatory-note">Fields marked with <span class="req-star">*</span> are mandatory required fields.</div>
    <hr />

    <h2>Basic Information</h2>
    <div class="field-row"><span class="field-label"><span>Request Title<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Priority</span><span>:</span></span><span class="field-val">[  ] Low &nbsp;&nbsp; [  ] Normal &nbsp;&nbsp; [  ] High &nbsp;&nbsp; [  ] Urgent</span></div>
    <div class="field-row"><span class="field-label"><span>Shipment Type</span><span>:</span></span><span class="field-val">[  ] One Way &nbsp;&nbsp; [  ] Round Trip</span></div>
    <div class="field-row"><span class="field-label"><span>Service Type</span><span>:</span></span><span class="field-val">[  ] Standard &nbsp;&nbsp; [  ] Express</span></div>
    <div class="field-row"><span class="field-label"><span>Pickup Date<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 180px;"></span> &nbsp;&nbsp; (YYYY-MM-DD)</span></div>
    <div class="field-row"><span class="field-label"><span>Pickup Time</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 180px;"></span> &nbsp;&nbsp; (e.g. 09:00 AM)</span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Date<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 180px;"></span> &nbsp;&nbsp; (YYYY-MM-DD)</span></div>
    <div class="field-row"><span class="field-label"><span>Delivery Time</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 180px;"></span> &nbsp;&nbsp; (e.g. 05:00 PM)</span></div>
    <div class="field-row"><span class="field-label"><span>Transit Time (Days)</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 120px;"></span></span></div>
    <hr />

    <h2>Location Information</h2>
    <h3>Pickup Details</h3>
    <div class="field-row"><span class="field-label"><span>Company Name<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Contact Person<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 250px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Phone Number<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 250px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Email</span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Country<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 200px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>State / Division</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 200px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>City<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 200px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>ZIP Code</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 150px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Full Address<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Google Map URL</span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Instructions</span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <br />

    <h3>Delivery Details</h3>
    <div class="field-row"><span class="field-label"><span>Company Name<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Contact Person<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 250px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Phone Number<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 250px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Email</span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Country<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 200px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>State / Division</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 200px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>City<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 200px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>ZIP Code</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 150px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Full Address<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Google Map URL</span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Instructions</span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <hr />

    <h2>Load & Vehicle Information</h2>
    <div class="field-row"><span class="field-label"><span>Vehicle Type<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 250px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Cargo Load Type<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 250px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Items Count</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 120px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Pallets Count</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 120px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Total Weight (kg)<span class="req-star">*</span></span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 150px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Total Volume (m³)</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 150px;"></span></span></div>

    <h3>Cargo Dimensions (L x W x H)</h3>
    <table>
        <thead><tr><th>Length</th><th>Width</th><th>Height</th><th style="width: 50px;">Qty</th><th style="width: 60px;">Unit</th></tr></thead>
        <tbody>
            <tr><td>&nbsp;</td><td></td><td></td><td></td><td>CM</td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td><td>CM</td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td><td>CM</td></tr>
        </tbody>
    </table>

    <h3>Special Cargo Requirements & Services</h3>
    <div class="field-row"><span class="field-label"><span>Stackable / Fragile / Hazardous</span><span>:</span></span><span class="field-val">[ ] Stackable &nbsp;&nbsp; [ ] Fragile &nbsp;&nbsp; [ ] Hazardous</span></div>
    <div class="field-row"><span class="field-label"><span>Temperature Controlled / Oversized / Perishable</span><span>:</span></span><span class="field-val">[ ] Temp Controlled &nbsp;&nbsp; [ ] Oversized &nbsp;&nbsp; [ ] Perishable</span></div>
    <div class="field-row"><span class="field-label"><span>Loading / Unloading / Packaging Services</span><span>:</span></span><span class="field-val">[ ] Loading &nbsp;&nbsp; [ ] Unloading &nbsp;&nbsp; [ ] Packaging &nbsp;&nbsp; [ ] Insurance</span></div>
    <hr />

    <h2>Budget & Bidding Preferences</h2>
    <div class="field-row"><span class="field-label"><span>Target Budget (€)</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 180px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Auto Expire RFQ</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 180px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Negotiation / Multiple Bids</span><span>:</span></span><span class="field-val">[ ] Allow Negotiation &nbsp;&nbsp; [ ] Receive Multiple Bids</span></div>
    <hr />

    <h2>Attachments & Additional Notes</h2>
    <div class="field-row"><span class="field-label"><span>Internal Reference</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 250px;"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Customer Notes</span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Special Instructions</span><span>:</span></span><span class="field-val"><span class="blank-line-full"></span></span></div>
    <div class="field-row"><span class="field-label"><span>Packing List / Invoice</span><span>:</span></span><span class="field-val"><span class="blank-line" style="min-width: 250px;"></span></span></div>
</body>
</html>
    `);
    printWindow.document.close();
};
