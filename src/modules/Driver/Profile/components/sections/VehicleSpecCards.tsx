import React from 'react';
import {
    Truck, ShieldCheck, FileText, CheckCircle2,
    Calendar, Tag, Hash, CreditCard, Box
} from 'lucide-react';

interface KeyValueRowProps {
    label: string;
    value: React.ReactNode;
    isMono?: boolean;
    highlight?: boolean;
    icon?: any;
    iconColor?: string;
    action?: React.ReactNode;
}

export const KeyValueRow: React.FC<KeyValueRowProps> = ({
    label,
    value,
    isMono = false,
    highlight = false,
    icon: Icon,
    iconColor = 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400',
    action,
}) => (
    <div className="flex items-start justify-between py-[5px] text-[13px]">
        <div className="flex items-start gap-1.5 min-w-0 flex-1 pr-2">
            {Icon && (
                <div className={`w-5 h-5 rounded-[3px] flex items-center justify-center shrink-0 mt-0.5 ${iconColor}`}>
                    <Icon size={11} />
                </div>
            )}
            <span className="w-[140px] shrink-0 text-slate-600 dark:text-slate-400 font-medium">{label}</span>
            <span className="text-slate-400 dark:text-slate-500 font-medium select-none px-0.5">:</span>
            <span
                className={`break-words ${isMono ? 'font-mono' : ''} ${
                    highlight ? 'font-bold text-[#ff4a1f]' : 'font-semibold text-slate-900 dark:text-white'
                }`}
            >
                {value || '—'}
            </span>
        </div>
        {action && <div className="shrink-0 ml-2">{action}</div>}
    </div>
);

interface VehicleSpecCardsProps {
    fleet: any;
}

export const VehicleSpecCards: React.FC<VehicleSpecCardsProps> = ({ fleet }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
            {/* Column 1: Power Unit Specs */}
            <div className="space-y-1">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <Tag size={12} />
                    <span>Power unit specs</span>
                </div>
                <KeyValueRow label="Tractor Model" value={fleet.tractorModel} icon={Truck} />
                <KeyValueRow label="Power Unit #" value={fleet.unitNumber} isMono icon={Hash} />
                <KeyValueRow label="License Plate" value={fleet.licensePlate} isMono icon={CreditCard} />
                <KeyValueRow label="Vehicle VIN" value={fleet.vin} isMono icon={ShieldCheck} />
            </div>

            {/* Column 2: Equipment & Trailer */}
            <div className="space-y-1">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <Box size={12} />
                    <span>Assigned trailer</span>
                </div>
                <KeyValueRow label="Equipment Type" value={fleet.equipmentType} icon={Box} />
                <KeyValueRow label="Trailer #" value={fleet.trailerNumber} isMono icon={Hash} />
                <KeyValueRow
                    label="Inspection Status"
                    value={
                        <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle2 size={12} className="mr-1" />
                            {fleet.inspectionStatus || 'Pending Inspection'}
                        </span>
                    }
                    icon={ShieldCheck}
                    iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
                />
            </div>

            {/* Column 3: Commercial Insurance */}
            <div className="space-y-1">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    <span>Fleet insurance</span>
                </div>
                <KeyValueRow
                    label="Carrier Insurer"
                    value={fleet.insuranceProvider || '—'}
                    icon={ShieldCheck}
                    iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400"
                />
                <KeyValueRow
                    label="Policy Number"
                    value={fleet.insurancePolicyNumber || '—'}
                    isMono
                    icon={FileText}
                    iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400"
                />
                <KeyValueRow
                    label="Policy Expiry"
                    value={
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {fleet.insuranceExpiryDate || '—'}
                        </span>
                    }
                    icon={Calendar}
                    iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
                />
            </div>
        </div>
    );
};
