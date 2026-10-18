import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { PaymentFilterTab } from '../components/PaymentFilterTabs';

export function useSupplierPaymentsState() {
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Tab & Custom Filters
  const [activeTab, setActiveTab] = useState<PaymentFilterTab>('all');
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

  const fetchPayments = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const res = await apiClient.get('/supplier/finance/payments').catch(() => apiClient.get('/supplier/payments'));
      const resData = res?.data || res;
      const list = resData?.data?.history 
        || resData?.data?.items 
        || resData?.data?.data 
        || resData?.history 
        || resData?.items 
        || (Array.isArray(resData?.data) ? resData?.data : null) 
        || (Array.isArray(resData) ? resData : []);
      
      setPayments(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch supplier payments:', error);
      setPayments([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDownload = async (row: any) => {
    const invId = row.raw_id || row.id;
    if (!invId) {
      alert('No invoice ID associated with this payout.');
      return;
    }
    try {
      const response = await fetch(`${apiClient['baseURL'] || ''}/supplier/finance/invoices/${invId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Accept': 'application/pdf',
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-Receipt-${row.invoice_number || row.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Failed to download payment receipt:', err);
      alert('Failed to download payment receipt.');
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const stage = String(item.payment_stage || '').toLowerCase().trim();
      const st = String(item.raw_status || item.status || '').toLowerCase().trim();
      const isPayLater = item.is_pay_later || stage === 'pay_later' || st.includes('pay later') || (item.payment_method || '').toLowerCase().includes('pay_later');
      const method = String(item.payment_method || '').toLowerCase().trim();

      // Header Tab filter
      if (activeTab === 'cleared') {
        if (!item.is_cleared && stage !== 'cleared' && st !== 'paid' && st !== 'cleared' && st !== 'released') return false;
      } else if (activeTab === 'escrow') {
        if (!item.is_in_escrow && stage !== 'escrow' && stage !== 'in_escrow') return false;
      } else if (activeTab === 'pay_later') {
        if (!isPayLater) return false;
      } else if (activeTab === 'pending') {
        if (item.is_cleared || (stage !== 'unpaid' && st !== 'pending' && st !== 'due')) return false;
      }

      // Dropdown Stage filter
      if (stageFilter !== 'all') {
        if (stageFilter === 'cleared' && !item.is_cleared && stage !== 'cleared' && st !== 'cleared') return false;
        if (stageFilter === 'escrow' && !item.is_in_escrow && stage !== 'in_escrow') return false;
        if (stageFilter === 'pay_later' && !isPayLater) return false;
        if (stageFilter === 'pending' && (item.is_cleared || (stage !== 'unpaid' && st !== 'pending'))) return false;
      }

      // Dropdown Method filter
      if (methodFilter !== 'all') {
        if (methodFilter === 'card' && !method.includes('card') && !method.includes('stripe')) return false;
        if (methodFilter === 'pay_later' && !isPayLater) return false;
        if (methodFilter === 'bank_transfer' && !method.includes('bank') && !method.includes('wire')) return false;
      }

      // Date Range filters
      if (startDate) {
        const itemDate = item.date || item.created_at || item.issue_date;
        if (itemDate && new Date(itemDate) < new Date(startDate)) return false;
      }
      if (endDate) {
        const itemDate = item.date || item.created_at || item.issue_date;
        if (itemDate && new Date(itemDate) > new Date(endDate)) return false;
      }

      return true;
    });
  }, [payments, activeTab, stageFilter, methodFilter, startDate, endDate]);

  return {
    payments,
    selectedPayment,
    setSelectedPayment,
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
    filteredPayments,
    fetchPayments,
    handleDownload,
    handleResetFilters,
  };
}
