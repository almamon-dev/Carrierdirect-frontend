import { QuoteFormData } from '../types/formTypes';

export function validateCreateQuoteForm(formData: QuoteFormData): Record<string, string> {
  const errs: Record<string, string> = {};

  // 1. General Info
  if (!formData.requestTitle?.trim()) {
    errs.requestTitle = 'Request title is required.';
  }
  if (!formData.priority) {
    errs.priority = 'Priority is required.';
  }
  if (!formData.shipmentType) {
    errs.shipmentType = 'Shipment type is required.';
  }
  if (!formData.serviceType) {
    errs.serviceType = 'Service type is required.';
  }
  const todayStr = new Date().toISOString().split('T')[0];
  if (!formData.pickupDate) {
    errs.pickupDate = 'Pickup date is required.';
  } else if (formData.pickupDate < todayStr) {
    errs.pickupDate = 'Pickup date cannot be in the past.';
  }
  if (!formData.pickupTime) {
    errs.pickupTime = 'Pickup time is required.';
  }
  if (!formData.deliveryDate) {
    errs.deliveryDate = 'Delivery date is required.';
  } else if (formData.deliveryDate < todayStr) {
    errs.deliveryDate = 'Delivery date cannot be in the past.';
  } else if (formData.pickupDate && formData.deliveryDate < formData.pickupDate) {
    errs.deliveryDate = 'Delivery date must be on or after the pickup date.';
  }

  // 2. Locations Info
  if (!formData.pickupContactName?.trim()) {
    errs.pickupContactName = 'Contact person name is required.';
  }
  if (!formData.pickupPhone?.trim()) {
    errs.pickupPhone = 'Phone number is required.';
  }
  if (!formData.pickupCountry?.trim()) {
    errs.pickupCountry = 'Country is required.';
  }
  if (!formData.pickupCity?.trim()) {
    errs.pickupCity = 'City is required.';
  }
  if (!formData.pickupAddress?.trim()) {
    errs.pickupAddress = 'Full pickup address is required.';
  }

  if (!formData.deliveryContactName?.trim()) {
    errs.deliveryContactName = 'Contact person name is required.';
  }
  if (!formData.deliveryPhone?.trim()) {
    errs.deliveryPhone = 'Phone number is required.';
  }
  if (!formData.deliveryCountry?.trim()) {
    errs.deliveryCountry = 'Country is required.';
  }
  if (!formData.deliveryCity?.trim()) {
    errs.deliveryCity = 'City is required.';
  }
  if (!formData.deliveryAddress?.trim()) {
    errs.deliveryAddress = 'Full delivery address is required.';
  }

  // 3. Load & Specs
  if (!formData.vehicleType?.trim()) {
    errs.vehicleType = 'Vehicle type is required.';
  }
  if (!formData.loadType?.trim()) {
    errs.loadType = 'Load type is required.';
  }
  if (!formData.weight || isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
    errs.weight = 'Weight is required and must be greater than 0.';
  }

  const hasValidDimension =
    Array.isArray(formData.dimensions) &&
    formData.dimensions.some(
      (dim) =>
        Number(dim.length) > 0 &&
        Number(dim.width) > 0 &&
        Number(dim.height) > 0 &&
        Number(dim.qty) > 0
    );
  if (!hasValidDimension) {
    errs.dimensions = 'At least one complete cargo dimension (Length, Width, Height, and Qty) is required.';
  }

  return errs;
}

export const MANDATORY_FORM_FIELDS = [
  'requestTitle',
  'priority',
  'shipmentType',
  'serviceType',
  'pickupDate',
  'pickupTime',
  'deliveryDate',
  'pickupContactName',
  'pickupPhone',
  'pickupCountry',
  'pickupCity',
  'pickupAddress',
  'deliveryContactName',
  'deliveryPhone',
  'deliveryCountry',
  'deliveryCity',
  'deliveryAddress',
  'vehicleType',
  'loadType',
  'weight',
  'dimensions',
];
