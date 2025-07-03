'use client';

import { useEffect, useState } from "react";
import { FieldError } from "react-hook-form";

type Province = {
  province_id: string;
  province: string;
};

type Props = {
  name: string;
  register: any;
  error?: FieldError;
};

export default function RajaOngkirProvinceDatalist({ name, register, error }: Props) { 
  const [provinces, setProvinces] = useState<Province[]>([]);

  useEffect(() => {
    fetch('/api/rajaongkir/province')
    .then((res) => res.json())
    .then((data) => setProvinces(data));
  }, []);

  console.log(provinces);

  return (
    <div>
      <label htmlFor="province">
        Provinsi <span className="text-red">*</span>
      </label>
      <input
        list="province-list" 
        id="province" 
        // {...register("billing.regionName", { required: true })}
        // {...register(name, {
        //   required: true,
        //   validate: (value: string) => provinces.some(province => province.province === value) || "Pilih provinsi yang valid"
        // })}
        {...register(name, {
          required: "Province is required",
          validate: (value: string) =>
            provinces.some(province => province.province === value) || "Pilih provinsi yang valid"
        })}
        type="text" 
        name={name} 
        // autoComplete="on" 
        className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
        placeholder="Silahkan Ketik dan Pilih Provinsi..."
      />
      <datalist id="province-list">
        {provinces.map((province) => (
          <option key={province.province_id} value={province.province} />
        ))}
      </datalist>
      {error && <p className="text-sm text-red mt-1.5">{error.message}</p>}
    </div>
  )
}