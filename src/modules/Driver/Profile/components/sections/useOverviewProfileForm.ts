import { useState, useEffect } from 'react';
import { DriverProfile } from '../../../types';
import { driverApi } from '../../../services/driverApi';

interface UseOverviewProfileFormProps {
    profile: DriverProfile;
    onUpdateProfile?: (updates: Partial<DriverProfile>) => Promise<any> | void;
}

export function useOverviewProfileForm({ profile, onUpdateProfile }: UseOverviewProfileFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form inputs state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [homeTerminal, setHomeTerminal] = useState('');
    const [address, setAddress] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [relationship, setRelationship] = useState('');
    const [slogan, setSlogan] = useState('');

    // Fleet state
    const [tractorModel, setTractorModel] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [trailerNumber, setTrailerNumber] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [vinNumber, setVinNumber] = useState('');

    const syncWithProfile = () => {
        setName(profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setHomeTerminal(profile.homeTerminal || '');
        setAddress(profile.address || '');
        setEmergencyContact(profile.emergencyContact?.name || '');
        setEmergencyPhone(profile.emergencyContact?.phone || '');
        setRelationship(profile.emergencyContact?.relationship || '');
        setSlogan(profile.slogan || '');

        const fleet = profile.fleetEquipment || ({} as any);
        setTractorModel(fleet.tractorModel || '');
        setUnitNumber(fleet.unitNumber || '');
        setTrailerNumber(fleet.trailerNumber || '');
        setLicensePlate(fleet.licensePlate || '');
        setVinNumber(fleet.vin || fleet.vinNumber || '');
    };

    useEffect(() => {
        syncWithProfile();
    }, [profile]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await driverApi.updatePersonalInfo({
                name,
                phone,
                address,
                bio: slogan,
            });
            await driverApi.updateEmergency({
                emergency_contact_name: emergencyContact,
                emergency_contact_phone: emergencyPhone,
                emergency_contact_relation: relationship,
                terminal_location: homeTerminal,
            });
            await driverApi.updateEquipment({
                tractor_model: tractorModel,
                truck_number: unitNumber,
                trailer_number: trailerNumber,
                license_plate: licensePlate,
                vin_number: vinNumber,
            });

            if (onUpdateProfile) {
                await onUpdateProfile({
                    name,
                    phone,
                    homeTerminal,
                    address,
                    slogan,
                    emergencyContact: {
                        name: emergencyContact,
                        phone: emergencyPhone,
                        relationship,
                    },
                    fleetEquipment: {
                        ...profile.fleetEquipment,
                        tractorModel,
                        unitNumber,
                        trailerNumber,
                        licensePlate,
                        vin: vinNumber,
                    } as any,
                });
            }
            setIsEditMode(false);
        } catch (err) {
            console.error('Failed to save driver profile:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        syncWithProfile();
        setIsEditMode(false);
    };

    return {
        isSaving,
        isEditMode,
        setIsEditMode,
        name,
        setName,
        email,
        phone,
        setPhone,
        homeTerminal,
        setHomeTerminal,
        address,
        setAddress,
        emergencyContact,
        setEmergencyContact,
        emergencyPhone,
        setEmergencyPhone,
        relationship,
        setRelationship,
        slogan,
        setSlogan,
        tractorModel,
        setTractorModel,
        unitNumber,
        setUnitNumber,
        trailerNumber,
        setTrailerNumber,
        licensePlate,
        vinNumber,
        setVinNumber,
        handleSaveProfile,
        handleCancel,
    };
}
