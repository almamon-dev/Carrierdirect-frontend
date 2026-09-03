/**
 * PDF Print Template Generator for CarrierDirect Quote Requests
 * Matches the exact manual Create Request form sequence without section numbering.
 */
export const downloadPDFTemplate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Shipping Request Order Template</title>
    <style>
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

        h1 { font-size: 22px; font-weight: 800; color: #000; margin: 0 0 12px 0; letter-spacing: -0.5px; }
        
        hr { border: none; border-top: 1.5px solid #cbd5e1; margin: 15px 0 16px 0; }
        
        h2 { font-size: 15px; font-weight: 800; color: #000; margin: 0 0 10px 0; letter-spacing: 0.3px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        h3 { font-size: 13.5px; font-weight: 700; color: #111; margin: 12px 0 6px 0; }

        .detail-p { font-size: 13px; margin: 0 0 5px 0; color: #1e293b; }
        .detail-p strong { font-weight: 700; color: #000; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 14px; font-size: 12.5px; }
        th, td { border: 1px solid #94a3b8; padding: 6px 10px; text-align: left; }
        th { font-weight: 700; color: #000; background: #f8fafc; }
        
        .services-list { list-style-type: square; padding-left: 20px; margin: 6px 0 10px 0; font-size: 13px; color: #1e293b; }
        .services-list li { margin-bottom: 3px; }
        .services-list li strong { font-weight: 700; color: #000; }

        .notes-line { font-size: 13px; margin-top: 6px; color: #1e293b; }
        .notes-line strong { font-weight: 700; color: #000; }

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
    </style>
</head>
<body>
    <button class="print-bar" onclick="window.print()">🖨️ Save / Print PDF</button>

    <div class="brand-header">
        <span class="brand-logo">CarrierDirect Logistics</span>
        <span class="brand-tag">Shipping Order PDF Template</span>
    </div>

    <h1>Shipping Request Order</h1>

    <hr />

    <!-- Basic Information -->
    <h2>Basic Information</h2>
    <div class="detail-p"><strong>Request Title:</strong> 5 Pallets Machinery Parts - Gazipur to Chittagong Port</div>
    <div class="detail-p"><strong>Priority:</strong> High</div>
    <div class="detail-p"><strong>Shipment Type:</strong> One Way</div>
    <div class="detail-p"><strong>Service Type:</strong> Express</div>
    <div class="detail-p"><strong>Pickup Date:</strong> 2026-07-28</div>
    <div class="detail-p"><strong>Pickup Time:</strong> 09:00 AM</div>
    <div class="detail-p"><strong>Delivery Date:</strong> 2026-07-30</div>
    <div class="detail-p"><strong>Delivery Time:</strong> 05:00 PM</div>
    <div class="detail-p"><strong>Transit Time (Days):</strong> 2</div>

    <hr />

    <!-- Location Information -->
    <h2>Location Information</h2>
    
    <h3>Pickup Details</h3>
    <div class="detail-p"><strong>Company Name:</strong> Prime Logistics EPZ Depot</div>
    <div class="detail-p"><strong>Contact Person:</strong> Kamal Hossain</div>
    <div class="detail-p"><strong>Phone Number:</strong> +8801711234567</div>
    <div class="detail-p"><strong>Email:</strong> dispatch@primelogistics.bd</div>
    <div class="detail-p"><strong>Country:</strong> Bangladesh</div>
    <div class="detail-p"><strong>State/Division:</strong> Dhaka Division</div>
    <div class="detail-p"><strong>City:</strong> Gazipur</div>
    <div class="detail-p"><strong>ZIP Code:</strong> 1700</div>
    <div class="detail-p"><strong>Full Address:</strong> Plot 42, Sector 4, Gazipur Industrial Area, Gazipur</div>
    <div class="detail-p"><strong>Google Map URL:</strong> https://maps.google.com/?q=Gazipur+EPZ</div>
    <div class="detail-p"><strong>Instructions:</strong> Report to Gate 3 loading dock upon arrival with gate pass.</div>

    <br />

    <h3>Delivery Details</h3>
    <div class="detail-p"><strong>Company Name:</strong> Chittagong Port Maritime Terminal</div>
    <div class="detail-p"><strong>Contact Person:</strong> Rahim Uddin</div>
    <div class="detail-p"><strong>Phone Number:</strong> +8801819987654</div>
    <div class="detail-p"><strong>Email:</strong> cargo@ctgport.com</div>
    <div class="detail-p"><strong>Country:</strong> Bangladesh</div>
    <div class="detail-p"><strong>State/Division:</strong> Chittagong Division</div>
    <div class="detail-p"><strong>City:</strong> Chittagong</div>
    <div class="detail-p"><strong>ZIP Code:</strong> 4000</div>
    <div class="detail-p"><strong>Full Address:</strong> Terminal 2, Berth 5, Port Authority Zone, Chittagong</div>
    <div class="detail-p"><strong>Google Map URL:</strong> https://maps.google.com/?q=Chittagong+Port</div>
    <div class="detail-p"><strong>Instructions:</strong> Delivery permitted strictly between 08:00 AM and 06:00 PM.</div>

    <hr />

    <!-- Load & Vehicle Information -->
    <h2>Load & Vehicle Information</h2>
    <div class="detail-p"><strong>Vehicle Type:</strong> Covered Van (20ft)</div>
    <div class="detail-p"><strong>Load Type:</strong> Pallets</div>
    <div class="detail-p"><strong>Items Count:</strong> 10</div>
    <div class="detail-p"><strong>Pallets Count:</strong> 5</div>
    <div class="detail-p"><strong>Total Weight (kg):</strong> 2500</div>
    <div class="detail-p"><strong>Total Volume (m³):</strong> 15.5</div>

    <h3>Cargo Dimensions (L x W x H)</h3>
    <table>
        <thead>
            <tr>
                <th>Length</th>
                <th>Width</th>
                <th>Height</th>
                <th style="width: 50px;">Qty</th>
                <th style="width: 60px;">Unit</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>120</td>
                <td>80</td>
                <td>100</td>
                <td>5</td>
                <td>CM</td>
            </tr>
            <tr>
                <td>40</td>
                <td>40</td>
                <td>40</td>
                <td>10</td>
                <td>CM</td>
            </tr>
        </tbody>
    </table>

    <h3>Special Cargo Requirements & Services</h3>
    <ul class="services-list">
        <li><strong>Stackable Cargo:</strong> Yes</li>
        <li><strong>Fragile Handling:</strong> Yes</li>
        <li><strong>Hazardous Materials:</strong> No</li>
        <li><strong>Temperature Controlled:</strong> No</li>
        <li><strong>Oversized Cargo:</strong> No</li>
        <li><strong>Perishable Goods:</strong> No</li>
        <li><strong>Loading Service Required:</strong> Yes</li>
        <li><strong>Unloading Service Required:</strong> Yes</li>
        <li><strong>Packaging Service:</strong> No</li>
        <li><strong>Cargo Insurance:</strong> Yes</li>
    </ul>

    <hr />

    <!-- Budget & Bidding Preferences -->
    <h2>Budget & Bidding Preferences</h2>
    <div class="detail-p"><strong>Target Budget (€):</strong> 48000</div>
    <div class="detail-p"><strong>Auto Expire RFQ:</strong> 7 Days</div>
    <div class="detail-p"><strong>Allow rate negotiation:</strong> Yes</div>
    <div class="detail-p"><strong>Receive quotes from multiple verified suppliers:</strong> Yes</div>

    <hr />

    <!-- Attachments & Additional Notes -->
    <h2>Attachments & Additional Notes</h2>
    <div class="notes-line"><strong>Internal Reference:</strong> PO-98765-GAZ</div>
    <div class="notes-line"><strong>Customer Notes:</strong> Fully covered waterproof vehicle required with 2 labor personnel.</div>
    <div class="notes-line"><strong>Special Instructions:</strong> Driver must call dispatch 1 hour prior to pickup. Check-in at Security Gate 3.</div>
    <div class="notes-line"><strong>Packing List PDF:</strong> Packing_List_Machinery.pdf</div>
    <div class="notes-line"><strong>Commercial Invoice:</strong> Commercial_Invoice_2026.pdf</div>

    <div style="page-break-after: always; margin: 30px 0; border-top: 2px dashed #cbd5e1; text-align: center; padding-top: 15px; font-weight: bold; color: #64748b; font-size: 12px;">
        ✂️ --- PAGE BREAK: REPEAT SECTIONS BELOW FOR MULTIPLE ORDERS ---
    </div>

    <!-- Order 2 -->
    <h1>Shipping Request Order</h1>
    
    <hr />

    <h2>Basic Information</h2>
    <div class="detail-p"><strong>Request Title:</strong> 100 Garment Fabric Rolls - Savar EPZ to Comilla Hub</div>
    <div class="detail-p"><strong>Priority:</strong> Normal</div>
    <div class="detail-p"><strong>Shipment Type:</strong> One Way</div>
    <div class="detail-p"><strong>Service Type:</strong> Standard</div>
    <div class="detail-p"><strong>Pickup Date:</strong> 2026-08-01</div>
    <div class="detail-p"><strong>Pickup Time:</strong> 10:00 AM</div>
    <div class="detail-p"><strong>Delivery Date:</strong> 2026-08-02</div>
    <div class="detail-p"><strong>Delivery Time:</strong> 08:00 AM</div>
    <div class="detail-p"><strong>Transit Time (Days):</strong> 1</div>

    <hr />

    <h2>Location Information</h2>
    <h3>Pickup Details</h3>
    <div class="detail-p"><strong>Company Name:</strong> Savar Textile Depot</div>
    <div class="detail-p"><strong>Contact Person:</strong> Shakil Ahmed</div>
    <div class="detail-p"><strong>Phone Number:</strong> +8801911334455</div>
    <div class="detail-p"><strong>Full Address:</strong> Savar EPZ Industrial Zone, Sector 2, Dhaka 1340</div>

    <br />

    <h3>Delivery Details</h3>
    <div class="detail-p"><strong>Company Name:</strong> Comilla Maritime Hub</div>
    <div class="detail-p"><strong>Contact Person:</strong> Tanvir Hasan</div>
    <div class="detail-p"><strong>Phone Number:</strong> +8801711998877</div>
    <div class="detail-p"><strong>Full Address:</strong> Comilla Highway Industrial Zone, Comilla 3500</div>

    <hr />

    <h2>Load & Vehicle Information</h2>
    <div class="detail-p"><strong>Vehicle Type:</strong> Box Truck</div>
    <div class="detail-p"><strong>Load Type:</strong> Boxes</div>
    <div class="detail-p"><strong>Total Weight (kg):</strong> 3200</div>

    <h3>Cargo Dimensions (L x W x H)</h3>
    <table>
        <thead>
            <tr>
                <th>Length</th>
                <th>Width</th>
                <th>Height</th>
                <th style="width: 50px;">Qty</th>
                <th style="width: 60px;">Unit</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>150</td>
                <td>30</td>
                <td>30</td>
                <td>100</td>
                <td>CM</td>
            </tr>
        </tbody>
    </table>

    <hr />

    <h2>Budget & Bidding Preferences</h2>
    <div class="detail-p"><strong>Target Budget (€):</strong> 38000</div>
    <div class="detail-p"><strong>Auto Expire RFQ:</strong> 48 Hours</div>

    <hr />

    <h2>Attachments & Additional Notes</h2>
    <div class="notes-line"><strong>Internal Reference:</strong> PO-55443-SAV</div>
    <div class="notes-line"><strong>Customer Notes:</strong> Contact Savar supervisor before departure. Keep fabric rolls dry.</div>

</body>
</html>
    `);
    printWindow.document.close();
};
