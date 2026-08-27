import React, { useState, useEffect } from 'react';
import { Eye, MessageSquare, ArrowDownRight, History, Clock, MessageSquareOff } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';

export default function Negotiation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [negotiations, setNegotiations] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNegotiations = async () => {
    setIsLoading(true);
    try {
      let res;
      try {
        res = await apiClient.get('/customer/negotiations');
      } catch {
        res = await apiClient.get('/negotiations');
      }
      const list = res.data?.data || res.data || [];
      setNegotiations(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch negotiations:', error);
      setNegotiations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNegotiations();
  }, []);

  const activeData = negotiations.filter((item) => {
    const st = (item.status_raw || item.status || '').toLowerCase();
    const revSt = (item.revision_status || '').toLowerCase();
    return st === 'pending' || st === 'negotiating' || revSt === 'pending';
  });

  const historyData = negotiations.filter((item) => {
    const st = (item.status_raw || item.status || '').toLowerCase();
    const revSt = (item.revision_status || '').toLowerCase();
    return st === 'accepted' || st === 'rejected' || revSt === 'accepted' || revSt === 'rejected';
  });

  const displayData = activeTab === 'active' ? activeData : historyData;

  const columns: Column<any>[] = [
    { 
      id: 'id', 
      label: 'Quote ID', 
      render: (row) => <span className="text-[#FF4A1F] font-bold whitespace-nowrap">{row.quote_id_formatted || `QT-${row.id}`}</span> 
    },
    { 
      id: 'requestId', 
      label: 'Request ID', 
      render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.request_id || `REQ-${row.quote_request_id}`}</span> 
    },
    { 
      id: 'supplier', 
      label: 'Supplier', 
      render: (row) => <span className="whitespace-nowrap text-slate-800 font-semibold">{row.sender_name || row.company_name || 'Supplier'}</span> 
    },
    { 
      id: 'originalAmount', 
      label: 'Original Quote', 
      render: (row) => <span className="whitespace-nowrap text-slate-500">{row.base_amount || row.amount || 'N/A'}</span> 
    },
    { 
      id: 'yourOffer', 
      label: 'Current / Revised Offer', 
      render: (row) => <span className="whitespace-nowrap text-emerald-600 font-bold">{row.revised_amount || row.amount || 'N/A'}</span>
    },
    { 
      id: 'lastUpdated', 
      label: 'Last Activity', 
      render: (row) => <span className="whitespace-nowrap text-slate-500">{row.time_ago || row.created_at || 'Recently'}</span> 
    },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        const st = (row.status_raw || row.status || 'Pending').toLowerCase();
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
        emptyState={
          <EmptyState
            icon={MessageSquareOff}
            title={activeTab === 'active' ? "No Active Negotiations" : "No Negotiation History"}
            description={activeTab === 'active' ? "You don't have any open price counter-offers or chat negotiations right now." : "Past completed or closed negotiation chats will appear here."}
          />
        }
      />
    </div>
  );
}
