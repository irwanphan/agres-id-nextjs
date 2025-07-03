'use client'

import { useState, useEffect, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useCheckoutForm } from './form';
import { rajaOngkirService, RajaOngkirDestination } from '../../lib/rajaongkir';
import { IconSearch, IconMapPin, IconLoader } from '@tabler/icons-react';

interface DestinationSearchProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  onDestinationSelect?: (destination: RajaOngkirDestination) => void;
}

export default function DestinationSearch({
  name,
  label,
  placeholder = "Cari kota, kecamatan, atau kode pos...",
  required = false,
  onDestinationSelect,
}: DestinationSearchProps) {
  const { control, setValue } = useCheckoutForm();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [destinations, setDestinations] = useState<RajaOngkirDestination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<RajaOngkirDestination | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length < 3) {
      setDestinations([]);
      setIsOpen(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await rajaOngkirService.searchDestination(searchTerm);
        if (response.meta.status === 'success' && response.data) {
          setDestinations(response.data);
          setIsOpen(true);
        } else {
          setDestinations([]);
          setIsOpen(false);
        }
      } catch (error) {
        console.error('Error searching destinations:', error);
        setDestinations([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleDestinationSelect = (destination: RajaOngkirDestination) => {
    setSelectedDestination(destination);
    setSearchTerm(destination.name);
    setValue(name as any, destination.id);
    setIsOpen(false);
    onDestinationSelect?.(destination);
  };

  const getDisplayText = (destination: RajaOngkirDestination) => {
    const parts = [destination.name];
    
    if (destination.subdistrict_name && destination.subdistrict_name !== destination.name) {
      parts.push(destination.subdistrict_name);
    }
    
    if (destination.city_name && destination.city_name !== destination.name) {
      parts.push(destination.city_name);
    }
    
    if (destination.province_name) {
      parts.push(destination.province_name);
    }
    
    return parts.join(', ');
  };

  return (
    <div className="relative" ref={containerRef}>
      <Controller
        control={control}
        name={name as any}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field, fieldState }) => (
          <div>
            <label className="block mb-1.5 text-sm text-gray-6">
              {label}
              {required && <span className="text-red">*</span>}
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isLoading ? (
                  <IconLoader className="h-4 w-4 text-gray-4 animate-spin" />
                ) : (
                  <IconSearch className="h-4 w-4 text-gray-4" />
                )}
              </div>
              
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (destinations.length > 0) setIsOpen(true);
                }}
                placeholder={placeholder}
                className={`rounded-lg border text-sm border-gray-3 h-11 focus:border-blue focus:outline-0 w-full py-2.5 pl-10 pr-4 duration-200 focus:ring-0 ${
                  fieldState.error ? 'border-red' : ''
                }`}
              />
              
              <input
                type="hidden"
                {...field}
              />
            </div>
            
            {fieldState.error && (
              <p className="mt-1 text-sm text-red">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Dropdown */}
      {isOpen && destinations.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-3 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {destinations.map((destination) => (
            <button
              key={destination.id}
              type="button"
              onClick={() => handleDestinationSelect(destination)}
              className="w-full px-4 py-3 text-left hover:bg-gray-2 focus:bg-gray-2 focus:outline-none border-b border-gray-3 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <IconMapPin className="h-4 w-4 text-gray-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark truncate">
                    {getDisplayText(destination)}
                  </p>
                  {destination.postal_code && (
                    <p className="text-xs text-gray-5 mt-1">
                      Kode Pos: {destination.postal_code}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && !isLoading && destinations.length === 0 && searchTerm.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-3 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-center text-sm text-gray-5">
            Tidak ada hasil untuk &ldquo;{searchTerm}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
} 