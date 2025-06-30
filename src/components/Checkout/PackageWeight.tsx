import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useCheckoutForm } from './form';
import { IconPackage, IconInfoCircle } from '@tabler/icons-react';

interface PackageWeightProps {
  onWeightChange: (weight: number) => void;
  defaultWeight?: number;
}

export default function PackageWeight({ onWeightChange, defaultWeight = 1 }: PackageWeightProps) {
  const { control } = useCheckoutForm();
  const [weight, setWeight] = useState(defaultWeight);

  const handleWeightChange = (newWeight: number) => {
    const validWeight = Math.max(0.1, Math.min(50, newWeight)); // Min 0.1kg, Max 50kg
    setWeight(validWeight);
    onWeightChange(validWeight);
  };

  return (
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
          defaultValue={weight}
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
                  value={weight}
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
              
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <IconInfoCircle className="h-4 w-4 text-blue mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-dark">
                    <p className="font-medium mb-1">Tips:</p>
                    <ul className="space-y-1">
                      <li>• Berat minimal: 0.1 kg</li>
                      <li>• Berat maksimal: 50 kg</li>
                      <li>• Gunakan titik (.) untuk desimal</li>
                      <li>• Berat akan dibulatkan ke atas oleh kurir</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
} 