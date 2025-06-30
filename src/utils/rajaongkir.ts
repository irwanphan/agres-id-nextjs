import { RajaOngkirDestination, RajaOngkirShippingCost } from '@/lib/rajaongkir';

/**
 * Format ETD (Estimated Time of Delivery) to readable format
 */
export function formatEtd(etd: string): string {
  if (!etd) return '1-2 hari';
  
  // Handle various ETD formats
  if (etd.includes('HARI')) {
    return etd.replace('HARI', ' hari');
  }
  
  if (etd.includes('H')) {
    return etd.replace('H', ' hari');
  }
  
  return etd;
}

/**
 * Format price to Indonesian Rupiah format
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Get display text for destination
 */
export function getDestinationDisplayText(destination: RajaOngkirDestination): string {
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
}

/**
 * Get courier icon path based on courier name
 */
export function getCourierIcon(courierName: string): string {
  const name = courierName.toLowerCase();
  
  if (name.includes('jne')) return '/images/checkout/jne.svg';
  if (name.includes('pos')) return '/images/checkout/pos.svg';
  if (name.includes('tiki')) return '/images/checkout/tiki.svg';
  if (name.includes('sicepat')) return '/images/checkout/sicepat.svg';
  if (name.includes('jnt')) return '/images/checkout/jnt.svg';
  if (name.includes('ninja')) return '/images/checkout/ninja.svg';
  if (name.includes('anteraja')) return '/images/checkout/anteraja.svg';
  if (name.includes('wahana')) return '/images/checkout/wahana.svg';
  if (name.includes('lion')) return '/images/checkout/lion.svg';
  if (name.includes('pandu')) return '/images/checkout/pandu.svg';
  if (name.includes('sap')) return '/images/checkout/sap.svg';
  if (name.includes('jet')) return '/images/checkout/jet.svg';
  if (name.includes('indah')) return '/images/checkout/indah.svg';
  if (name.includes('dse')) return '/images/checkout/dse.svg';
  if (name.includes('first')) return '/images/checkout/first.svg';
  if (name.includes('ncs')) return '/images/checkout/ncs.svg';
  if (name.includes('star')) return '/images/checkout/star.svg';
  if (name.includes('idl')) return '/images/checkout/idl.svg';
  if (name.includes('rex')) return '/images/checkout/rex.svg';
  if (name.includes('pahala')) return '/images/checkout/pahala.svg';
  if (name.includes('cahaya')) return '/images/checkout/cahaya.svg';
  if (name.includes('satria')) return '/images/checkout/satria.svg';
  if (name.includes('j&t')) return '/images/checkout/jnt.svg';
  if (name.includes('jnt')) return '/images/checkout/jnt.svg';
  
  return '/images/checkout/dhl.svg'; // default fallback
}

/**
 * Validate weight input
 */
export function validateWeight(weight: number): { isValid: boolean; message?: string } {
  if (weight <= 0) {
    return { isValid: false, message: 'Berat harus lebih dari 0 kg' };
  }
  
  if (weight < 0.1) {
    return { isValid: false, message: 'Berat minimal 0.1 kg' };
  }
  
  if (weight > 50) {
    return { isValid: false, message: 'Berat maksimal 50 kg' };
  }
  
  return { isValid: true };
}

/**
 * Group shipping options by courier
 */
export function groupShippingOptionsByCourier(
  options: RajaOngkirShippingCost[]
): Record<string, RajaOngkirShippingCost[]> {
  return options.reduce((groups, option) => {
    const courier = option.courier.toLowerCase();
    if (!groups[courier]) {
      groups[courier] = [];
    }
    groups[courier].push(option);
    return groups;
  }, {} as Record<string, RajaOngkirShippingCost[]>);
}

/**
 * Sort shipping options by price (ascending)
 */
export function sortShippingOptionsByPrice(
  options: RajaOngkirShippingCost[]
): RajaOngkirShippingCost[] {
  return [...options].sort((a, b) => a.cost - b.cost);
}

/**
 * Get cheapest shipping option
 */
export function getCheapestShippingOption(
  options: RajaOngkirShippingCost[]
): RajaOngkirShippingCost | null {
  if (options.length === 0) return null;
  
  return options.reduce((cheapest, current) => 
    current.cost < cheapest.cost ? current : cheapest
  );
}

/**
 * Calculate estimated delivery date
 */
export function calculateEstimatedDeliveryDate(etd: string): Date {
  const today = new Date();
  const etdNumber = parseInt(etd.replace(/\D/g, '')) || 1;
  
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + etdNumber);
  
  return deliveryDate;
}

/**
 * Format delivery date
 */
export function formatDeliveryDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Check if destination is in same city
 */
export function isSameCity(
  origin: RajaOngkirDestination,
  destination: RajaOngkirDestination
): boolean {
  return origin.city_id === destination.city_id;
}

/**
 * Check if destination is in same province
 */
export function isSameProvince(
  origin: RajaOngkirDestination,
  destination: RajaOngkirDestination
): boolean {
  return origin.province_id === destination.province_id;
}

/**
 * Get distance type (local, intercity, interprovince)
 */
export function getDistanceType(
  origin: RajaOngkirDestination,
  destination: RajaOngkirDestination
): 'local' | 'intercity' | 'interprovince' {
  if (isSameCity(origin, destination)) {
    return 'local';
  }
  
  if (isSameProvince(origin, destination)) {
    return 'intercity';
  }
  
  return 'interprovince';
} 