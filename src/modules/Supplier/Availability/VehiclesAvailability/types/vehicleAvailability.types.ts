export type VehicleItem = {
    id: string;
    name: string;
    type: string;
    registrationNo: string;
    registration_no?: string;
    capacity: string;
    status: 'Active' | 'Maintenance' | 'Inactive' | 'Available' | 'On Job' | 'Unavailable';
    assignedDriver?: string;
    assigned_driver?: string;
    image?: string;
};

export const INITIAL_VEHICLES: VehicleItem[] = [
    {
        id: '1',
        name: 'Mercedes Sprinter',
        type: 'Van (3.5t)',
        registrationNo: 'FD68 XYZ',
        registration_no: 'FD68 XYZ',
        capacity: '1,200 kg',
        status: 'Active',
        assignedDriver: 'John Doe',
        assigned_driver: 'John Doe',
    },
    {
        id: '2',
        name: 'Iveco Daily',
        type: 'Van (3.5t)',
        registrationNo: 'LC19 ABC',
        registration_no: 'LC19 ABC',
        capacity: '1,200 kg',
        status: 'Active',
        assignedDriver: 'Michael Smith',
        assigned_driver: 'Michael Smith',
    },
    {
        id: '3',
        name: 'DAF LF',
        type: 'Rigid',
        registrationNo: 'YN20 DEF',
        registration_no: 'YN20 DEF',
        capacity: '4,000 kg',
        status: 'Active',
        assignedDriver: 'Sarah Rose',
        assigned_driver: 'Sarah Rose',
    },
    {
        id: '4',
        name: 'Scania R450',
        type: 'Artic (44t)',
        registrationNo: 'PX70 GHI',
        registration_no: 'PX70 GHI',
        capacity: '24,000 kg',
        status: 'Maintenance',
        assignedDriver: 'David Turner',
        assigned_driver: 'David Turner',
    },
    {
        id: '5',
        name: 'Ford Transit',
        type: 'Van (3.5t)',
        registrationNo: 'BK22 JKL',
        registration_no: 'BK22 JKL',
        capacity: '1,000 kg',
        status: 'Active',
        assignedDriver: 'Ahmed Khan',
        assigned_driver: 'Ahmed Khan',
    },
];

export default INITIAL_VEHICLES;
