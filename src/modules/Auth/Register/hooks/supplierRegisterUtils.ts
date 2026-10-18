export interface SupplierFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    insuranceType: string;
    customInsuranceType: string;
    insuranceProviderName: string;
    policyNumber: string;
    policyExpiryDate: string;
    insuranceDocument: any;
    licenses: any;
}

export const isPolicyDateValid = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
};

export const getRegisterSessionId = (): string => {
    let sid = sessionStorage.getItem('supplier_register_session_id');
    if (!sid) {
        const randHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        sid = `sess_${randHex}_${Date.now()}`;
        sessionStorage.setItem('supplier_register_session_id', sid);
    }
    return sid;
};

export const validateStep1 = (data: SupplierFormData): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!data.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!data.email.trim()) {
        errs.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errs.email = 'Please enter a valid email address';
    }
    if (!data.password) {
        errs.password = 'Password is required';
    } else if (data.password.length < 8) {
        errs.password = 'Password must be at least 8 characters';
    }
    if (!data.confirmPassword) {
        errs.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
};

export const validateStep2 = (
    data: SupplierFormData,
    isOther: boolean,
    agreed: boolean
): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!data.insuranceType) {
        errs.insuranceType = 'Insurance Type is required';
    } else if (isOther && !data.customInsuranceType.trim()) {
        errs.customInsuranceType = 'Please specify your insurance type';
    }
    if (!data.insuranceProviderName.trim()) errs.insuranceProviderName = 'Provider Name is required';
    if (!data.policyNumber.trim()) errs.policyNumber = 'Policy Number is required';
    if (!data.policyExpiryDate) {
        errs.policyExpiryDate = 'Expiry Date is required';
    } else if (!isPolicyDateValid(data.policyExpiryDate)) {
        errs.policyExpiryDate = 'Expiry date must be in the future';
    }
    if (!data.insuranceDocument) errs.insuranceDocument = 'Insurance Document is required';
    if (!agreed) errs.agreed = 'You must agree to the Terms & Privacy Policy';
    return errs;
};
