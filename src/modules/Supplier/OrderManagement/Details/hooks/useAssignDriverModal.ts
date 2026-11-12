import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

export interface AdditionalLegItem {
    id: string;
    legNumber: number;
    driverType: 'internal' | 'subcontractor';
    subcontractorCompany: string;
    subcontractorId?: string;
    selectedSubDriverId?: string;
    selectedTeamMember?: string;
    driverName: string;
    driverPhone: string;
    driverEmail: string;
    vehiclePlate: string;
    vehicleType: string;
    journeyLeg: string;
    cost: string;
}

export interface AssignDriverData {
    name: string;
    phone: string;
    email?: string;
    plate: string;
    vehicle_type?: string;
    driverType?: 'internal' | 'subcontractor';
    subcontractorCompany?: string;
    subcontractorId?: string | number;
    subcontractorCost?: number;
    journeyLeg?: string;

    // Relay / 2-Driver Relay Fields
    isRelay?: boolean;
    leg2DriverName?: string;
    leg2DriverPhone?: string;
    leg2DriverEmail?: string;
    leg2VehiclePlate?: string;
    leg2VehicleType?: string;
    leg2DriverType?: 'internal' | 'subcontractor';
    leg2SubcontractorCompany?: string;
    leg2SubcontractorId?: string | number;
    leg2JourneyLeg?: string;
    leg2Cost?: number;

    // Dynamic Multi-Legs (3+ Drivers)
    legs?: any[];
}

interface UseAssignDriverModalProps {
    isOpen: boolean;
    currentDriver?: any;
    currentVehiclePlate?: string;
    onSave: (driverData: AssignDriverData) => Promise<void> | void;
    pickupCity?: string;
    deliveryCity?: string;
}

const cleanPlateText = (val?: string, fallback = '212-C-8492') => {
    if (!val || !val.trim()) return fallback;
    const trimmed = val.trim();
    if (/adipisicing|exped|lorem|ipsum|consectetur|officia|laborum|volup|explicabo/i.test(trimmed) || trimmed.length > 14) {
        return fallback;
    }
    return trimmed;
};

const cleanDriverName = (val?: string, fallback = "Liam O'Connor") => {
    if (!val || !val.trim()) return fallback;
    const trimmed = val.trim();
    if (/necessitatibus|consectetur|adipisicing|dolor|explicabo|lorem|ipsum|volup/i.test(trimmed)) {
        return fallback;
    }
    return trimmed;
};

export const useAssignDriverModal = ({
    isOpen,
    currentDriver,
    currentVehiclePlate = '',
    onSave,
    pickupCity = '',
    deliveryCity = '',
}: UseAssignDriverModalProps) => {
    // Mode Switcher: Single Driver vs Multi-Driver Relay
    const [isRelay, setIsRelay] = useState<boolean>(false);

    // --- Leg 1 State ---
    const [driverType, setDriverType] = useState<'internal' | 'subcontractor'>('internal');
    const [subcontractorCompany, setSubcontractorCompany] = useState('');
    const [selectedSubcontractorId, setSelectedSubcontractorId] = useState<string>('custom');
    const [selectedSubDriverId, setSelectedSubDriverId] = useState<string>('custom');
    const [subcontractorDrivers, setSubcontractorDrivers] = useState<any[]>([]);
    const [selectedTeamMember, setSelectedTeamMember] = useState<string>('custom');

    const [driverName, setDriverName] = useState('');
    const [driverPhone, setDriverPhone] = useState('');
    const [driverEmail, setDriverEmail] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('Standard Fleet');
    const [journeyLeg, setJourneyLeg] = useState('');
    const [subcontractorCost, setSubcontractorCost] = useState<string>('750');

    // --- Leg 2 State (Relay) ---
    const [leg2DriverType, setLeg2DriverType] = useState<'internal' | 'subcontractor'>('subcontractor');
    const [leg2SubcontractorCompany, setLeg2SubcontractorCompany] = useState('');
    const [leg2SelectedSubcontractorId, setLeg2SelectedSubcontractorId] = useState<string>('custom');
    const [leg2SelectedSubDriverId, setLeg2SelectedSubDriverId] = useState<string>('custom');
    const [leg2SubcontractorDrivers, setLeg2SubcontractorDrivers] = useState<any[]>([]);
    const [leg2SelectedTeamMember, setLeg2SelectedTeamMember] = useState<string>('custom');

    const [leg2DriverName, setLeg2DriverName] = useState('');
    const [leg2DriverPhone, setLeg2DriverPhone] = useState('');
    const [leg2DriverEmail, setLeg2DriverEmail] = useState('');
    const [leg2VehiclePlate, setLeg2VehiclePlate] = useState('');
    const [leg2VehicleType, setLeg2VehicleType] = useState('Standard Fleet');
    const [leg2JourneyLeg, setLeg2JourneyLeg] = useState('Transit Hub → Intermediate Depot');
    const [leg2Cost, setLeg2Cost] = useState<string>('350');

    // --- Additional Legs (Leg 3, Leg 4... for 3+ Drivers) ---
    const [additionalLegs, setAdditionalLegs] = useState<AdditionalLegItem[]>([]);

    // Shared Team & Subcontractor directory
    const [teamDrivers, setTeamDrivers] = useState<any[]>([]);
    const [subcontractorsList, setSubcontractorsList] = useState<any[]>([]);
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const isCurrentRelay = Boolean(
            currentDriver?.isRelay ||
            currentDriver?.is_relay ||
            currentDriver?.leg2_driver_name ||
            (Array.isArray(currentDriver?.legs) && currentDriver.legs.length > 1)
        );
        setIsRelay(isCurrentRelay);

        const fromName = pickupCity && pickupCity !== '-' ? pickupCity : 'Pickup';
        const toName = deliveryCity && deliveryCity !== '-' ? deliveryCity : 'Delivery';

        // Populate Leg 1
        setDriverName(currentDriver?.name && currentDriver.name !== 'Assigned Driver' && currentDriver.name !== 'Unassigned' ? currentDriver.name : '');
        setDriverPhone(currentDriver?.phone || '');
        setDriverEmail(currentDriver?.email || '');
        setVehiclePlate(currentVehiclePlate && currentVehiclePlate !== 'Assigning Fleet...' ? currentVehiclePlate : 'DE-TR-8821');
        setVehicleType(currentDriver?.vehicle_type || 'Curtainsider 40ft');
        setJourneyLeg(currentDriver?.journeyLeg || (isCurrentRelay ? `${fromName} → Transit Hub` : `${fromName} → ${toName}`));

        if (currentDriver?.driverType) {
            setDriverType(currentDriver.driverType);
        }
        if (currentDriver?.subcontractorCompany) {
            setSubcontractorCompany(currentDriver.subcontractorCompany);
        }
        if (currentDriver?.subcontractor_cost || currentDriver?.subcontractorCost || currentDriver?.agreed_cost) {
            setSubcontractorCost(String(currentDriver.subcontractor_cost || currentDriver.subcontractorCost || currentDriver.agreed_cost));
        }

        // Populate Leg 2 if already present
        if (currentDriver?.leg2_driver_name || currentDriver?.leg2DriverName) {
            setLeg2DriverName(currentDriver.leg2_driver_name || currentDriver.leg2DriverName || '');
            setLeg2DriverPhone(currentDriver.leg2_driver_phone || currentDriver.leg2DriverPhone || '');
            setLeg2DriverEmail(currentDriver.leg2_driver_email || currentDriver.leg2DriverEmail || '');
            setLeg2VehiclePlate(currentDriver.leg2_vehicle_plate || currentDriver.leg2VehiclePlate || 'GB-24-TRK');
            setLeg2VehicleType(currentDriver.leg2_vehicle_type || currentDriver.leg2VehicleType || 'Standard Fleet');
            setLeg2DriverType(currentDriver.leg2_driver_type || currentDriver.leg2DriverType || 'subcontractor');
            setLeg2SubcontractorCompany(currentDriver.leg2_subcontractor_company || currentDriver.leg2SubcontractorCompany || '');
            setLeg2JourneyLeg(currentDriver.leg2_journey_leg || currentDriver.leg2JourneyLeg || `Transit Hub → ${toName}`);
            setLeg2Cost(String(currentDriver.leg2_cost ?? currentDriver.leg2Cost ?? '350'));
        }

        // Populate Additional Legs (Leg 3, 4...) if saved in legs array
        if (Array.isArray(currentDriver?.legs) && currentDriver.legs.length > 2) {
            const extra = currentDriver.legs.slice(2).map((l: any, idx: number) => ({
                id: `leg_${Date.now()}_${idx}`,
                legNumber: idx + 3,
                driverType: l.driver_type || 'subcontractor',
                subcontractorCompany: l.subcontractor_company || '',
                driverName: l.driver_name || '',
                driverPhone: l.driver_phone || '',
                driverEmail: l.driver_email || '',
                vehiclePlate: l.vehicle_plate || '192-C-4421',
                vehicleType: l.vehicle_type || 'Standard Fleet',
                journeyLeg: l.journey_leg || `Leg ${idx + 3} Route`,
                cost: String(l.cost || l.agreed_cost || '250'),
            }));
            setAdditionalLegs(extra);
        } else {
            setAdditionalLegs([]);
        }

        setIsSubmitting(false);

        async function fetchTeamAndSubcontractors() {
            setIsLoadingTeam(true);
            try {
                const [driversRes, subsRes] = await Promise.allSettled([
                    apiClient.get('/supplier/availability/drivers'),
                    apiClient.get('/supplier/subcontractors'),
                ]);

                if (driversRes.status === 'fulfilled') {
                    const rawDrivers =
                        driversRes.value.data?.data?.drivers ||
                        driversRes.value.data?.drivers ||
                        driversRes.value.data?.data ||
                        [];
                    if (Array.isArray(rawDrivers) && rawDrivers.length > 0) {
                        setTeamDrivers(rawDrivers);
                    } else {
                        // Fallback to active team members
                        const teamRes = await apiClient.get('/supplier/team/members?status=active&per_page=100');
                        const members = teamRes.data?.data || teamRes.data || [];
                        if (Array.isArray(members)) {
                            const activeOnly = members.filter((m: any) => !m.status || String(m.status).toLowerCase() === 'active');
                            setTeamDrivers(activeOnly);
                        }
                    }
                }

                if (subsRes.status === 'fulfilled') {
                    const subs = subsRes.value.data?.data || subsRes.value.data || [];
                    if (Array.isArray(subs)) {
                        setSubcontractorsList(subs);
                    }
                }
            } catch {
                // Ignore fallback
            } finally {
                setIsLoadingTeam(false);
            }
        }

        fetchTeamAndSubcontractors();
    }, [isOpen, currentDriver, currentVehiclePlate]);

    // Update default journey leg when relay toggle switches
    const handleToggleRelay = (newRelayState: boolean) => {
        setIsRelay(newRelayState);
        const fromName = pickupCity && pickupCity !== '-' ? pickupCity : 'Origin';
        const toName = deliveryCity && deliveryCity !== '-' ? deliveryCity : 'Destination';

        if (newRelayState) {
            if (!journeyLeg || journeyLeg === 'Full Journey Route' || journeyLeg === `${fromName} → ${toName}`) {
                setJourneyLeg(`${fromName} → Transit Hub`);
            }
            if (!leg2JourneyLeg || leg2JourneyLeg === 'Transit Hub → Delivery') {
                setLeg2JourneyLeg(`Transit Hub → ${toName}`);
            }
        } else {
            if (journeyLeg.includes('Transit Hub')) {
                setJourneyLeg(`${fromName} → ${toName}`);
            }
            setAdditionalLegs([]);
        }
    };

    // --- Dynamic Legs Handler (3+ Drivers) ---
    const handleAddAdditionalLeg = () => {
        const nextNum = 3 + additionalLegs.length;
        const newLeg: AdditionalLegItem = {
            id: `leg_${Date.now()}_${nextNum}`,
            legNumber: nextNum,
            driverType: 'subcontractor',
            subcontractorCompany: '',
            driverName: '',
            driverPhone: '',
            driverEmail: '',
            vehiclePlate: '192-C-4421',
            vehicleType: 'Curtainsider 40ft',
            journeyLeg: `Hub ${nextNum - 1} → Final Destination`,
            cost: '250',
        };
        setAdditionalLegs((prev) => [...prev, newLeg]);
    };

    const handleRemoveAdditionalLeg = (id: string) => {
        setAdditionalLegs((prev) => prev.filter((l) => l.id !== id));
    };

    const handleUpdateAdditionalLeg = (id: string, updates: Partial<AdditionalLegItem>) => {
        setAdditionalLegs((prev) =>
            prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
        );
    };

    // --- Leg 1 Handlers ---
    const handleSubcontractorChange = (subId: string) => {
        setSelectedSubcontractorId(subId);
        if (subId === 'custom') {
            setSubcontractorCompany('');
            setSubcontractorDrivers([]);
            setSelectedSubDriverId('custom');
        } else {
            const sub = subcontractorsList.find((s) => String(s.id) === String(subId));
            if (sub) {
                setSubcontractorCompany(sub.name);
                const drivers = sub.drivers || [];
                setSubcontractorDrivers(drivers);
                setSelectedSubDriverId('custom');
                if (drivers.length > 0) {
                    const first = drivers[0];
                    setSelectedSubDriverId(String(first.id));
                    setDriverName(cleanDriverName(first.name));
                    setDriverPhone(first.phone || '+353 21 450 7821');
                    setDriverEmail(first.email || '');
                    setVehiclePlate(cleanPlateText(first.vehicle_plate));
                }
            }
        }
    };

    const handleSubcontractorDriverChange = (driverId: string) => {
        setSelectedSubDriverId(driverId);
        if (driverId === 'custom') {
            setDriverName('');
            setDriverPhone('');
            setDriverEmail('');
        } else {
            const driver = subcontractorDrivers.find((d) => String(d.id) === String(driverId));
            if (driver) {
                setDriverName(cleanDriverName(driver.name));
                setDriverPhone(driver.phone || '+353 21 450 7821');
                setDriverEmail(driver.email || '');
                setVehiclePlate(cleanPlateText(driver.vehicle_plate));
            }
        }
    };

    const handleTeamMemberChange = (memberId: string) => {
        setSelectedTeamMember(memberId);
        if (memberId === 'custom') {
            setDriverName('');
            setDriverPhone('');
            setDriverEmail('');
        } else {
            const member = teamDrivers.find((m) => String(m.id) === String(memberId) || String(m.user_id) === String(memberId));
            if (member) {
                setDriverName(member.name || member.user?.name || '');
                setDriverPhone(member.phone || member.user?.phone || '');
                setDriverEmail(member.email || member.user?.email || '');
                const plate = member.vehicle?.registration_no || member.vehicle?.plate || member.vehicle_plate;
                if (plate) setVehiclePlate(plate);
            }
        }
    };

    // --- Leg 2 Handlers ---
    const handleLeg2SubcontractorChange = (subId: string) => {
        setLeg2SelectedSubcontractorId(subId);
        if (subId === 'custom') {
            setLeg2SubcontractorCompany('');
            setLeg2SubcontractorDrivers([]);
            setLeg2SelectedSubDriverId('custom');
        } else {
            const sub = subcontractorsList.find((s) => String(s.id) === String(subId));
            if (sub) {
                setLeg2SubcontractorCompany(sub.name);
                const drivers = sub.drivers || [];
                setLeg2SubcontractorDrivers(drivers);
                setLeg2SelectedSubDriverId('custom');
                if (drivers.length > 0) {
                    const first = drivers[0];
                    setLeg2SelectedSubDriverId(String(first.id));
                    setLeg2DriverName(first.name || '');
                    setLeg2DriverPhone(first.phone || '');
                    setLeg2DriverEmail(first.email || '');
                    if (first.vehicle_plate) setLeg2VehiclePlate(first.vehicle_plate);
                }
            }
        }
    };

    const handleLeg2SubcontractorDriverChange = (driverId: string) => {
        setLeg2SelectedSubDriverId(driverId);
        if (driverId === 'custom') {
            setLeg2DriverName('');
            setLeg2DriverPhone('');
            setLeg2DriverEmail('');
        } else {
            const driver = leg2SubcontractorDrivers.find((d) => String(d.id) === String(driverId));
            if (driver) {
                setLeg2DriverName(driver.name || '');
                setLeg2DriverPhone(driver.phone || '');
                setLeg2DriverEmail(driver.email || '');
                if (driver.vehicle_plate) setLeg2VehiclePlate(driver.vehicle_plate);
            }
        }
    };

    const handleLeg2TeamMemberChange = (memberId: string) => {
        setLeg2SelectedTeamMember(memberId);
        if (memberId === 'custom') {
            setLeg2DriverName('');
            setLeg2DriverPhone('');
            setLeg2DriverEmail('');
        } else {
            const member = teamDrivers.find((m) => String(m.id) === String(memberId) || String(m.user_id) === String(memberId));
            if (member) {
                setLeg2DriverName(member.name || member.user?.name || '');
                setLeg2DriverPhone(member.phone || member.user?.phone || '');
                setLeg2DriverEmail(member.email || member.user?.email || '');
                const plate = member.vehicle?.registration_no || member.vehicle?.plate || member.vehicle_plate;
                if (plate) setLeg2VehiclePlate(plate);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalName = driverName.trim() || '-';
        const finalPhone = driverPhone.trim();
        const finalEmail = driverEmail.trim();
        const finalPlate = vehiclePlate.trim() || 'DE-TR-8821';

        // Prepare full legs array (supporting 2, 3, 4, 5... unlimited drivers)
        const allLegs: any[] = [];
        const fromName = pickupCity && pickupCity !== '-' ? pickupCity : 'Origin';
        const toName = deliveryCity && deliveryCity !== '-' ? deliveryCity : 'Destination';
        let effectiveLeg1Route = journeyLeg.trim() || (isRelay ? `${fromName} → Intermediate Hub` : 'Full Route');
        let effectiveLeg2Route = leg2JourneyLeg.trim() || (isRelay ? `Intermediate Hub → ${toName}` : '');

        if (isRelay) {
            let customHub: string | null = null;
            if (effectiveLeg2Route && !effectiveLeg2Route.toLowerCase().includes('transit hub')) {
                const p2 = effectiveLeg2Route.split(/➔|→|->/);
                if (p2.length > 1 && p2[0].trim()) customHub = p2[0].trim();
            }
            if (!customHub && effectiveLeg1Route && !effectiveLeg1Route.toLowerCase().includes('transit hub')) {
                const p1 = effectiveLeg1Route.split(/➔|→|->/);
                if (p1.length > 1 && p1[1].trim()) customHub = p1[1].trim();
            }

            if (customHub) {
                effectiveLeg1Route = effectiveLeg1Route.replace(/Transit Hub|transit hub/g, customHub);
                effectiveLeg2Route = effectiveLeg2Route.replace(/Transit Hub|transit hub/g, customHub);
            }

            allLegs.push({
                leg_number: 1,
                title: 'Leg 1 (Pickup / Collection)',
                driver_type: driverType,
                subcontractor_company: driverType === 'subcontractor' ? subcontractorCompany : undefined,
                subcontractor_id: driverType === 'subcontractor' && selectedSubcontractorId !== 'custom' ? selectedSubcontractorId : undefined,
                journey_leg: effectiveLeg1Route,
                driver_name: finalName,
                driver_phone: finalPhone,
                driver_email: finalEmail,
                vehicle_plate: finalPlate,
                vehicle_type: vehicleType,
                cost: driverType === 'subcontractor' && subcontractorCost ? parseFloat(subcontractorCost) : undefined,
            });

            allLegs.push({
                leg_number: 2,
                title: 'Leg 2 (Intermediate Handover)',
                driver_type: leg2DriverType,
                subcontractor_company: leg2DriverType === 'subcontractor' ? leg2SubcontractorCompany : undefined,
                subcontractor_id: leg2DriverType === 'subcontractor' && leg2SelectedSubcontractorId !== 'custom' ? leg2SelectedSubcontractorId : undefined,
                journey_leg: effectiveLeg2Route,
                driver_name: leg2DriverName.trim() || '-',
                driver_phone: leg2DriverPhone.trim(),
                driver_email: leg2DriverEmail.trim(),
                vehicle_plate: leg2VehiclePlate.trim() || 'GB-24-TRK',
                vehicle_type: leg2VehicleType,
                cost: leg2Cost ? parseFloat(leg2Cost) : undefined,
            });

            additionalLegs.forEach((extra, idx) => {
                allLegs.push({
                    leg_number: idx + 3,
                    title: `Leg ${idx + 3} (Segment / Delivery)`,
                    driver_type: extra.driverType,
                    subcontractor_company: extra.driverType === 'subcontractor' ? extra.subcontractorCompany : undefined,
                    subcontractor_id: extra.driverType === 'subcontractor' && extra.subcontractorId ? extra.subcontractorId : undefined,
                    journey_leg: extra.journeyLeg.trim() || `Leg ${idx + 3} Route`,
                    driver_name: extra.driverName.trim() || '-',
                    driver_phone: extra.driverPhone.trim(),
                    driver_email: extra.driverEmail.trim(),
                    vehicle_plate: extra.vehiclePlate.trim() || '192-C-4421',
                    vehicle_type: extra.vehicleType,
                    cost: extra.cost ? parseFloat(extra.cost) : undefined,
                });
            });
        }

        setIsSubmitting(true);
        try {
            await onSave({
                name: finalName,
                phone: finalPhone,
                email: finalEmail,
                plate: finalPlate,
                vehicle_type: vehicleType,
                driverType,
                subcontractorCompany: driverType === 'subcontractor' ? subcontractorCompany.trim() : undefined,
                subcontractorId: driverType === 'subcontractor' && selectedSubcontractorId !== 'custom' ? selectedSubcontractorId : undefined,
                subcontractorCost: driverType === 'subcontractor' && subcontractorCost ? Math.max(0, parseFloat(subcontractorCost)) : 0,
                journeyLeg: effectiveLeg1Route,

                // 2-Driver Relay Fields
                isRelay,
                leg2DriverName: isRelay ? (leg2DriverName.trim() || '-') : undefined,
                leg2DriverPhone: isRelay ? leg2DriverPhone.trim() : undefined,
                leg2DriverEmail: isRelay ? leg2DriverEmail.trim() : undefined,
                leg2VehiclePlate: isRelay ? (leg2VehiclePlate.trim() || 'GB-24-TRK') : undefined,
                leg2VehicleType: isRelay ? leg2VehicleType : undefined,
                leg2DriverType: isRelay ? leg2DriverType : undefined,
                leg2SubcontractorCompany: isRelay && leg2DriverType === 'subcontractor' ? leg2SubcontractorCompany.trim() : undefined,
                leg2SubcontractorId: isRelay && leg2DriverType === 'subcontractor' && leg2SelectedSubcontractorId !== 'custom' ? leg2SelectedSubcontractorId : undefined,
                leg2JourneyLeg: isRelay ? effectiveLeg2Route : undefined,
                leg2Cost: isRelay && leg2DriverType === 'subcontractor' && leg2Cost ? Math.max(0, parseFloat(leg2Cost)) : 0,

                // Multi-Legs (3+ Drivers)
                legs: isRelay ? allLegs : undefined,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isRelay,
        handleToggleRelay,

        // Leg 1
        driverType,
        setDriverType,
        subcontractorCompany,
        setSubcontractorCompany,
        subcontractorCost,
        setSubcontractorCost,
        journeyLeg,
        setJourneyLeg,
        driverName,
        setDriverName,
        driverPhone,
        setDriverPhone,
        driverEmail,
        setDriverEmail,
        vehiclePlate,
        setVehiclePlate,
        vehicleType,
        setVehicleType,
        teamDrivers,
        selectedTeamMember,
        subcontractorsList,
        selectedSubcontractorId,
        subcontractorDrivers,
        selectedSubDriverId,
        handleSubcontractorChange,
        handleSubcontractorDriverChange,
        handleTeamMemberChange,

        // Leg 2
        leg2DriverType,
        setLeg2DriverType,
        leg2SubcontractorCompany,
        setLeg2SubcontractorCompany,
        leg2JourneyLeg,
        setLeg2JourneyLeg,
        leg2DriverName,
        setLeg2DriverName,
        leg2DriverPhone,
        setLeg2DriverPhone,
        leg2DriverEmail,
        setLeg2DriverEmail,
        leg2VehiclePlate,
        setLeg2VehiclePlate,
        leg2VehicleType,
        setLeg2VehicleType,
        leg2Cost,
        setLeg2Cost,
        leg2SelectedSubcontractorId,
        leg2SelectedSubDriverId,
        leg2SubcontractorDrivers,
        leg2SelectedTeamMember,
        handleLeg2SubcontractorChange,
        handleLeg2SubcontractorDriverChange,
        handleLeg2TeamMemberChange,

        // Additional Legs (Leg 3, 4... for 3+ drivers)
        additionalLegs,
        handleAddAdditionalLeg,
        handleRemoveAdditionalLeg,
        handleUpdateAdditionalLeg,

        isLoadingTeam,
        isSubmitting,
        handleSubmit,
    };
};

export default useAssignDriverModal;
