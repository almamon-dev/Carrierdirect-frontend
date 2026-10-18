import { Country, getCountries } from 'react-phone-number-input';
import enLabels from 'react-phone-number-input/locale/en.json';

export interface CountryOption {
    code: Country;
    name: string;
    callingCode: string;
    flag: string;
}

export interface PhoneInputProps {
    name?: string;
    value?: string;
    onChange?: (e: any) => void;
    onCountryChange?: (country: CountryOption) => void;
    country?: string | Country;
    defaultCountry?: Country;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    label?: string;
    className?: string;
    id?: string;
}

export const getFlagEmoji = (countryCode: string): string => {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

export const PRIORITY_CODES: Country[] = ['BD', 'US', 'GB', 'CA', 'AU', 'AE', 'SA', 'SG', 'IN', 'DE', 'FR'];

export const COUNTRY_ALIASES: Record<string, string[]> = {
    BD: ['bangladesh', 'bd', 'dhaka', 'chittagong', 'sylhet', '880', '+880'],
    US: ['united states', 'usa', 'us', 'america', 'united states of america', '1', '+1'],
    GB: ['united kingdom', 'uk', 'great britain', 'england', 'britain', 'london', '44', '+44'],
    CA: ['canada', 'ca', 'toronto', 'vancouver', '1', '+1'],
    AU: ['australia', 'au', 'sydney', 'melbourne', '61', '+61'],
    AE: ['united arab emirates', 'uae', 'dubai', 'abu dhabi', 'emirates', '971', '+971'],
    SA: ['saudi arabia', 'saudi', 'ksa', 'riyadh', 'jeddah', '966', '+966'],
    QA: ['qatar', 'doha', '974', '+974'],
    KW: ['kuwait', '965', '+965'],
    OM: ['oman', 'muscat', '968', '+968'],
    BH: ['bahrain', '973', '+973'],
    SG: ['singapore', 'sg', '65', '+65'],
    MY: ['malaysia', 'my', 'kuala lumpur', '60', '+60'],
    IN: ['india', 'in', 'delhi', 'mumbai', 'kolkata', '91', '+91'],
    PK: ['pakistan', 'pk', 'karachi', 'lahore', 'islamabad', '92', '+92'],
    DE: ['germany', 'deutschland', 'de', 'berlin', '49', '+49'],
    FR: ['france', 'fr', 'paris', '33', '+33'],
    IT: ['italy', 'italia', 'it', 'rome', 'milan', '39', '+39'],
    ES: ['spain', 'espana', 'es', 'madrid', 'barcelona', '34', '+34'],
    TR: ['turkey', 'turkiye', 'tr', 'istanbul', 'ankara', '90', '+90'],
    CN: ['china', 'cn', 'beijing', 'shanghai', '86', '+86'],
    JP: ['japan', 'jp', 'tokyo', '81', '+81'],
    KR: ['south korea', 'korea', 'kr', 'seoul', '82', '+82'],
    TH: ['thailand', 'th', 'bangkok', '66', '+66'],
    ID: ['indonesia', 'id', 'jakarta', '62', '+62'],
    PH: ['philippines', 'ph', 'manila', '63', '+63'],
    VN: ['vietnam', 'vn', 'hanoi', '84', '+84'],
    NL: ['netherlands', 'holland', 'amsterdam', 'nl', '31', '+31'],
    CH: ['switzerland', 'swiss', 'ch', 'zurich', 'geneva', '41', '+41'],
    SE: ['sweden', 'se', 'stockholm', '46', '+46'],
    NO: ['norway', 'no', 'oslo', '47', '+47'],
    DK: ['denmark', 'dk', 'copenhagen', '45', '+45'],
    IE: ['ireland', 'ie', 'dublin', '353', '+353'],
    NZ: ['new zealand', 'nz', 'auckland', '64', '+64'],
    ZA: ['south africa', 'za', 'johannesburg', 'cape town', '27', '+27'],
    EG: ['egypt', 'eg', 'cairo', '20', '+20'],
    BR: ['brazil', 'brasil', 'br', 'sao paulo', '55', '+55'],
    MX: ['mexico', 'mx', '52', '+52'],
};

export const COUNTRY_NAME_TO_CODE: Record<string, Country> = {};
getCountries().forEach((c) => {
    const label = (enLabels as Record<string, string>)[c];
    if (label) {
        COUNTRY_NAME_TO_CODE[label.toLowerCase()] = c;
    }
    COUNTRY_NAME_TO_CODE[c.toLowerCase()] = c;
});

COUNTRY_NAME_TO_CODE['usa'] = 'US';
COUNTRY_NAME_TO_CODE['united states of america'] = 'US';
COUNTRY_NAME_TO_CODE['uk'] = 'GB';
COUNTRY_NAME_TO_CODE['great britain'] = 'GB';
COUNTRY_NAME_TO_CODE['england'] = 'GB';
COUNTRY_NAME_TO_CODE['uae'] = 'AE';
COUNTRY_NAME_TO_CODE['dubai'] = 'AE';
COUNTRY_NAME_TO_CODE['emirates'] = 'AE';
COUNTRY_NAME_TO_CODE['saudi'] = 'SA';
COUNTRY_NAME_TO_CODE['ksa'] = 'SA';
COUNTRY_NAME_TO_CODE['bd'] = 'BD';

export function resolveCountry(val?: string | Country): Country | undefined {
    if (!val) return undefined;
    const clean = String(val).trim().toLowerCase();
    if (COUNTRY_NAME_TO_CODE[clean]) {
        return COUNTRY_NAME_TO_CODE[clean];
    }
    if (clean.length === 2) {
        return clean.toUpperCase() as Country;
    }
    return undefined;
}
