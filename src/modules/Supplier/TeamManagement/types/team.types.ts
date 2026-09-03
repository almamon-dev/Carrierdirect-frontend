export interface TeamMember {
    id: string;
    rawId?: string | number;
    name: string;
    avatar: string;
    role: string;
    department: string;
    designation: string;
    email: string;
    phone: string;
    status: 'Active' | 'On Leave' | 'Inactive' | 'Blocked' | 'Pending' | 'Invited';
    isBlocked?: boolean;
    blockReason?: string;
    blockedAt?: string;
    lastLogin: string;
    location: string;
    assignedVehicle: string;
    clearance: string;
    permissions?: string[];
    roleDetails?: any;
}

export interface RoleItem {
    id: string;
    rawId?: string | number;
    name: string;
    description: string;
    memberCount: number;
    badgeColor?: string;
    permissions: string[];
    isSystemDefault?: boolean;
}

export interface InvitationItem {
    id: string;
    rawId?: string | number;
    email: string;
    role: string;
    department: string;
    dateSent: string;
    status: 'Pending' | 'Accepted' | 'Expired';
    expires: string;
}

export interface ActivityLogItem {
    id: string;
    actor: string;
    avatar: string;
    action: string;
    target: string;
    timestamp: string;
    ip: string;
    type: 'Security' | 'Access' | 'Fleet' | 'System';
}
