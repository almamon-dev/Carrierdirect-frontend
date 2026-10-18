import { User, Files } from 'lucide-react';

export const DRIVER_SETTINGS_TABS = [
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'documents', label: 'Documents', icon: Files },
];

export const LICENSE_CLASS_OPTIONS = [
    { value: 'Class A', label: 'Class A - Heavy Tractor-Trailer combinations' },
    { value: 'Class B', label: 'Class B - Straight Truck & Heavy Single Vehicle' },
    { value: 'Class C', label: 'Class C - Hazardous / Commercial Transport' },
];

export const EQUIPMENT_TYPE_OPTIONS = [
    { value: '53ft Dry Van', label: '53ft Dry Van Trailer' },
    { value: '53ft Reefer', label: '53ft Temperature Controlled Reefer' },
    { value: 'Flatbed', label: 'Standard Flatbed Trailer' },
    { value: 'Step Deck', label: 'Step Deck / Drop Deck' },
    { value: 'Power Only', label: 'Power Only (Tractor Unit Only)' },
    { value: 'Tanker', label: 'Liquid / Bulk Tanker' },
    { value: 'Box Truck', label: 'Commercial Box Truck (26ft)' },
    { value: 'Hotshot', label: 'Hotshot / Gooseneck' },
    { value: 'Conestoga', label: 'Conestoga Trailer' },
    { value: 'Car Hauler', label: 'Auto Carrier / Car Hauler' },
];

export const formatDateForInput = (val?: string | null): string => {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
    }
    return val;
};
