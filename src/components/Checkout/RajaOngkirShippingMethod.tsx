import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { RadioInput } from '../ui/input/radio';
import { useCheckoutForm } from './form';
import { rajaOngkirService, RajaOngkirShippingCost, RajaOngkirDestination } from '../../lib/rajaongkir';
import { IconTruck, IconClock, IconLoader } from '@tabler/icons-react';

interface RajaOngkirShippingMethodProps {
  originDestination?: RajaOngkirDestination;
  destinationDestination?: RajaOngkirDestination;
  weight: number;
  itemValue?: number;
}

export default function RajaOngkirShippingMethod({
  originDestination,
  destinationDestination,
  weight,
  itemValue = 0,
}: RajaOngkirShippingMethodProps) {
  const { errors, control, setValue } = useCheckoutForm();
  const [shippingOptions, setShippingOptions] = useState<RajaOngkirShippingCost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateShipping = async () => {
      if (!originDestination || !destinationDestination || weight <= 0) {
        setShippingOptions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await rajaOngkirService.calculateShippingCost({
          shipper_destination_id: originDestination.id,
          receiver_destination_id: destinationDestination.id,
          weight,
          item_value: itemValue,
          cod: 'no',
        });

        if (response.meta.status === 'success' && response.data.courier) {
          setShippingOptions(response.data.courier);
        } else {
          setError('Tidak ada opsi pengiriman yang tersedia');
          setShippingOptions([]);
        }
      } catch (err) {
        console.error('Error calculating shipping:', err);
        setError('Gagal memuat opsi pengiriman. Silakan coba lagi.');
        setShippingOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    calculateShipping();
  }, [originDestination, destinationDestination, weight, itemValue]);

  const getCourierIcon = (courierName: string) => {
    const name = courierName.toLowerCase();
    if (name.includes('jne')) return '/images/checkout/jne.svg';
    if (name.includes('pos')) return '/images/checkout/pos.svg';
    if (name.includes('tiki')) return '/images/checkout/tiki.svg';
    if (name.includes('sicepat')) return '/images/checkout/sicepat.svg';
    if (name.includes('jnt')) return '/images/checkout/jnt.svg';
    if (name.includes('ninja')) return '/images/checkout/ninja.svg';
    return '/images/checkout/dhl.svg'; // default
  };

  const formatEtd = (etd: string) => {
    if (!etd) return '1-2 hari';
    
    // Handle various ETD formats
    if (etd.includes('HARI')) {
      return etd.replace('HARI', ' hari');
    }
    
    if (etd.includes('H')) {
      return etd.replace('H', ' hari');
    }
    
    return etd;
  };

  if (!originDestination || !destinationDestination) {
    return (
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="px-6 py-5 border-b border-gray-3">
          <h3 className="text-lg font-medium text-dark">Metode Pengiriman</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-5 text-center py-4">
            Silakan pilih alamat asal dan tujuan terlebih dahulu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div className="px-6 py-5 border-b border-gray-3">
        <h3 className="text-lg font-medium text-dark">Metode Pengiriman</h3>
        <p className="text-sm text-gray-5 mt-1">
          Dari {originDestination.city_name} ke {destinationDestination.city_name}
        </p>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader className="h-6 w-6 text-blue animate-spin mr-2" />
            <span className="text-sm text-gray-5">Memuat opsi pengiriman...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-blue hover:underline"
            >
              Coba lagi
            </button>
          </div>
        ) : shippingOptions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-5">Tidak ada opsi pengiriman yang tersedia</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {shippingOptions.map((option, index) => (
              <Controller
                key={`${option.courier}-${option.service}-${index}`}
                name="shippingMethod"
                control={control}
                render={({ field }) => (
                  <RadioInput
                    name={field.name}
                    value={`${option.courier}-${option.service}`}
                    label={
                      <ShippingOptionCard
                        option={option}
                        courierIcon={getCourierIcon(option.courier)}
                      />
                    }
                    onChange={(e) =>
                      field.onChange({
                        name: e.currentTarget.value,
                        price: option.cost,
                        courier: option.courier,
                        service: option.service,
                        etd: option.etd,
                      })
                    }
                  />
                )}
              />
            ))}
          </div>
        )}

        {errors.shippingMethod && (
          <p className="mt-2 text-sm text-red">
            Silakan pilih metode pengiriman
          </p>
        )}
      </div>
    </div>
  );
}

function ShippingOptionCard({ 
  option, 
  courierIcon 
}: { 
  option: RajaOngkirShippingCost; 
  courierIcon: string;
}) {
  return (
    <div className="rounded-md border-[0.5px] shadow-1 border-gray-4 py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-transparent peer-checked:bg-gray-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="pr-4">
            <img
              src={courierIcon}
              alt={`Logo ${option.courier}`}
              className="h-8 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/checkout/dhl.svg'; // fallback
              }}
            />
          </div>

          <div>
            <p className="font-semibold text-dark capitalize">
              {option.courier} - {option.service}
            </p>
            <p className="text-custom-xs text-gray-5">{option.description}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold text-dark">
            Rp {option.cost.toLocaleString('id-ID')}
          </p>
          <div className="flex items-center justify-end gap-1 text-custom-xs text-gray-5">
            <IconClock className="h-3 w-3" />
            <span>{formatEtd(option.etd)}</span>
          </div>
        </div>
      </div>
      
      {option.note && (
        <div className="mt-2 pt-2 border-t border-gray-3">
          <p className="text-xs text-gray-5 italic">{option.note}</p>
        </div>
      )}
    </div>
  );
}

function formatEtd(etd: string) {
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