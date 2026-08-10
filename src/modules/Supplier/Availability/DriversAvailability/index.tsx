import React, { useState } from 'react';
import { Plus, Download, User, Phone, Truck, Check, Search, Trash2, Edit2, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import DataTable, { Column } from '@/components/tables/data-table';

type DriverRoster = {
    id: string;
    name: string;
    phone: string;
    license: string;
    assignedVehicle: string;
    shift: 'Morning' | 'Afternoon' | 'Night' | 'Full Day';
    tripsCount: number;
    rating: string;
    status: 'Available' | 'On Trip' | 'Off Duty' | 'On Leave';
};

export default function DriversAvailability() {
    const [drivers, setDrivers] = useState<DriverRoster[]>([
        { id: '1', name: 'John Doe', phone: '+880 1812-334455', license: 'DL-89021', assignedVehicle: 'Covered Truck (DH-11-2099)', shift: 'Morning', tripsCount: 142, rating: '4.9', status: 'On Trip' },
        { id: '2', name: 'Sarah Lee', phone: '+880 1715-443322', license: 'DL-77124', assignedVehicle: 'Refrigerated Van (DH-14-8812)', shift: 'Full Day', tripsCount: 98, rating: '4.8', status: 'Available' },
        { id: '3', name: 'Mike Ross', phone: '+880 1819-776655', license: 'DL-99012', assignedVehicle: 'Heavy Trailer (CT-09-5511)', shift: 'Night', tripsCount: 210, rating: '5.0', status: 'Available' },
        { id: '4', name: 'Kabir Hossain', phone: '+880 1612-445566', license: 'DL-55410', assignedVehicle: 'Covered Van (DH-12-1002)', shift: 'Afternoon', tripsCount: 45, rating: '4.7', status: 'Off Duty' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [license, setLicense] = useState('');
    const [shift, setShift] = useState<'Morning' | 'Afternoon' | 'Night' | 'Full Day'>('Morning');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = drivers.filter(d => {
        if (statusFilter === 'all') return true;
        return d.status.toLowerCase() === statusFilter.toLowerCase();
    });

    const handleAddDriver = (e: React.FormEvent) => {
        e.preventDefault();
        const created: DriverRoster = {
            id: String(Date.now()),
            name,
            phone,
            license,
            assignedVehicle: 'Unassigned Fleet',
            shift,
            tripsCount: 0,
            rating: '5.0',
            status: 'Available',
        };
        setDrivers([created, ...drivers]);
        setShowModal(false);
        setName(''); setPhone(''); setLicense('');
    };

    const columns: Column<DriverRoster>[] = [
        { 
            id: 'name', 
            label: 'Driver Name', 
            render: (r) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                        {r.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{r.name}</p>
                        <p className="text-[11px] text-slate-500">{r.phone}</p>
                    </div>
                </div>
            ) 
        },
        { 
            id: 'license', 
            label: 'License #', 
            render: (r) => <span className="font-mono text-xs text-slate-700 font-semibold">{r.license}</span> 
        },
        { 
            id: 'assignedVehicle', 
            label: 'Assigned Vehicle', 
            render: (r) => (
                <span className="text-xs text-slate-700 font-medium flex items-center gap-1">
                    <Truck size={12} className="text-slate-400" /> {r.assignedVehicle}
                </span>
            )
        },
        { 
            id: 'shift', 
            label: 'Shift', 
            render: (r) => <span className="text-xs font-medium text-slate-800">{r.shift}</span> 
        },
        { 
            id: 'tripsCount', 
            label: 'Trips & Rating', 
            render: (r) => (
                <div>
                    <span className="font-bold text-slate-900">{r.tripsCount} trips</span>
                    <span className="text-amber-600 text-xs font-semibold ml-1.5">★ {r.rating}</span>
                </div>
            )
        },
        { 
            id: 'status', 
            label: 'Availability', 
            render: (r) => (
                <Badge variant="secondary" className={
                    r.status === 'Available' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                    r.status === 'On Trip' ? 'bg-blue-50 text-blue-700 font-semibold' :
                    'bg-slate-100 text-slate-600 font-semibold'
                }>
                    {r.status}
                </Badge>
            )
        },
    ];

    const renderActions = (row: DriverRoster) => (
        <div className="flex items-center justify-end gap-1">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-slate-400 hover:text-slate-800"
                onClick={() => alert(`Edit driver ${row.name}`)}
            >
                <Edit2 size={13} />
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-slate-400 hover:text-red-600"
                onClick={() => setDrivers(drivers.filter(d => d.id !== row.id))}
            >
                <Trash2 size={13} />
            </Button>
        </div>
    );

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Availability Status</label>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Drivers</option>
                    <option value="available">Available</option>
                    <option value="on trip">On Trip</option>
                    <option value="off duty">Off Duty</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Drivers Availability Roster</h1>
                    <p className="text-xs text-slate-500 font-medium">Track driver shifts, current active trips, and fleet assignments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 text-xs font-semibold" onClick={() => alert('Exporting drivers list...')}>
                        <Download size={13} className="mr-1.5" /> Export
                    </Button>
                    <Button variant="primary" size="sm" className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white" onClick={() => setShowModal(true)}>
                        <Plus size={13} className="mr-1.5" /> Add Driver
                    </Button>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={filtered} 
                compact={true}
                searchPlaceholder="Search drivers by name, phone, license..."
                hideViewToggle={true}
                actions={renderActions}
                filterContent={filterContent}
            />

            {/* Add Driver Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleAddDriver} className="bg-white rounded-lg max-w-md w-full p-6 border border-slate-200 shadow-md space-y-4">
                        <h3 className="text-sm font-bold text-slate-900">Add New Fleet Driver</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <FormLabel className="text-xs">Driver Full Name</FormLabel>
                                <Input required placeholder="e.g. John Doe" className="text-xs h-8" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div>
                                <FormLabel className="text-xs">Phone Number</FormLabel>
                                <PhoneInput name="phone" placeholder="1812-334455" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <FormLabel className="text-xs">Driving License #</FormLabel>
                                    <Input required placeholder="DL-99012" className="text-xs h-8" value={license} onChange={e => setLicense(e.target.value)} />
                                </div>
                                <div>
                                    <FormLabel className="text-xs">Assigned Shift</FormLabel>
                                    <Select value={shift} onChange={e => setShift(e.target.value as any)} showSearch={false} className="text-xs h-8">
                                        <option value="Morning">Morning</option>
                                        <option value="Afternoon">Afternoon</option>
                                        <option value="Night">Night</option>
                                        <option value="Full Day">Full Day</option>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                            <Button variant="outline" size="sm" type="button" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" type="submit" className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white">
                                Save Driver
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
