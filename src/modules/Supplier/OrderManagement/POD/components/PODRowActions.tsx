import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
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
        <div className="flex items-center justify-end font-sans" onClick={(e) => e.stopPropagation()}>
            {/* 3-Dots More Options Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={handleOpenMenu}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="More actions"
            >
                <MoreVertical size={16} />
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
