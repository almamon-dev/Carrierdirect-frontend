import { QuoteFormData } from '../types/formTypes';
import { isServiceChecked } from '@/hooks/useCargoServices';

export const buildQuoteRequestFormData = (
    formData: QuoteFormData,
    targetStatus: 'active' | 'pending',
    allServices: Array<{ key: string }>
): FormData => {
    const submitData = new FormData();
    submitData.append('request_title', formData.requestTitle);
    submitData.append('priority', formData.priority || 'Normal');
    submitData.append('shipment_type', formData.shipmentType || 'One Way');
    submitData.append('service_type', formData.serviceType || 'Standard');
    submitData.append('status', targetStatus);

    if (formData.pickupDate) submitData.append('pickup_date', formData.pickupDate);
    if (formData.pickupTime) submitData.append('pickup_time_from', formData.pickupTime);
    if (formData.pickupCompany) submitData.append('pickup_company', formData.pickupCompany);
    if (formData.pickupContactName) submitData.append('pickup_contact_name', formData.pickupContactName);
    if (formData.pickupPhone) submitData.append('pickup_phone', formData.pickupPhone);
    if (formData.pickupEmail) submitData.append('pickup_email', formData.pickupEmail);
    if (formData.pickupAddress) submitData.append('pickup_address', formData.pickupAddress);
    if (formData.pickupCity) submitData.append('pickup_city', formData.pickupCity);
    if (formData.pickupState) submitData.append('pickup_state', formData.pickupState);
    if (formData.pickupCountry) submitData.append('pickup_country', formData.pickupCountry);
    if (formData.pickupZip) submitData.append('pickup_zip', formData.pickupZip);

    if (formData.deliveryDate) submitData.append('delivery_date', formData.deliveryDate);
    if (formData.deliveryTime) submitData.append('delivery_time_from', formData.deliveryTime);
    if (formData.deliveryCompany) submitData.append('delivery_company', formData.deliveryCompany);
    if (formData.deliveryContactName) submitData.append('delivery_contact_name', formData.deliveryContactName);
    if (formData.deliveryPhone) submitData.append('delivery_phone', formData.deliveryPhone);
    if (formData.deliveryEmail) submitData.append('delivery_email', formData.deliveryEmail);
    if (formData.deliveryAddress) submitData.append('delivery_address', formData.deliveryAddress);
    if (formData.deliveryCity) submitData.append('delivery_city', formData.deliveryCity);
    if (formData.deliveryState) submitData.append('delivery_state', formData.deliveryState);
    if (formData.deliveryCountry) submitData.append('delivery_country', formData.deliveryCountry);
    if (formData.deliveryZip) submitData.append('delivery_zip', formData.deliveryZip);

    if (formData.vehicleType) submitData.append('vehicle_type', formData.vehicleType);
    if (formData.loadType) submitData.append('load_type', formData.loadType);
    if (formData.budget) submitData.append('budget', formData.budget.replace(/[^0-9.]/g, ''));
    if (formData.currency) submitData.append('currency', formData.currency);
    if (formData.customerNotes) submitData.append('customer_notes', formData.customerNotes);

    allServices.forEach(srv => {
        if (isServiceChecked(formData, srv.key)) {
            submitData.append(srv.key, '1');
        }
    });

    return submitData;
};
