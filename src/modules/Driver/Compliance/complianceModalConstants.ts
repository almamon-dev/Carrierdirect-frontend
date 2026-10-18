import { CreditCard, Briefcase, Truck, ShieldCheck, Clock } from 'lucide-react';

export const formatDateForInput = (val?: string | null): string => {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
    }
    return val;
};

export const licenseClassOptions = [
    { value: '', label: 'Select CDL Classification *' },
    { value: 'Class A', label: 'Class A - Heavy Tractor-Trailer combinations' },
    { value: 'Class B', label: 'Class B - Straight Truck & Heavy Single Vehicle' },
    { value: 'Class C', label: 'Class C - Hazardous / Commercial Transport' },
];

export const equipmentTypeOptions = [
    { value: '', label: 'Select Equipment / Trailer Type *' },
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
    { value: 'Other', label: 'Other (Enter Custom Trailer / Equipment)' },
];

export const COMPLIANCE_STEPS = [
    {
        number: 1,
        title: 'CDL License',
        subtitle: 'Driver credentials & class',
        icon: CreditCard,
    },
    {
        number: 2,
        title: 'DOT Medical Card',
        subtitle: 'MCSA-5876 physical exam',
        icon: Briefcase,
    },
    {
        number: 3,
        title: 'Assigned Vehicle',
        subtitle: 'Power unit & trailer specs',
        icon: Truck,
    },
    {
        number: 4,
        title: 'Fleet Insurance',
        subtitle: 'Commercial liability COI',
        icon: ShieldCheck,
    },
    {
        number: 5,
        title: 'Admin Approval',
        subtitle: 'Safety review & status',
        icon: Clock,
    },
];
