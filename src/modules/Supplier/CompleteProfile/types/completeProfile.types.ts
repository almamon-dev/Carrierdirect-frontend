export interface OptionItem {
    id: string;
    name: string;
    postal_code?: string;
    country?: string;
    state?: string;
    city?: string;
}

export interface ProfileFormData {
    companyName: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    address: string;
}
