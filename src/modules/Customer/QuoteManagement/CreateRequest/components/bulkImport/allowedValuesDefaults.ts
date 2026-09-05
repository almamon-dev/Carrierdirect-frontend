export interface AllowedValuesOptions {
    dynamicVehicleTypes?: any[];
    dynamicLoadTypes?: any[];
    dynamicServiceTypes?: any[];
    dynamicPriorityTypes?: any[];
}

export const defaultVehicles = [
    { id: 'Covered Van', name: 'Covered Van' },
    { id: 'Flatbed Truck', name: 'Flatbed Truck' },
    { id: 'Trailer', name: 'Trailer' },
    { id: 'Reefer / Temperature Controlled', name: 'Reefer / Temperature Controlled' },
    { id: 'Open Truck', name: 'Open Truck' },
    { id: 'Container Carrier', name: 'Container Carrier' },
    { id: 'Heavy Hauler', name: 'Heavy Hauler' }
];

export const defaultLoads = [
    { id: 'Pallets', name: 'Pallets' },
    { id: 'Cartons / Boxes', name: 'Cartons / Boxes' },
    { id: 'Machinery Parts', name: 'Machinery Parts' },
    { id: 'Raw Materials', name: 'Raw Materials' },
    { id: 'Perishable Goods', name: 'Perishable Goods' },
    { id: 'Chemicals / Hazardous', name: 'Chemicals / Hazardous' }
];

export const defaultServices = [
    { id: 'Standard', name: 'Standard' },
    { id: 'Express', name: 'Express' },
    { id: 'Same Day', name: 'Same Day' }
];

export const defaultPriorities = [
    { id: 'Normal', name: 'Normal' },
    { id: 'High', name: 'High' },
    { id: 'Urgent', name: 'Urgent' }
];
