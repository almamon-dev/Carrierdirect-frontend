import React, { useState, useEffect } from 'react';
import { Eye, Download, RotateCcw, Star, PackageSearch } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { useNavigate } from 'react-router-dom';
import RatingModal from '@/components/modals/rating-modal';
import apiClient from '@/lib/axios';
import { formatDisplayDate } from '@/lib/utils';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [ratingTarget, setRatingTarget] = useState<{ id: string; supplier: string; route: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Transit' | 'Cancelled'>('All');

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get('/customer/orders');
      const list = res.data?.data || res.data || [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'All') return true;
    const st = (order.status || order.status_raw || '').toLowerCase();
    if (statusFilter === 'Completed') return st === 'completed';
    if (statusFilter === 'Cancelled') return st === 'cancelled';
    if (statusFilter === 'In Transit') return st === 'in transit' || st === 'in_transit' || st === 'confirmed' || st === 'in_progress' || st === 'picked_up';
    return true;
  });

  const columns: Column<any>[] = [
    { 
      id: 'id', 
      label: 'Order ID', 
      render: (row) => <span className="font-bold text-[#ff4a1f]">{row.order_id || row.order_number || (row.id ? `ORD-${String(row.id).padStart(4, '0')}` : 'ORD-0001')}</span> 
    },
    { 
      id: 'date', 
      label: 'Order Date', 
      render: (row) => <span className="text-slate-600 whitespace-nowrap">{formatDisplayDate(row.created_at || row.date || row.order_date || row.created_at_formatted)}</span> 
    },
    { 
      id: 'route', 
      label: 'Route', 
      render: (row) => <span className="font-medium text-slate-800 whitespace-nowrap">{row.route || `${row.pickup_address || row.pickup_city || 'Origin'} → ${row.delivery_address || row.delivery_city || 'Destination'}`}</span> 
    },
    { 
      id: 'supplier', 
      label: 'Supplier', 
      render: (row) => <span className="text-slate-700 whitespace-nowrap">{row.supplier_name || row.supplier?.company_name || row.supplier?.name || 'Verified Carrier'}</span> 
    },
    { 
      id: 'vehicle', 
      label: 'Vehicle', 
      render: (row) => <span className="text-slate-500 text-[13px]">{row.vehicle || row.vehicle_type || 'Covered Van'}</span> 
    },
    { 
      id: 'deliveryDate', 
      label: 'Delivery', 
      render: (row) => <span className="text-slate-600 whitespace-nowrap">{formatDisplayDate(row.delivery_date || row.estimated_delivery || row.estimated_time, 'In Transit')}</span> 
    },
    { 
      id: 'amount', 
      label: 'Total Amount', 
      render: (row) => <span className="font-bold text-slate-900 whitespace-nowrap">{row.amount ? (String(row.amount).includes('€') ? row.amount : `€ ${row.amount}`) : (row.total_amount ? `€ ${row.total_amount}` : '€ 0.00')}</span> 
    },
    { 
      id: 'paymentStatus', 
      label: 'Payment',
      render: (row) => {
        const ps = (row.payment_status || 'Paid').toLowerCase();
        if (ps === 'paid') return <span className="text-emerald-600 font-semibold text-[13px]">Paid</span>;
        if (ps === 'refunded') return <span className="text-slate-400 font-semibold text-[13px]">Refunded</span>;
        return <span className="text-amber-600 font-semibold text-[13px]">{row.payment_status || 'Pending'}</span>;
      }
    },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        const st = (row.status || '').toLowerCase();
        if (st === 'completed') return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</Badge>;
        if (st === 'cancelled') return <Badge variant="destructive">Cancelled</Badge>;
        return <Badge variant="warning">{row.status || 'In Transit'}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-1.5">
      {row.status === 'Completed' && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 font-bold text-[11px] cursor-pointer"
          onClick={() => setRatingTarget({ id: String(row.id), supplier: row.supplier_name || row.supplier?.name || 'Supplier', route: row.route })}
          title="Rate Supplier"
        >
          <Star size={12} className="mr-1 fill-amber-400 text-amber-400" /> Rate
        </Button>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 w-7 p-0 text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer" 
        onClick={() => navigate(`/customer/orders/${row.id}`, { state: { orderData: row } })}
        title="View Details"
      >
        <Eye size={13} />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 px-2 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center gap-1 font-semibold cursor-pointer" 
        onClick={() => navigate('/customer/quotes/create/new', { state: { repeatData: row } })}
        title="Repeat Order"
      >
        <RotateCcw size={12} />
        <span>Repeat</span>
      </Button>
    </div>
  );

  const filterContent = (
    <div className="flex flex-wrap items-center gap-3 py-1">
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-slate-600">Order Status</label>
        <div className="flex items-center gap-1.5">
          {(['All', 'Completed', 'In Transit', 'Cancelled'] as const).map((tab) => {
            const count = tab === 'All' ? orders.length : orders.filter(i => {
              const st = (i.status || i.status_raw || '').toLowerCase();
              if (tab === 'Completed') return st === 'completed';
              if (tab === 'Cancelled') return st === 'cancelled';
              if (tab === 'In Transit') return st === 'in transit' || st === 'in_transit' || st === 'confirmed' || st === 'in_progress' || st === 'picked_up';
              return true;
            }).length;
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                  isActive
                    ? 'bg-[#ff4a1f] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen space-y-4 font-sans antialiased">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Order History & Ratings</h1>
          <p className="text-xs text-slate-500 mt-0.5">View orders, download receipts, and rate logistics suppliers for completed orders.</p>
        </div>
        <Button variant="outline" className="h-8 text-xs font-bold cursor-pointer">
          <Download size={14} className="mr-1.5" /> Export CSV
        </Button>
      </div>
      
      <DataTable 
        data={filteredOrders} 
        columns={columns} 
        actions={actions}
        filterContent={filterContent}
        searchPlaceholder="Search by Order ID or Supplier..."
        compact={true}
        emptyState={
          <EmptyState
            icon={PackageSearch}
            title="No Orders Found"
            description="You haven't placed any logistics orders yet. Accept a quote from received quotes to place an order."
            actionLabel="View Received Quotes"
            onAction={() => navigate('/customer/quotes/received')}
          />
        }
      />

      {/* Bidirectional Rating Modal for Completed Orders */}
      {ratingTarget && (
        <RatingModal
          isOpen={Boolean(ratingTarget)}
          onClose={() => setRatingTarget(null)}
          orderId={ratingTarget.id}
          targetName={ratingTarget.supplier}
          targetRole="Supplier"
          orderTitle={ratingTarget.route}
          onSubmit={async (data) => {
            try {
              await apiClient.post(`/customer/orders/${ratingTarget.id}/review`, data);
              fetchOrders();
            } catch (err: any) {
              console.error('Failed to submit review:', err);
            }
          }}
        />
      )}
    </div>
  );
}
