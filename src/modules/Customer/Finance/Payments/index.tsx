import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Download } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import apiClient from '@/lib/axios';

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);

  const fetchPayments = async () => {
    try {
      const res = await apiClient.get('/customer/invoices?status=paid');
      const list = res.data?.data || res.data?.invoices?.data || res.data?.invoices || res.data || [];
      setPayments(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      setPayments([]);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const columns: Column<any>[] = [
    { 
      id: 'id', 
      label: 'Transaction / Ref ID', 
      render: (row) => <span className="font-bold text-slate-800">{row.transaction_id || `TXN-${row.id}`}</span> 
    },
    { 
      id: 'date', 
      label: 'Date', 
      render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.date || row.created_at_formatted || 'N/A'}</span> 
    },
    { 
      id: 'method', 
      label: 'Payment Method', 
      render: (row) => <span className="text-slate-600">{row.payment_method || row.method || 'Online Payment'}</span> 
    },
    { 
      id: 'invoice', 
      label: 'Invoice No.', 
      render: (row) => <span className="text-brand font-medium hover:underline cursor-pointer">{row.invoice_number || row.id}</span> 
    },
    { 
      id: 'amount', 
      label: 'Amount', 
      render: (row) => <span className="font-bold text-slate-900 whitespace-nowrap">{row.amount || row.total_amount_formatted || `€ ${row.total_amount || 0}`}</span> 
    },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        const st = (row.status || 'Success').toLowerCase();
        if (st === 'success' || st === 'paid') return <Badge variant="success" className="bg-emerald-50 text-emerald-700">Success</Badge>;
        if (st === 'failed') return <Badge variant="destructive">Failed</Badge>;
        return <Badge variant="default">{row.status || 'Success'}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      {row.status === 'Success' && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 w-7 p-0 text-slate-600 border-slate-200 hover:bg-slate-50" 
          title="Download Receipt"
          onClick={() => alert(`Downloading receipt for invoice ${row.invoice_number || row.id}`)}
        >
          <Download size={14} />
        </Button>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900 mb-1">Payment History</h1>
          <p className="text-sm text-slate-500">Track all your transactions and download payment receipts.</p>
        </div>
      </div>
      
      <DataTable 
        data={payments} 
        columns={columns} 
        actions={actions}
        searchPlaceholder="Search by Transaction or Invoice ID..."
        compact={true}
        emptyState={
          <EmptyState
            icon={CreditCard}
            title="No Payment Records Found"
            description="Your completed order payments and transaction receipts will be logged here."
          />
        }
      />
    </div>
  );
}
