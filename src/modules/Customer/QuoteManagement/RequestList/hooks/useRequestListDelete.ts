import { useState } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';

export function useRequestListDelete(
    setRequestData: React.Dispatch<React.SetStateAction<any[]>>
) {
    const showToast = useToastStore((state) => state.showToast);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [selectedIdsToDelete, setSelectedIdsToDelete] = useState<(string | number)[] | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteRequestClick = (row: any) => {
        setItemToDelete(row);
        setSelectedIdsToDelete(null);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteSelectedClick = (selectedIds: (number | string)[]) => {
        if (!selectedIds || selectedIds.length === 0) return;
        setSelectedIdsToDelete(selectedIds);
        setItemToDelete(null);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            if (itemToDelete) {
                const rawId = String(itemToDelete.rawId || itemToDelete.id).replace('REQ-', '');
                await apiClient.delete(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${rawId}`);
                setRequestData(prev => prev.filter(item => item.id !== itemToDelete.id));
                showToast(`Quote request ${itemToDelete.id} has been deleted.`, 'success');
            } else if (selectedIdsToDelete && selectedIdsToDelete.length > 0) {
                for (const id of selectedIdsToDelete) {
                    const rawId = String(id).replace('REQ-', '');
                    try {
                        await apiClient.delete(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${rawId}`);
                    } catch {}
                }
                setRequestData(prev => prev.filter(item => !selectedIdsToDelete.includes(item.id)));
                showToast(`${selectedIdsToDelete.length} quote request(s) deleted.`, 'success');
            }
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            setSelectedIdsToDelete(null);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to delete quote request.';
            showToast(msg, 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        itemToDelete,
        selectedIdsToDelete,
        isDeleting,
        handleDeleteRequestClick,
        handleDeleteSelectedClick,
        handleConfirmDelete,
    };
}
