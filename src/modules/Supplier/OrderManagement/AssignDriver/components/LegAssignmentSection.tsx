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
import Switch from '@/components/ui/switch';
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

    const driverOptions: SelectOption[] = useMemo(() => {
        return fleetDrivers.map((d) => {
            const isBlocked = d.account_status === 'blocked' || d.userStatus === 'blocked';
            const isDisabled = d.account_status === 'disabled' || d.userStatus === 'disabled';
            const isOnJob = d.job_status === 'on_job' || Boolean(d.active_assignment?.order_id);
            const isOnBreak = d.duty_status === 'break';
            const isOffline = d.duty_status === 'offline';
            const isEligible = typeof d.is_eligible === 'boolean'
                ? d.is_eligible
                : (!isBlocked && !isDisabled && !isOnJob && !isOnBreak && !isOffline);

            let badge = 'Available';
            let badgeColor: 'success' | 'info' | 'warning' | 'danger' | 'neutral' = 'success';

            if (isBlocked) {
                badge = 'Blocked';
                badgeColor = 'danger';
            } else if (isDisabled) {
                badge = 'Disabled';
                badgeColor = 'danger';
            } else if (isOnJob) {
                const orderRef = d.active_assignment?.order_number || (d.active_assignment?.order_id ? `#ORD-${d.active_assignment.order_id}` : null);
                badge = orderRef ? `On Job • ${orderRef}` : 'On Job';
                badgeColor = 'info';
            } else if (isOnBreak) {
                badge = 'On Break';
                badgeColor = 'warning';
            } else if (isOffline) {
                badge = 'Offline';
                badgeColor = 'neutral';
            } else if (isEligible) {
                badge = 'Available';
                badgeColor = 'success';
            } else {
                badge = d.status || 'Unavailable';
                badgeColor = 'neutral';
            }

            let subtitle = '';
            if (isEligible) {
                subtitle = [
                    d.phone && d.phone !== '—' ? d.phone : null,
                    d.vehiclePlate ? `Truck: ${d.vehiclePlate}` : null,
                ].filter(Boolean).join(' • ') || 'Ready for dispatch';
            } else {
                subtitle = d.disqualification_reason || (
                    isBlocked ? 'Account blocked' :
                    isDisabled ? 'Account disabled' :
                    isOnJob ? `Assigned to ${d.active_assignment?.order_number || 'another order'}` :
                    isOnBreak ? 'Driver is on break' :
                    isOffline ? 'Driver is offline' :
                    'Not eligible for assignment'
                );
            }

            return {
                id: String(d.rawId),
                name: d.name,
                subtitle,
                badge,
                badgeColor,
                disabled: !isEligible,
            };
        });
    }, [fleetDrivers]);

    const vehicleOptions: SelectOption[] = useMemo(
        () => [
            { id: '', name: 'No Vehicle / Assign Later' },
            ...fleetVehicles.map((v) => {
                const statusLabel = v.current_order_number
                    ? `On Job ${v.current_order_number}`
                    : v.status;
                const unavailable = isVehicleUnavailable(v);
                const badgeColor: 'neutral' | 'fleet' = unavailable ? 'neutral' : 'fleet';
                return {
                    id: String(v.id),
                    name: `${v.registration_no} — ${v.name}`,
                    selectedLabel: `${v.registration_no} (${v.name})`,
                    subtitle: `${v.type} • ${statusLabel}`,
                    badge: statusLabel,
                    badgeColor,
                    disabled: unavailable,
                };
            }),
        ],
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
        let nextVehicleId = '';

        if (found) {
            // Only auto-select vehicle if this driver actually has an assigned vehicle in the fleet
            const matchedVehicle = fleetVehicles.find(
                (v) =>
                    !isVehicleUnavailable(v) &&
                    ((v.driver_id && String(v.driver_id) === String(found.rawId)) ||
                        (found.vehiclePlate &&
                            v.registration_no?.replace(/[\s-]/g, '').toUpperCase() ===
                                found.vehiclePlate.replace(/[\s-]/g, '').toUpperCase()))
            );

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
            {/* Clean header with toggle switch */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate">
                        {title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {subtitle}
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 self-start sm:self-center shrink-0">
                    <button
                        type="button"
                        onClick={() => handleModeChange('in_house')}
                        className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                            legState.executionMode === 'in_house'
                                ? 'text-[#ff4a1f]'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <Truck size={12} />
                        <span>In-House Driver</span>
                    </button>

                    <Switch
                        checked={legState.executionMode === 'subcontractor'}
                        onCheckedChange={(checked) =>
                            handleModeChange(checked ? 'subcontractor' : 'in_house')
                        }
                    />

                    <button
                        type="button"
                        onClick={() => handleModeChange('subcontractor')}
                        className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                            legState.executionMode === 'subcontractor'
                                ? 'text-[#ff4a1f]'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
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
                                    {selectedDriver ? (
                                        <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                                                <Phone size={11} className="text-slate-400" />
                                                {selectedDriver.phone && selectedDriver.phone !== '—'
                                                    ? selectedDriver.phone
                                                    : 'No phone on profile'}
                                            </span>
                                            <span>•</span>
                                            <span
                                                className={`font-medium ${
                                                    selectedDriver.duty_status === 'online'
                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                        : selectedDriver.duty_status === 'break'
                                                        ? 'text-amber-600 dark:text-amber-400'
                                                        : 'text-slate-500'
                                                }`}
                                            >
                                                {selectedDriver.duty_status === 'online'
                                                    ? '● Online'
                                                    : selectedDriver.duty_status === 'break'
                                                    ? '● On Break'
                                                    : selectedDriver.status || 'Active'}
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 px-1">
                                            Select an available fleet driver
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1 w-full">
                                    <FieldLabel label="Company Vehicle (Optional)" />
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
                                        placeholder="Select vehicle (Optional)"
                                        options={vehicleOptions}
                                    />
                                    {selectedVehicle ? (
                                        <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-500 dark:text-slate-400">
                                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                                {selectedVehicle.registration_no}
                                            </span>
                                            <span>•</span>
                                            <span>{selectedVehicle.type}</span>
                                            <span>•</span>
                                            <span
                                                className={`font-semibold ${
                                                    selectedVehicle.status === 'Active'
                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                        : 'text-amber-600 dark:text-amber-400'
                                                }`}
                                            >
                                                {selectedVehicle.status}
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 px-1">
                                            {selectedDriver
                                                ? 'No vehicle assigned to driver • Select from fleet if needed'
                                                : 'Auto-allocates if driver has assigned truck'}
                                        </p>
                                    )}
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
