import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

export interface AssignDriverData {
    name: string;
    phone: string;
    email?: string;
    plate: string;
    driverType?: 'internal' | 'subcontractor';
    subcontractorCompany?: string;
    journeyLeg?: string;
}

interface UseAssignDriverModalProps {
    isOpen: boolean;
    currentDriver?: any;
    currentVehiclePlate?: string;
    onSave: (driverData: AssignDriverData) => Promise<void> | void;
}

export const useAssignDriverModal = ({
    isOpen,
    currentDriver,
    currentVehiclePlate = '',
    onSave,
}: UseAssignDriverModalProps) => {
    const [driverType, setDriverType] = useState<'internal' | 'subcontractor'>('internal');
    const [subcontractorCompany, setSubcontractorCompany] = useState('ABC Logistics');
    const [journeyLeg, setJourneyLeg] = useState('Dublin Port → Final Destination');
    const [driverName, setDriverName] = useState('');
    const [driverPhone, setDriverPhone] = useState('');
    const [driverEmail, setDriverEmail] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [teamDrivers, setTeamDrivers] = useState<any[]>([]);
    const [selectedTeamMember, setSelectedTeamMember] = useState<string>('custom');
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Subcontractors and their nested drivers
    const [subcontractorsList, setSubcontractorsList] = useState<any[]>([]);
    const [selectedSubcontractorId, setSelectedSubcontractorId] = useState<string>('custom');
    const [subcontractorDrivers, setSubcontractorDrivers] = useState<any[]>([]);
    const [selectedSubDriverId, setSelectedSubDriverId] = useState<string>('custom');

    useEffect(() => {
        if (!isOpen) return;
        setDriverName(currentDriver?.name && currentDriver.name !== 'Assigned Driver' && currentDriver.name !== 'Unassigned' ? currentDriver.name : '');
        setDriverPhone(currentDriver?.phone || '');
        setDriverEmail(currentDriver?.email || '');
        setVehiclePlate(currentVehiclePlate && currentVehiclePlate !== 'Assigning Fleet...' ? currentVehiclePlate : 'DE-TR-8821');
        setIsSubmitting(false);

        if (currentDriver?.driverType) {
            setDriverType(currentDriver.driverType);
        }
        if (currentDriver?.subcontractorCompany) {
            setSubcontractorCompany(currentDriver.subcontractorCompany);
        }

        async function fetchTeam() {
            setIsLoadingTeam(true);
            try {
                const res = await apiClient.get('/supplier/team/members?status=active&per_page=100');
                const members = res.data?.data || res.data || [];
                if (Array.isArray(members) && members.length > 0) {
                    const activeOnly = members.filter((m: any) => !m.status || String(m.status).toLowerCase() === 'active');
                    setTeamDrivers(activeOnly);
                }
            } catch {
                // Fallback
            } finally {
                setIsLoadingTeam(false);
            }
        }

        async function fetchSubcontractors() {
            try {
                const res = await apiClient.get('/supplier/subcontractors');
                const subs = res.data?.data || res.data || [];
                if (Array.isArray(subs)) {
                    setSubcontractorsList(subs);
                }
            } catch {
                // Fallback
            }
        }

        fetchTeam();
        fetchSubcontractors();
    }, [isOpen, currentDriver, currentVehiclePlate]);

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
                setDriverName(driver.name || '');
                setDriverPhone(driver.phone || '');
                setDriverEmail(driver.email || '');
                if (driver.vehicle_plate) {
                    setVehiclePlate(driver.vehicle_plate);
                }
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
            const member = teamDrivers.find((m) => String(m.id) === String(memberId));
            if (member) {
                setDriverName(member.name || member.user?.name || '');
                setDriverPhone(member.phone || member.user?.phone || '');
                setDriverEmail(member.email || member.user?.email || '');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalName = driverName.trim() || '-';
        const finalPhone = driverPhone.trim();
        const finalEmail = driverEmail.trim();
        const finalPlate = vehiclePlate.trim() || 'DE-TR-8821';

        setIsSubmitting(true);
        try {
            await onSave({
                name: finalName,
                phone: finalPhone,
                email: finalEmail,
                plate: finalPlate,
                driverType,
                subcontractorCompany: driverType === 'subcontractor' ? subcontractorCompany.trim() : undefined,
                journeyLeg: driverType === 'subcontractor' ? journeyLeg.trim() : undefined,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        driverType,
        setDriverType,
        subcontractorCompany,
        setSubcontractorCompany,
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
        teamDrivers,
        selectedTeamMember,
        isLoadingTeam,
        isSubmitting,
        subcontractorsList,
        selectedSubcontractorId,
        subcontractorDrivers,
        selectedSubDriverId,
        handleSubcontractorChange,
        handleSubcontractorDriverChange,
        handleTeamMemberChange,
        handleSubmit,
    };
};

export default useAssignDriverModal;
