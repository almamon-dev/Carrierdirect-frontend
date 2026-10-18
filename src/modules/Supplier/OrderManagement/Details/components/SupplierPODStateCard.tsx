import React from 'react';
import Button from '@/components/ui/button';

interface SupplierPODStateCardProps {
    bgColor: string;
    borderColor: string;
    iconBg: string;
    iconColor: string;
    icon: React.ReactNode;
    title: string;
    titleColor: string;
    description: string;
    descColor: string;
    badge?: React.ReactNode;
    children?: React.ReactNode;
}

export const SupplierPODStateCard: React.FC<SupplierPODStateCardProps> = ({
    bgColor,
    borderColor,
    iconBg,
    iconColor,
    icon,
    title,
    titleColor,
    description,
    descColor,
    badge,
    children,
}) => (
    <div className={`${bgColor} ${borderColor} border rounded-xl p-3.5 space-y-2.5 font-sans shadow-2xs`}>
        <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                    {icon}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                    <h4 className={`text-xs sm:text-[13px] font-bold ${titleColor} leading-tight`}>{title}</h4>
                    <p className={`text-[11px] ${descColor} leading-snug`}>{description}</p>
                </div>
            </div>
            {badge}
        </div>
        {children}
    </div>
);

export default SupplierPODStateCard;
