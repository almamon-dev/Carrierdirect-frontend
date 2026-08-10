import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../../lib/axios';
import { TOKEN_CONFIG } from '../../../config/auth';
import { useToastStore } from '../../../stores/useToastStore';
import Input from '../../../components/ui/input';
import PhoneInput from '../../../components/ui/phone-input';
import Button from '../../../components/ui/button';
import LogoBlack from '../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../assets/Images/Logo.png';

interface OptionItem {
    id: string;
    name: string;
    postal_code?: string;
    country?: string;
    state?: string;
    city?: string;
}

interface AutocompleteInputProps {
    id?: string;
    nextFieldId?: string;
    value: string;
    onChange: (val: string) => void;
    onSelect?: (val: string, item?: OptionItem) => void;
    options: OptionItem[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
}

// Helper to robustly extract arrays from API responses
const extractDataArray = (res: any): any[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
};

// ─── Inline Type-Ahead Autocomplete Input Component ──────────────────────────
function AutocompleteInput({
    id,
    nextFieldId,
    value,
    onChange,
    onSelect,
    options,
    placeholder = 'Type to search...',
    disabled = false,
    error,
}: AutocompleteInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close options list when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const focusNextField = () => {
        if (nextFieldId) {
            setTimeout(() => {
                const nextElem = document.getElementById(nextFieldId);
                if (nextElem) {
                    nextElem.focus();
                }
            }, 100);
        }
    };

    const searchTrimmed = (value || '').trim().toLowerCase();
    const hasTypedText = searchTrimmed.length > 0;

    const filtered = hasTypedText
        ? options.filter(opt => opt.name.toLowerCase().includes(searchTrimmed))
        : [];

    return (
        <div ref={containerRef} className="relative w-full">
            <Input
                id={id}
                type="text"
                className="bg-white"
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => {
                    if (!disabled && hasTypedText) setIsOpen(true);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (isOpen && filtered.length > 0) {
                            const firstMatch = filtered[0];
                            onChange(firstMatch.name);
                            if (onSelect) onSelect(firstMatch.name, firstMatch);
                            setIsOpen(false);
                        }
                        focusNextField();
                    }
                }}
                error={error}
            />
            {isOpen && !disabled && hasTypedText && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto font-sans antialiased">
                    {filtered.map((item, idx) => (
                        <div
                            key={idx}
                            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#FF4A1F] cursor-pointer transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onChange(item.name);
                                if (onSelect) onSelect(item.name, item);
                                setIsOpen(false);
                                focusNextField();
                            }}
                        >
                            <span>{item.name}</span>
                            {item.postal_code && (
                                <span className="text-[10px] text-slate-400 font-normal">ZIP: {item.postal_code}</span>
                            )}
                        </div>
                    ))}

                    {/* Display custom prompt ONLY if user typed text and zero matching search results exist */}
                    {filtered.length === 0 && (
                        <div
                            className="px-3 py-2 text-xs font-semibold text-[#FF4A1F] hover:bg-orange-50 cursor-pointer transition-colors border-t border-slate-100 flex items-center gap-1"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onChange(value);
                                if (onSelect) onSelect(value);
                                setIsOpen(false);
                                focusNextField();
                            }}
                        >
                            <span>Use custom:</span>
                            <span className="italic font-bold">"{value.trim()}"</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SupplierCompleteProfilePage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Read stored user
    const userStr = localStorage.getItem(TOKEN_CONFIG.userKey) || localStorage.getItem('erp_user_data') || localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : {};

    const [formData, setFormData] = useState({
        companyName: currentUser.company_name || currentUser.name || '',
        phone: currentUser.phone_number || currentUser.phone || '',
        country: currentUser.country || '',
        state: currentUser.state || '',
        city: currentUser.city || '',
        zipCode: currentUser.zip_code || '',
        address: currentUser.business_address || currentUser.address || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Location Options fetched from DB
    const [countriesList, setCountriesList] = useState<OptionItem[]>([]);
    const [statesList, setStatesList] = useState<OptionItem[]>([]);
    const [citiesList, setCitiesList] = useState<OptionItem[]>([]);
    const [zipCodesList, setZipCodesList] = useState<OptionItem[]>([]);
    const [addressList, setAddressList] = useState<OptionItem[]>([]);

    // 1. Fetch Countries on Mount
    useEffect(() => {
        apiClient.get('/locations/countries')
            .then(res => {
                const list = extractDataArray(res);
                if (list.length > 0) {
                    setCountriesList(list.map((c: string) => ({ id: c, name: c })));
                } else {
                    fallbackCountries();
                }
            })
            .catch(() => fallbackCountries());
    }, []);

    const fallbackCountries = () => {
        const defaultList = [
            'Bangladesh', 'United States', 'Canada', 'United Kingdom',
            'Australia', 'Germany', 'France', 'United Arab Emirates',
            'Saudi Arabia', 'Singapore', 'India', 'Japan'
        ];
        setCountriesList(defaultList.map(c => ({ id: c, name: c })));
    };

    // 2. Fetch States, Cities & Zip Codes when Country changes
    useEffect(() => {
        if (!formData.country.trim()) {
            setStatesList([]);
            setCitiesList([]);
            setZipCodesList([]);
            return;
        }

        // Fetch States
        apiClient.get('/locations/states', { country: formData.country })
            .then(res => {
                const states = extractDataArray(res);
                setStatesList(states.filter(Boolean).map((s: string) => ({ id: s, name: s })));
            })
            .catch(() => setStatesList([]));

        // Fetch Cities & Zip Codes
        apiClient.get('/locations/cities', { country: formData.country })
            .then(res => {
                const rawCities = extractDataArray(res);
                const citiesMap = rawCities.map((c: any) => {
                    const cityName = typeof c === 'string' ? c : c.city;
                    return { id: cityName, name: cityName, postal_code: c.postal_code };
                });
                setCitiesList(citiesMap);

                // Extract Postal Codes
                const zips = rawCities
                    .map((c: any) => typeof c === 'string' ? null : c.postal_code)
                    .filter(Boolean);
                const uniqueZips = Array.from(new Set(zips)).map(z => ({ id: String(z), name: String(z) }));
                setZipCodesList(uniqueZips as OptionItem[]);
            })
            .catch(() => {
                setCitiesList([]);
                setZipCodesList([]);
            });
    }, [formData.country]);

    // 3. Refetch Cities & Zip Codes if State changes
    useEffect(() => {
        if (!formData.country.trim() || !formData.state.trim()) return;
        apiClient.get('/locations/cities', { country: formData.country, state: formData.state })
            .then(res => {
                const rawCities = extractDataArray(res);
                if (rawCities.length > 0) {
                    const citiesMap = rawCities.map((c: any) => {
                        const cityName = typeof c === 'string' ? c : c.city;
                        return { id: cityName, name: cityName, postal_code: c.postal_code };
                    });
                    setCitiesList(citiesMap);

                    const zips = rawCities
                        .map((c: any) => typeof c === 'string' ? null : c.postal_code)
                        .filter(Boolean);
                    const uniqueZips = Array.from(new Set(zips)).map(z => ({ id: String(z), name: String(z) }));
                    setZipCodesList(uniqueZips as OptionItem[]);
                }
            })
            .catch(() => { });
    }, [formData.state]);

    const generateAutoAddress = (cityVal: string, stateVal: string, countryVal: string, zipVal: string) => {
        const parts = [countryVal, stateVal, cityVal].filter(Boolean);
        let result = parts.join(', ');
        if (zipVal) result += ` - ${zipVal}`;
        return result;
    };

    // 4. Fetch Address Suggestions when typing Address
    const handleAddressChange = (val: string, item?: OptionItem) => {
        setFormData(prev => ({
            ...prev,
            address: val,
            ...(item?.country ? { country: item.country } : {}),
            ...(item?.state ? { state: item.state } : {}),
            ...(item?.city ? { city: item.city } : {}),
            ...(item?.postal_code ? { zipCode: item.postal_code } : {}),
        }));

        if (errors.address) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.address;
                return newErrors;
            });
        }

        if (val.trim().length > 2) {
            apiClient.get('/locations/search', { q: val })
                .then(res => {
                    const rawSearch = extractDataArray(res);
                    setAddressList(rawSearch.map((loc: any) => ({
                        id: String(loc.id),
                        name: loc.address || loc.label,
                        country: loc.country,
                        state: loc.state,
                        city: loc.city,
                        postal_code: loc.postal_code
                    })));
                })
                .catch(() => { });
        } else {
            setAddressList([]);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            if ((field === 'state' || field === 'zipCode') && !prev.address) {
                updated.address = generateAutoAddress(updated.city, updated.state, updated.country, updated.zipCode);
            }
            return updated;
        });
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleCountryChange = (val: string) => {
        setFormData(prev => ({
            ...prev,
            country: val,
            state: '',
            city: '',
            zipCode: '',
            address: '',
        }));
        if (errors.country) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.country;
                return newErrors;
            });
        }
    };

    const handleStateChange = (val: string) => {
        setFormData(prev => ({
            ...prev,
            state: val,
            city: '',
            zipCode: '',
            address: '',
        }));
        if (errors.state) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.state;
                return newErrors;
            });
        }
    };

    const handleCityChange = (val: string, item?: OptionItem) => {
        setFormData(prev => {
            const newZip = (item && item.postal_code) ? item.postal_code : prev.zipCode;
            const autoAddr = generateAutoAddress(val, prev.state, prev.country, newZip);
            return {
                ...prev,
                city: val,
                zipCode: newZip,
                address: prev.address ? prev.address : autoAddr
            };
        });
        if (errors.city) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.city;
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const autoAddr = generateAutoAddress(formData.city, formData.state, formData.country, formData.zipCode);
        const newErrors: Record<string, string> = {};

        if (!formData.companyName.trim()) newErrors.companyName = 'Company Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip / Postal code is required';
        if (!autoAddr.trim()) newErrors.address = 'Full business address is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => setIsLoading(false), 700);
            return;
        }

        try {
            const res = await apiClient.post('/supplier/profile', {
                name: formData.companyName,
                company_name: formData.companyName,
                phone_number: formData.phone,
                country: formData.country,
                state: formData.state,
                city: formData.city,
                zip_code: formData.zipCode,
                business_address: autoAddr,
            });

            const apiUser = res.data?.data || {};

            const updatedUser = {
                ...currentUser,
                ...apiUser,
                name: formData.companyName,
                company_name: formData.companyName,
                phone_number: formData.phone,
                country: formData.country,
                state: formData.state,
                city: formData.city,
                zip_code: formData.zipCode,
                business_address: autoAddr,
                is_profile_completed: true,
            };

            localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(updatedUser));

            // Minimum loading animation delay so Binance Equalizer bars render smoothly
            await new Promise(resolve => setTimeout(resolve, 750));

            useToastStore.getState().showToast('Profile completed successfully! Welcome to your dashboard.', 'success');
            navigate('/supplier/dashboard');
        } catch (err: any) {
            const msg = err.data?.message || err.message || 'Failed to update profile. Please check your entries.';
            useToastStore.getState().showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative p-4 font-sans antialiased">

            {/* Main Centered Card matching SupplierRegisterPage */}
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[600px]">

                {/* Left Side - Logo & Radial Grid Pattern */}
                <div className="hidden md:flex md:w-5/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex flex-col items-center w-full text-center">
                        <Link to="/" className="cursor-pointer hover:opacity-85 transition-opacity">
                            <img src={LogoBlack} alt="CarrierDirect Logo" className="w-full max-w-[260px] object-contain dark:hidden" />
                            <img src={LogoWhite} alt="CarrierDirect Logo" className="w-full max-w-[260px] object-contain hidden dark:block" />
                        </Link>
                        <h2 className="text-[15px] font-bold text-slate-800 mt-8 tracking-tight">Supplier Portal Setup</h2>
                        <p className="mt-2 text-xs text-gray-500 leading-relaxed max-w-xs">
                            Complete your location and contact details to activate your supplier portal and receive carrier quote requests.
                        </p>

                        <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-[#FF4A1F] border border-orange-100 rounded-full text-xs font-semibold">
                            <ShieldCheck className="w-4 h-4 text-[#FF4A1F]" />
                            <span>Step 2 of 2: Profile Activation</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Container */}
                <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-center">
                    <div className="mb-6">
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Complete Your Supplier Profile
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Please provide your business location and contact information to complete your account setup.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="companyName"
                                type="text"
                                className="bg-white"
                                placeholder="Enter Company Name"
                                value={formData.companyName}
                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        document.getElementById('phone')?.focus();
                                    }
                                }}
                                error={errors.companyName}
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <PhoneInput
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="1711-234567"
                                error={errors.phone}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Country Auto-suggest Input */}
                            <div>
                                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <AutocompleteInput
                                    id="country"
                                    nextFieldId="state"
                                    value={formData.country}
                                    onChange={handleCountryChange}
                                    onSelect={(val) => handleCountryChange(val)}
                                    options={countriesList}
                                    placeholder="Enter Country"
                                    error={errors.country}
                                />
                            </div>

                            {/* State / Division Auto-suggest Input */}
                            <div>
                                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                    State / Division
                                </label>
                                <AutocompleteInput
                                    id="state"
                                    nextFieldId="city"
                                    value={formData.state}
                                    onChange={handleStateChange}
                                    onSelect={(val) => handleStateChange(val)}
                                    options={statesList}
                                    placeholder={!formData.country.trim() ? "Enter Country first" : "Enter State"}
                                    disabled={!formData.country.trim()}
                                />
                            </div>

                            {/* City Auto-suggest Input */}
                            <div>
                                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <AutocompleteInput
                                    id="city"
                                    nextFieldId="zipCode"
                                    value={formData.city}
                                    onChange={(val) => handleCityChange(val)}
                                    onSelect={(val, item) => handleCityChange(val, item)}
                                    options={citiesList}
                                    placeholder={
                                        !formData.country.trim()
                                            ? "Enter Country first"
                                            : (!formData.state.trim() ? "Enter State first" : "Enter City")
                                    }
                                    disabled={!formData.country.trim() || !formData.state.trim()}
                                    error={errors.city}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                    Zip / Postal Code <span className="text-red-500">*</span>
                                </label>
                                <AutocompleteInput
                                    id="zipCode"
                                    nextFieldId="address"
                                    value={formData.zipCode}
                                    onChange={(val) => handleInputChange('zipCode', val)}
                                    onSelect={(val) => handleInputChange('zipCode', val)}
                                    options={zipCodesList}
                                    placeholder={!formData.city.trim() ? "Enter City first" : "Enter Zip Code"}
                                    disabled={!formData.city.trim()}
                                    error={errors.zipCode}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                    Full Business Address <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="address"
                                    type="text"
                                    className="bg-slate-100 text-slate-700 font-semibold cursor-not-allowed border-slate-200"
                                    placeholder={!formData.city.trim() ? "Enter City first" : "Auto-generated Address"}
                                    value={generateAutoAddress(formData.city, formData.state, formData.country, formData.zipCode)}
                                    readOnly={true}
                                    error={errors.address}
                                />
                            </div>
                        </div>

                        <Button
                            id="submit-btn"
                            type="submit"
                            isLoading={isLoading}
                            fullWidth={true}
                            className="mt-6"
                        >
                            Complete Setup
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
