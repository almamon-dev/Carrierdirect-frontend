import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface QuoteLifecycleStep {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    timestamp?: string;
    dateFormatted?: string;
    status: 'completed' | 'active' | 'pending' | 'rejected' | 'expired';
    icon: LucideIcon | React.ComponentType<any>;
    actor?: string;
}

export interface QuoteLifecycleTrackerProps {
    quote?: any;
    requestDetail?: any;
    className?: string;
    compact?: boolean;
    allBids?: any[];
}

export const formatStepTimestamp = (timestamp?: any): string => {
    if (!timestamp) return '';
    try {
        const d = new Date(timestamp);
        if (isNaN(d.getTime())) return String(timestamp);
        return d.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch {
        return String(timestamp);
    }
};
