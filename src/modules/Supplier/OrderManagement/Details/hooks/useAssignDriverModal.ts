import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

interface UseAssignDriverModalProps {
    isOpen: boolean;
    currentDriver?: any;
    currentVehiclePlate?: string;
    onSave: (driverData: { name: string; phone: string; email?: string; plate: string }) => Promise<void> | void;
}

export const useAssignDriverModal = ({
    isOpen,
    currentDriver,
    currentVehiclePlate = '',
    onSave,
}: UseAssignDriverModalProps) => {
    const [driverName, setDriverName] = useState('');
    const [driverPhone, setDriverPhone] = useState('');
    const [driverEmail, setDriverEmail] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [teamDrivers, setTeamDrivers] = useState<any[]>([]);
    const [selectedTeamMember, setSelectedTeamMember] = useState<string>('custom');
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setDriverName(currentDriver?.name && currentDriver.name !== 'Assigned Driver' && currentDriver.name !== 'Unassigned' ? currentDriver.name : '');
        setDriverPhone(currentDriver?.phone || '');
        setDriverEmail(currentDriver?.email || '');
        setVehiclePlate(currentVehiclePlate && currentVehiclePlate !== 'Assigning Fleet...' ? currentVehiclePlate : 'DE-TR-8821');
        setIsSubmitting(false);

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
        fetchTeam();
    }, [isOpen, currentDriver, currentVehiclePlate]);

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
            await onSave({ name: finalName, phone: finalPhone, email: finalEmail, plate: finalPlate });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
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
        handleTeamMemberChange,
        handleSubmit,
    };
};

export default useAssignDriverModal;
