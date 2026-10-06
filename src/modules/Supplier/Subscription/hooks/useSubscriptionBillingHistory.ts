import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios";
import { SubscriptionBillingHistoryItem } from "../types";

export const useSubscriptionBillingHistory = () => {
  const [invoices, setInvoices] = useState<SubscriptionBillingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get("/supplier/subscription/invoices").catch(() => null)
        || await apiClient.get("/subscription/invoices").catch(() => null);

      let list: SubscriptionBillingHistoryItem[] = [];
      if (Array.isArray(res?.data?.data?.items)) {
        list = res.data.data.items;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res?.data?.items)) {
        list = res.data.items;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      }

      setInvoices(list);
    } catch (err) {
      console.error("Failed to fetch subscription invoices:", err);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const downloadReceipt = async (item: SubscriptionBillingHistoryItem) => {
    setDownloadingId(item.id);
    try {
      const response = await apiClient.get(
        `/supplier/subscription/invoices/${item.id}/download`,
        { responseType: "blob" }
      ).catch(async () => {
        return await apiClient.get(
          `/subscription/invoices/${item.id}/download`,
          { responseType: "blob" }
        );
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${item.invoice_number || item.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download subscription receipt PDF:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  return {
    invoices,
    isLoading,
    downloadingId,
    fetchInvoices,
    downloadReceipt,
  };
};

export default useSubscriptionBillingHistory;
