import { CSV_HEADERS } from './csvHeaders';

const P_INSTRUCTIONS = "1. Driver must report to Gate 3 security checkpost upon arrival.\\n2. Mandatory PPE required (safety helmet, high-vis vest, safety boots).\\n3. Inspect cargo packaging and pallet seal conditions before loading.\\n4. Obtain authorized supervisor signature and stamped gate pass on BOL.\\n5. Notify dispatch team immediately via phone prior to departure.";

const D_INSTRUCTIONS = "1. Contact destination warehouse receiving manager 1 hour prior to arrival.\\n2. Vehicle must be parked in designated Unloading Bay #2 only.\\n3. Receiving permitted strictly between 08:00 AM and 06:00 PM.\\n4. Verify item count and pallet condition with warehouse receiver before offloading.\\n5. Secure signed and stamped Proof of Delivery (POD) copy before leaving facility.";

const sampleRow1 = [
    '"5 Pallets Machinery Parts - Gazipur to Chittagong Port"',
    '"High"', '"One Way"', '"Express"', '"2 Days"',
    '"2026-07-28"', '"09:00 AM"', '"Prime Logistics EPZ Depot"', '"Kamal Hossain"', '"+8801711234567"',
    '"dispatch@primelogistics.bd"', '"Bangladesh"', '"Dhaka Division"', '"Dhaka (Gazipur)"', '"1700"',
    '"Plot 42, Sector 4, Gazipur Industrial Area, Gazipur"', '"https://maps.google.com/?q=Gazipur+EPZ"',
    `"${P_INSTRUCTIONS}"`,
    '"2026-07-30"', '"05:00 PM"', '"Chittagong Maritime Terminal Hub"', '"Rahim Uddin"', '"+8801819987654"',
    '"cargo@ctgport.com"', '"Bangladesh"', '"Chittagong Division"', '"Chittagong (Port Area)"', '"4000"',
    '"Terminal 2, Berth 5, Port Authority Zone, Chittagong"', '"https://maps.google.com/?q=Chittagong+Port"',
    `"${D_INSTRUCTIONS}"`,
    '"Covered Van (20ft)"', '"Pallets (Machinery Spare Parts)"', '"25"', '"5"', '"2500"', '"15.5"', '"120x80x100 CM"',
    '"Euro Pallets"', '"5"', '"120x80x100"', '"500"', '"Stackable, Fragile Care"',
    '"Cardboard Boxes"', '"10"', '"40x40x40"', '"100"', '"Standard Care"',
    '"Wooden Crates"', '"2"', '"150x100x50"', '"400"', '"Heavy Cargo Loading"',
    '"Yes"', '"Yes"', '"No"', '"No"', '"No"', '"No"', '"Yes"', '"Yes"', '"Yes"', '"Yes"',
    '"48000"', '"Yes"', '"Yes"', '"7 Days"',
    '"Fully covered, waterproof vehicle required with 2 labor personnel."',
    '"Driver must report to Gate 3 loading dock upon arrival."',
    '"PO-98765-GAZ"', '"Cargo_Photos_Batch.zip"'
].join(",") + "\n";

const sampleRow2 = [
    '"100 Garment Fabric Rolls - Savar EPZ to Comilla Hub"',
    '"Normal"', '"One Way"', '"Express"', '"1 Day"',
    '"2026-08-01"', '"10:00 AM"', '"Savar Textile Depot"', '"Shakil Ahmed"', '"+8801911334455"',
    '"dispatch@savartek.bd"', '"Bangladesh"', '"Dhaka Division"', '"Savar EPZ"', '"1340"',
    '"Savar EPZ Industrial Zone, Sector 2, Dhaka 1340"', '"https://maps.google.com/?q=Savar+EPZ"',
    `"${P_INSTRUCTIONS}"`,
    '"2026-08-02"', '"06:00 PM"', '"Comilla Maritime Hub"', '"Tanvir Hasan"', '"+8801711998877"',
    '"cargo@comillahub.bd"', '"Bangladesh"', '"Chittagong Division"', '"Comilla Hub"', '"3500"',
    '"Comilla Highway Hub, Industrial Zone, Comilla 3500"', '"https://maps.google.com/?q=Comilla+Hub"',
    `"${D_INSTRUCTIONS}"`,
    '"Covered Truck (24ft)"', '"Rolls / Textiles"', '"100"', '"0"', '"3200"', '"18.0"', '"150x30x30 CM"',
    '"Garment Fabric Rolls"', '"100"', '"150x30x30"', '"3200"', '"Moisture Protection Required"',
    '""', '""', '""', '""', '""',
    '""', '""', '""', '""', '""',
    '"Yes"', '"No"', '"No"', '"No"', '"No"', '"No"', '"Yes"', '"Yes"', '"No"', '"Yes"',
    '"38000"', '"Yes"', '"Yes"', '"5 Days"',
    '"Contact Savar supervisor before departure. Keep fabric rolls dry."',
    '"Handle with care. Driver must wear safety vest inside EPZ."',
    '"PO-55443-SAV"', '"Fabric_Rolls_Photos.zip"'
].join(",") + "\n";

export const downloadSampleCSVWithValues = () => {
    const blob = new Blob([CSV_HEADERS + sampleRow1 + sampleRow2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'CarrierDirect_Quote_Request_Sample_With_Values.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const download50SampleCSV = async () => {
    try {
        const response = await fetch('/Sample_50_Quote_Requests.csv');
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'Sample_50_Quote_Requests.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    } catch (e) {
        console.error('Failed to download 50 sample CSV', e);
    }
};
