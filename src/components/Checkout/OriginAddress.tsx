import { useState } from 'react';
import DestinationSearch from './DestinationSearch';
import { RajaOngkirDestination } from '../../lib/rajaongkir';
import { IconMapPin, IconEdit } from '@tabler/icons-react';

interface OriginAddressProps {
  onOriginSelect: (destination: RajaOngkirDestination) => void;
  selectedOrigin?: RajaOngkirDestination;
}

export default function OriginAddress({ onOriginSelect, selectedOrigin }: OriginAddressProps) {
  const [isEditing, setIsEditing] = useState(!selectedOrigin);

  const handleOriginSelect = (destination: RajaOngkirDestination) => {
    onOriginSelect(destination);
    setIsEditing(false);
  };

  if (!isEditing && selectedOrigin) {
    return (
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="px-6 py-5 border-b border-gray-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-dark">Alamat Asal</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-sm text-blue hover:text-blue-dark transition-colors"
            >
              <IconEdit className="h-4 w-4" />
              Ubah
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-3">
            <IconMapPin className="h-5 w-5 text-blue mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-dark">
                {selectedOrigin.name}
              </p>
              <p className="text-sm text-gray-5 mt-1">
                {selectedOrigin.city_name}, {selectedOrigin.province_name}
              </p>
              {selectedOrigin.postal_code && (
                <p className="text-sm text-gray-5">
                  Kode Pos: {selectedOrigin.postal_code}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div className="px-6 py-5 border-b border-gray-3">
        <h3 className="text-lg font-medium text-dark">Alamat Asal</h3>
        <p className="text-sm text-gray-5 mt-1">
          Pilih lokasi asal pengiriman untuk menghitung ongkir
        </p>
      </div>
      
      <div className="p-6">
        <DestinationSearch
          name="originDestination"
          label="Cari Alamat Asal"
          placeholder="Cari kota, kecamatan, atau kode pos asal..."
          required
          onDestinationSelect={handleOriginSelect}
        />
      </div>
    </div>
  );
} 