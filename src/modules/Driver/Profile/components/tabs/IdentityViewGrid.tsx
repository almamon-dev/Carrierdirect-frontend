import React from 'react';
import { DriverProfile } from '../../../types';
import { ProfileFormData } from './profileStateMappers';
import { ProfileKeyValueRow } from './ProfileKeyValueRow';

interface Props {
    profile: DriverProfile;
    formData: ProfileFormData;
}

export const IdentityViewGrid: React.FC<Props> = ({ profile, formData }) => {
    const carrier = profile.employerCarrier;

    return (
        <div className="space-y-3">
            {/* 1. Identity Key : Value Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                <ProfileKeyValueRow label="Legal Full Name" value={formData.name || profile.name} />
                <ProfileKeyValueRow label="Account Email" value={formData.email || profile.email} />
                <ProfileKeyValueRow label="Direct Mobile Phone" value={formData.phone || profile.phone} />
                <ProfileKeyValueRow label="Designation / Role" value={formData.title || profile.title} />
            </div>

            {/* 2. Domicile Address Key : Value Grid */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                    <ProfileKeyValueRow label="Street Address" value={formData.address || profile.address} />
                    <ProfileKeyValueRow label="City / Municipality" value={formData.city || profile.city} />
                    <ProfileKeyValueRow label="State / Region" value={formData.state || profile.state} />
                    <ProfileKeyValueRow label="Zip / Postal Code" value={formData.zipCode || profile.zipCode} />
                </div>
            </div>

            {/* 3. Assigned Carrier Authority Key : Value Grid */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                    <ProfileKeyValueRow
                        label="Carrier Fleet Company"
                        value={carrier?.company_name || carrier?.companyName || 'Supplier Co 1 Fleet HQ'}
                    />
                    <ProfileKeyValueRow
                        label="USDOT Authority #"
                        value={carrier?.dot_number || 'USDOT-3920194'}
                        isMono
                    />
                    <ProfileKeyValueRow
                        label="Central Dispatch Phone"
                        value={carrier?.phone || '+353 87 123 4567'}
                    />
                    <ProfileKeyValueRow
                        label="Dispatch Desk Email"
                        value={carrier?.email || 'dispatch@supplierco1.ie'}
                    />
                </div>
            </div>
        </div>
    );
};
