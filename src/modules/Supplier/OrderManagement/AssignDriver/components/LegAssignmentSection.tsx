import React, { useMemo } from 'react';
import {
    AlertCircle,
    Building2,
    Euro,
    Phone,
    Route,
    Truck,
    User,
} from 'lucide-react';
import Input from '@/components/ui/input';
import Select, { SelectOption } from '@/components/ui/select';
import {
    ExecutionMode,
    FleetDriverItem,
    FleetVehicleItem,
    LegAssignmentState,
} from '../types';
import { isDriverUnavailable, isVehicleUnavailable } from '../utils/dispatchHelpers';

interface LegAssignmentSectionProps {
    title: string;
    subtitle: string;
    legNumber?: 1 | 2;
    showLegRoute?: boolean;
    legState: LegAssignmentState;
    onChange: (updates: Partial<LegAssignmentState>) => void;
    fleetDrivers: FleetDriverItem[];
    fleetVehicles: FleetVehicleItem[];
    subcontractorsList: any[];
    isLoading?: boolean;
}

const FieldLabel: React.FC<{ label: string; required?: boolean }> = ({
    label,
    required,
}) => (
    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 font-sans">
        {label}
        {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
    </label>
);

export const LegAssignmentSection: React.FC<LegAssignmentSectionProps> = ({
    title,
    subtitle,
    legNumber = 1,
    showLegRoute = false,
    legState,
    onChange,
    fleetDrivers,
    fleetVehicles,
    subcontractorsList,
    isLoading = false,
}) => {
    const selectedDriver = useMemo(
        () =>
            fleetDrivers.find(
                (d) =>
                    String(d.rawId) === String(legState.driverId) ||
                    String(d.id) === String(legState.driverId)
            ) || null,
        [fleetDrivers, legState.driverId]
    );

    const selectedVehicle = useMemo(
        () =>
            fleetVehicles.find(
                (v) => String(v.id) === String(legState.vehicleId)
            ) || null,
        [fleetVehicles, legState.vehicleId]
    );

    const selectedSubcontractor = useMemo(
        () =>
            subcontractorsList.find(
                (s) => String(s.id) === String(legState.subcontractorId)
            ) || null,
        [subcontractorsList, legState.subcontractorId]
    );

    const registeredSubDrivers = useMemo(
        () =>
            Array.isArray(selectedSubcontractor?.drivers)
                ? selectedSubcontractor.drivers
                : [],
        [selectedSubcontractor]
    );

    const driverOptions: SelectOption[] = useMemo(
        () =>
            fleetDrivers.map((d) => ({
                id: String(d.rawId),
                name: d.name,
                subtitle: `${d.availabilityStatus}${d.phone && d.phone !== '—' ? ` • ${d.phone}` : ''}`,
                badge: d.availabilityStatus,
                badgeColor:
                    d.availabilityStatus === 'Unavailable' ? 'neutral' : 'fleet',
                disabled: isDriverUnavailable(d),
            })),
        [fleetDrivers]
    );

    const vehicleOptions: SelectOption[] = useMemo(
        () =>
            fleetVehicles.map((v) => {
                const statusLabel = v.current_order_number
                    ? `On Job ${v.current_order_number}`
                    : v.status;
                const unavailable = isVehicleUnavailable(v);
                return {
                    id: String(v.id),
                    name: `${v.registration_no} — ${v.name}`,
                    selectedLabel: `${v.registration_no} (${v.name})`,
                    subtitle: `${v.type} • ${statusLabel}`,
                    badge: statusLabel,
                    badgeColor: unavailable ? 'neutral' : 'fleet',
                    disabled: unavailable,
                };
            }),
        [fleetVehicles]
    );

    const subcontractorOptions: SelectOption[] = useMemo(
        () =>
            subcontractorsList.map((s) => ({
                id: String(s.id),
                name: s.name,
                subtitle: s.phone || s.email || 'Subcontractor Partner',
            })),
        [subcontractorsList]
    );

    const subDriverOptions: SelectOption[] = useMemo(() => {
        const opts: SelectOption[] = registeredSubDrivers.map((sd: any) => ({
            id: String(sd.id),
            name: sd.name,
            subtitle: [sd.phone, sd.vehicle_plate].filter(Boolean).join(' • '),
        }));

        if (
            legState.subcontractorDriverId === 'custom' &&
            legState.subcontractorDriverName.trim() !== ''
        ) {
            opts.unshift({
                id: 'custom',
                name: legState.subcontractorDriverName.trim(),
            });
        }

        return opts;
    }, [
        registeredSubDrivers,
        legState.subcontractorDriverId,
        legState.subcontractorDriverName,
    ]);

    const handleModeChange = (mode: ExecutionMode) => {
        if (mode === legState.executionMode) return;
        onChange(
            mode === 'in_house'
                ? { executionMode: 'in_house', subcontractorCost: '' }
                : { executionMode: 'subcontractor' }
        );
    };

    const handleDriverSelect = (val: any) => {
        const driverRawId = String(val?.id ?? val?.value ?? val ?? '');
        const found = fleetDrivers.find(
            (d) =>
                String(d.rawId) === driverRawId ||
                String(d.id) === driverRawId
        );
        let nextVehicleId = legState.vehicleId;

        if (found) {
            const matchedVehicle =
                fleetVehicles.find(
                    (v) =>
                        !isVehicleUnavailable(v) &&
                        ((v.driver_id && String(v.driver_id) === String(found.rawId)) ||
                            (found.vehiclePlate &&
                                v.registration_no?.replace(/[\s-]/g, '').toUpperCase() ===
                                    found.vehiclePlate.replace(/[\s-]/g, '').toUpperCase()))
                ) ||
                (!nextVehicleId
                    ? fleetVehicles.find((v) => !isVehicleUnavailable(v))
                    : undefined);

            if (matchedVehicle) {
                nextVehicleId = String(matchedVehicle.id);
            }
        }

        onChange({
            driverId: driverRawId,
            vehicleId: nextVehicleId,
        });
    };

    const handleSubcontractorSelect = (val: any) => {
        const subId = String(val?.id ?? val?.value ?? val ?? '');
        const sub = subcontractorsList.find((s) => String(s.id) === subId);
        if (!sub) return;

        const firstDriver =
            Array.isArray(sub.drivers) && sub.drivers.length > 0
                ? sub.drivers[0]
                : null;
        onChange({
            subcontractorId: String(sub.id),
            subcontractorCompany: sub.name || '',
            subcontractorDriverId: firstDriver ? String(firstDriver.id) : '',
            subcontractorDriverName: firstDriver?.name || '',
            subcontractorDriverPhone: firstDriver?.phone || sub.phone || '',
            subcontractorDriverEmail: firstDriver?.email || sub.email || '',
            subcontractorVehiclePlate: firstDriver?.vehicle_plate || '',
            subcontractorVehicleType: firstDriver?.vehicle_type || 'Curtainsider 40ft',
        });
    };

    const handleSubDriverSelect = (val: any) => {
        const subDriverId = String(val?.id ?? val?.value ?? val ?? '');
        const sd = registeredSubDrivers.find(
            (d: any) => String(d.id) === subDriverId
        );
        if (sd) {
            onChange({
                subcontractorDriverId: String(sd.id),
                subcontractorDriverName: sd.name || '',
                subcontractorDriverPhone:
                    sd.phone || selectedSubcontractor?.phone || '',
                subcontractorDriverEmail:
                    sd.email || selectedSubcontractor?.email || '',
                subcontractorVehiclePlate: sd.vehicle_plate || '',
                subcontractorVehicleType: sd.vehicle_type || 'Curtainsider 40ft',
            });
        }
    };

    const driverWarning = selectedDriver && isDriverUnavailable(selectedDriver);
    const vehicleWarning = selectedVehicle && isVehicleUnavailable(selectedVehicle);

    return (
        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#191e24]">
            {/* Clean header with segmented switch */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate">
                        {title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {subtitle}
                    </p>
                </div>

                <div className="inline-flex p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-center shrink-0">
                    <button
                        type="button"
                        onClick={() => handleModeChange('in_house')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            legState.executionMode === 'in_house'
                                ? 'bg-[#ff4a1f] text-white'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                    >
                        <Truck size={12} />
                        <span>In-House Driver</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleModeChange('subcontractor')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            legState.executionMode === 'subcontractor'
                                ? 'bg-[#ff4a1f] text-white'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                    >
                        <Building2 size={12} />
                        <span>Subcontractor</span>
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {legState.executionMode === 'in_house' ? (
                    <div className="space-y-3">
                        {fleetDrivers.length === 0 && !isLoading ? (
                            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                <AlertCircle size={14} className="text-amber-500 shrink-0" />
                                <span>
                                    No company drivers found. Add fleet drivers or switch to Subcontractor.
                                </span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                                <div className="flex flex-col gap-1 w-full">
                                    <FieldLabel label="Driver" required />
                                    <Select
                                        size="md"
                                        icon={User}
                                        value={legState.driverId}
                                        onChange={handleDriverSelect}
                                        placeholder="Select driver"
                                        options={driverOptions}
                                    />
                                </div>

                                <Input
                                    label="Phone Number"
                                    icon={<Phone size={13} />}
                                    type="text"
                                    value={selectedDriver?.phone || ''}
                                    placeholder="Auto-filled if available"
                                    readOnly
                                    disabled
                                />

                                <div className="flex flex-col gap-1 w-full">
                                    <FieldLabel label="Company Vehicle" required />
                                    <Select
                                        size="md"
                                        icon={Truck}
                                        value={legState.vehicleId}
                                        onChange={(val) =>
                                            onChange({
                                                vehicleId: String(
                                                    val?.id ?? val?.value ?? val ?? ''
                                                ),
                                            })
                                        }
                                        placeholder="Select vehicle"
                                        options={vehicleOptions}
                                    />
                                </div>
                            </div>
                        )}

                        {(driverWarning || vehicleWarning) && (
                            <p className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1.5 font-medium">
                                <AlertCircle size={13} />
                                <span>
                                    {driverWarning
                                        ? 'Selected driver is currently unavailable.'
                                        : 'Selected vehicle is in Maintenance/Unavailable and cannot be dispatched.'}
                                </span>
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                            <div className="flex flex-col gap-1 w-full">
                                <FieldLabel label="Subcontractor Company" required />
                                <Select
                                    size="md"
                                    icon={Building2}
                                    value={legState.subcontractorId}
                                    onChange={handleSubcontractorSelect}
                                    onCreate={(companyName) =>
                                        onChange({
                                            subcontractorId: 'custom',
                                            subcontractorCompany: companyName,
                                        })
                                    }
                                    showSearch={true}
                                    placeholder="Select carrier company"
                                    options={subcontractorOptions}
                                />
                            </div>

                            <Input
                                label="Agreed Cost (€) *"
                                icon={<Euro size={13} />}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="450.00"
                                value={legState.subcontractorCost}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val !== '' && parseFloat(val) < 0) return;
                                    onChange({ subcontractorCost: val });
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                            <div className="flex flex-col gap-1 w-full">
                                <FieldLabel label="Driver" required />
                                <Select
                                    size="md"
                                    icon={User}
                                    value={
                                        legState.subcontractorDriverId ||
                                        (legState.subcontractorDriverName ? 'custom' : '')
                                    }
                                    onChange={handleSubDriverSelect}
                                    onCreate={(driverName) =>
                                        onChange({
                                            subcontractorDriverId: 'custom',
                                            subcontractorDriverName: driverName,
                                        })
                                    }
                                    showSearch={true}
                                    placeholder="Select driver"
                                    options={subDriverOptions}
                                />
                            </div>

                            <Input
                                label="Phone Number"
                                icon={<Phone size={13} />}
                                type="text"
                                placeholder="Auto-filled if available"
                                value={legState.subcontractorDriverPhone}
                                onChange={(e) =>
                                    onChange({ subcontractorDriverPhone: e.target.value })
                                }
                            />
                        </div>

                        {showLegRoute && (
                            <Input
                                label="Leg Route / Segment"
                                icon={<Route size={13} />}
                                type="text"
                                placeholder={
                                    legNumber === 1
                                        ? 'e.g. Origin → Transit Hub'
                                        : 'e.g. Transit Hub → Destination'
                                }
                                value={legState.journeyLeg}
                                onChange={(e) => onChange({ journeyLeg: e.target.value })}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LegAssignmentSection;
