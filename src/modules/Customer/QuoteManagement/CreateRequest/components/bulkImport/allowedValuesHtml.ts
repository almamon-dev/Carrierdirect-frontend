export const renderAllowedValuesHtml = (
    vehicleBadges: string,
    loadBadges: string,
    serviceBadges: string,
    priorityBadges: string
): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Freight Import Specification & Allowed Values - CarrierDirect</title>
    <style>
        * { box-sizing: border-box; }
        @page { size: A4; margin: 15mm; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
            background: #f8fafc; color: #0f172a; margin: 0; padding: 30px 20px; line-height: 1.5; 
        }
        .container { 
            max-width: 820px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; 
            border-radius: 10px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); 
        }
        .brand-header {
            display: flex; align-items: center; justify-content: space-between;
            border-bottom: 2px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 20px;
        }
        .brand-logo { font-size: 22px; font-weight: 800; color: #ff4a1f; letter-spacing: -0.5px; }
        .brand-tag { background: #f1f5f9; color: #475569; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
        h1 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; letter-spacing: -0.3px; }
        p.sub { font-size: 13px; color: #64748b; margin: 0 0 20px 0; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; margin-bottom: 18px; }
        h2 { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; display: flex; align-items: center; justify-content: space-between; }
        .col-hint { font-size: 11.5px; font-family: monospace; font-weight: 600; color: #64748b; background: #ffffff; padding: 2px 7px; border-radius: 4px; border: 1px solid #cbd5e1; }
        .badge-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .badge { background: #ffffff; color: #1e293b; border: 1px solid #cbd5e1; padding: 5px 11px; border-radius: 6px; font-size: 12.5px; font-weight: 600; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
        .section-label { font-size: 12px; font-weight: 700; color: #475569; margin-top: 10px; margin-bottom: 6px; }
        .print-bar { position: fixed; top: 20px; right: 25px; background: #ff4a1f; color: #fff; border: none; padding: 9px 18px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 13px; box-shadow: 0 4px 12px rgba(255,74,31,0.3); z-index: 100; }
        @media print { .print-bar { display: none; } body { background: #fff; padding: 0; } .container { border: none; box-shadow: none; padding: 0; } }
    </style>
</head>
<body>
    <button class="print-bar" onclick="window.print()">🖨️ Print / Save Guide</button>
    <div class="container">
        <div class="brand-header">
            <span class="brand-logo">CarrierDirect Logistics</span>
            <span class="brand-tag">Allowed Values & Formatting Reference</span>
        </div>
        <h1>Freight Import Specification & Allowed Values</h1>
        <p class="sub">Dynamic master data retrieved from CarrierDirect system database. Use these exact values in your import files.</p>
        <div class="card">
            <h2><span>1. Vehicle Types</span><span class="col-hint">Column: vehicle_type</span></h2>
            <div class="badge-wrap">${vehicleBadges}</div>
        </div>
        <div class="card">
            <h2><span>2. Cargo / Load Types</span><span class="col-hint">Column: load_type</span></h2>
            <div class="badge-wrap">${loadBadges}</div>
        </div>
        <div class="card">
            <h2><span>3. Service Types & Priority Levels</span><span class="col-hint">Columns: service_type, priority_level</span></h2>
            <div class="section-label">Service Types:</div>
            <div class="badge-wrap" style="margin-bottom: 14px;">${serviceBadges}</div>
            <div class="section-label">Priority Levels:</div>
            <div class="badge-wrap">${priorityBadges}</div>
        </div>
        <div class="card">
            <h2><span>4. Date & Time Formats</span><span class="col-hint">Columns: pickup_date, delivery_date, pickup_time, delivery_time</span></h2>
            <div style="font-size: 12.5px; color: #334155; line-height: 1.6;">
                <div>• <strong>Date Format:</strong> <code class="col-hint">YYYY-MM-DD</code> (e.g. <code>2026-07-28</code>)</div>
                <div style="margin-top: 4px;">• <strong>Time Format:</strong> <code class="col-hint">HH:MM AM/PM</code> (e.g. <code>09:00 AM</code>, <code>05:30 PM</code>)</div>
            </div>
        </div>
    </div>
</body>
</html>
`;
