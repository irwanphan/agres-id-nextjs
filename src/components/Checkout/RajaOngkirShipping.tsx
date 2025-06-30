import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { useCheckoutForm } from "./form";
import { rajaOngkirService, RajaOngkirDestination, RajaOngkirShippingCost } from "../../lib/rajaongkir";
import { IconMapPin, IconPackage, IconTruck, IconLoader, IconSearch, IconEdit } from "@tabler/icons-react";
import { formatPrice, getDestinationDisplayText, getCourierIcon, formatEtd } from "../../utils/rajaongkir";

export default function RajaOngkirShipping() {
  const { control, setValue, watch } = useCheckoutForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<RajaOngkirShippingCost[]>([]);
  
  // State untuk alamat
  const [originDestination, setOriginDestination] = useState<RajaOngkirDestination>();
  const [destinationDestination, setDestinationDestination] = useState<RajaOngkirDestination>();
  const [packageWeight, setPackageWeight] = useState(1);
  
  // State untuk search
  const [originSearchTerm, setOriginSearchTerm] = useState('');
  const [destinationSearchTerm, setDestinationSearchTerm] = useState('');
  const [originSearchResults, setOriginSearchResults] = useState<RajaOngkirDestination[]>([]);
  const [destinationSearchResults, setDestinationSearchResults] = useState<RajaOngkirDestination[]>([]);
  const [isOriginSearching, setIsOriginSearching] = useState(false);
  const [isDestinationSearching, setIsDestinationSearching] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  // Watch form values
  const shipToDifferentAddress = watch("shipToDifferentAddress");

  // Calculate shipping when all required data is available
  useEffect(() => {
    const calculateShipping = async () => {
      if (!originDestination || !destinationDestination || packageWeight <= 0) {
        setShippingOptions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await rajaOngkirService.calculateShippingCost({
          shipper_destination_id: originDestination.id,
          receiver_destination_id: destinationDestination.id,
          weight: packageWeight,
          item_value: 0, // You can calculate this from cart items
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
  }, [originDestination, destinationDestination, packageWeight]);

  // Search destinations with debouncing
  useEffect(() => {
    const searchOrigin = async () => {
      if (originSearchTerm.length < 3) {
        setOriginSearchResults([]);
        setShowOriginDropdown(false);
        return;
      }

      setIsOriginSearching(true);
      try {
        const response = await rajaOngkirService.searchDestination(originSearchTerm);
        if (response.meta.status === 'success' && response.data) {
          setOriginSearchResults(response.data);
          setShowOriginDropdown(true);
        }
      } catch (error) {
        console.error('Error searching origin:', error);
        setOriginSearchResults([]);
      } finally {
        setIsOriginSearching(false);
      }
    };

    const timeoutId = setTimeout(searchOrigin, 500);
    return () => clearTimeout(timeoutId);
  }, [originSearchTerm]);

  useEffect(() => {
    const searchDestination = async () => {
      if (destinationSearchTerm.length < 3) {
        setDestinationSearchResults([]);
        setShowDestinationDropdown(false);
        return;
      }

      setIsDestinationSearching(true);
      try {
        const response = await rajaOngkirService.searchDestination(destinationSearchTerm);
        if (response.meta.status === 'success' && response.data) {
          setDestinationSearchResults(response.data);
          setShowDestinationDropdown(true);
        }
      } catch (error) {
        console.error('Error searching destination:', error);
        setDestinationSearchResults([]);
      } finally {
        setIsDestinationSearching(false);
      }
    };

    const timeoutId = setTimeout(searchDestination, 500);
    return () => clearTimeout(timeoutId);
  }, [destinationSearchTerm]);

  const handleOriginSelect = (destination: RajaOngkirDestination) => {
    setOriginDestination(destination);
    setOriginSearchTerm(destination.name);
    setShowOriginDropdown(false);
    setValue("originDestination" as any, destination.id);
  };

  const handleDestinationSelect = (destination: RajaOngkirDestination) => {
    setDestinationDestination(destination);
    setDestinationSearchTerm(destination.name);
    setShowDestinationDropdown(false);
    setValue("destinationDestination" as any, destination.id);
  };

  const handleWeightChange = (newWeight: number) => {
    const validWeight = Math.max(0.1, Math.min(50, newWeight));
    setPackageWeight(validWeight);
    setValue("packageWeight" as any, validWeight);
  };

  const canCalculateShipping = originDestination && destinationDestination && packageWeight > 0;

  return (
    <div className="space-y-6">
      {/* Origin Address */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="px-6 py-5 border-b border-gray-3">
          <h3 className="text-lg font-medium text-dark">Alamat Asal Pengiriman</h3>
          <p className="text-sm text-gray-5 mt-1">
            Pilih lokasi asal pengiriman untuk menghitung ongkir
          </p>
        </div>
        
        <div className="p-6">
          <div className="relative">
            <label className="block mb-1.5 text-sm text-gray-6">
              Cari Alamat Asal
              <span className="text-red">*</span>
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isOriginSearching ? (
                  <IconLoader className="h-4 w-4 text-gray-4 animate-spin" />
                ) : (
                  <IconSearch className="h-4 w-4 text-gray-4" />
                )}
              </div>
              
              <input
                type="text"
                value={originSearchTerm}
                onChange={(e) => setOriginSearchTerm(e.target.value)}
                placeholder="Cari kota, kecamatan, atau kode pos asal..."
                className="rounded-lg border text-sm border-gray-3 h-11 focus:border-blue focus:outline-0 w-full py-2.5 pl-10 pr-4 duration-200 focus:ring-0"
              />
            </div>
            
            {/* Origin Dropdown */}
            {showOriginDropdown && originSearchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-3 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {originSearchResults.map((destination) => (
                  <button
                    key={destination.id}
                    type="button"
                    onClick={() => handleOriginSelect(destination)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-2 focus:bg-gray-2 focus:outline-none border-b border-gray-3 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <IconMapPin className="h-4 w-4 text-gray-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark truncate">
                          {getDestinationDisplayText(destination)}
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
          </div>
        </div>
      </div>

      {/* Destination Address */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="px-6 py-5 border-b border-gray-3">
          <h3 className="text-lg font-medium text-dark">Alamat Tujuan Pengiriman</h3>
          <p className="text-sm text-gray-5 mt-1">
            Pilih lokasi tujuan pengiriman untuk menghitung ongkir
          </p>
        </div>
        
        <div className="p-6">
          <div className="relative">
            <label className="block mb-1.5 text-sm text-gray-6">
              Cari Alamat Tujuan
              <span className="text-red">*</span>
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isDestinationSearching ? (
                  <IconLoader className="h-4 w-4 text-gray-4 animate-spin" />
                ) : (
                  <IconSearch className="h-4 w-4 text-gray-4" />
                )}
              </div>
              
              <input
                type="text"
                value={destinationSearchTerm}
                onChange={(e) => setDestinationSearchTerm(e.target.value)}
                placeholder="Cari kota, kecamatan, atau kode pos tujuan..."
                className="rounded-lg border text-sm border-gray-3 h-11 focus:border-blue focus:outline-0 w-full py-2.5 pl-10 pr-4 duration-200 focus:ring-0"
              />
            </div>
            
            {/* Destination Dropdown */}
            {showDestinationDropdown && destinationSearchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-3 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {destinationSearchResults.map((destination) => (
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
                          {getDestinationDisplayText(destination)}
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
          </div>
        </div>
      </div>

      {/* Package Weight */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="px-6 py-5 border-b border-gray-3">
          <h3 className="text-lg font-medium text-dark">Berat Paket</h3>
          <p className="text-sm text-gray-5 mt-1">
            Masukkan berat total paket untuk perhitungan ongkir
          </p>
        </div>
        
        <div className="p-6">
          <Controller
            control={control}
            name={"packageWeight" as any}
            defaultValue={packageWeight}
            rules={{ 
              required: 'Berat paket harus diisi',
              min: { value: 0.1, message: 'Berat minimal 0.1 kg' },
              max: { value: 50, message: 'Berat maksimal 50 kg' }
            }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block mb-1.5 text-sm text-gray-6">
                  Berat (kg)
                  <span className="text-red">*</span>
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconPackage className="h-4 w-4 text-gray-4" />
                  </div>
                  
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="50"
                    value={packageWeight}
                    onChange={(e) => {
                      const newWeight = parseFloat(e.target.value) || 0;
                      handleWeightChange(newWeight);
                      field.onChange(newWeight);
                    }}
                    onBlur={field.onBlur}
                    placeholder="1.0"
                    className={`rounded-lg border text-sm border-gray-3 h-11 focus:border-blue focus:outline-0 w-full py-2.5 pl-10 pr-4 duration-200 focus:ring-0 ${
                      fieldState.error ? 'border-red' : ''
                    }`}
                  />
                </div>
                
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* Shipping Methods */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="px-6 py-5 border-b border-gray-3">
          <h3 className="text-lg font-medium text-dark">Metode Pengiriman</h3>
          {canCalculateShipping && (
            <p className="text-sm text-gray-5 mt-1">
              Dari {originDestination?.city_name} ke {destinationDestination?.city_name}
            </p>
          )}
        </div>

        <div className="p-6">
          {!canCalculateShipping ? (
            <div className="text-center py-8">
              <IconTruck className="h-12 w-12 text-gray-4 mx-auto mb-4" />
              <p className="text-sm text-gray-5">
                Silakan pilih alamat asal, alamat tujuan, dan berat paket untuk melihat opsi pengiriman
              </p>
            </div>
          ) : isLoading ? (
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
            <div className="space-y-4">
              {shippingOptions.map((option, index) => (
                <Controller
                  key={`${option.courier}-${option.service}-${index}`}
                  name="shippingMethod"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center p-4 border border-gray-3 rounded-lg cursor-pointer hover:bg-gray-2 transition-colors">
                      <input
                        type="radio"
                        name={field.name}
                        value={`${option.courier}-${option.service}`}
                        onChange={(e) =>
                          field.onChange({
                            name: e.target.value,
                            price: option.cost,
                            courier: option.courier,
                            service: option.service,
                            etd: option.etd,
                          })
                        }
                        className="mr-3"
                      />
                      
                      <div className="flex items-center justify-between flex-1">
                        <div className="flex items-center">
                          <div className="pr-4">
                            <img
                              src={getCourierIcon(option.courier)}
                              alt={`Logo ${option.courier}`}
                              className="h-8 w-auto object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/checkout/dhl.svg';
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
                            {formatPrice(option.cost)}
                          </p>
                          <div className="flex items-center justify-end gap-1 text-custom-xs text-gray-5">
                            <IconTruck className="h-3 w-3" />
                            <span>{formatEtd(option.etd)}</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 