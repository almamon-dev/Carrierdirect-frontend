import React, { useState } from 'react';
import { Eye, MessageSquare, CheckCircle, ArrowDownRight, History, Clock } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const activeData = [
  { id: 'NEG-102', quoteId: 'QT-8822', supplier: 'Prime Movers', originalAmount: 45000, yourOffer: 40000, lastUpdated: '2 hours ago', status: 'Awaiting Supplier' },
  { id: 'NEG-101', quoteId: 'QT-8815', supplier: 'Fast Track BD', originalAmount: 35000, yourOffer: 32000, lastUpdated: '10 mins ago', status: 'Supplier Countered' },
];

const historyData = [
  { id: 'NEG-098', quoteId: 'QT-8801', supplier: 'Safe Logistics', originalAmount: 50000, yourOffer: 46000, lastUpdated: '2026-07-15', status: 'Accepted' },
  { id: 'NEG-095', quoteId: 'QT-8790', supplier: 'Express Cargo', originalAmount: 28000, yourOffer: 22000, lastUpdated: '2026-07-10', status: 'Rejected' },
  { id: 'NEG-092', quoteId: 'QT-8785', supplier: 'Apex Freight', originalAmount: 62000, yourOffer: 58000, lastUpdated: '2026-07-02', status: 'Accepted' },
];

export default function Negotiation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const columns: Column<any>[] = [
    { id: 'id', label: 'Negotiation ID', render: (row) => <span className="text-[#FF4A1F] font-bold whitespace-nowrap">{row.id}</span> },
    { id: 'quoteId', label: 'Quote ID', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.quoteId}</span> },
    { id: 'supplier', label: 'Supplier', render: (row) => <span className="whitespace-nowrap text-slate-800 font-semibold">{row.supplier}</span> },
    { 
      id: 'originalAmount', 
      label: 'Original Quote', 
      render: (row) => <span className="whitespace-nowrap text-slate-400 line-through">€ {row.originalAmount.toLocaleString()}</span> 
    },
    { 
      id: 'yourOffer', 
      label: 'Final Offer', 
      render: (row) => <span className="whitespace-nowrap text-emerald-600 font-bold">€ {row.yourOffer.toLocaleString()}</span>
    },
    { 
      id: 'savings', 
      label: 'Savings', 
      render: (row) => {
        const diff = row.originalAmount - row.yourOffer;
        const savingsPercent = ((diff / row.originalAmount) * 100).toFixed(1);
        return (
          <div className="flex items-center text-emerald-600 font-bold whitespace-nowrap">
            <ArrowDownRight size={14} className="mr-1 text-emerald-600" /> {savingsPercent}% (€ {diff.toLocaleString()})
          </div>
        );
      }
    },
    { id: 'lastUpdated', label: 'Last Activity', render: (row) => <span className="whitespace-nowrap text-slate-500">{row.lastUpdated}</span> },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        let variant: any = 'default';
        if (row.status === 'Awaiting Supplier') variant = 'warning';
        if (row.status === 'Supplier Countered') variant = 'info';
        if (row.status === 'Accepted') variant = 'success';
        if (row.status === 'Rejected') variant = 'critical';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" className="h-7 px-2 text-xs font-semibold" onClick={() => navigate(`/customer/quotes/negotiation/view/${row.id}`)}>
        <Eye size={13} className="mr-1" /> View
      </Button>
      {activeTab === 'active' && (
        <Button variant="primary" size="sm" className="h-7 px-2 text-xs font-semibold bg-[#FF4A1F] hover:bg-[#E03E15] text-white" onClick={() => navigate(`/customer/quotes/negotiation/view/${row.id}`)}>
          <MessageSquare size={13} className="mr-1" /> Reply
        </Button>
      )}
    </div>
  );

  const displayData = activeTab === 'active' ? activeData : historyData;

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Negotiation Management</h1>
          <p className="text-xs text-slate-500 font-medium">Manage active price negotiations and view complete negotiation history.</p>
        </div>

        {/* Tab Switcher: Active vs Negotiation History */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-white text-[#FF4A1F] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock size={14} />
            <span>Active Negotiations ({activeData.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-[#FF4A1F] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History size={14} />
            <span>Negotiation History ({historyData.length})</span>
          </button>
        </div>
      </div>
      
      <DataTable 
        data={displayData} 
        columns={columns} 
        actions={actions}
        searchPlaceholder={activeTab === 'active' ? "Search active negotiations..." : "Search negotiation history..."}
        compact={true}
      />
    </div>
  );
}
