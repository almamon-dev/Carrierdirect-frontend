import React, { useState } from 'react';
import { Eye, Send, MapPin, Clock, Truck, Box } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

type QuoteRequest = {
    id: string;
    requestDate: string;
    customer: string;
    pickup: string;
    delivery: string;
    distance: string;
    vehicleType: string;
    loadType: string;
    weight: string;
    pickupDate: string;
    deliveryDate: string;
    budget?: string;
    status: 'New' | 'Viewed' | 'Quoted' | 'Negotiation' | 'Expired';
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    timeRemaining: string;
    assignedTo?: string;
};

const mockData: QuoteRequest[] = [
    {
        id: 'QR-000125',
        requestDate: '20 Jul 2026',
        customer: 'ABC Company',
        pickup: 'Dhaka',
        delivery: 'Chittagong',
        distance: '265 KM',
        vehicleType: 'Truck / Van',
        loadType: 'Pallet / Box / Container',
        weight: '2,500 KG',
        pickupDate: '22 Jul 2026',
        deliveryDate: '23 Jul 2026',
        budget: '€450',
        status: 'New',
        priority: 'High',
        timeRemaining: '02:15:30',
        assignedTo: 'John Doe',
    },
    {
        id: 'QR-000124',
        requestDate: '19 Jul 2026',
        customer: 'Global Logistics',
        pickup: 'Sylhet',
        delivery: 'Dhaka',
        distance: '240 KM',
        vehicleType: 'Covered Van',
        loadType: 'Fragile',
        weight: '1,200 KG',
        pickupDate: '21 Jul 2026',
        deliveryDate: '22 Jul 2026',
        budget: 'Open',
        status: 'Viewed',
        priority: 'Medium',
        timeRemaining: '12:00:00',
        assignedTo: 'Unassigned',
    },
    {
        id: 'QR-000123',
        requestDate: '18 Jul 2026',
        customer: 'Walton Group',
        pickup: 'Gazipur',
        delivery: 'Khulna',
        distance: '350 KM',
        vehicleType: 'Heavy Truck',
        loadType: 'Machinery',
        weight: '5,000 KG',
        pickupDate: '25 Jul 2026',
        deliveryDate: '26 Jul 2026',
        budget: '€850',
        status: 'Quoted',
        priority: 'Urgent',
        timeRemaining: '00:45:10',
        assignedTo: 'Sarah Connor',
    },
    {
        id: 'QR-000122',
        requestDate: '17 Jul 2026',
        customer: 'Beximco Pharma',
        pickup: 'Dhaka',
        delivery: 'Rajshahi',
        distance: '250 KM',
        vehicleType: 'Refrigerated Van',
        loadType: 'Medicine',
        weight: '800 KG',
        pickupDate: '19 Jul 2026',
        deliveryDate: '20 Jul 2026',
        budget: '€300',
        status: 'Negotiation',
        priority: 'High',
        timeRemaining: '05:30:00',
        assignedTo: 'John Doe',
    },
    {
        id: 'QR-000121',
        requestDate: '15 Jul 2026',
        customer: 'Square Textiles',
        pickup: 'Narayanganj',
        delivery: 'Chittagong Port',
        distance: '230 KM',
        vehicleType: 'Trailer',
        loadType: 'Containers',
        weight: '15,000 KG',
        pickupDate: '16 Jul 2026',
        deliveryDate: '17 Jul 2026',
        budget: '€1,200',
        status: 'Expired',
        priority: 'Low',
        timeRemaining: '00:00:00',
        assignedTo: 'Unassigned',
    }
];

export default function LostQuotes() {
    const columns: Column<QuoteRequest>[] = [
        { 
            id: 'id', 
            label: 'Request ID', 
            render: (row) => <span className="font-bold text-brand whitespace-nowrap">{row.id}</span>
        },
        { 
            id: 'requestDate', 
            label: 'Request Date',
            render: (row) => <span className="whitespace-nowrap">{row.requestDate}</span>
        },
        { 
            id: 'customer', 
            label: 'Customer',
            render: (row) => <span className="font-medium text-slate-800 whitespace-nowrap">{row.customer}</span>
        },
        { 
            id: 'pickup', 
            label: 'Pickup Location',
            render: (row) => <span className="whitespace-nowrap">{row.pickup}</span>
        },
        { 
            id: 'delivery', 
            label: 'Delivery Location',
            render: (row) => <span className="whitespace-nowrap">{row.delivery}</span>
        },
        { 
            id: 'distance', 
            label: 'Distance',
            render: (row) => <span className="whitespace-nowrap">{row.distance}</span>
        },
        { 
            id: 'vehicleType', 
            label: 'Vehicle Type',
            render: (row) => <span className="whitespace-nowrap">{row.vehicleType}</span>
        },
        { 
            id: 'loadType', 
            label: 'Load Type',
            render: (row) => <span className="whitespace-nowrap">{row.loadType}</span>
        },
        { 
            id: 'weight', 
            label: 'Weight',
            render: (row) => <span className="whitespace-nowrap">{row.weight}</span>
        },
        { 
            id: 'pickupDate', 
            label: 'Pickup Date',
            render: (row) => <span className="whitespace-nowrap">{row.pickupDate}</span>,
            defaultHidden: true
        },
        { 
            id: 'deliveryDate', 
            label: 'Delivery Date',
            render: (row) => <span className="whitespace-nowrap">{row.deliveryDate}</span>,
            defaultHidden: true
        },
        { 
            id: 'budget', 
            label: 'Budget',
            render: (row) => <span className="whitespace-nowrap font-bold text-emerald-600">{row.budget}</span>,
            defaultHidden: true
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row) => {
                let variant: any = 'default';
                if (row.status === 'New') variant = 'info';
                if (row.status === 'Quoted') variant = 'success';
                if (row.status === 'Negotiation') variant = 'warning';
                if (row.status === 'Expired') variant = 'critical';
                return <Badge variant={variant}>{row.status}</Badge>;
            }
        },
        { 
            id: 'priority', 
            label: 'Priority', 
            render: (row) => {
                let variant: any = 'default';
                if (row.priority === 'Medium') variant = 'info';
                if (row.priority === 'High') variant = 'warning';
                if (row.priority === 'Urgent') variant = 'critical';
                return <Badge variant={variant}>{row.priority}</Badge>;
            },
            defaultHidden: true
        },
        { 
            id: 'timeRemaining', 
            label: 'Time Left', 
            render: (row) => (
                <span className={`font-medium whitespace-nowrap ${row.status === 'Expired' ? 'text-slate-400' : 'text-amber-600'}`}>
                    {row.timeRemaining}
                </span>
            )
        },
        { 
            id: 'assignedTo', 
            label: 'Assigned To',
            render: (row) => <span className={`whitespace-nowrap ${row.assignedTo === 'Unassigned' ? 'text-slate-400 italic' : 'font-medium'}`}>{row.assignedTo}</span>,
            defaultHidden: true
        }
    ];

    const renderActions = (row: QuoteRequest) => (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 px-2">
                <Eye size={14} className="mr-1" /> View
            </Button>
            {row.status !== 'Expired' && (
                <Button variant="primary" size="sm" className="h-7 px-2">
                    <Send size={14} className="mr-1" /> Quote
                </Button>
            )}
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 mb-1">Lost Quotes</h1>
                    <p className="text-sm text-slate-500 font-medium">Review past transportation quotes that were not accepted.</p>
                </div>
            </div>

            <DataTable 
                key="lostquotes_list_v1"
                tableId="lostquotes_list_v1"
                data={mockData} 
                columns={columns} 
                actions={renderActions}
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search by ID, Customer, Location..."
                compact={true}
            />
        </div>
    );
}
