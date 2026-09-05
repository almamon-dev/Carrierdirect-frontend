import React from 'react';
import { QuoteFormData } from '../../CreateRequest/types/formTypes';

export function useEditQuoteFormHandlers(
    formData: QuoteFormData,
    setFormData: React.Dispatch<React.SetStateAction<QuoteFormData>>
) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof QuoteFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: keyof QuoteFormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const addDimension = () => {
        setFormData(prev => ({
            ...prev,
            dimensions: [
                ...prev.dimensions,
                { id: Date.now(), length: '', width: '', height: '', qty: '1', unit: 'CM' }
            ]
        }));
    };

    const removeDimension = (id: number) => {
        if (formData.dimensions.length === 1) return;
        setFormData(prev => ({
            ...prev,
            dimensions: prev.dimensions.filter(d => d.id !== id)
        }));
    };

    const updateDimension = (id: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            dimensions: prev.dimensions.map(d => (d.id === id ? { ...d, [field]: value } : d))
        }));
    };

    return {
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        addDimension,
        removeDimension,
        updateDimension,
    };
}
