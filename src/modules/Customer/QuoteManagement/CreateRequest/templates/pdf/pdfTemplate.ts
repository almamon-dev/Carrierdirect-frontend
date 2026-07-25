/**
 * PDF Print Template Generator for GetItMoving Quote Requests
 * Generates an A4 Printable PDF Guide Document.
 */
export const downloadPDFTemplate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Shipping Request Order - Full Template</title>
    <style>
        @page { size: A4; margin: 15mm; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
            color: #0f172a; 
            padding: 35px; 
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
            margin-bottom: 20px;
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
            text-transform: uppercase;
        }

        h1 { font-size: 24px; font-weight: 800; color: #000; margin: 0 0 14px 0; letter-spacing: -0.5px; }
        
        hr { border: none; border-top: 1.5px solid #cbd5e1; margin: 16px 0 18px 0; }
        
        h2 { font-size: 15px; font-weight: 800; color: #000; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        h3 { font-size: 13.5px; font-weight: 700; color: #111; margin: 14px 0 6px 0; }

        .detail-p { font-size: 13px; margin: 0 0 5px 0; color: #1e293b; }
        .detail-p strong { font-weight: 700; color: #000; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 16px; font-size: 12.5px; }
        th, td { border: 1px solid #94a3b8; padding: 7px 10px; text-align: left; }
        th { font-weight: 700; color: #000; background: #f8fafc; }
        
        .services-list { list-style-type: square; padding-left: 20px; margin: 6px 0 12px 0; font-size: 13px; color: #1e293b; }
        .services-list li { margin-bottom: 4px; }
        .services-list li strong { font-weight: 700; color: #000; }

        .notes-line { font-size: 13px; margin-top: 8px; color: #1e293b; }
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
        <span class="brand-logo">GetItMoving Logistics</span>
        <span class="brand-tag">Shipping Order PDF Template</span>
    </div>

    <h1>Shipping Request Order (#1)</h1>

    <hr />

    <!-- 1. Basic Information -->
    <h2>1. Basic Information</h2>
    <div class="detail-p"><strong>Request Title:</strong> 5 Pallets Machinery Parts - Gazipur to Chittagong Port</div>
    <div class="detail-p"><strong>Priority:</strong> High</div>
    <div class="detail-p"><strong>Shipment Type:</strong> One Way</div>
    <div class="detail-p"><strong>Service Type:</strong> Express</div>
    <div class="detail-p"><strong>Expected Transit Time:</strong> 2 Days</div>

    <hr />

    <!-- 2. Pickup & Delivery -->
    <h2>2. Pickup & Delivery Locations</h2>
    <div class="detail-p"><strong>Pickup Address:</strong> Plot 42, Sector 4, Gazipur Industrial Area, Dhaka 1700 (Company: Prime Logistics EPZ Depot)</div>
    <div class="detail-p"><strong>Pickup Contact:</strong> Kamal Hossain (+8801711234567 | dispatch@primelogistics.bd)</div>
    <div class="detail-p"><strong>Pickup Date & Time:</strong> 2026-07-28 from 09:00 AM to 05:00 PM</div>
    <div class="detail-p"><strong>Pickup Special Instructions:</strong> Report to Gate 3 loading dock upon arrival.</div>
    <br />
    <div class="detail-p"><strong>Delivery Address:</strong> Terminal 2, Berth 5, Port Authority Zone, Chittagong 4000 (Company: Chittagong Maritime Hub)</div>
    <div class="detail-p"><strong>Delivery Contact:</strong> Rahim Uddin (+8801819987654 | cargo@ctgport.com)</div>
    <div class="detail-p"><strong>Delivery Date & Time:</strong> 2026-07-30 from 08:00 AM to 06:00 PM</div>
    <div class="detail-p"><strong>Delivery Special Instructions:</strong> Receiving allowed between 08:00 AM and 06:00 PM.</div>

    <hr />

    <!-- 3. Cargo Load & Services -->
    <h2>3. Cargo Load & Vehicle Specifications</h2>
    <div class="detail-p"><strong>Vehicle Type Preference:</strong> Covered Van (20ft)</div>
    <div class="detail-p"><strong>Cargo Load Type:</strong> Pallets (Machinery Spare Parts)</div>
    <div class="detail-p"><strong>Total Weight & Volume:</strong> 2,500 KG Weight | 15.5 CBM Volume</div>

    <h3>Items to Ship (10 Items Specification List)</h3>
    <table>
        <thead>
            <tr>
                <th>Item Type</th>
                <th style="width: 50px;">Qty</th>
                <th>Dimensions (LxWxH) cm</th>
                <th style="width: 90px;">Weight (kg)</th>
                <th>Handling & Care</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Euro Pallets</td>
                <td>5</td>
                <td>120 x 80 x 100</td>
                <td>500</td>
                <td>Stackable, Fragile Care</td>
            </tr>
            <tr>
                <td>Cardboard Boxes</td>
                <td>10</td>
                <td>40 x 40 x 40</td>
                <td>100</td>
                <td>Standard Care</td>
            </tr>
            <tr>
                <td>Wooden Crates</td>
                <td>2</td>
                <td>150 x 100 x 50</td>
                <td>400</td>
                <td>Heavy Cargo Loading</td>
            </tr>
            <tr>
                <td>Plastic Drums</td>
                <td>4</td>
                <td>60 x 60 x 90</td>
                <td>360</td>
                <td>Hazardous Handling</td>
            </tr>
            <tr>
                <td>Metal Tubes</td>
                <td>20</td>
                <td>200 x 10 x 10</td>
                <td>200</td>
                <td>Oversized Handling</td>
            </tr>
        </tbody>
    </table>

    <h3>Value-Added Logistics Services</h3>
    <ul class="services-list">
        <li><strong>Loading Service:</strong> Required at pickup dock</li>
        <li><strong>Unloading Service:</strong> Required at delivery dock</li>
        <li><strong>Cargo Insurance:</strong> Full coverage policy</li>
        <li><strong>Waterproof Covered Vehicle:</strong> Fully enclosed container</li>
    </ul>

    <hr />

    <!-- 4. Budget & Preferences -->
    <h2>4. Target Budget Rate</h2>
    <div class="detail-p"><strong>Target Budget Rate:</strong> € 48,000 (EUR)</div>
    <div class="detail-p"><strong>Allow Rate Negotiation:</strong> Yes (Bids Open to Verified Carriers)</div>
    <div class="detail-p"><strong>Receive Multiple Bids:</strong> Yes</div>
    <div class="detail-p"><strong>Auto Expire Duration:</strong> 7 Days</div>

    <hr />

    <!-- 5. Attachments & Notes -->
    <h2>5. Attachments & Notes</h2>
    <div class="notes-line"><strong>Customer Notes:</strong> Fully covered, waterproof vehicle required with 2 labor personnel.</div>
    <div class="notes-line"><strong>Special Instructions:</strong> Driver must report to Gate 3 loading dock upon arrival.</div>
    <div class="notes-line"><strong>Internal Reference (PO / Job Ref):</strong> PO-98765-GAZ</div>
    <div class="notes-line"><strong>Attached Photos / Archive:</strong> Cargo_Photos_Batch.zip (Linked)</div>

    <div style="page-break-after: always; margin: 30px 0; border-top: 2px dashed #cbd5e1; text-align: center; padding-top: 15px; font-weight: bold; color: #64748b; font-size: 12px;">
        ✂️ --- PAGE BREAK: REPEAT SECTIONS 1 TO 5 BELOW FOR REQUEST #2, #3 ... IN 1 PDF FILE ---
    </div>

    <!-- Page 2 / Request 2 -->
    <h1>Shipping Request Order (#2)</h1>
    
    <hr />

    <h2>1. Basic Information</h2>
    <div class="detail-p"><strong>Request Title:</strong> 100 Garment Fabric Rolls - Savar EPZ to Comilla Hub</div>
    <div class="detail-p"><strong>Priority:</strong> Normal</div>
    <div class="detail-p"><strong>Shipment Type:</strong> One Way</div>
    <div class="detail-p"><strong>Service Type:</strong> Express</div>
    <div class="detail-p"><strong>Expected Transit Time:</strong> 1 Day</div>

    <hr />

    <h2>2. Pickup & Delivery</h2>
    <div class="detail-p"><strong>Pickup Address:</strong> Savar EPZ Industrial Zone, Sector 2, Dhaka 1340 (Company: Savar Textile Depot)</div>
    <div class="detail-p"><strong>Pickup Contact:</strong> Shakil Ahmed (+8801911334455 | dispatch@savartek.bd)</div>
    <div class="detail-p"><strong>Pickup Date & Time:</strong> 2026-08-01 from 10:00 AM to 04:00 PM</div>
    <br />
    <div class="detail-p"><strong>Delivery Address:</strong> Comilla Highway Hub, Industrial Zone, Comilla 3500 (Company: Comilla Maritime Hub)</div>
    <div class="detail-p"><strong>Delivery Contact:</strong> Tanvir Hasan (+8801711998877 | cargo@comillahub.bd)</div>
    <div class="detail-p"><strong>Delivery Date & Time:</strong> 2026-08-02 from 08:00 AM to 06:00 PM</div>

    <hr />

    <h2>3. Load & Services</h2>
    <div class="detail-p"><strong>Vehicle Type Preference:</strong> Covered Truck (24ft)</div>
    <div class="detail-p"><strong>Cargo Load Type:</strong> Rolls / Textiles</div>
    <div class="detail-p"><strong>Total Weight & Volume:</strong> 3,200 KG Weight | 18.0 CBM Volume</div>

    <h3>Items to Ship</h3>
    <table>
        <thead>
            <tr>
                <th>Item Type</th>
                <th style="width: 50px;">Qty</th>
                <th>Dimensions (LxWxH) cm</th>
                <th style="width: 90px;">Weight (kg)</th>
                <th>Handling & Care</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Garment Fabric Rolls</td>
                <td>100</td>
                <td>150 x 30 x 30</td>
                <td>3,200</td>
                <td>Moisture Protection Required</td>
            </tr>
        </tbody>
    </table>

    <hr />

    <h2>4. Target Budget Rate</h2>
    <div class="detail-p"><strong>Target Budget Rate:</strong> € 38,000</div>

    <hr />

    <h2>5. Attachments & Notes</h2>
    <div class="notes-line"><strong>Customer Notes:</strong> Contact Savar supervisor before departure. Keep fabric rolls dry and away from heat.</div>
    <div class="notes-line"><strong>Internal Reference:</strong> PO-55443-SAV</div>

</body>
</html>
    `);
    printWindow.document.close();
};
