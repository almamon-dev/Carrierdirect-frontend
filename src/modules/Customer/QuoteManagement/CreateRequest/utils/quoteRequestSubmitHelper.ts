import { QuoteFormData } from '../types/formTypes';
import { isServiceChecked } from '@/hooks/useCargoServices';

export const buildQuoteRequestFormData = (
    formData: QuoteFormData,
    targetStatus: 'active' | 'pending',
    allServices: Array<{ key: string }>
): FormData => {
    const submitData = new FormData();
    submitData.append('request_title', formData.requestTitle || '');
    submitData.append('priority', formData.priority || 'Normal');
    submitData.append('shipment_type', formData.shipmentType || 'One Way');
    submitData.append('service_type', formData.serviceType || 'Standard');
    submitData.append('status', targetStatus);
    if (formData.expectedTransitTime) submitData.append('expected_transit_time', formData.expectedTransitTime);

    if (formData.pickupDate) submitData.append('pickup_date', formData.pickupDate);
    if (formData.pickupTime) submitData.append('pickup_time_from', formData.pickupTime);
    if (formData.pickupTimeTill) submitData.append('pickup_time_till', formData.pickupTimeTill);
    if (formData.pickupCompany) submitData.append('pickup_company', formData.pickupCompany);
    if (formData.pickupContactName) submitData.append('pickup_contact_name', formData.pickupContactName);
    if (formData.pickupPhone) submitData.append('pickup_phone', formData.pickupPhone);
    if (formData.pickupEmail) submitData.append('pickup_email', formData.pickupEmail);
    if (formData.pickupAddress) submitData.append('pickup_address', formData.pickupAddress);
    if (formData.pickupCity) submitData.append('pickup_city', formData.pickupCity);
    if (formData.pickupState) submitData.append('pickup_state', formData.pickupState);
    if (formData.pickupCountry) submitData.append('pickup_country', formData.pickupCountry);
    if (formData.pickupZip) submitData.append('pickup_zip', formData.pickupZip);
    if (formData.pickupInstructions) submitData.append('pickup_instructions', formData.pickupInstructions);
    if (formData.pickupLat !== undefined && formData.pickupLat !== null && formData.pickupLat !== '') submitData.append('pickup_lat', String(formData.pickupLat));
    if (formData.pickupLng !== undefined && formData.pickupLng !== null && formData.pickupLng !== '') submitData.append('pickup_lng', String(formData.pickupLng));

    if (formData.deliveryDate) submitData.append('delivery_date', formData.deliveryDate);
    if (formData.deliveryTime) submitData.append('delivery_time_from', formData.deliveryTime);
    if (formData.deliveryTimeTill) submitData.append('delivery_time_till', formData.deliveryTimeTill);
    if (formData.deliveryCompany) submitData.append('delivery_company', formData.deliveryCompany);
    if (formData.deliveryContactName) submitData.append('delivery_contact_name', formData.deliveryContactName);
    if (formData.deliveryPhone) submitData.append('delivery_phone', formData.deliveryPhone);
    if (formData.deliveryEmail) submitData.append('delivery_email', formData.deliveryEmail);
    if (formData.deliveryAddress) submitData.append('delivery_address', formData.deliveryAddress);
    if (formData.deliveryCity) submitData.append('delivery_city', formData.deliveryCity);
    if (formData.deliveryState) submitData.append('delivery_state', formData.deliveryState);
    if (formData.deliveryCountry) submitData.append('delivery_country', formData.deliveryCountry);
    if (formData.deliveryZip) submitData.append('delivery_zip', formData.deliveryZip);
    if (formData.deliveryInstructions) submitData.append('delivery_instructions', formData.deliveryInstructions);
    if (formData.deliveryLat !== undefined && formData.deliveryLat !== null && formData.deliveryLat !== '') submitData.append('delivery_lat', String(formData.deliveryLat));
    if (formData.deliveryLng !== undefined && formData.deliveryLng !== null && formData.deliveryLng !== '') submitData.append('delivery_lng', String(formData.deliveryLng));
    if (formData.distanceKm !== undefined && formData.distanceKm !== null && formData.distanceKm !== '') {
        submitData.append('distance_km', String(formData.distanceKm));
    }

    if (formData.vehicleType) submitData.append('vehicle_type', formData.vehicleType);
    if (formData.loadType) submitData.append('load_type', formData.loadType);
    if (formData.itemsCount) submitData.append('items_count', String(formData.itemsCount));
    if (formData.palletsCount) submitData.append('pallets_count', String(formData.palletsCount));
    if (formData.weight) submitData.append('weight', String(formData.weight));
    if (formData.volume) submitData.append('volume', String(formData.volume));

    // Dimensions table / items
    if (Array.isArray(formData.dimensions) && formData.dimensions.length > 0) {
        const validDims = formData.dimensions.filter(d => d.length || d.width || d.height || d.qty || d.unit);
        if (validDims.length > 0) {
            validDims.forEach((dim, index) => {
                submitData.append(`items[${index}][item_type]`, formData.loadType || 'Package');
                submitData.append(`items[${index}][quantity]`, dim.qty || '1');
                if (dim.length) submitData.append(`items[${index}][length]`, dim.length);
                if (dim.width) submitData.append(`items[${index}][width]`, dim.width);
                if (dim.height) submitData.append(`items[${index}][height]`, dim.height);
                submitData.append(`items[${index}][unit]`, dim.unit || 'CM');
            });
        }
    }

    if (formData.budget) submitData.append('budget', formData.budget.replace(/[^0-9.]/g, ''));
    if (formData.currency) submitData.append('currency', formData.currency);
    submitData.append('allow_negotiation', formData.allowNegotiation ? '1' : '0');
    submitData.append('receive_multiple', formData.receiveMultiple ? '1' : '0');
    if (formData.autoExpire) submitData.append('auto_expire', formData.autoExpire);

    if (formData.customerNotes) submitData.append('customer_notes', formData.customerNotes);
    if (formData.specialInstructions) submitData.append('special_instructions', formData.specialInstructions);
    if (formData.internalReference) submitData.append('internal_reference', formData.internalReference);

    // Dynamic services and cargo requirements
    allServices.forEach(srv => {
        if (isServiceChecked(formData, srv.key)) {
            submitData.append(srv.key, '1');
        } else {
            submitData.append(srv.key, '0');
        }
    });

    // File attachments
    if (formData.packingList instanceof File) {
        submitData.append('packing_list', formData.packingList);
    }
    if (formData.invoice instanceof File) {
        submitData.append('invoice', formData.invoice);
    }
    if (Array.isArray(formData.images)) {
        formData.images.forEach((img) => {
            if (img instanceof File) {
                submitData.append('images[]', img);
            }
        });
    }

    return submitData;
};
