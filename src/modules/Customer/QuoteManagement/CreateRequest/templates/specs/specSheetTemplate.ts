/**
 * Specification Guide Generator for GetItMoving Quote Requests
 */
export const downloadSpecSheet = () => {
    const content = `LOGISTICS & TRANSPORTATION SPECIFICATION GUIDE
==================================================

1. VEHICLE TYPES & CAPACITY:
   - Covered Van (20ft): Max Load 2,500 KG | 15.5 CBM
   - Open Truck (14ft): Max Load 1,200 KG | 8.0 CBM
   - Open Truck (18ft): Max Load 2,400 KG | 12.0 CBM
   - Covered Truck (24ft): Max Load 5,200 KG | 25.0 CBM
   - Trailer Truck (40ft): Max Load 25,000 KG | 60.0 CBM

2. REQUIRED COLUMN HEADERS FOR PDF / DOCUMENT IMPORTS:
   - Request Title, Pickup Location, Delivery Location, Vehicle Type, Cargo Specs, Total Weight, Target Budget.

3. ATTACHMENT ZIP GUIDELINES:
   - ZIP file can contain: Commercial Invoices, Packing Lists, Cargo Photos (.jpg, .png), CAD drawings.
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Logistics_Specification_Guide.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
