import React, { useState } from 'react';
import { Plus, Download, MapPin, Truck, Check, Search, Trash2, Edit2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import DataTable, { Column } from '@/components/tables/data-table';

type ServiceRoute = {
    id: string;
    code: string;
    pickup: string;
    delivery: string;
    distance: string;
    estimatedDuration: string;
    ratePerKm: string;
    assignedFleet: string;
    status: 'Active' | 'Inactive' | 'High Demand';
};

export default function Routes() {
    const [routes, setRoutes] = useState<ServiceRoute[]>([
        { id: '1', code: 'RT-DHK-CTG', pickup: 'Dhaka (Uttara / EPZ)', delivery: 'Chittagong (Port Area)', distance: '265 km', estimatedDuration: '5.5 hrs', ratePerKm: '€1.65', assignedFleet: '5 Trucks', status: 'Active' },
        { id: '2', code: 'RT-[#ff4a1f]-SYL', pickup: 'Dhaka (Gazipur Hub)', delivery: 'Sylhet (Industrial EPZ)', distance: '240 km', estimatedDuration: '5.0 hrs', ratePerKm: '€1.80', assignedFleet: '3 Vans', status: 'High Demand' },
        { id: '3', code: 'RT-CTG-KHL', pickup: 'Chittagong (Agrabad)', delivery: 'Khulna (Mongla Port)', distance: '380 km', estimatedDuration: '8.5 hrs', ratePerKm: '€2.10', assignedFleet: '4 Trailers', status: 'Active' },
        { id: '4', code: 'RT-DHK-RAJ', pickup: 'Dhaka (Savar)', delivery: 'Rajshahi (BSP Depot)', distance: '245 km', estimatedDuration: '5.2 hrs', ratePerKm: '€1.50', assignedFleet: '2 Vans', status: 'Inactive' },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRouteCode, setNewRouteCode] = useState('');
    const [newPickup, setNewPickup] = useState('');
    const [newDelivery, setNewDelivery] = useState('');
    const [newDistance, setNewDistance] = useState('');
    const [newDuration, setNewDuration] = useState('');
    const [newRate, setNewRate] = useState('');

    const handleCreateRoute = (e: React.FormEvent) => {
        e.preventDefault();
        const created: ServiceRoute = {
            id: String(Date.now()),
            code: newRouteCode || `RT-${newPickup.slice(0, 3).toUpperCase()}-${newDelivery.slice(0, 3).toUpperCase()}`,
            pickup: newPickup,
            delivery: newDelivery,
            distance: `${newDistance} km`,
            estimatedDuration: `${newDuration} hrs`,
            ratePerKm: `€${newRate}`,
            assignedFleet: '2 Vehicles',
            status: 'Active',
        };
        setRoutes([created, ...routes]);
        setShowCreateModal(false);
        setNewRouteCode(''); setNewPickup(''); setNewDelivery(''); setNewDistance(''); setNewDuration(''); setNewRate('');
    };

    const columns: Column<ServiceRoute>[] = [
        { 
            id: 'code', 
            label: 'Route Code', 
            render: (r) => <span className="font-bold text-slate-900">{r.code}</span> 
        },
        { 
            id: 'pickup', 
            label: 'Pickup Zone', 
            render: (r) => (
                <div className="flex items-center gap-1.5 text-slate-800">
                    <MapPin size={13} className="text-slate-500" />
                    <span className="font-medium">{r.pickup}</span>
                </div>
            )
        },
        { 
            id: 'delivery', 
            label: 'Delivery Zone', 
            render: (r) => (
                <div className="flex items-center gap-1.5 text-slate-800">
                    <MapPin size={13} className="text-slate-500" />
                    <span className="font-medium">{r.delivery}</span>
                </div>
            )
        },
        { 
            id: 'distance', 
            label: 'Distance & Time', 
            render: (r) => (
                <div>
                    <p className="text-xs font-bold text-slate-900">{r.distance}</p>
                    <p className="text-[11px] text-slate-500">Est. {r.estimatedDuration}</p>
                </div>
            )
        },
        { 
            id: 'ratePerKm', 
            label: 'Base Rate / KM', 
            render: (r) => <span className="font-bold text-emerald-700">{r.ratePerKm}</span> 
        },
        { 
            id: 'assignedFleet', 
            label: 'Assigned Fleet', 
            render: (r) => (
                <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    <Truck size={12} className="text-slate-400" /> {r.assignedFleet}
                </span>
            )
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: (r) => (
                <Badge variant="secondary" className={
                    r.status === 'Active' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                    r.status === 'High Demand' ? 'bg-amber-50 text-amber-700 font-semibold' :
                    'bg-slate-100 text-slate-600 font-semibold'
                }>
                    {r.status}
                </Badge>
            )
        },
    ];

    const renderActions = (row: ServiceRoute) => (
        <div className="flex items-center justify-end gap-1">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-slate-400 hover:text-slate-800"
                onClick={() => alert(`Edit route ${row.code}`)}
            >
                <Edit2 size={13} />
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-slate-400 hover:text-red-600"
                onClick={() => setRoutes(routes.filter(r => r.id !== row.id))}
            >
                <Trash2 size={13} />
            </Button>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Service Routes Management</h1>
                    <p className="text-xs text-slate-500 font-medium">Define, configure, and monitor active shipping corridors and pricing rates.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 text-xs font-semibold" onClick={() => alert('Exporting routes data...')}>
                        <Download size={13} className="mr-1.5" /> Export
                    </Button>
                    <Button variant="primary" size="sm" className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white" onClick={() => setShowCreateModal(true)}>
                        <Plus size={13} className="mr-1.5" /> Add New Route
                    </Button>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={routes} 
                compact={true}
                searchPlaceholder="Search routes by code, zone, distance..."
                hideViewToggle={true}
                actions={renderActions}
            />

            {/* Create Route Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleCreateRoute} className="bg-white rounded-lg max-w-md w-full p-6 border border-slate-200 shadow-md space-y-4">
                        <h3 className="text-sm font-bold text-slate-900">Define New Shipping Route</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <FormLabel className="text-xs">Pickup Zone / City</FormLabel>
                                <Input required placeholder="e.g. Dhaka (Uttara)" className="text-xs h-8" value={newPickup} onChange={e => setNewPickup(e.target.value)} />
                            </div>
                            <div>
                                <FormLabel className="text-xs">Delivery Zone / Destination</FormLabel>
                                <Input required placeholder="e.g. Chittagong Port" className="text-xs h-8" value={newDelivery} onChange={e => setNewDelivery(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <FormLabel className="text-xs">Distance (km)</FormLabel>
                                    <Input required type="number" placeholder="265" className="text-xs h-8" value={newDistance} onChange={e => setNewDistance(e.target.value)} />
                                </div>
                                <div>
                                    <FormLabel className="text-xs">Duration (hrs)</FormLabel>
                                    <Input required type="number" step="0.5" placeholder="5.5" className="text-xs h-8" value={newDuration} onChange={e => setNewDuration(e.target.value)} />
                                </div>
                                <div>
                                    <FormLabel className="text-xs">Rate (€/km)</FormLabel>
                                    <Input required type="number" step="0.05" placeholder="1.65" className="text-xs h-8" value={newRate} onChange={e => setNewRate(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                            <Button variant="outline" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" type="submit" className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white">
                                Save Route
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
