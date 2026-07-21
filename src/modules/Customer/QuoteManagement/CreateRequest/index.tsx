import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, Edit, Plus, Activity, MoreHorizontal, FileDown, Copy, XCircle, ArrowRight, TrendingDown, Clock, Inbox, Search, Trash2 } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const mockData = [
    { 
        id: 'REQ-9234', date: '2026-07-20', type: 'FTL', 
        pickup: 'Dhaka', delivery: 'Chittagong', 
        load: 'Pallets', vehicle: 'Covered Van', weight: '15 Tons',
        status: 'Draft', quotesReceived: 0, contacted: 0, lowestBid: null, expiresIn: null,
        suppliersList: [], hasNew: false
    },
    { 
        id: 'REQ-9233', date: '2026-07-19', type: 'LTL', 
        pickup: 'Sylhet', delivery: 'Rajshahi', 
        load: 'Boxes', vehicle: 'Open Truck', weight: '5 Tons',
        status: 'Bidding Active', quotesReceived: 3, contacted: 15, lowestBid: 42500, expiresIn: '1d 4h',
        suppliersList: ['Express Logistics', 'Prime Movers', 'Fast Track BD'], hasNew: true
    },
    { 
        id: 'REQ-9230', date: '2026-07-18', type: 'FTL',
        pickup: 'Chittagong', delivery: 'Dhaka', 
        load: 'Container', vehicle: 'Trailer', weight: '22 Tons',
        status: 'Negotiating', quotesReceived: 4, contacted: 12, lowestBid: 48000, expiresIn: 'Ended',
        suppliersList: ['Global Transport', 'Speedy Cargo', 'BD Logistics', 'TransCom'], hasNew: false
    },
    { 
        id: 'REQ-9105', date: '2026-07-15', type: 'Heavy Haul',
        pickup: 'Khulna', delivery: 'Dhaka', 
        load: 'Machinery', vehicle: 'Flatbed', weight: '35 Tons',
        status: 'Accepted', quotesReceived: 6, contacted: 20, lowestBid: 85000, expiresIn: 'Ended',
        suppliersList: ['HeavyHaul BD', 'Prime Movers'], hasNew: false
    },
];

export default function RequestList() {
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [activeFilterTab, setActiveFilterTab] = useState('All');
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const closeDropdown = () => setOpenDropdown(null);
        window.addEventListener('scroll', closeDropdown, true);
        window.addEventListener('resize', closeDropdown);
        return () => {
            window.removeEventListener('scroll', closeDropdown, true);
            window.removeEventListener('resize', closeDropdown);
        };
    }, []);

    const FilterTabs = () => {
        const tabs = [
            { id: 'All', label: 'All', count: 12 },
            { id: 'Active', label: 'Active', count: 7 },
            { id: 'Waiting', label: 'Waiting Quotes', count: 4 },
            { id: 'Review', label: 'To Review', count: 18 },
            { id: 'Accepted', label: 'Accepted', count: 5 },
        ];

        return (
            <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar mb-[-1px]">
                {tabs.map((tab) => {
                    const isActive = activeFilterTab === tab.id;
                    return (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveFilterTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${isActive ? 'border-[#008060] text-[#008060]' : 'border-transparent text-slate-600 hover:text-slate-800'}`}
                        >
                            <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                            <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${isActive ? 'bg-[#eaf5f0] text-[#008060]' : 'bg-slate-100 text-slate-500'}`}>
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    };

    const columns: Column<any>[] = [
        { 
            id: 'id', 
            label: 'Request', 
            render: (row) => (
                <span className="text-brand font-semibold whitespace-nowrap flex items-center gap-2">
                    {row.id}
                    {row.hasNew && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="New activity"></span>}
                </span>
            ) 
        },
        { 
            id: 'date', 
            label: 'Date', 
            render: (row) => <span className="text-[13px] text-slate-500 whitespace-nowrap">{row.date}</span>
        },
        { 
            id: 'type', 
            label: 'Type', 
            render: (row) => <Badge variant="secondary" className="px-1.5 py-0 min-w-[20px] text-center bg-slate-100">{row.type}</Badge>
        },
        { 
            id: 'pickup', 
            label: 'Pickup', 
            render: (row) => <span className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{row.pickup}</span>
        },
        { 
            id: 'delivery', 
            label: 'Delivery', 
            render: (row) => <span className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{row.delivery}</span>
        },
        { 
            id: 'load', 
            label: 'Commodity', 
            render: (row) => <span className="text-[13px] text-slate-700 whitespace-nowrap">{row.load}</span>
        },
        { 
            id: 'weight', 
            label: 'Weight', 
            render: (row) => <span className="text-[13px] text-slate-500 whitespace-nowrap">{row.weight}</span>
        },
        { 
            id: 'vehicle', 
            label: 'Vehicle', 
            render: (row) => <span className="text-[13px] text-slate-700 font-medium whitespace-nowrap">{row.vehicle}</span>
        },
        { 
            id: 'quotes', 
            label: 'Quotes', 
            render: (row) => (
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Badge variant={row.quotesReceived > 0 ? 'success' : 'secondary'} className="px-1.5 py-0 min-w-[20px] text-center">
                        {row.quotesReceived}
                    </Badge>
                    <span className="text-[11px] text-slate-500">/ {row.contacted}</span>
                </div>
            ) 
        },
        { 
            id: 'bestBid', 
            label: 'Best Bid', 
            render: (row) => (
                <span className="text-[13px] font-semibold text-emerald-600 whitespace-nowrap">
                    {row.lowestBid ? `৳ ${row.lowestBid.toLocaleString()}` : '-'}
                </span>
            ) 
        },
        { 
            id: 'status', 
            label: 'Status',
            render: (row) => {
                let variant: any = 'default';
                if (row.status === 'Draft') variant = 'secondary';
                if (row.status === 'Bidding Active') variant = 'info';
                if (row.status === 'Negotiating') variant = 'warning';
                if (row.status === 'Accepted') variant = 'success';
                
                return (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <Badge variant={variant}>{row.status}</Badge>
                        {row.expiresIn && row.expiresIn !== 'Ended' && (
                            <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                {row.expiresIn}
                            </span>
                        )}
                    </div>
                );
            }
        }
    ];

    const actions = (row: any) => (
        <div className="flex items-center justify-end gap-2 relative">
            {row.status !== 'Draft' ? (
                <Button variant="primary" size="sm" className="h-7 px-3 bg-brand hover:bg-brand-hover" onClick={(e) => { e.stopPropagation(); navigate(`/customer/quotes/received/${row.id}`); }}>
                    <Activity size={14} className="mr-1.5" /> Track Bids
                </Button>
            ) : (
                <Button variant="outline" size="sm" className="h-7 px-3 border-indigo-200 text-indigo-700 hover:bg-brand-light" onClick={(e) => { e.stopPropagation(); navigate(`/customer/quotes/create/edit/${row.id}`); }}>
                    <Edit size={14} className="mr-1.5" /> Edit Draft
                </Button>
            )}

            <div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-slate-500 border-slate-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (openDropdown === row.id) {
                            setOpenDropdown(null);
                        } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPos({
                                top: rect.bottom + 4,
                                left: rect.right - 160
                            });
                            setOpenDropdown(row.id);
                        }
                    }}
                >
                    <MoreHorizontal size={14} />
                </Button>

                {openDropdown === row.id && createPortal(
                    <div 
                        className="fixed w-40 bg-white rounded-md shadow-xl border border-slate-200 py-1 z-[9999] animate-in fade-in zoom-in-95 duration-100"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="w-full text-left px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => { setOpenDropdown(null); navigate(`/customer/quotes/create/view/${row.id}`); }}>
                            <Eye size={14} className="text-slate-400" /> View Details
                        </button>
                        <button className="w-full text-left px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenDropdown(null)}>
                            <Copy size={14} className="text-slate-400" /> Duplicate
                        </button>
                        <button className="w-full text-left px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenDropdown(null)}>
                            <FileDown size={14} className="text-slate-400" /> Download PDF
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        {row.status === 'Bidding Active' ? (
                            <button className="w-full text-left px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => setOpenDropdown(null)}>
                                <XCircle size={14} className="text-red-500" /> Cancel Request
                            </button>
                        ) : (
                            <button className="w-full text-left px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => setOpenDropdown(null)}>
                                <Trash2 size={14} className="text-red-500" /> Delete
                            </button>
                        )}
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen" onClick={() => setOpenDropdown(null)}>
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 mb-1">Quote Requests</h1>
                    <p className="text-sm text-slate-500">Manage and track your active transportation quote requests.</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/customer/quotes/create/new')}>
                    <Plus size={16} className="mr-2" /> Create New Request
                </Button>
            </div>
            
            <DataTable 
                data={mockData} 
                columns={columns} 
                actions={actions}
                headerTabs={<FilterTabs />}
                searchPlaceholder="Search by ID or Route (e.g. Dhaka)..."
                compact={true}
            />
        </div>
    );
}
