import {
    DispatchFinancialSummary,
    FleetDriverItem,
    FleetVehicleItem,
    LegAssignmentState,
    LegType,
} from '../types';

export const createDefaultLegState = (
    legNumber: 1 | 2,
    legType: LegType,
    journeyLeg = ''
): LegAssignmentState => ({
    legNumber,
    legType,
    executionMode: 'in_house',
    driverId: '',
    vehicleId: '',
    subcontractorId: '',
    subcontractorCompany: '',
    subcontractorDriverId: 'custom',
    subcontractorDriverName: '',
    subcontractorDriverPhone: '',
    subcontractorDriverEmail: '',
    subcontractorVehiclePlate: '',
    subcontractorVehicleType: 'Curtainsider 40ft',
    subcontractorCost: '',
    journeyLeg:
        journeyLeg ||
        (legNumber === 1
            ? 'Leg 1: Pickup to Transit Hub'
            : 'Leg 2: Transit Hub to Delivery'),
    status: 'pending',
});

export const isDriverUnavailable = (driver?: FleetDriverItem | null): boolean => {
    if (!driver) return false;
    if (typeof driver.is_eligible === 'boolean') {
        return !driver.is_eligible;
    }
    const status = String(driver.availabilityStatus || driver.status || '').toLowerCase();
    const accountStatus = String(driver.account_status || driver.userStatus || '').toLowerCase();
    const dutyStatus = String(driver.duty_status || '').toLowerCase();
    const jobStatus = String(driver.job_status || '').toLowerCase();

    return (
        jobStatus === 'on_job' ||
        dutyStatus === 'offline' ||
        dutyStatus === 'break' ||
        status === 'unavailable' ||
        status === 'on job' ||
        status === 'offline' ||
        status === 'on break' ||
        accountStatus === 'blocked' ||
        accountStatus === 'disabled' ||
        accountStatus === 'suspended'
    );
};

export const isVehicleUnavailable = (vehicle?: FleetVehicleItem | null): boolean => {
    if (!vehicle) return false;
    const status = String(vehicle.status || '').toLowerCase();
    return status === 'maintenance' || status === 'inactive' || status === 'unavailable';
};

export const getEffectiveLegSubcontractorCost = (leg: LegAssignmentState): number => {
    if (leg.executionMode !== 'subcontractor') return 0;
    const parsed = parseFloat(leg.subcontractorCost);
    if (Number.isNaN(parsed) || parsed < 0) return 0;
    return Math.round(parsed * 100) / 100;
};

export const calculateDispatchFinancials = (
    customerPrice: number,
    isRelay: boolean,
    pickupLeg: LegAssignmentState,
    deliveryLeg: LegAssignmentState
): DispatchFinancialSummary => {
    const safeCustomerPrice = Math.max(0, Number(customerPrice) || 0);
    const pickupSubcontractorCost = getEffectiveLegSubcontractorCost(pickupLeg);
    const deliverySubcontractorCost = isRelay
        ? getEffectiveLegSubcontractorCost(deliveryLeg)
        : 0;
    const totalSubcontractorCost =
        Math.round((pickupSubcontractorCost + deliverySubcontractorCost) * 100) / 100;
    const netProfit =
        Math.round((safeCustomerPrice - totalSubcontractorCost) * 100) / 100;
    const profitMarginPercent =
        safeCustomerPrice > 0
            ? Math.round((netProfit / safeCustomerPrice) * 1000) / 10
            : 0;

    return {
        customerPrice: safeCustomerPrice,
        pickupSubcontractorCost,
        deliverySubcontractorCost,
        totalSubcontractorCost,
        netProfit,
        profitMarginPercent,
        isProfitable: netProfit >= 0,
    };
};

export const validateLegAssignment = (
    leg: LegAssignmentState,
    legLabel: string,
    fleetDrivers: FleetDriverItem[],
    fleetVehicles: FleetVehicleItem[]
): string | null => {
    if (leg.executionMode === 'in_house') {
        if (!leg.driverId) {
            return `${legLabel}: Please select a company driver.`;
        }
        const driver = fleetDrivers.find((d) => String(d.rawId) === String(leg.driverId) || String(d.id) === String(leg.driverId));
        if (!driver) {
            return `${legLabel}: Selected company driver was not found.`;
        }
        if (isDriverUnavailable(driver)) {
            const reason = driver.disqualification_reason || `Driver ${driver.name} is currently unavailable for dispatch.`;
            return `${legLabel}: ${reason}`;
        }
        if (leg.vehicleId) {
            const vehicle = fleetVehicles.find((v) => String(v.id) === String(leg.vehicleId));
            if (vehicle && isVehicleUnavailable(vehicle)) {
                return `${legLabel}: Vehicle ${vehicle.registration_no} is ${vehicle.status} and unavailable.`;
            }
        }
        return null;
    }

    // Subcontractor mode
    const hasSubCompany = Boolean(
        (leg.subcontractorId && leg.subcontractorId !== 'custom') ||
        leg.subcontractorCompany.trim()
    );
    if (!hasSubCompany) {
        return `${legLabel}: Please select or enter a subcontractor carrier company.`;
    }
    if (!leg.subcontractorDriverName.trim()) {
        return `${legLabel}: Please select a subcontractor driver.`;
    }
    if (leg.subcontractorCost.trim() === '' || Number.isNaN(Number(leg.subcontractorCost)) || Number(leg.subcontractorCost) < 0) {
        return `${legLabel}: Agreed subcontractor cost must be 0 or greater.`;
    }
    return null;
};

export const buildLegApiPayload = (leg: LegAssignmentState) => {
    if (leg.executionMode === 'in_house') {
        return {
            execution_mode: 'in_house',
            driver_id: Number(leg.driverId) || leg.driverId,
            vehicle_id: String(leg.vehicleId),
            subcontractor_cost: 0,
            journey_leg: leg.journeyLeg.trim(),
        };
    }

    const isNumericSubId = leg.subcontractorId && leg.subcontractorId !== 'custom' && !Number.isNaN(Number(leg.subcontractorId));
    return {
        execution_mode: 'subcontractor',
        subcontractor_id: isNumericSubId ? Number(leg.subcontractorId) : undefined,
        subcontractor_company: leg.subcontractorCompany.trim() || undefined,
        subcontractor_driver_name: leg.subcontractorDriverName.trim(),
        subcontractor_driver_phone: leg.subcontractorDriverPhone.trim() || undefined,
        subcontractor_driver_email: leg.subcontractorDriverEmail.trim() || undefined,
        subcontractor_vehicle_plate: leg.subcontractorVehiclePlate.trim() || undefined,
        subcontractor_vehicle_type: leg.subcontractorVehicleType.trim() || 'Subcontractor Vehicle',
        subcontractor_cost: getEffectiveLegSubcontractorCost(leg),
        journey_leg: leg.journeyLeg.trim(),
    };
};

