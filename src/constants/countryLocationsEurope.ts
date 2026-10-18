import { CountryLocationInfo } from './countryLocationsTypes';
import { WESTERN_EUROPE_LOCATIONS } from './countryLocationsWesternEurope';
import { SOUTHERN_EASTERN_EUROPE_LOCATIONS } from './countryLocationsSouthernEasternEurope';

export const EUROPE_LOCATIONS: Record<string, CountryLocationInfo> = {
  ...WESTERN_EUROPE_LOCATIONS,
  ...SOUTHERN_EASTERN_EUROPE_LOCATIONS,
};
