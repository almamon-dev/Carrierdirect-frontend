import React, { useEffect, useState } from 'react';
import { Clock, History, Loader2, ArrowRight, Shield, Smartphone, Monitor, Cpu } from 'lucide-react';
import Modal from '@/components/modals/modal';
import apiClient from '@/lib/axios';
import { DriverItem, DriverAvailabilityLogItem } from '../types/driverAvailability.types';

interface DriverAvailabilityHistoryModalProps {
    isOpen: boolean;
    driver: DriverItem;
    onClose: () => void;
}

export const DriverAvailabilityHistoryModal: React.FC<DriverAvailabilityHistoryModalProps> = ({
    isOpen,
    driver,
    onClose,
}) => {
    const [logs, setLogs] = useState<DriverAvailabilityLogItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !driver.id) return;
        let isMounted = true;
        setIsLoading(true);
        setError(null);

        apiClient
            .get(`/supplier/availability/drivers/${driver.id}/history`)
            .then((res) => {
                if (!isMounted) return;
                const data = res.data?.data?.history || res.data?.history || res.data?.data || [];
                setLogs(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error('Failed to load availability history:', err);
                setError(err.response?.data?.message || 'Failed to load availability history.');
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen, driver.id]);

    if (!driver) return null;

    const renderSourceIcon = (source: string) => {
        switch (source) {
            case 'driver_app':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        <Smartphone size={12} />
                        Driver App
                    </span>
                );
            case 'supplier_dashboard':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                        <Monitor size={12} />
                        Supplier
                    </span>
                );
            case 'system':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                        <Cpu size={12} />
                        System (Auto)
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                        <Shield size={12} />
                        {source || 'Admin'}
                    </span>
                );
        }
    };

    const renderStatusBadge = (status: string | null, type: 'duty' | 'job') => {
        if (!status) return <span className="text-slate-400 text-xs">—</span>;

        const s = String(status).toLowerCase();
        let bgClass = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

        if (s === 'online' || s === 'available') {
            bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800';
        } else if (s === 'on_job' || s === 'on job') {
            bgClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800';
        } else if (s === 'break' || s === 'on break') {
            bgClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800';
        } else if (s === 'offline') {
            bgClass = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        }

        return (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-bold border capitalize ${bgClass}`}>
                {status.replace(/_/g, ' ')}
            </span>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            title={
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0">
                        <History size={16} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            Availability History & Audit Log
                        </h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {driver.name} {driver.employee_id ? `(${driver.employee_id})` : ''} • Real-time status transitions
                        </p>
                    </div>
                </div>
            }
        >
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[70vh]">
                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <Loader2 size={24} className="animate-spin text-[#ff4a1f]" />
                        <span className="text-xs">Loading audit logs...</span>
                    </div>
                ) : error ? (
                    <div className="p-4 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-600 dark:text-rose-400">
                        {error}
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-1">
                        <Clock size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No status changes recorded yet</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            Changes made via the Driver App, Supplier Dashboard, or dispatch events will be logged here.
                        </p>
                    </div>
                ) : (
                    <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3.5 space-y-4 py-2">
                        {logs.map((log) => {
                            const formattedDate = new Date(log.created_at).toLocaleString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            });

                            return (
                                <div key={log.id} className="relative pl-5 group">
                                    {/* Dot */}
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white dark:bg-[#1e2329] border-2 border-[#ff4a1f]" />

                                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-[6px] border border-slate-200/80 dark:border-slate-700/80 p-3 space-y-2">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="flex items-center gap-2">
                                                {renderSourceIcon(log.source)}
                                                {log.changed_by_name && (
                                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                                        by <span className="font-semibold text-slate-700 dark:text-slate-200">{log.changed_by_name}</span> ({log.user_role || 'Staff'})
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                {formattedDate}
                                            </span>
                                        </div>

                                        {/* Status transition cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                                            {/* Duty Status Transition */}
                                            <div className="flex items-center gap-2 bg-white dark:bg-[#191e24] px-2.5 py-1.5 rounded border border-slate-100 dark:border-slate-800">
                                                <span className="text-[11px] text-slate-400 font-medium w-18">Duty Status:</span>
                                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                    {renderStatusBadge(log.previous_duty_status, 'duty')}
                                                    <ArrowRight size={11} className="text-slate-300 dark:text-slate-600 shrink-0" />
                                                    {renderStatusBadge(log.new_duty_status, 'duty')}
                                                </div>
                                            </div>

                                            {/* Job Status Transition */}
                                            <div className="flex items-center gap-2 bg-white dark:bg-[#191e24] px-2.5 py-1.5 rounded border border-slate-100 dark:border-slate-800">
                                                <span className="text-[11px] text-slate-400 font-medium w-18">Job Status:</span>
                                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                    {renderStatusBadge(log.previous_job_status, 'job')}
                                                    <ArrowRight size={11} className="text-slate-300 dark:text-slate-600 shrink-0" />
                                                    {renderStatusBadge(log.new_job_status, 'job')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meta: Reason or Associated Order/Leg */}
                                        {(log.change_reason || log.order_id || log.shipment_leg_id) && (
                                            <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-1">
                                                {log.change_reason && (
                                                    <span className="italic">
                                                        Reason: "{log.change_reason}"
                                                    </span>
                                                )}
                                                {log.order_id && (
                                                    <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono text-[10px]">
                                                        Shipment #{log.order_id} {log.shipment_leg_id ? `(Leg ${log.shipment_leg_id})` : ''}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default DriverAvailabilityHistoryModal;
