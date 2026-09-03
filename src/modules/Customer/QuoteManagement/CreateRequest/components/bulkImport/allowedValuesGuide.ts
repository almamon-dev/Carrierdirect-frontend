/**
 * Freight Import Allowed Values Guide Window Generator
 */
export const openAllowedValuesGuideWindow = (options?: {
    dynamicVehicleTypes?: any[];
    dynamicLoadTypes?: any[];
    dynamicServiceTypes?: any[];
    dynamicPriorityTypes?: any[];
}) => {
    const newWindow = window.open('', '_blank', 'width=900,height=750,scrollbars=yes,resizable=yes');
    if (!newWindow) {
        alert('Popup blocked! Please allow popups for this site to view the specification.');
        return;
    }

    const defaultVehicles = [
        { id: 'Covered Van', name: 'Covered Van' },
        { id: 'Flatbed Truck', name: 'Flatbed Truck' },
        { id: 'Trailer', name: 'Trailer' },
        { id: 'Reefer / Temperature Controlled', name: 'Reefer / Temperature Controlled' },
        { id: 'Open Truck', name: 'Open Truck' },
        { id: 'Container Carrier', name: 'Container Carrier' },
        { id: 'Heavy Hauler', name: 'Heavy Hauler' }
    ];

    const defaultLoads = [
        { id: 'Pallets', name: 'Pallets' },
        { id: 'Cartons / Boxes', name: 'Cartons / Boxes' },
        { id: 'Machinery Parts', name: 'Machinery Parts' },
        { id: 'Raw Materials', name: 'Raw Materials' },
        { id: 'Perishable Goods', name: 'Perishable Goods' },
        { id: 'Chemicals / Hazardous', name: 'Chemicals / Hazardous' }
    ];

    const defaultServices = [
        { id: 'Standard', name: 'Standard' },
        { id: 'Express', name: 'Express' },
        { id: 'Same Day', name: 'Same Day' }
    ];

    const defaultPriorities = [
        { id: 'Normal', name: 'Normal' },
        { id: 'High', name: 'High' },
        { id: 'Urgent', name: 'Urgent' }
    ];

    const vehicles = (options?.dynamicVehicleTypes && options.dynamicVehicleTypes.length > 0) ? options.dynamicVehicleTypes : defaultVehicles;
    const loads = (options?.dynamicLoadTypes && options.dynamicLoadTypes.length > 0) ? options.dynamicLoadTypes : defaultLoads;
    const services = (options?.dynamicServiceTypes && options.dynamicServiceTypes.length > 0) ? options.dynamicServiceTypes : defaultServices;
    const priorities = (options?.dynamicPriorityTypes && options.dynamicPriorityTypes.length > 0) ? options.dynamicPriorityTypes : defaultPriorities;

    const vehicleBadges = vehicles.map(v => `<span class="badge">${v.name || v.id}</span>`).join(' ');
    const loadBadges = loads.map(l => `<span class="badge">${l.name || l.id}</span>`).join(' ');
    const serviceBadges = services.map(s => `<span class="badge">${s.name || s.id}</span>`).join(' ');
    const priorityBadges = priorities.map(p => `<span class="badge">${p.name || p.id}</span>`).join(' ');

    newWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Freight Import Guide & Allowed Values - CarrierDirect</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 40px 20px; line-height: 1.5; }
        .container { max-width: 820px; margin: 0 auto; }
        .header { margin-bottom: 24px; }
        h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; }
        p.sub { font-size: 13px; color: #64748b; margin: 0; }
        .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        h2 { font-size: 14px; font-weight: 600; color: #0f172a; margin: 0 0 10px 0; }
        .badge-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
        .badge { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
        .btn { background: #0f172a; color: #fff; padding: 7px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; float: right; }
        .btn:hover { background: #334155; }
    </style>
</head>
<body>
    <div class="container">
        <button class="btn" onclick="window.print()">Print Specification</button>
        <div class="header">
            <h1>Freight Import Specification & Allowed Values</h1>
            <p class="sub">Dynamic master data retrieved from CarrierDirect API database</p>
        </div>

        <div class="card">
            <h2>1. Vehicle Types (Column: vehicle_type)</h2>
            <div class="badge-wrap">${vehicleBadges}</div>
        </div>

        <div class="card">
            <h2>2. Cargo / Load Types (Column: load_type)</h2>
            <div class="badge-wrap">${loadBadges}</div>
        </div>

        <div class="card">
            <h2>3. Service & Priority (Columns: service_type, priority_level)</h2>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 6px; font-weight: 600;">Service Types:</div>
            <div class="badge-wrap" style="margin-bottom: 12px;">${serviceBadges}</div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 6px; font-weight: 600;">Priority Levels:</div>
            <div class="badge-wrap">${priorityBadges}</div>
        </div>
    </div>
</body>
</html>
    `);
    newWindow.document.close();
};
