import React from 'react';
import { Truck } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

export const STANDARD_TYPES = ['Van (3.5t)', 'Van', 'Truck', 'Rigid', 'Artic (44t)', 'Trailer', 'Box Truck', 'Flatbed Truck', 'Refrigerated Truck'];

interface VehicleModalFieldsProps {
    name: string;
    setName: (val: string) => void;
    type: string;
    setType: (val: string) => void;
    isCustomType: boolean;
    setIsCustomType: (val: boolean) => void;
    customType: string;
    setCustomType: (val: string) => void;
    registrationNo: string;
    setRegistrationNo: (val: string) => void;
    capacity: string;
    setCapacity: (val: string) => void;
    status: any;
    setStatus: (val: any) => void;
    assignedDriver?: string;
    setAssignedDriver?: (val: string) => void;
}

export const VehicleModalFields: React.FC<VehicleModalFieldsProps> = ({
    name,
    setName,
    type,
    setType,
    isCustomType,
    setIsCustomType,
    customType,
    setCustomType,
    registrationNo,
    setRegistrationNo,
    capacity,
    setCapacity,
    status,
    setStatus,
    assignedDriver,
    setAssignedDriver,
}) => {
    return (
        <div className="space-y-4 pt-1 font-sans">
            <Input
                label="Vehicle Model / Name *"
                type="text"
                required
                placeholder="e.g. Mercedes Sprinter, Volvo FH16"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<Truck size={14} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 block">
                            Vehicle Type <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                if (isCustomType) {
                                    setIsCustomType(false);
                                    setType('Van (3.5t)');
                                } else {
                                    setIsCustomType(true);
                                    setCustomType(type && !STANDARD_TYPES.includes(type) ? type : '');
                                }
                            }}
                            className="text-[11px] text-[#ff4a1f] hover:underline font-semibold cursor-pointer"
                        >
                            {isCustomType ? 'From list' : '+ Custom'}
                        </button>
                    </div>
                    {isCustomType ? (
                        <Input
                            type="text"
                            required
                            placeholder="e.g. Tipper, Tanker, Luton Van"
                            value={customType}
                            onChange={(e) => {
                                setCustomType(e.target.value);
                                setType(e.target.value);
                            }}
                            className="text-xs h-9 rounded-[4px]"
                            autoFocus
                        />
                    ) : (
                        <Select
                            value={type}
                            onChange={(val: any) => {
                                const v = val?.target?.value !== undefined ? val.target.value : val;
                                if (v === '__custom__') {
                                    setIsCustomType(true);
                                    setCustomType('');
                                } else {
                                    setType(v);
                                }
                            }}
                            options={[
                                { id: 'Van (3.5t)', name: 'Van (3.5t)' },
                                { id: 'Rigid', name: 'Rigid' },
                                { id: 'Artic (44t)', name: 'Artic (44t)' },
                                { id: 'Van', name: 'Van' },
                                { id: 'Truck', name: 'Truck' },
                                { id: 'Box Truck', name: 'Box Truck' },
                                { id: 'Flatbed Truck', name: 'Flatbed Truck' },
                                { id: 'Refrigerated Truck', name: 'Refrigerated Truck' },
                                { id: '__custom__', name: '+ Custom / Other...' },
                            ]}
                            placeholder="Select vehicle type..."
                        />
                    )}
                </div>

                <div>
                    <Input
                        label="Registration / Plate *"
                        type="text"
                        required
                        placeholder="e.g. FD68 XYZ"
                        value={registrationNo}
                        onChange={(e) => setRegistrationNo(e.target.value.toUpperCase())}
                        className="font-mono uppercase tracking-wider"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                    label="Payload Capacity"
                    type="text"
                    placeholder="e.g. 1,200 kg or 24,000 kg"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                />

                {setAssignedDriver && (
                    <Input
                        label="Assigned Driver"
                        type="text"
                        placeholder="e.g. John Doe (Optional)"
                        value={assignedDriver || ''}
                        onChange={(e) => setAssignedDriver(e.target.value)}
                    />
                )}
            </div>

            <div>
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Operational Status <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <Select
                    value={status}
                    onChange={(val: any) => {
                        const v = val?.target?.value !== undefined ? val.target.value : val;
                        setStatus(v);
                    }}
                    options={[
                        { id: 'Active', name: 'Active' },
                        { id: 'Maintenance', name: 'Maintenance' },
                        { id: 'Inactive', name: 'Inactive' },
                    ]}
                    placeholder="Select status..."
                />
            </div>
        </div>
    );
};

export default VehicleModalFields;
