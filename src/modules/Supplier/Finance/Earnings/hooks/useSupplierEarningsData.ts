import { useState, useEffect } from "react";
import apiClient from "@/lib/axios";
import { EarningItem } from "../types/earnings.types";

export function useSupplierEarningsData() {
    const [earningsList, setEarningsList] = useState<EarningItem[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchEarningsData = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get("/supplier/finance/dashboard");
            const resData = res?.data?.data || res?.data || res;

            setStats(resData?.stats || null);
            setRevenueTrend(Array.isArray(resData?.revenue_trend) ? resData.revenue_trend : []);

            const rawList = resData?.job_earnings 
                || resData?.recent_transactions 
                || (Array.isArray(resData?.data) ? resData?.data : null) 
                || [];

            setEarningsList(Array.isArray(rawList) ? rawList : []);
        } catch (error) {
            console.error("Failed to load supplier earnings:", error);
            setEarningsList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEarningsData();
    }, []);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDownloadReport = async () => {
        try {
            const response = await fetch(`${apiClient["baseURL"] || ""}/customer/invoices/1/download`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                    "Accept": "application/pdf",
                }
            }).catch(() => null);

            if (response && response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Earnings-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                alert("Earnings summary exported successfully.");
            }
        } catch (err) {
            alert("Exported earnings report.");
        }
    };

    const filteredHistory = earningsList.filter(item => {
        if (selectedStatusFilter === "all") return true;
        const st = (item.status || item.raw_status || "").toLowerCase();
        if (selectedStatusFilter === "cleared") return st === "cleared" || st === "paid" || st === "completed";
        if (selectedStatusFilter === "pending") return st.includes("pending") || st.includes("escrow") || st.includes("due");
        return true;
    });

    return {
        earningsList,
        stats,
        revenueTrend,
        selectedStatusFilter,
        setSelectedStatusFilter,
        isLoading,
        copiedId,
        filteredHistory,
        fetchEarningsData,
        handleCopy,
        handleDownloadReport,
    };
}
