import { useState, useEffect, useMemo, useRef } from 'react';
import { useCargoServices } from '@/hooks/useCargoServices';
import { ExtraChargeItem, getServiceIcon } from './counterOfferModalConstants';
import {
    buildMergedAvailableCharges,
    isChargeActive,
    getChargeMeta,
    toggleCommonCharge,
    formatCounterOfferNote
} from './counterOfferChargeHelpers';

interface UseCounterOfferFormProps {
    isOpen: boolean;
    initialAmount?: number | string;
    initialBaseFreight?: number | string;
    originalOfferAmount?: number | string;
    currency?: string;
    isSupplier?: boolean;
    propExtraCharges?: any[];
    onSubmit: (amount: number, note: string, extraCharges?: ExtraChargeItem[], baseFreight?: number) => void;
    onClose: () => void;
}

export function useCounterOfferForm({
    isOpen,
    initialAmount,
    initialBaseFreight,
    originalOfferAmount,
    currency = '€',
    isSupplier = false,
    propExtraCharges = [],
    onSubmit,
    onClose,
}: UseCounterOfferFormProps) {
    const { allServices } = useCargoServices();

    const availableCharges = useMemo(() => {
        return buildMergedAvailableCharges(allServices);
    }, [allServices]);

    const origTotalNum = useMemo(() => {
        const raw = originalOfferAmount ?? initialAmount;
        if (!raw) return 0;
        return typeof raw === 'number' ? raw : parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 0;
    }, [originalOfferAmount, initialAmount]);

    const initialExtrasSum = useMemo(() => {
        return (propExtraCharges && propExtraCharges.length > 0)
            ? propExtraCharges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
            : 0;
    }, [propExtraCharges]);

    const origBaseNum = useMemo(() => {
        if (initialBaseFreight !== undefined && initialBaseFreight !== null) {
            const parsed = typeof initialBaseFreight === 'number' ? initialBaseFreight : parseFloat(String(initialBaseFreight).replace(/[^0-9.]/g, '')) || 0;
            if (parsed > 0 && initialExtrasSum > 0 && parsed < origTotalNum) return parsed;
            if (parsed > 0 && initialExtrasSum === 0) return parsed;
        }
        if (initialExtrasSum > 0 && origTotalNum > initialExtrasSum) {
            return origTotalNum - initialExtrasSum;
        }
        return origTotalNum;
    }, [initialBaseFreight, origTotalNum, initialExtrasSum]);

    const [proposedPrice, setProposedPrice] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [supplierExtras, setSupplierExtras] = useState<ExtraChargeItem[]>([]);
    const [showAddCustom, setShowAddCustom] = useState(false);
    const [customChargeName, setCustomChargeName] = useState('');
    const [customChargeAmount, setCustomChargeAmount] = useState('');

    const prevIsOpenRef = useRef(false);

    useEffect(() => {
        if (isOpen && !prevIsOpenRef.current) {
            const initialExtras: ExtraChargeItem[] = (propExtraCharges && propExtraCharges.length > 0)
                ? propExtraCharges.map(c => ({
                    id: c.id,
                    type: c.type || c.label || c.name || c.customName || c.custom_name || 'Custom',
                    customName: c.customName || c.custom_name || c.label || c.title || c.type,
                    amount: Number(c.amount || 0)
                }))
                : [];

            setSupplierExtras(initialExtras);
            const initialPrice = isSupplier ? origBaseNum : origTotalNum;
            setProposedPrice(initialPrice > 0 ? String(initialPrice) : '');
            setNotes('');
            setShowAddCustom(false);
            setCustomChargeName('');
            setCustomChargeAmount('');
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, propExtraCharges, origTotalNum, origBaseNum, isSupplier]);

    const totalExtrasAmount = useMemo(() => {
        return supplierExtras.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    }, [supplierExtras]);

    const finalAmountNum = isSupplier
        ? (Number(proposedPrice) || 0) + totalExtrasAmount
        : (Number(proposedPrice) || 0);

    const activeTypesForSelect = useMemo(() => {
        return availableCharges
            .filter(c => isChargeActive(c, supplierExtras))
            .map(c => c.type);
    }, [availableCharges, supplierExtras]);

    const selectOptions = useMemo(() => {
        return availableCharges.map(item => ({
            id: item.type,
            value: item.type,
            name: item.label,
            label: item.label,
            icon: item.icon || getServiceIcon(item.label || item.type),
        }));
    }, [availableCharges]);

    const handleToggleCommonCharge = (chargeDef: any) => {
        setSupplierExtras(prev => toggleCommonCharge(prev, chargeDef));
    };

    const handleSelectDropdownService = (selectedVal: any) => {
        let valStr = '';
        if (Array.isArray(selectedVal?.value)) {
            const lastItem = selectedVal.value[selectedVal.value.length - 1];
            valStr = String(lastItem || '');
        } else if (typeof selectedVal === 'object') {
            valStr = selectedVal?.target?.value || selectedVal?.value || '';
        } else {
            valStr = String(selectedVal || '');
        }
        if (!valStr) return;
        if (valStr === 'Custom') {
            setShowAddCustom(true);
            return;
        }
        const match = availableCharges.find(c => c.type === valStr || c.label === valStr);
        if (match) handleToggleCommonCharge(match);
    };

    const handleUpdateExtraAmount = (index: number, newAmount: string) => {
        const val = parseFloat(newAmount);
        setSupplierExtras(prev => prev.map((e, idx) => (idx === index) ? { ...e, amount: isNaN(val) ? 0 : val } : e));
    };

    const handleRemoveExtra = (index: number) => {
        setSupplierExtras(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleAddCustomCharge = () => {
        if (!customChargeName.trim() || !customChargeAmount) return;
        const amt = parseFloat(customChargeAmount) || 0;
        setSupplierExtras(prev => [
            ...prev,
            { type: `Custom-${Date.now()}`, customName: customChargeName.trim(), amount: amt }
        ]);
        setCustomChargeName('');
        setCustomChargeAmount('');
        setShowAddCustom(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (finalAmountNum <= 0) return;

        const formattedNote = formatCounterOfferNote(notes, isSupplier, supplierExtras, currency, proposedPrice);
        const proposedBase = isSupplier
            ? (Number(proposedPrice) || 0)
            : (totalExtrasAmount > 0 && finalAmountNum > totalExtrasAmount ? finalAmountNum - totalExtrasAmount : finalAmountNum);
        onSubmit(finalAmountNum, formattedNote, supplierExtras, proposedBase);
        onClose();
    };

    return {
        origTotalNum,
        proposedPrice,
        setProposedPrice,
        notes,
        setNotes,
        supplierExtras,
        showAddCustom,
        setShowAddCustom,
        customChargeName,
        setCustomChargeName,
        customChargeAmount,
        setCustomChargeAmount,
        finalAmountNum,
        activeTypesForSelect,
        selectOptions,
        getChargeMeta: (extra: ExtraChargeItem) => getChargeMeta(extra, availableCharges),
        handleSelectDropdownService,
        handleUpdateExtraAmount,
        handleRemoveExtra,
        handleAddCustomCharge,
        handleSubmit,
    };
}
