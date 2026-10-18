import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { WORLD_COUNTRIES, CountryOption } from '@/constants/countries';
import { CountryDropdownMenu } from './CountryDropdownMenu';

export interface CountryDropdownProps {
  value: string;
  onChange: (countryName: string, option?: CountryOption) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const CountryDropdown: React.FC<CountryDropdownProps> = ({
  value,
  onChange,
  placeholder = 'Select Country',
  error,
  disabled = false,
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected country
  const selectedCountry = useMemo(() => {
    if (!value) return null;
    const q = value.toLowerCase().trim();
    return WORLD_COUNTRIES.find(
      (c) => c.name.toLowerCase() === q || c.code.toLowerCase() === q
    );
  }, [value]);

  // Filter countries by search term
  const filteredCountries = useMemo(() => {
    if (!search.trim()) return WORLD_COUNTRIES;
    const query = search.toLowerCase().trim();
    return WORLD_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [search]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (country: CountryOption) => {
    onChange(country.name, country);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full h-9 px-3 text-xs bg-slate-50 dark:bg-[#12161c] border rounded-[4px] text-left flex items-center justify-between transition-colors outline-none cursor-pointer ${
          error
            ? 'border-red-500 ring-1 ring-red-500'
            : isOpen
            ? 'border-[#ff4a1f] ring-1 ring-[#ff4a1f]'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''}`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {selectedCountry ? (
            <>
              <span className="text-base shrink-0 select-none">{selectedCountry.flag}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {selectedCountry.name}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-700/60 px-1 py-0.2 rounded shrink-0">
                {selectedCountry.code}
              </span>
            </>
          ) : value ? (
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
              {value}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-0.5 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
              title="Clear"
            >
              <X size={13} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#ff4a1f]' : ''}`}
          />
        </div>
      </button>

      {/* Hidden input for HTML5 form validation if required */}
      {required && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          required
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <CountryDropdownMenu
          searchInputRef={searchInputRef}
          search={search}
          onSearchChange={setSearch}
          filteredCountries={filteredCountries}
          selectedCountry={selectedCountry}
          onSelect={handleSelect}
        />
      )}

      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default CountryDropdown;
