import { useState, useEffect } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { apiClient } from '@/lib/axios';

export const STANDARD_DEPARTMENTS = [
    { id: 'Operations & Dispatch', name: 'Operations & Dispatch' },
    { id: 'Fleet & Drivers', name: 'Fleet & Drivers' },
    { id: 'Customer Support & Sales', name: 'Customer Support & Sales' },
    { id: 'Finance & Accounts', name: 'Finance & Accounts' },
    { id: 'Security & Compliance', name: 'Security & Compliance' },
];

export const STANDARD_DESIGNATIONS = [
    { id: 'Manager', name: 'Manager' },
    { id: 'Driver / Dispatcher', name: 'Driver / Dispatcher' },
    { id: 'Fleet Supervisor', name: 'Fleet Supervisor' },
    { id: 'Operations Executive', name: 'Operations Executive' },
    { id: 'Coordinator', name: 'Coordinator' },
    { id: 'Support Executive', name: 'Support Executive' },
    { id: 'Sales Executive', name: 'Sales Executive' },
    { id: 'Accountant', name: 'Accountant' },
    { id: 'Staff Assistant', name: 'Staff Assistant' },
];

export interface CreateTeamMemberForm {
    email: string;
    department: string;
    accessRole: string;
    jobTitle: string;
    accessMethod: 'email_invitation' | 'temporary_password';
    password?: string;
    name?: string;
}

export function useCreateTeamMember(onClose: () => void, onSuccess?: () => void) {
    const [formData, setFormData] = useState<CreateTeamMemberForm>({
        email: '',
        department: 'Operations',
        accessRole: 'Driver',
        jobTitle: 'Driver',
        accessMethod: 'email_invitation',
        password: '',
        name: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roles, setRoles] = useState<{ id: string | number; name: string; slug: string }[]>([]);

    useEffect(() => {
        let isMounted = true;
        async function fetchRoles() {
            try {
                const res = await apiClient.get('/supplier/team/roles');
                const rawRoles = res.data?.data?.roles || res.data?.data || res.data || [];
                if (Array.isArray(rawRoles) && rawRoles.length > 0 && isMounted) {
                    setRoles(rawRoles);
                }
            } catch (err) {
                console.error('Failed to fetch roles:', err);
            }
        }
        fetchRoles();
        return () => { isMounted = false; };
    }, []);

    const handleChange = (field: keyof CreateTeamMemberForm, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const isValid = Boolean(
        formData.email.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
        formData.accessRole &&
        (formData.accessMethod === 'email_invitation' || (formData.password && formData.password.trim().length >= 6))
    );

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const payload = {
                email: formData.email.trim(),
                department: formData.department,
                access_role: formData.accessRole,
                role: formData.accessRole,
                job_title: formData.jobTitle,
                access_method: formData.accessMethod,
                password: formData.accessMethod === 'temporary_password' ? formData.password : undefined,
                name: formData.name || undefined,
            };

            await apiClient.post('/supplier/team/members', payload);
            useToastStore.getState().showToast('Team member invitation sent successfully!', 'success');
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error('Failed to add team member:', err);
            const msg = err.response?.data?.message || 'Failed to send invitation. Please try again.';
            useToastStore.getState().showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        roles,
        isValid,
        handleChange,
        handleSubmit,
    };
}
