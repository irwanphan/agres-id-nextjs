import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { InputGroup } from "../ui/input";
import { useCheckoutForm } from "./form";
import { ChevronDown } from "./icons";
import { useShippingContext } from "./ShippingContext";

export default function Shipping() {
  const [dropdown, setDropdown] = useState(false);
  const { register, control, setValue, watch } = useCheckoutForm();
  const shipToDifferentAddress = watch("shipToDifferentAddress");
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [shippingCost, setShippingCost] = useState<number|null>(null);
  const [loadingOngkir, setLoadingOngkir] = useState(false);
  const { originCityId, destinationCityId } = useShippingContext();

  console.log(originCityId, destinationCityId);

  useEffect(() => {
    if (dropdown) {
      setValue("shipToDifferentAddress", true);
    } else {
      setValue("shipToDifferentAddress", false);
    }
  }, [dropdown, setValue]);

  // Handler untuk fetch ongkir
  const handleCourierChange = async (courier: string) => {
    setSelectedCourier(courier);
    setLoadingOngkir(true);
    setShippingCost(null);
    try {
      const res = await fetch("/api/rajaongkir/cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: originCityId,
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
        Ship to a different address?
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
            <label
              htmlFor="shipping-country-name"
              className="block mb-1.5 text-sm text-gray-6"
            >
              Country/ Region
              <span className="text-red">*</span>
            </label>

            <div className="relative">
              <select
                {...register("shipping.countryName", {
                  required: shipToDifferentAddress
                    ? "Country is required"
                    : false,
                })}
                id="shipping-country-name"
                className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
              >
                <option value="">Select a country</option>
                <option value="australia">Australia</option>
                <option value="america">America</option>
                <option value="england">England</option>
              </select>
            </div>
          </div>

          <div className="mb-5">
            <Controller
              control={control}
              name="shipping.address.street"
              render={({ field }) => (
                <InputGroup
                  label="Street Address"
                  placeholder="House number and street name"
                  required
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <div className="mt-5">
              <input
                type="text"
                {...register("shipping.address.apartment")}
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
              />
            </div>
          </div>

          <div className="mb-5">
            <Controller
              control={control}
              name="shipping.town"
              render={({ field }) => (
                <InputGroup
                  label="Town/City"
                  required
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="mb-5">
            <Controller
              control={control}
              name="shipping.country"
              render={({ field }) => (
                <InputGroup
                  label="Country"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="mb-5">
            <Controller
              control={control}
              name="shipping.phone"
              render={({ field }) => (
                <InputGroup
                  type="tel"
                  label="Phone"
                  required
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="shipping.email"
            render={({ field }) => (
              <InputGroup
                label="Email Address"
                type="email"
                required
                name={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div className="mb-5">
            <label className="block mb-1.5 text-sm text-gray-6">Kurir</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="courier" value="jne" checked={selectedCourier==="jne"} onChange={()=>handleCourierChange("jne")} /> JNE
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="courier" value="jnt" checked={selectedCourier==="jnt"} onChange={()=>handleCourierChange("jnt")} /> JNT
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
