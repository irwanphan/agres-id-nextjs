'use client';

import { FieldError } from "react-hook-form";

export type City = {
  city_id: string;
  city_name: string;
  province_id: string;
};

type Props = {
  name: string;
  register: any;
  error?: FieldError;
  cities: City[];
  setValue: (name: any, value: string) => void;
};

export default function LocationCityDatalist({ name, register, error, cities, setValue }: Props) { 
  return (
    <div>
      <label htmlFor="city" className="block text-sm font-normal text-gray-6 mb-1.5">
        Kota <span className="text-red">*</span>
      </label>
      <input
        list="city-list" 
        id="city"
        {...register(name, {
          required: "Kota is required",
          validate: (value: string) =>
            cities.some(city => city.city_name === value) || "Pilih kota yang valid"
        })}
        type="text" 
        name={name} 
        className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
        placeholder="Silahkan Ketik dan Pilih Kota..."
        onBlur={e => {
          const selected = cities.find(c => c.city_name === e.target.value);
          setValue("billing.city", selected ? selected.city_name : "");
          setValue("billing.cityId", selected ? selected.city_id : "");
        }}
      />
      <datalist id="city-list">
        {cities.map((city) => (
          <option key={city.city_id} value={city.city_name} />
        ))}
      </datalist>
      {error && <p className="text-sm text-red mt-1.5">{error.message}</p>}
    </div>
  )
}