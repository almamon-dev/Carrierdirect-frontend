/**
 * Complete CSV Template Generator for GetItMoving Quote Requests
 * Contains 100% full field schema matching the PDF Quote Request Template.
 */
export const downloadCSVTemplate = () => {
    const headers = [
        "Request Title",
        "Priority",
        "Shipment Type",
        "Service Type",
        "Expected Transit Time",
        
        "Pickup Date",
        "Pickup Time",
        "Pickup Company Name",
        "Pickup Contact Person",
        "Pickup Phone",
        "Pickup Email",
        "Pickup Country",
        "Pickup State Division",
        "Pickup City",
        "Pickup Zip Code",
        "Pickup Full Address",
        "Pickup Google Map URL",
        "Pickup Special Instructions",

        "Delivery Date",
        "Delivery Time",
        "Delivery Company Name",
        "Delivery Contact Person",
        "Delivery Phone",
        "Delivery Email",
        "Delivery Country",
        "Delivery State Division",
        "Delivery City",
        "Delivery Zip Code",
        "Delivery Full Address",
        "Delivery Google Map URL",
        "Delivery Special Instructions",

        "Vehicle Type Preference",
        "Cargo Load Type",
        "Items Count",
        "Pallets Count",
        "Total Weight (KG)",
        "Total Volume (CBM)",
        "Cargo Dimensions (LxWxH CM)",

        "Item 1 Type", "Item 1 Qty", "Item 1 Dimensions (CM)", "Item 1 Weight (KG)", "Item 1 Handling",
        "Item 2 Type", "Item 2 Qty", "Item 2 Dimensions (CM)", "Item 2 Weight (KG)", "Item 2 Handling",
        "Item 3 Type", "Item 3 Qty", "Item 3 Dimensions (CM)", "Item 3 Weight (KG)", "Item 3 Handling",

        "Stackable Cargo (Yes/No)",
        "Fragile Care (Yes/No)",
        "Hazardous (Yes/No)",
        "Temp Controlled (Yes/No)",
        "Oversized Cargo (Yes/No)",
        "Perishable Goods (Yes/No)",
        "Loading Service Required (Yes/No)",
        "Unloading Service Required (Yes/No)",
        "Packaging Service (Yes/No)",
        "Cargo Insurance (Yes/No)",

        "Target Budget Rate (EUR)",
        "Allow Rate Negotiation (Yes/No)",
        "Receive Multiple Bids (Yes/No)",
        "Auto Expire Duration",

        "Customer Notes",
        "Special Instructions",
        "Internal Reference ID",
        "Attached ZIP Archive File"
    ].join(",") + "\n";

    const sampleRow1 = [
        '"5 Pallets Machinery Parts - Gazipur to Chittagong Port"',
        '"High"',
        '"One Way"',
        '"Express"',
        '"2 Days"',

        '"2026-07-28"',
        '"09:00 AM"',
        '"Prime Logistics EPZ Depot"',
        '"Kamal Hossain"',
        '"+8801711234567"',
        '"dispatch@primelogistics.bd"',
        '"Bangladesh"',
        '"Dhaka Division"',
        '"Dhaka (Gazipur)"',
        '"1700"',
        '"Plot 42, Sector 4, Gazipur Industrial Area, Gazipur"',
        '"https://maps.google.com/?q=Gazipur+EPZ"',
        '"Report to Gate 3 loading dock upon arrival"',

        '"2026-07-30"',
        '"05:00 PM"',
        '"Chittagong Maritime Terminal Hub"',
        '"Rahim Uddin"',
        '"+8801819987654"',
        '"cargo@ctgport.com"',
        '"Bangladesh"',
        '"Chittagong Division"',
        '"Chittagong (Port Area)"',
        '"4000"',
        '"Terminal 2, Berth 5, Port Authority Zone, Chittagong"',
        '"https://maps.google.com/?q=Chittagong+Port"',
        '"Delivery permitted between 08:00 AM and 06:00 PM"',

        '"Covered Van (20ft)"',
        '"Pallets (Machinery Spare Parts)"',
        '"25"',
        '"5"',
        '"2500"',
        '"15.5"',
        '"120x80x100 CM"',

        '"Euro Pallets"', '"5"', '"120x80x100"', '"500"', '"Stackable, Fragile Care"',
        '"Cardboard Boxes"', '"10"', '"40x40x40"', '"100"', '"Standard Care"',
        '"Wooden Crates"', '"2"', '"150x100x50"', '"400"', '"Heavy Cargo Loading"',

        '"Yes"',
        '"Yes"',
        '"No"',
        '"No"',
        '"No"',
        '"No"',
        '"Yes"',
        '"Yes"',
        '"Yes"',
        '"Yes"',

        '"48000"',
        '"Yes"',
        '"Yes"',
        '"7 Days"',

        '"Fully covered, waterproof vehicle required with 2 labor personnel."',
        '"Driver must report to Gate 3 loading dock upon arrival."',
        '"PO-98765-GAZ"',
        '"Cargo_Photos_Batch.zip"'
    ].join(",") + "\n";

    const sampleRow2 = [
        '"100 Garment Fabric Rolls - Savar EPZ to Comilla Hub"',
        '"Normal"',
        '"One Way"',
        '"Express"',
        '"1 Day"',

        '"2026-08-01"',
        '"10:00 AM"',
        '"Savar Textile Depot"',
        '"Shakil Ahmed"',
        '"+8801911334455"',
        '"dispatch@savartek.bd"',
        '"Bangladesh"',
        '"Dhaka Division"',
        '"Savar EPZ"',
        '"1340"',
        '"Savar EPZ Industrial Zone, Sector 2, Dhaka 1340"',
        '"https://maps.google.com/?q=Savar+EPZ"',
        '"Call 1 hour before pickup arrival"',

        '"2026-08-02"',
        '"06:00 PM"',
        '"Comilla Maritime Hub"',
        '"Tanvir Hasan"',
        '"+8801711998877"',
        '"cargo@comillahub.bd"',
        '"Bangladesh"',
        '"Chittagong Division"',
        '"Comilla Hub"',
        '"3500"',
        '"Comilla Highway Hub, Industrial Zone, Comilla 3500"',
        '"https://maps.google.com/?q=Comilla+Hub"',
        '"Unloading bay 1. Receiving allowed until 06:00 PM."',

        '"Covered Truck (24ft)"',
        '"Rolls / Textiles"',
        '"100"',
        '"0"',
        '"3200"',
        '"18.0"',
        '"150x30x30 CM"',

        '"Garment Fabric Rolls"', '"100"', '"150x30x30"', '"3200"', '"Moisture Protection Required"',
        '""', '""', '""', '""', '""',
        '""', '""', '""', '""', '""',

        '"Yes"',
        '"No"',
        '"No"',
        '"No"',
        '"No"',
        '"No"',
        '"Yes"',
        '"Yes"',
        '"No"',
        '"Yes"',

        '"38000"',
        '"Yes"',
        '"Yes"',
        '"5 Days"',

        '"Contact Savar supervisor before departure. Keep fabric rolls dry."',
        '"Handle with care. Driver must wear safety vest inside EPZ."',
        '"PO-55443-SAV"',
        '"Fabric_Rolls_Photos.zip"'
    ].join(",") + "\n";

    const blob = new Blob([headers + sampleRow1 + sampleRow2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'GetItMoving_Quote_Request_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
