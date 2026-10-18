import {
    Package,
    Truck,
    FileText,
    DollarSign,
    Users,
    Settings as SettingsIcon,
    Layers,
} from 'lucide-react';

export interface ModulePermission {
    id: string;
    name: string;
    description: string;
    category?: string;
    icon?: any;
}

export const parsePermission = (p: any): ModulePermission => {
    const rawName = p.name || p.label || p.id || '';
    const rawDesc = p.description || p.desc || '';

    let cleanName = rawName;
    let cleanDesc = rawDesc;

    const regex = /Manage\s+and\s+configure\s+(.+?)\s+access\s+permissions/i;
    const matchName = rawName.match(regex);
    const matchDesc = rawDesc.match(regex);

    if (matchName) {
        cleanName = matchName[1];
        cleanDesc = rawDesc && rawDesc !== rawName ? rawDesc : `Full access, tracking and management for ${cleanName}.`;
    } else if (matchDesc) {
        cleanName = matchDesc[1];
        cleanDesc = rawDesc;
    } else {
        cleanName = cleanName.replace(/_/g, ' ').replace(/-/g, ' ');
    }

    cleanName = cleanName
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    if (!cleanDesc) {
        cleanDesc = `Full access and management for ${cleanName}.`;
    }

    const lower = cleanName.toLowerCase();
    let icon = Layers;
    if (lower.includes('order') || lower.includes('shipment')) icon = Package;
    else if (lower.includes('quote') || lower.includes('bid')) icon = FileText;
    else if (lower.includes('fleet') || lower.includes('driver')) icon = Truck;
    else if (lower.includes('finance') || lower.includes('invoice') || lower.includes('payment')) icon = DollarSign;
    else if (lower.includes('team') || lower.includes('staff') || lower.includes('user')) icon = Users;
    else if (lower.includes('setting') || lower.includes('compliance')) icon = SettingsIcon;

    return {
        id: p.id || p.key || cleanName.toLowerCase().replace(/\s+/g, '_'),
        name: cleanName,
        description: cleanDesc,
        category: p.category || 'Platform Modules',
        icon,
    };
};
