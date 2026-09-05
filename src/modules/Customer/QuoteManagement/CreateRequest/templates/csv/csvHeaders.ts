/**
 * CSV Headers and Blank Template Generator
 */
export const CSV_HEADERS = [
    "Request Title *",
    "Priority",
    "Shipment Type",
    "Service Type",
    "Expected Transit Time",

    "Pickup Date *",
    "Pickup Time",
    "Pickup Company Name *",
    "Pickup Contact Person *",
    "Pickup Phone *",
    "Pickup Email",
    "Pickup Country *",
    "Pickup State Division",
    "Pickup City *",
    "Pickup Zip Code",
    "Pickup Full Address *",
    "Pickup Google Map URL",
    "Pickup Special Instructions",

    "Delivery Date *",
    "Delivery Time",
    "Delivery Company Name *",
    "Delivery Contact Person *",
    "Delivery Phone *",
    "Delivery Email",
    "Delivery Country *",
    "Delivery State Division",
    "Delivery City *",
    "Delivery Zip Code",
    "Delivery Full Address *",
    "Delivery Google Map URL",
    "Delivery Special Instructions",

    "Vehicle Type Preference *",
    "Cargo Load Type *",
    "Items Count",
    "Pallets Count",
    "Total Weight (KG) *",
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

export const downloadBlankCSVTemplate = () => {
    const blob = new Blob([CSV_HEADERS], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'CarrierDirect_Blank_Quote_Request_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const downloadCSVTemplate = downloadBlankCSVTemplate;
