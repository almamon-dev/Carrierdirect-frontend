export interface AddressData {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface AddressesResponse {
  permanent: AddressData | null;
  present: AddressData | null;
}

export const COUNTRY_OPTIONS = [
  { id: "Bangladesh", name: "🇧🇩 Bangladesh" },
  { id: "Germany", name: "🇩🇪 Germany" },
  { id: "France", name: "🇫🇷 France" },
  { id: "Netherlands", name: "🇳🇱 Netherlands" },
  { id: "Poland", name: "🇵🇱 Poland" },
  { id: "United Kingdom", name: "🇬🇧 United Kingdom" },
  { id: "United States", name: "🇺🇸 United States" },
];

export const BLANK_ADDRESS: AddressData = {
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  zip_code: "",
  country: "Bangladesh",
};
