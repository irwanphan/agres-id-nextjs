import { useState, useCallback } from 'react';
import { RajaOngkirDestination, RajaOngkirShippingCost } from '@/lib/rajaongkir';

interface UseRajaOngkirReturn {
  // State
  originDestination: RajaOngkirDestination | undefined;
  destinationDestination: RajaOngkirDestination | undefined;
  packageWeight: number;
  shippingOptions: RajaOngkirShippingCost[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setOriginDestination: (destination: RajaOngkirDestination) => void;
  setDestinationDestination: (destination: RajaOngkirDestination) => void;
  setPackageWeight: (weight: number) => void;
  clearShippingOptions: () => void;
  resetAll: () => void;
  
  // Computed
  canCalculateShipping: boolean;
  totalShippingCost: number;
  selectedShippingMethod: RajaOngkirShippingCost | null;
}

export function useRajaOngkir(): UseRajaOngkirReturn {
  const [originDestination, setOriginDestination] = useState<RajaOngkirDestination>();
  const [destinationDestination, setDestinationDestination] = useState<RajaOngkirDestination>();
  const [packageWeight, setPackageWeight] = useState(1);
  const [shippingOptions, setShippingOptions] = useState<RajaOngkirShippingCost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<RajaOngkirShippingCost | null>(null);

  const canCalculateShipping = Boolean(
    originDestination && 
    destinationDestination && 
    packageWeight > 0
  );

  const totalShippingCost = selectedShippingMethod?.cost || 0;

  const clearShippingOptions = useCallback(() => {
    setShippingOptions([]);
    setSelectedShippingMethod(null);
    setError(null);
  }, []);

  const resetAll = useCallback(() => {
    setOriginDestination(undefined);
    setDestinationDestination(undefined);
    setPackageWeight(1);
    setShippingOptions([]);
    setSelectedShippingMethod(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    // State
    originDestination,
    destinationDestination,
    packageWeight,
    shippingOptions,
    isLoading,
    error,
    
    // Actions
    setOriginDestination,
    setDestinationDestination,
    setPackageWeight,
    clearShippingOptions,
    resetAll,
    
    // Computed
    canCalculateShipping,
    totalShippingCost,
    selectedShippingMethod,
  };
} 