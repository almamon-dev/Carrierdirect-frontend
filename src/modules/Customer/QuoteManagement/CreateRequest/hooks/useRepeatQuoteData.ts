import { useState, useEffect } from 'react';
import { QuoteFormData } from '../types/formTypes';

export const useRepeatQuoteData = (
    repeatData: any,
    setFormData: React.Dispatch<React.SetStateAction<QuoteFormData>>
) => {
    const [isRepeatMode, setIsRepeatMode] = useState(false);
    const [repeatSource, setRepeatSource] = useState('');

    useEffect(() => {
        if (!repeatData) return;

        setIsRepeatMode(true);
        const sourceId = repeatData.id || repeatData.requestId || 'Previous Order';
        setRepeatSource(sourceId);

        const pickupCityName = repeatData.pickup?.city || repeatData.pickupCity || (typeof repeatData.pickup === 'string' ? repeatData.pickup : '') || (repeatData.route ? repeatData.route.split('→')[0]?.trim() : '') || 'Dhaka';
        const deliveryCityName = repeatData.delivery?.city || repeatData.deliveryCity || (typeof repeatData.delivery === 'string' ? repeatData.delivery : '') || (repeatData.route ? repeatData.route.split('→')[1]?.trim() : '') || 'Chittagong';
        const rawBudget = repeatData.pricing?.total ? String(repeatData.pricing.total) : (repeatData.amount ? String(repeatData.amount).replace(/[^0-9.]/g, '') : (repeatData.lowestBid ? String(repeatData.lowestBid) : ''));

        setFormData(prev => ({
            ...prev,
            requestTitle: repeatData.requestTitle || (repeatData.route ? `Repeat Shipment: ${repeatData.route}` : `Repeat Order Request (${sourceId})`),
            priority: repeatData.priority || 'Normal',
            shipmentType: repeatData.shipmentType || 'One Way',
            serviceType: repeatData.serviceType || 'Standard',
            pickupDate: repeatData.pickupDate || repeatData.logistics?.pickupDate || '',
            pickupTime: repeatData.pickupTime || '09:00',
            deliveryDate: repeatData.deliveryDate || repeatData.logistics?.deliveryDate || '',
            deliveryTime: repeatData.deliveryTime || '17:00',
            expectedTransitTime: repeatData.expectedTransitTime || repeatData.logistics?.transitTime || '',
            pickupCompany: repeatData.pickup?.company || repeatData.pickupCompany || '',
            pickupContactName: repeatData.pickup?.contact || repeatData.pickupContactName || '',
            pickupPhone: repeatData.pickupPhone || '',
            pickupEmail: repeatData.pickupEmail || '',
            pickupCountry: repeatData.pickupCountry || 'Bangladesh',
            pickupState: repeatData.pickupState || '',
            pickupCity: pickupCityName,
            deliveryCompany: repeatData.delivery?.company || repeatData.deliveryCompany || '',
            deliveryContactName: repeatData.delivery?.contact || repeatData.deliveryContactName || '',
            deliveryPhone: repeatData.deliveryPhone || '',
            deliveryEmail: repeatData.deliveryEmail || '',
            deliveryCountry: repeatData.deliveryCountry || 'Bangladesh',
            deliveryState: repeatData.deliveryState || '',
            deliveryCity: deliveryCityName,
            vehicleType: repeatData.vehicle || repeatData.logistics?.vehicleType || '',
            loadType: repeatData.load || '',
            weight: repeatData.weight ? String(repeatData.weight).replace(/[^0-9.]/g, '') : '',
            volume: repeatData.volume ? String(repeatData.volume).replace(/[^0-9.]/g, '') : '',
            budget: rawBudget,
            customerNotes: repeatData.notes || repeatData.customerNotes || '',
            internalReference: repeatData.internalReference || `REPEAT-${sourceId}`,
        }));
    }, [repeatData, setFormData]);

    return { isRepeatMode, setIsRepeatMode, repeatSource, setRepeatSource };
};
