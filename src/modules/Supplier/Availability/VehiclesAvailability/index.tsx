import React, { useState } from 'react';
import { Plus, Download, Truck, ShieldCheck, Wrench, Trash2, Edit2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import DataTable, { Column } from '@/components/tables/data-table';

type FleetVehicle = {
    id: string;
    plateNumber: string;
    name: string;
    type: string;
    capacityWeight: string;
    capacityVolume: string;
    assignedDriver: string;
    status: 'Ready' | 'On Assignment' | 'In Maintenance' | 'Inactive';
};

export default function VehiclesAvailability() {
    const [vehicles, setVehicles] = useState<FleetVehicle[]>([
        { id: '1', plateNumber: 'DH-11-2099', name: 'Covered Truck 10T', type: 'Covered Truck', capacityWeight: '10.0 Tons', capacityVolume: '35 CBM', assignedDriver: 'John Doe', status: 'On Assignment' },
        { id: '2', plateNumber: 'DH-14-8812', name: 'Refrigerated Van 3T', type: 'Refrigerated Van', capacityWeight: '3.5 Tons', capacityVolume: '14 CBM', assignedDriver: 'Sarah Lee', status: 'Ready' },
        { id: '3', plateNumber: 'CT-09-5511', name: 'Heavy Trailer 20T', type: 'Heavy Trailer', capacityWeight: '20.0 Tons', capacityVolume: '65 CBM', assignedDriver: 'Mike Ross', status: 'Ready' },
        { id: '4', plateNumber: 'DH-12-1002', name: 'Covered Van 2T', type: 'Covered Van', capacityWeight: '2.0 Tons', capacityVolume: '10 CBM', assignedDriver: 'Kabir Hossain', status: 'In Maintenance' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [plateNumber, setPlateNumber] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('Covered Truck');
    const [weight, setWeight] = useState('');
    const [volume, setVolume] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = vehicles.filter(v => {
        if (statusFilter === 'all') return true;
        return v.status.toLowerCase() === statusFilter.toLowerCase();
    });

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault();
        const created: FleetVehicle = {
            id: String(Date.now()),
            plateNumber,
            name,
            type,
            capacityWeight: `${weight} Tons`,
            capacityVolume: `${volume} CBM`,
            assignedDriver: 'Unassigned',
            status: 'Ready',
        };
        setVehicles([created, ...vehicles]);
        setShowModal(false);
        setPlateNumber(''); setName(''); setWeight(''); setVolume('');
    };

    const columns: Column<FleetVehicle>[] = [
        { 
            id: 'plateNumber', 
            label: 'License Plate', 
            render: (r) => (
                <div className="flex items-center gap-2">
                    <Truck size={16} className="text-[#ff4a1f]" />
                    <span className="font-bold text-slate-900">{r.plateNumber}</span>
                </div>
            ) 
        },
        { 
            id: 'name', 
            label: 'Vehicle Name & Type', 
            render: (r) => (
                <div>
                    <p className="font-bold text-slate-900">{r.name}</p>
                    <p className="text-[11px] text-slate-500">{r.type}</p>
                </div>
            )
        },
        { 
            id: 'capacityWeight', 
            label: 'Max Payload & Volume', 
            render: (r) => (
                <div>
                    <span className="font-bold text-slate-900">{r.capacityWeight}</span>
                    <span className="text-[11px] text-slate-500 block">{r.capacityVolume}</span>
                </div>
            )
        },
        { 
            id: 'assignedDriver', 
            label: 'Assigned Driver', 
            render: (r) => <span className="text-xs font-semibold text-slate-800">{r.assignedDriver}</span> 
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: (r) => (
                <Badge variant="secondary" className={
                    r.status === 'Ready' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                    r.status === 'On Assignment' ? 'bg-blue-50 text-blue-700 font-semibold' :
                    r.status === 'In Maintenance' ? 'bg-amber-50 text-amber-700 font-semibold' :
                    'bg-slate-100 text-slate-600 font-semibold'
                }>
                    {r.status}
                </Badge>
            )
        },
    ];

    const renderActions = (row: FleetVehicle) => (
        <div className="flex items-center justify-end gap-1">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-slate-400 hover:text-slate-800"
                onClick={() => alert(`Edit vehicle ${row.plateNumber}`)}
            >
                <Edit2 size={13} />
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-slate-400 hover:text-red-600"
                onClick={() => setVehicles(vehicles.filter(v => v.id !== row.id))}
            >
                <Trash2 size={13} />
            </Button>
        </div>
    );

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Vehicle Status</label>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Vehicles</option>
                    <option value="ready">Ready</option>
                    <option value="on assignment">On Assignment</option>
                    <option value="in maintenance">In Maintenance</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5 bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Vehicles & Fleet Capacity</h1>
                    <p className="text-xs text-slate-500 font-medium">Manage fleet capacity, vehicle specs, and maintenance schedules.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 text-xs font-semibold" onClick={() => alert('Exporting fleet list...')}>
                        <Download size={13} className="mr-1.5" /> Export
                    </Button>
                    <Button variant="primary" size="sm" className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white" onClick={() => setShowModal(true)}>
                        <Plus size={13} className="mr-1.5" /> Add Vehicle
                    </Button>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={filtered} 
                compact={true}
                searchPlaceholder="Search vehicles by plate number, type..."
                hideViewToggle={true}
                actions={renderActions}
                filterContent={filterContent}
            />

            {/* Add Vehicle Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleAddVehicle} className="bg-white rounded-[5px] max-w-md w-full p-6 border border-slate-200 shadow-md space-y-4">
                        <h3 className="text-sm font-bold text-slate-900">Add New Fleet Vehicle</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <FormLabel className="text-xs">License Plate Number</FormLabel>
                                <Input required placeholder="e.g. DH-11-2099" className="text-xs h-8" value={plateNumber} onChange={e => setPlateNumber(e.target.value)} />
                            </div>
                            <div>
                                <FormLabel className="text-xs">Vehicle Name & Model</FormLabel>
                                <Input required placeholder="e.g. Covered Truck 10-Ton" className="text-xs h-8" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <FormLabel className="text-xs">Category</FormLabel>
                                    <Select value={type} onChange={e => setType(e.target.value)} showSearch={false} className="text-xs h-8">
                                        <option value="Covered Truck">Covered Truck</option>
                                        <option value="Refrigerated Van">Refrigerated Van</option>
                                        <option value="Heavy Trailer">Heavy Trailer</option>
                                        <option value="Open Truck">Open Truck</option>
                                    </Select>
                                </div>
                                <div>
                                    <FormLabel className="text-xs">Payload (Tons)</FormLabel>
                                    <Input required type="number" step="0.5" placeholder="10.0" className="text-xs h-8" value={weight} onChange={e => setWeight(e.target.value)} />
                                </div>
                                <div>
                                    <FormLabel className="text-xs">Volume (CBM)</FormLabel>
                                    <Input required type="number" placeholder="35" className="text-xs h-8" value={volume} onChange={e => setVolume(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                            <Button variant="outline" size="sm" type="button" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" type="submit" className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white">
                                Save Vehicle
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
