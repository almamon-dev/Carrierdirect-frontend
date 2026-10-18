import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface SelectOption {
    id?: string | number;
    value?: string | number;
    name?: string | React.ReactNode;
    label?: string | React.ReactNode;
    image?: string;
    icon?: LucideIcon | React.ElementType | React.ReactNode;
    [key: string]: any;
}

export interface SelectProps {
    value?: any;
    onChange?: (e: any) => void;
    options?: SelectOption[];
    placeholder?: string;
    className?: string;
    triggerClassName?: string;
    size?: "sm" | "md" | "lg";
    name?: string;
    multiple?: boolean;
    disabled?: boolean;
    showSearch?: boolean;
    direction?: "up" | "down";
    onCreate?: (name: string) => void;
    icon?: LucideIcon | React.ElementType;
    children?: React.ReactNode;
    error?: string | boolean;
}
