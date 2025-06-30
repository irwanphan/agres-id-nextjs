import { useState } from 'react';
import DestinationSearch from './DestinationSearch';
import { RajaOngkirDestination } from '../../lib/rajaongkir';
import { IconMapPin, IconEdit } from '@tabler/icons-react';

interface DestinationAddressProps {
  onDestinationSelect: (destination: RajaOngkirDestination) => void;
  selectedDestination?: RajaOngkirDestination;
}

export default function DestinationAddress({ 
  onDestinationSelect, 
  selectedDestination 
}: DestinationAddressProps) {
  const [isEditing, setIsEditing] = useState(!selectedDestination);

  const handleDestinationSelect = (destination: RajaOngkirDestination) => {
    onDestinationSelect(destination);
    setIsEditing(false);
  };

  if (!isEditing && selectedDestination) {
    return (
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="px-6 py-5 border-b border-gray-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-dark">Alamat Tujuan</h3>
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
            <IconMapPin className="h-5 w-5 text-green mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-dark">
                {selectedDestination.name}
              </p>
              <p className="text-sm text-gray-5 mt-1">
                {selectedDestination.city_name}, {selectedDestination.province_name}
              </p>
              {selectedDestination.postal_code && (
                <p className="text-sm text-gray-5">
                  Kode Pos: {selectedDestination.postal_code}
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
        <h3 className="text-lg font-medium text-dark">Alamat Tujuan</h3>
        <p className="text-sm text-gray-5 mt-1">
          Pilih lokasi tujuan pengiriman untuk menghitung ongkir
        </p>
      </div>
      
      <div className="p-6">
        <DestinationSearch
          name="destinationDestination"
          label="Cari Alamat Tujuan"
          placeholder="Cari kota, kecamatan, atau kode pos tujuan..."
          required
          onDestinationSelect={handleDestinationSelect}
        />
      </div>
    </div>
  );
} 