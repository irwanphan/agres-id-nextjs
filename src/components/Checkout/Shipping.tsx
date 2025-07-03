import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { InputGroup } from "../ui/input";
import { useCheckoutForm } from "./form";
import { ChevronDown } from "./icons";

import { SHIPPING_METHODS, ShippingMethodsCard } from "./ShippingMethod";

export default function Shipping() {
  const [dropdown, setDropdown] = useState(true);
  const { register, control, setValue, watch } = useCheckoutForm();
  const shipToDifferentAddress = watch("shipToDifferentAddress");
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [shippingCost, setShippingCost] = useState<number|null>(null);
  const [loadingOngkir, setLoadingOngkir] = useState(false);

  const [citySearch, setCitySearch] = useState("");
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [destinationCityId, setDestinationCityId] = useState<string>("");

  // Handler pencarian kota destinasi
  const handleCitySearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCitySearch(value);
    if (value.length < 3) {
      setCityOptions([]);
      return;
    }
    try {
      const res = await fetch(`/api/rajaongkir/destination?search=${encodeURIComponent(value)}`);
      const data = await res.json();
      setCityOptions(data.data || []);
    } catch (err) {
      setCityOptions([]);
    }
  };

  // Handler saat user memilih kota dari datalist
  const handleCitySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;
    const found = cityOptions.find(opt => opt.label === label);
    if (found) {
      setDestinationCityId(String(found.id));
    }
  };

  useEffect(() => {
    if (dropdown) {
      setValue("shipToDifferentAddress", true);
    } else {
      setValue("shipToDifferentAddress", false);
    }
  }, [dropdown, setValue]);

  // Handler untuk fetch ongkir
  const handleCourierChange = async (courier: string) => {
    console.log(destinationCityId);

    setSelectedCourier(courier);
    setLoadingOngkir(true);
    setShippingCost(null);
    try {
      const res = await fetch("/api/rajaongkir/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // origin: originCityId,
          destination: destinationCityId,
          weight: 1000,
          courier,
        }),
      });
      const data = await res.json();
      // Ambil ongkir dari response (asumsi response format RajaOngkir)
      const cost = data?.rajaongkir?.results?.[0]?.costs?.[0]?.cost?.[0]?.value;
      setShippingCost(cost || null);
    } catch (e) {
      setShippingCost(null);
    }
    setLoadingOngkir(false);
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] break-inside-avoid">
      <div
        onClick={() => setDropdown(!dropdown)}
        className="cursor-pointer flex items-center gap-2.5 font-medium text-lg text-dark py-5 px-6 "
      >
        Detil Alamat Pengiriman
        <ChevronDown
          className={`fill-current ease-out duration-200 ${
            dropdown && "rotate-180"
          }`}
          aria-hidden
        />
      </div>

      {/* <!-- dropdown menu --> */}
      {dropdown && (
        <div className="p-6 border-t border-gray-3">
          <div className="mb-5">
            <label htmlFor="destination-city-search" className="block mb-1.5 text-sm text-gray-6">
              Cari Kota Tujuan (API Komerce)
            </label>
            <input
              id="destination-city-search"
              className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11 focus:border-blue focus:outline-0 placeholder:text-dark-5 w-full py-2.5 px-4 duration-200 focus:ring-0"
              list="destination-city-options"
              value={citySearch}
              onChange={handleCitySearch}
              onBlur={handleCitySelect}
              placeholder="Ketik nama kota tujuan..."
            />
            <datalist id="destination-city-options">
              {cityOptions.map(opt => (
                <option key={opt.id} value={opt.label} />
              ))}
            </datalist>
          </div>

          <div className="mb-5">
            <label className="block mb-1.5 text-sm text-gray-6">Kurir</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="courier" 
                  value="free" 
                  checked={selectedCourier==="free"} 
                  onChange={()=>handleCourierChange("free")} />
                  <div className="rounded-md border-[0.5px] shadow-1 border-gray-4 py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-transparent peer-checked:bg-gray-2">
                    Pickup di Gerai <strong>AGRES</strong>
                  </div>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="courier" 
                  value="jne" 
                  checked={selectedCourier==="jne"} 
                  onChange={()=>handleCourierChange("jne")} />
                  { ShippingMethodsCard({method: "jne"})}
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="courier" 
                  value="sicepat" 
                  checked={selectedCourier==="sicepat"} 
                  onChange={()=>handleCourierChange("sicepat")} />
                  { ShippingMethodsCard({method: "sicepat"})}
              </label>
            </div>
            {loadingOngkir && <div className="text-sm text-gray-500 mt-2">Menghitung ongkir...</div>}
            {shippingCost!==null && !loadingOngkir && (
              <div className="text-sm text-green-600 mt-2">Ongkos kirim: Rp{shippingCost.toLocaleString()}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
