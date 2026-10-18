import React from 'react';
import { Sparkles, Truck } from 'lucide-react';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import Select from '@/components/ui/select';
import { FleetVehicleOption } from '../hooks/useAssignVehicle';

export const VEHICLE_TYPES = [
    'Van',
    'Curtain Sider',
    'Box Truck',
    'Refrigerated (Chilled/Frozen)',
    'Flatbed',
    'Luton Van',
    'Low Loader',
    'Articulated Truck',
    'Tanker',
    'Car Transporter',
];

export const PRESET_VEHICLES = [
    { name: 'Ford Transit Custom', type: 'Van', plate: '261 D 23235', capacity: '1,200 kg' },
    { name: 'Mercedes-Benz Sprinter', type: 'Van', plate: 'UK-AB12CD', capacity: '1,400 kg' },
    { name: 'Volvo FH16 Globetrotter', type: 'Box Truck', plate: 'FR-XY342T', capacity: '24,000 kg' },
    { name: 'Scania R450 Streamline', type: 'Curtain Sider', plate: 'BE-KL78MN', capacity: '20,000 kg' },
];

interface AssignVehicleFormFieldsProps {
    fleetVehicles?: FleetVehicleOption[];
    isLoadingFleet?: boolean;
    vehicleName: string;
    setVehicleName: (val: string) => void;
    vehicleType: string;
    setVehicleType: (val: string) => void;
    isCustomType: boolean;
    setIsCustomType: (val: boolean) => void;
    customType: string;
    setCustomType: (val: string) => void;
    vehiclePlate: string;
    setVehiclePlate: (val: string) => void;
    capacity: string;
    setCapacity: (val: string) => void;
    disabled: boolean;
    onSelectVehicle: (v: { name: string; type: string; plate?: string; registration_no?: string; capacity?: string }) => void;
}

export const AssignVehicleFormFields: React.FC<AssignVehicleFormFieldsProps> = ({
    fleetVehicles = [],
    isLoadingFleet = false,
    vehicleName,
    setVehicleName,
    vehicleType,
    setVehicleType,
    isCustomType,
    setIsCustomType,
    customType,
    setCustomType,
    vehiclePlate,
    setVehiclePlate,
    capacity,
    setCapacity,
    disabled,
    onSelectVehicle,
}) => {
    const vehiclesToDisplay = fleetVehicles.length > 0 ? fleetVehicles : PRESET_VEHICLES;

    return (
        <div className="space-y-4 font-sans">
            {/* Quick Select Fleet Vehicles */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Sparkles size={12} className="text-[#ff4a1f]" />
                        Select Fleet Vehicle:
                    </span>
                    {isLoadingFleet && <span className="text-[10px] text-slate-400">Loading fleet...</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {vehiclesToDisplay.map((p: any) => {
                        const plate = p.registration_no || p.plate || '';
                        const isCurrent = vehiclePlate && vehiclePlate.toUpperCase() === plate.toUpperCase();
                        return (
                            <button
                                key={plate || p.name}
                                type="button"
                                onClick={() => onSelectVehicle(p)}
                                className={`text-[11px] px-2 py-1 rounded-[4px] border transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isCurrent
                                        ? 'bg-orange-50 dark:bg-orange-950/40 border-[#ff4a1f] text-[#ff4a1f] font-bold shadow-2xs'
                                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                                }`}
                            >
                                <Truck size={11} className={isCurrent ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                <span>{p.name}</span>
                                {plate && <span className="font-mono text-[9.5px] opacity-75">({plate})</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Vehicle Model / Name <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Input
                        type="text"
                        required
                        placeholder="e.g. Mercedes Sprinter, Volvo FH16"
                        value={vehicleName}
                        onChange={(e) => setVehicleName(e.target.value)}
                        className="text-xs h-9 mt-1 rounded-[4px]"
                        disabled={disabled}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="flex items-center justify-between">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Vehicle Type <span className="text-rose-500">*</span>
                            </FormLabel>
                            <button
                                type="button"
                                onClick={() => {
                                    if (isCustomType) {
                                        setIsCustomType(false);
                                        setVehicleType(VEHICLE_TYPES[0]);
                                    } else {
                                        setIsCustomType(true);
                                        setCustomType(vehicleType && !VEHICLE_TYPES.includes(vehicleType) ? vehicleType : '');
                                    }
                                }}
                                className="text-[10.5px] text-[#ff4a1f] hover:underline font-semibold cursor-pointer"
                            >
                                {isCustomType ? 'From list' : '+ Custom'}
                            </button>
                        </div>
                        <div className="mt-1">
                            {isCustomType ? (
                                <Input
                                    type="text"
                                    required
                                    placeholder="e.g. Tipper, Tanker"
                                    value={customType}
                                    onChange={(e) => {
                                        setCustomType(e.target.value);
                                        setVehicleType(e.target.value);
                                    }}
                                    className="text-xs h-9 rounded-[4px]"
                                    disabled={disabled}
                                    autoFocus
                                />
                            ) : (
                                <Select
                                    value={vehicleType}
                                    onChange={(val: any) => {
                                        const v = val?.target?.value !== undefined ? val.target.value : val;
                                        if (v === '__custom__') {
                                            setIsCustomType(true);
                                            setCustomType('');
                                        } else {
                                            setVehicleType(v);
                                        }
                                    }}
                                    disabled={disabled}
                                    options={[
                                        ...VEHICLE_TYPES.map((t) => ({ id: t, name: t })),
                                        { id: '__custom__', name: '+ Custom / Other...' },
                                    ]}
                                    placeholder="Select vehicle type..."
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Registration / Plate <span className="text-rose-500">*</span>
                        </FormLabel>
                        <Input
                            type="text"
                            required
                            placeholder="e.g. UK-AB12CD"
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                            className="text-xs h-9 mt-1 rounded-[4px] font-mono uppercase tracking-wider"
                            disabled={disabled}
                        />
                    </div>
                </div>

                <div>
                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Payload Capacity
                    </FormLabel>
                    <Input
                        type="text"
                        placeholder="e.g. 1,200 kg or 24,000 kg"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="text-xs h-9 mt-1 rounded-[4px]"
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default AssignVehicleFormFields;
