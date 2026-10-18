import { CountryLocationInfo, CityLocation } from './countryLocationsTypes';
import { EUROPE_LOCATIONS } from './countryLocationsEurope';
import { REST_WORLD_LOCATIONS } from './countryLocationsAmericasOceaniaAsia';

export type { CityLocation, CountryLocationInfo };

export const COUNTRY_LOCATIONS: Record<string, CountryLocationInfo> = {
  ...EUROPE_LOCATIONS,
  ...REST_WORLD_LOCATIONS,
};

export function getStatesForCountry(countryName: string): string[] {
  if (!countryName) return [];
  const normalized = countryName.trim();
  const match = Object.keys(COUNTRY_LOCATIONS).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  );
  return match ? COUNTRY_LOCATIONS[match].states : [];
}

export function getCitiesForCountry(countryName: string, stateFilter?: string): CityLocation[] {
  if (!countryName) return [];
  const normalized = countryName.trim();
  const match = Object.keys(COUNTRY_LOCATIONS).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  );
  if (!match) return [];

  const allCities = COUNTRY_LOCATIONS[match].cities;
  if (!stateFilter || !stateFilter.trim()) {
    return allCities;
  }

  const sNorm = stateFilter.toLowerCase().trim();
  const filtered = allCities.filter(
    (c) => c.state && (c.state.toLowerCase().includes(sNorm) || sNorm.includes(c.state.toLowerCase()))
  );
  return filtered.length > 0 ? filtered : allCities;
}
