import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Star, Loader2, Inbox } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';

export default function QuotesReceived() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchQuotes = async () => {
    try {
      const res = await apiClient.get('/customer/quotes/received');
      const raw = res.data?.data?.quotes || res.data?.quotes_request || res.data?.quotes || res.data?.data || res.data || [];
      const list = Array.isArray(raw) ? raw : (raw?.data || []);
      setQuotes(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch received quotes:', error);
      setQuotes([]);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleAccept = async (quoteId: number) => {
    setActionLoading(quoteId);
    try {
      await apiClient.post(`/customer/quotes/${quoteId}/accept`);
      await fetchQuotes();
    } catch (error: any) {
      alert(error?.data?.message || error?.message || 'Failed to accept quote.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (quoteId: number) => {
    if (!window.confirm('Are you sure you want to reject this quote?')) return;
    setActionLoading(quoteId);
    try {
      await apiClient.post(`/customer/quotes/${quoteId}/reject`);
      await fetchQuotes();
    } catch (error: any) {
      alert(error?.data?.message || error?.message || 'Failed to reject quote.');
    } finally {
      setActionLoading(null);
    }
  };

  const columns: Column<any>[] = [
    { 
      id: 'id', 
      label: 'Quote ID', 
      render: (row) => <span className="text-brand font-semibold whitespace-nowrap">{row.quote_id || `QT-${row.id}`}</span> 
    },
    { 
      id: 'requestId', 
      label: 'Request ID', 
      render: (row) => <span className="text-slate-500 whitespace-nowrap">{row.request_id || (row.quote_request_id ? `REQ-${row.quote_request_id}` : (row.quote_request?.id ? `REQ-${row.quote_request.id}` : '—'))}</span> 
    },
    { 
      id: 'supplier', 
      label: 'Supplier', 
      render: (row) => <span className="whitespace-nowrap font-medium text-slate-800">{row.supplier_name || row.supplier?.company_name || row.supplier?.name || row.carrier_name || 'Supplier'}</span> 
    },
    { 
      id: 'rating', 
      label: 'Rating', 
      render: (row) => (
        <div className="flex items-center gap-1 whitespace-nowrap">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          <span className="text-slate-700">{row.rating || row.supplier?.rating || 0}</span>
          {row.reviews_count ? <span className="text-slate-400">({row.reviews_count})</span> : null}
        </div>
      ) 
    },
    { 
      id: 'vehicle', 
      label: 'Vehicle Type', 
      render: (row) => <span className="whitespace-nowrap">{row.vehicle || row.vehicle_type || row.truck_type || row.quote_request?.vehicle_type || 'N/A'}</span> 
    },
    { 
      id: 'transitTime', 
      label: 'Transit Time', 
      render: (row) => <span className="whitespace-nowrap">{row.estimated_delivery || row.estimated_time || row.transit_time || 'N/A'}</span> 
    },
    { 
      id: 'amount', 
      label: 'Quote Amount', 
      render: (row) => {
        if (typeof row.amount === 'number') return <span className="whitespace-nowrap font-semibold text-emerald-600">€{row.amount.toLocaleString()}</span>;
        if (typeof row.amount === 'string' && row.amount) {
          const amt = row.amount.startsWith('€') || row.amount.startsWith('৳') || row.amount.startsWith('$') ? row.amount : `€${row.amount}`;
          return <span className="whitespace-nowrap font-semibold text-emerald-600">{amt}</span>;
        }
        if (row.amount_raw) return <span className="whitespace-nowrap font-semibold text-emerald-600">€{row.amount_raw}</span>;
        return <span className="whitespace-nowrap font-semibold text-slate-400">—</span>;
      }
    },
    { 
      id: 'validUntil', 
      label: 'Valid Until', 
      render: (row) => <span className="whitespace-nowrap">{row.valid_until || row.validity || 'N/A'}</span> 
    },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        const st = (row.status_raw || row.status || 'pending').toLowerCase();
        let variant: any = 'default';
        if (st === 'pending') variant = 'warning';
        if (st === 'negotiating') variant = 'info';
        if (st === 'accepted') variant = 'success';
        if (st === 'rejected') variant = 'critical';
        return <Badge variant={variant}>{row.status || 'Pending'}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 px-2" 
        onClick={() => navigate(`/customer/quotes/received/view/${row.id}`)}
      >
        <Eye size={14} className="mr-1" /> View
      </Button>
      {(row.status_raw === 'pending' || row.status === 'Pending') && (
        <>
          <Button 
            variant="primary" 
            size="sm" 
            disabled={actionLoading === row.id}
            className="h-7 px-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
            onClick={() => handleAccept(row.id)}
          >
            {actionLoading === row.id ? <Loader2 size={14} className="animate-spin mr-1" /> : <CheckCircle size={14} className="mr-1" />} Accept
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={actionLoading === row.id}
            className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => handleReject(row.id)}
          >
            <XCircle size={14} className="mr-1" /> Reject
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900 mb-1">Quotes Received</h1>
          <p className="text-sm text-slate-500">Review and accept quotes from our verified suppliers.</p>
        </div>
      </div>
      
      <DataTable 
        data={quotes} 
        columns={columns} 
        actions={actions}
        searchPlaceholder="Search quotes by ID or supplier..."
        compact={true}
        emptyState={
          <EmptyState
            icon={Inbox}
            title="No Quotes Received Yet"
            description="When verified suppliers submit quotes for your shipping requests, they will appear here for your review."
            actionLabel="Create Quote Request"
            onAction={() => navigate('/customer/quotes/create/new')}
          />
        }
      />
    </div>
  );
}
