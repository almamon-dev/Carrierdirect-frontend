export interface CityLocation {
  name: string;
  state?: string;
  zip?: string;
}

export interface CountryLocationInfo {
  states: string[];
  cities: CityLocation[];
  defaultZipPrefix?: string;
}
