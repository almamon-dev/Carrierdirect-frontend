import React from 'react';

export interface PermissionGuardProps {
    className?: string;
    permissions?: string[];
    hasPermission?: boolean;
    children?: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function PermissionGuard({ className = '', hasPermission = true, children, fallback = null }: PermissionGuardProps) {
    if (!hasPermission) {
        return <div className={className}>{fallback}</div>;
    }
    return <>{children}</>;
}
