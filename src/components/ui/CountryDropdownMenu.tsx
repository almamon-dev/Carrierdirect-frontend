import React, { RefObject } from 'react';
import { Search, X, Check } from 'lucide-react';
import { CountryOption } from '@/constants/countries';

interface CountryDropdownMenuProps {
  searchInputRef: RefObject<HTMLInputElement | null>;
  search: string;
  onSearchChange: (value: string) => void;
  filteredCountries: CountryOption[];
  selectedCountry: CountryOption | null;
  onSelect: (country: CountryOption) => void;
}

export const CountryDropdownMenu: React.FC<CountryDropdownMenuProps> = ({
  searchInputRef,
  search,
  onSearchChange,
  filteredCountries,
  selectedCountry,
  onSelect,
}) => {
  return (
    <div className="absolute left-0 right-0 top-full mt-1.5 z-[9999] bg-white dark:bg-[#18202a] rounded-[4px] shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden animate-in fade-in zoom-in-95 duration-100 font-sans">
      {/* Search Box */}
      <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#12161c]/50">
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-2.5 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by country or code..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-white dark:bg-[#18202a] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-800 dark:text-slate-200 outline-none focus:border-[#ff4a1f] placeholder:text-slate-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Countries List */}
      <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/40">
        {filteredCountries.length === 0 ? (
          <div className="py-6 px-3 text-center text-xs text-slate-400">
            No country found matching "{search}"
          </div>
        ) : (
          filteredCountries.map((country) => {
            const isSelected = selectedCountry?.code === country.code;
            return (
              <button
                key={country.code}
                type="button"
                onClick={() => onSelect(country)}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50/70 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <span className="text-base shrink-0 select-none">{country.flag}</span>
                  <span className="truncate">{country.name}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500">
                    {country.code}
                  </span>
                  {isSelected && <Check size={13} className="text-[#ff4a1f]" />}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer showing total count */}
      <div className="px-3 py-1.5 bg-slate-50 dark:bg-[#12161c] border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>{filteredCountries.length} countries available</span>
        <span>Worldwide Coverage</span>
      </div>
    </div>
  );
};
