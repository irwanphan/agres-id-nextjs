import { useState } from 'react';
import OriginAddress from './OriginAddress';
import DestinationAddress from './DestinationAddress';
import PackageWeight from './PackageWeight';
import RajaOngkirShippingMethod from './RajaOngkirShippingMethod';
import { RajaOngkirDestination } from '../../lib/rajaongkir';
import { IconTruck, IconMapPin, IconPackage } from '@tabler/icons-react';

export default function RajaOngkirCheckout() {
  const [originDestination, setOriginDestination] = useState<RajaOngkirDestination>();
  const [destinationDestination, setDestinationDestination] = useState<RajaOngkirDestination>();
  const [packageWeight, setPackageWeight] = useState(1);

  const canCalculateShipping = originDestination && destinationDestination && packageWeight > 0;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="bg-white shadow-1 rounded-[10px] p-6">
        <h2 className="text-xl font-semibold text-dark mb-4">Konfigurasi Pengiriman</h2>
        
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${originDestination ? 'text-blue' : 'text-gray-4'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              originDestination ? 'bg-blue text-white' : 'bg-gray-3 text-gray-5'
            }`}>
              <IconMapPin className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Alamat Asal</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${
            originDestination ? 'bg-blue' : 'bg-gray-3'
          }`} />
          
          <div className={`flex items-center gap-2 ${destinationDestination ? 'text-blue' : 'text-gray-4'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              destinationDestination ? 'bg-blue text-white' : 'bg-gray-3 text-gray-5'
            }`}>
              <IconMapPin className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Alamat Tujuan</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${
            destinationDestination ? 'bg-blue' : 'bg-gray-3'
          }`} />
          
          <div className={`flex items-center gap-2 ${packageWeight > 0 ? 'text-blue' : 'text-gray-4'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              packageWeight > 0 ? 'bg-blue text-white' : 'bg-gray-3 text-gray-5'
            }`}>
              <IconPackage className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Berat</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${
            canCalculateShipping ? 'bg-blue' : 'bg-gray-3'
          }`} />
          
          <div className={`flex items-center gap-2 ${canCalculateShipping ? 'text-blue' : 'text-gray-4'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              canCalculateShipping ? 'bg-blue text-white' : 'bg-gray-3 text-gray-5'
            }`}>
              <IconTruck className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Ongkir</span>
          </div>
        </div>
      </div>

      {/* Origin Address */}
      <OriginAddress
        onOriginSelect={setOriginDestination}
        selectedOrigin={originDestination}
      />

      {/* Destination Address */}
      <DestinationAddress
        onDestinationSelect={setDestinationDestination}
        selectedDestination={destinationDestination}
      />

      {/* Package Weight */}
      <PackageWeight
        onWeightChange={setPackageWeight}
        defaultWeight={packageWeight}
      />

      {/* Shipping Methods */}
      {canCalculateShipping && (
        <RajaOngkirShippingMethod
          originDestination={originDestination}
          destinationDestination={destinationDestination}
          weight={packageWeight}
          itemValue={0} // You can calculate this from cart items
        />
      )}

      {/* Info Card */}
      {!canCalculateShipping && (
        <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-6">
          <div className="flex items-start gap-3">
            <IconTruck className="h-5 w-5 text-blue mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-dark mb-2">
                Siap untuk menghitung ongkir?
              </h3>
              <p className="text-sm text-blue-dark">
                Lengkapi alamat asal, alamat tujuan, dan berat paket untuk melihat opsi pengiriman yang tersedia.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 