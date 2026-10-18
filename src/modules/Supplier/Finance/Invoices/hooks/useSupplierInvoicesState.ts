import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { InvoiceFilterTab } from '../components/InvoiceFilterTabs';

export function useSupplierInvoicesState() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Tab & Custom Filters
  const [activeTab, setActiveTab] = useState<InvoiceFilterTab>('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleResetFilters = () => {
    setStageFilter('all');
    setMethodFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const fetchInvoices = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const res = await apiClient.get('/supplier/finance/invoices').catch(() => apiClient.get('/supplier/invoices'));
      const resData = res?.data || res;
      const list = resData?.data?.items 
        || resData?.data?.data 
        || resData?.items 
        || (Array.isArray(resData?.data) ? resData?.data : null) 
        || (Array.isArray(resData) ? resData : []);
      
      setInvoices(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch supplier invoices:', err);
      setInvoices([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = async (invoice: any) => {
    try {
      const id = invoice.id || invoice.raw_id;
      const response = await apiClient.get(`/supplier/invoices/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data || response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${invoice.invoice_number || id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download invoice PDF:', err);
      alert('Could not download invoice PDF.');
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const stage = String(inv.payment_stage || '').toLowerCase().trim();
      const st = String(inv.raw_status || inv.status || '').toLowerCase().trim();
      const method = String(inv.payment_method || '').toLowerCase().trim();

      // Header Tab filter
      if (activeTab === 'cleared') {
        if (stage !== 'cleared' && st !== 'cleared') return false;
      } else if (activeTab === 'in_escrow') {
        if (stage !== 'in_escrow' && st !== 'in escrow' && !(st === 'paid' && stage !== 'cleared')) return false;
      } else if (activeTab === 'due') {
        if (stage !== 'pay_later' && stage !== 'unpaid' && st !== 'due' && st !== 'pending' && st !== 'overdue') return false;
      }

      // Dropdown Stage filter
      if (stageFilter !== 'all') {
        if (stageFilter === 'cleared' && stage !== 'cleared' && st !== 'cleared') return false;
        if (stageFilter === 'in_escrow' && stage !== 'in_escrow' && st !== 'in escrow') return false;
        if (stageFilter === 'due' && stage !== 'pay_later' && stage !== 'unpaid' && st !== 'due' && st !== 'pending') return false;
      }

      // Dropdown Method filter
      if (methodFilter !== 'all') {
        if (methodFilter === 'card' && !method.includes('card') && !method.includes('stripe')) return false;
        if (methodFilter === 'pay_later' && !method.includes('pay_later') && !inv.is_pay_later && stage !== 'pay_later') return false;
        if (methodFilter === 'bank_transfer' && !method.includes('bank') && !method.includes('wire')) return false;
      }

      // Date Range filters
      if (startDate) {
        const invDate = inv.created_at || inv.date || inv.issue_date;
        if (invDate && new Date(invDate) < new Date(startDate)) return false;
      }
      if (endDate) {
        const invDate = inv.created_at || inv.date || inv.issue_date;
        if (invDate && new Date(invDate) > new Date(endDate)) return false;
      }

      return true;
    });
  }, [invoices, activeTab, stageFilter, methodFilter, startDate, endDate]);

  return {
    invoices,
    selectedInvoice,
    setSelectedInvoice,
    isLoading,
    isRefreshing,
    activeTab,
    setActiveTab,
    stageFilter,
    setStageFilter,
    methodFilter,
    setMethodFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredInvoices,
    fetchInvoices,
    handleDownload,
    handleResetFilters,
  };
}
