import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Upload, MoreVertical, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/button';
import { PODOrderItem } from '../types';
import PODActionsMenu from './PODActionsMenu';

interface PODRowActionsProps {
    row: PODOrderItem;
    onPreviewPOD: (order: PODOrderItem) => void;
    onUploadPOD: (order: PODOrderItem) => void;
}

export const PODRowActions: React.FC<PODRowActionsProps> = ({
    row,
    onPreviewPOD,
    onUploadPOD,
}) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [copied, setCopied] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const hasPod = row.has_pod;
    const isRejected = row.pod_status === 'Rejected';

    const handleOpenMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (dropdownOpen) {
            setDropdownOpen(false);
            return;
        }
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
            const menuHeight = 240;
            const spaceBelow = window.innerHeight - rect.bottom;
            const top = spaceBelow < menuHeight
                ? rect.top + window.scrollY - menuHeight
                : rect.bottom + window.scrollY + 4;
            const left = Math.max(10, rect.right + window.scrollX - 208);
            setDropdownPos({ top, left });
        }
        setDropdownOpen(true);
    };

    const handleClose = () => setDropdownOpen(false);

    const handleViewDetails = () => {
        navigate(`/supplier/orders/details/${row.slug || row.id}`, { state: { orderData: row } });
    };

    const handleTrackOrder = () => {
        navigate(`/supplier/orders/details/${row.slug || row.id}`, { state: { orderData: row, openTab: 'tracking' } });
    };

    const handleDownloadPOD = () => {
        const url = row.pod_document_url || row.pod_file_url;
        if (url) window.open(url, '_blank');
        else alert('POD file ready for download.');
    };

    const handleCopyId = () => {
        const idText = row.order_id || row.order_no || row.order_number || String(row.id);
        navigator.clipboard.writeText(idText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-end gap-1.5 font-sans" onClick={(e) => e.stopPropagation()}>
            {/* Inline Quick Action Button */}
            {hasPod && !isRejected ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewPOD(row)}
                    className="h-7 px-2.5 text-xs font-semibold flex items-center gap-1 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                    <Eye size={13} className="text-slate-500" />
                    <span>Preview</span>
                </Button>
            ) : isRejected ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUploadPOD(row)}
                    className="h-7 px-2.5 text-xs font-bold flex items-center gap-1 cursor-pointer text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                >
                    <RotateCcw size={13} />
                    <span>Re-upload</span>
                </Button>
            ) : (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onUploadPOD(row)}
                    className="h-7 px-2.5 text-xs font-bold flex items-center gap-1 cursor-pointer bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs"
                >
                    <Upload size={13} />
                    <span>Upload</span>
                </Button>
            )}

            {/* 3-Dots More Options Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={handleOpenMenu}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="More actions"
            >
                <MoreVertical size={15} />
            </button>

            {/* Popup Menu */}
            <PODActionsMenu
                isOpen={dropdownOpen}
                dropdownPos={dropdownPos}
                copied={copied}
                row={row}
                onClose={handleClose}
                onPreviewPOD={() => onPreviewPOD(row)}
                onUploadPOD={() => onUploadPOD(row)}
                onViewDetails={handleViewDetails}
                onTrackOrder={handleTrackOrder}
                onDownloadPOD={handleDownloadPOD}
                onCopyId={handleCopyId}
            />
        </div>
    );
};

export default PODRowActions;
