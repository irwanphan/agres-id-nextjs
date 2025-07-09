'use client'

import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { InputGroup } from "../ui/input";
import { useCheckoutForm } from "./form";
import { ChevronDown } from "./icons";

import { SHIPPING_METHODS, ShippingMethodsCard } from "./ShippingMethod";
import { IconChevronsDown, IconChevronsUpRight, IconLoader2 } from "@tabler/icons-react";
import { formatPrice } from "@/utils/formatPrice";
import { ShippingCalculateDomesticCostResponse } from "@/types";
import { useSession } from "next-auth/react";
import { formatPackageWeightKg } from "@/utils/formatPackageWeight";
import { useDebounce } from "use-debounce";
import { PickupPoint } from "@/types/pickup-point";
import { AddressType } from "@/get-api-data/address";

export default function Shipping() {
  const [dropdown, setDropdown] = useState(true);
  const session = useSession();
  const [isPickedUp, setIsPickedUp] = useState(false);
  const { register, control, setValue, watch } = useCheckoutForm();
  
  const shipToDifferentAddress = watch("shipToDifferentAddress");
  const shipToDestination = watch("shipping.destination");
  // HANDLE SHIPPING COST
  const packageWeight = watch("shipping.weight");
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [shippingCost, setShippingCost] = useState<number|null>(null);
  const [loadingOngkir, setLoadingOngkir] = useState(false);
  // HANDLE DESTINATION CITY
  const [destinationCityId, setDestinationCityId] = useState<string>("");
  const [destinationCity, setDestinationCity] = useState<any>({
    id: "",
    label: "",
    province_name: "",
    district_name: "",
    subdistrict_name: "",
    city_name: "",
    zip_code: "",
  });
  const shippingMethod = watch("shippingMethod");
  
  // HANDLE PICKUP OPTION
  // temporary get city from billing address
  const pickupPointCity = watch("billing.city");
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [pickupPointCityOptions, setPickupPointCityOptions] = useState<string[]>([]);
  const [selectedPickupPointCity, setSelectedPickupPointCity] = useState<string>("");
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string>("");
  // fetch Pickup Points from API
  useEffect(() => {
    async function fetchPickupPoints() {
      try {
        if (isPickedUp) {
          const res = await fetch("/api/pickup-points");
          const data = await res.json();
          setPickupPoints(Array.isArray(data) ? data : []);
          setPickupPointCityOptions(Array.from(new Set(data.map((point: PickupPoint) => point.city))));
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchPickupPoints();
  }, [isPickedUp]);
  // handle pickup point change
  const handlePickupPointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPickupPoint(e.target.value);
    setValue("shipping.pickupPointId", e.target.value); // jika pakai react-hook-form
    setValue('shipping.destination', pickupPoints.find(point => point.id === e.target.value)?.name || "");
    setValue("shipping.address.address1", pickupPoints.find(point => point.id === e.target.value)?.address || "");
    setValue("shipping.city", pickupPoints.find(point => point.id === e.target.value)?.city || "");
    setValue("shippingMethod.name", "pickup");
    setValue("shippingMethod.price", 0);
    setValue("shippingMethod.courier", "pickup");
    setValue("shippingMethod.service", "pickup");
    setValue("shippingMethod.etd", "1-2 hari");
    setShippingCost(0);
  };

  // HANDLE SHIPPING OPTION
  const [addressData, setAddressData] = useState<AddressType>();
  const shippingAddressOption = watch("shippingAddressOption");
  const billingAddress = watch("billing.address");
  const billingCity = watch("billing.city");
  const billingProvince = watch("billing.province");
  const billingZipCode = watch("billing.zipCode");
  const billingPhone = watch("billing.phone");
  const billingEmail = watch("billing.email");
  // fetch shipping address from API
  useEffect(() => {
    if (!session.data?.user?.id) return;
    fetch(`/api/user/${session.data.user.id}/address?type=SHIPPING`)
    .then(res => res.json())
    .then(data => setAddressData(data));
  }, [session.data?.user?.id]);
  // default shipping address using user shipping address in my-account
  useEffect(() => {
    setValue("shippingAddressOption", "default");
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [setValue]);
  // handle shipping address option change
  useEffect(() => {
    if (shippingAddressOption === "default") {
      setValue("shipping.address.address1", addressData?.address?.address1 || "");
      setValue("shipping.address.address2", addressData?.address?.address2 || "");
      setValue("shipping.city", addressData?.city || "");
      setValue("shipping.province", addressData?.province || "");
      setValue("shipping.zipCode", addressData?.zipCode || "");
      setValue("shipping.phone", addressData?.phone || "");
      setValue("shipping.email", addressData?.email || "");
    } else if (shippingAddressOption === "sameAsBilling") {
      setValue("shipping.address.address1", billingAddress?.address1 || "");
      setValue("shipping.address.address2", billingAddress?.address2 || "");
      setValue("shipping.city", billingCity || "");
      setValue("shipping.province", billingProvince || "");
      setValue("shipping.zipCode", billingZipCode || "");
      setValue("shipping.phone", billingPhone || "");
      setValue("shipping.email", billingEmail || "");
    } else {
      setValue("shipping.address.address1", "");
      setValue("shipping.address.address2", "");
      setValue("shipping.city", "");
      setValue("shipping.province", "");
      setValue("shipping.zipCode", "");
      setValue("shipping.phone", "");
      setValue("shipping.email", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddressOption, addressData, billingAddress, billingPhone, billingEmail, setValue]);

  // HANDLE CITY SEARCH USING SELECT
  // prefiltered city options for testing
  const [loadingCitySearch, setLoadingCitySearch] = useState(false);
  const [filteredCityOptions, setFilteredCityOptions] = useState<any[]>([]);
  const citySearchParams = `${watch("shipping.city") || ""} ${watch("shipping.province") || ""} ${watch("shipping.zipCode") || ""}`;
  const [debouncedCitySearchParam] = useDebounce(citySearchParams, 1500); // 1500ms debounce
  // useEffect(() => {
  //   const fetchSampleCities = async () => {     
  //     try {
  //       if (debouncedCitySearchParam.trim().length > 0) {
  //         setLoadingCitySearch(true);
  //         console.log('citySearchParams', citySearchParams);
  //         // const res = await fetch(`/api/shipping/destination?search=${encodeURIComponent(citySearchParams)}`);
  //         // const data = await res.json();
  //         // console.log('data', data.data);
  //         // setFilteredCityOptions(data.data || []);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoadingCitySearch(false);
  //     }
  //   };
  //   fetchSampleCities();
  // }, [debouncedCitySearchParam]);
  
  /* populate city options using API */
  const handleFetchCityOptions = async () => {
    try {
      if (debouncedCitySearchParam.trim().length > 0) {
        // console.log('citySearchParams', citySearchParams);
        setLoadingCitySearch(true);
        const res = await fetch(`/api/shipping/destination?search=${encodeURIComponent(debouncedCitySearchParam)}`);
        const data = await res.json();
        setFilteredCityOptions(data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCitySearch(false);
    }
  }
  const handleSelectedCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const found = filteredCityOptions.find(opt => opt.label === label);
    if (found) {
      // console.log('found', found);
      // city_name: "JAKARTA PUSAT"
      // district_name: "SAWAH BESAR"
      // id: 17625
      // label: "MANGGA DUA SELATAN, SAWAH BESAR, JAKARTA PUSAT, DKI JAKARTA, 10730"
      // province_name: "DKI JAKARTA"
      // subdistrict_name: "MANGGA DUA SELATAN"
      // zip_code: "10730"
      setDestinationCityId(String(found.id));
      setDestinationCity(found);
      setValue("shipping.destination", found.label);
    }
  }

  /* HANDLE CITY SEARCH USING TEXT INPUT // no longer used, keep temporarily for testing */
  /*
  const [citySearch, setCitySearch] = useState("");
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [debouncedCitySearch] = useDebounce(citySearch, 2000); // 2000ms debounce

  useEffect(() => {
    if (citySearch !== debouncedCitySearch && citySearch.length >= 3) {
      setLoadingCitySearch(true); // Loading aktif saat user mengetik dan sebelum debounce selesai
    }
  }, [citySearch, debouncedCitySearch]);

  useEffect(() => {
    if (debouncedCitySearch.length < 3) {
      setCityOptions([]);
      setLoadingCitySearch(false); // Pastikan loading mati jika input kurang dari 3
      return;
    }
    let cancelled = false;
    const fetchCities = async () => {
      try {
        setLoadingCitySearch(true);
        const res = await fetch(`/api/shipping/destination?search=${encodeURIComponent(debouncedCitySearch)}`);
        const data = await res.json();
        if (!cancelled) setCityOptions(data.data || []);
        if (!cancelled) setLoadingCitySearch(false);
        // console.log('debouncedCitySearch', debouncedCitySearch);
        // console.log('res', res);
        // console.log('data', data.data);
      } catch (err) {
        if (!cancelled) setCityOptions([]);
        if (!cancelled) setLoadingCitySearch(false);
      }
    };
    fetchCities();
    return () => { cancelled = true; };
  }, [debouncedCitySearch]);

  // Handler pencarian kota destinasi
  const handleCitySearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCitySearch(value);
    if (value.length < 3) {
      setCityOptions([]);
      // return;
    }
  };
  
  // Handler saat user memilih kota dari datalist
  const handleCitySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;
    const found = cityOptions.find(opt => opt.label === label);
    if (found) {
      // console.log('found', found);
      // city_name: "JAKARTA PUSAT"
      // district_name: "SAWAH BESAR"
      // id: 17625
      // label: "MANGGA DUA SELATAN, SAWAH BESAR, JAKARTA PUSAT, DKI JAKARTA, 10730"
      // province_name: "DKI JAKARTA"
      // subdistrict_name: "MANGGA DUA SELATAN"
      // zip_code: "10730"
      setDestinationCityId(String(found.id));
      setDestinationCity(found);
      setValue("shipping.destination", found.label);
    }
  };
  */

  // HANDLER COURIER CHANGE: calculate shipping cost & set shipping method
  const handleCourierChange = async (courier: string) => {
    // console.log('destinationCityId', destinationCityId);
    // console.log('packageWeight', packageWeight);
    // console.log('courier', courier);
    setSelectedCourier(courier);
    // if (courier === "free") {
    //   setShippingCost(0);
    //   setLoadingOngkir(false);
    //   return;
    // }
    setLoadingOngkir(true);
    setShippingCost(null);
    try {
      const res = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // origin: originCityId,
          destination: destinationCityId,
          weight: packageWeight,
          courier,
        }),
      });
      const data: ShippingCalculateDomesticCostResponse = await res.json();
      // Ambil ongkir dari response (asumsi response format Shipping)
      const selectedShipping = data.data[0];
      const cost = selectedShipping?.cost ?? 0;
      setShippingCost(cost || 0);
      setValue("shippingMethod.name", selectedShipping.name);
      setValue("shippingMethod.price", selectedShipping.cost);
      setValue("shippingMethod.courier", selectedShipping.name);
      setValue("shippingMethod.service", selectedShipping.service);
      setValue("shippingMethod.etd", selectedShipping.etd);
    } catch (e) {
      setShippingCost(null);
      throw e;
    }
    setLoadingOngkir(false);
  };

  

  return (
    <div id="section-shipping" className="bg-white shadow-1 rounded-[10px] break-inside-avoid">
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

          <p className="text-sm text-gray-6 mb-5">Paket dikirim atau diambil sendiri (pickup) di gerai AGRES?</p>
          <div className="mb-5 flex flex-col gap-5 md:flex-row">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                id="isPickedUp"
                value="false"
                checked={!isPickedUp}
                onChange={() => setIsPickedUp(!isPickedUp)}
                name="isPickedUp"
              />
              <div className="rounded-md border-[0.5px] shadow-1 border-gray-4 py-2.5 px-4 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-transparent peer-checked:bg-gray-2 cursor-pointer">
                Dikirim
              </div>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                id="isPickedUp"
                value="true"
                checked={isPickedUp}
                onChange={() => setIsPickedUp(!isPickedUp)}
                name="isPickedUp"
              />
              <div className="rounded-md border-[0.5px] shadow-1 border-gray-4 py-2.5 px-4 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-transparent peer-checked:bg-gray-2 cursor-pointer">
                Diambil sendiri (pickup) di gerai AGRES
              </div>
            </label>
          </div>

          <hr className="my-5 border-gray-3" />

          {/* use pickup point */}
          {isPickedUp && (
            <div className={`mb-5 transition-all duration-300 ease-out h-auto ${!isPickedUp ? "h-0" : "h-auto"}`}>
              <div>
                <p className="text-sm text-gray-6 mb-5">Pilih Kota Pickup Point AGRES</p>
                <select 
                  className="w-full py-2.5 pl-4 pr-8 duration-200 
                  rounded-lg border cursor-pointer
                  placeholder:text-sm text-sm placeholder:font-normal placeholder:text-dark-5 
                  border-gray-3 h-11 focus:border-blue focus:outline-0 focus:ring-0
                  "
                  value={selectedPickupPointCity}
                  onChange={e => setSelectedPickupPointCity(e.target.value)}
                  >
                  <option value="">-- Pilih Kota Pickup Point --</option>
                  {pickupPointCityOptions.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="mt-2">
                <label className="block text-sm mb-1">Pilih Pickup Point</label>
                <select
                  className="w-full py-2.5 pl-4 pr-8 duration-200 
                  rounded-lg border cursor-pointer
                  placeholder:text-sm text-sm placeholder:font-normal placeholder:text-dark-5 
                  border-gray-3 h-11 focus:border-blue focus:outline-0 focus:ring-0
                  "
                  value={selectedPickupPoint}
                  onChange={e => handlePickupPointChange(e)}
                  required
                >
                  <option value="">-- Pilih Pickup Point --</option>
                  {pickupPoints
                    .filter(point => point.city.toLowerCase().includes(selectedPickupPointCity.toLowerCase()))
                    .map((point: PickupPoint) => (
                      <option key={point.id} value={point.id}>
                        {point.name}-{point.address}, {point.city}, {point.province}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {!isPickedUp && (
            <>
              {/* get destination id from API call */}
              <div className={`mb-5 transition-all duration-300 ease-out h-auto ${isPickedUp ? "opacity-0" : "opacity-100"}`}>

                {/* pilih alamat pengiriman: default, billing, lainnya */}
                <p className="text-sm text-gray-6 mb-5">Gunakan alamat pengiriman yang mana?</p>
                <div className="mb-5">
                  <Controller
                    control={control}
                    name="shippingAddressOption"
                    render={({ field }) => (
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="default"
                            checked={field.value === "default"}
                            onChange={field.onChange}
                            name={field.name}
                          />
                          <div className="rounded-md border-[0.5px] shadow-1 border-gray-4 py-2.5 px-4 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-transparent peer-checked:bg-gray-2 cursor-pointer">
                            Default Pengiriman
                          </div>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="sameAsBilling"
                            checked={field.value === "sameAsBilling"}
                            onChange={field.onChange}
                            name={field.name}
                          />
                          <div className="rounded-md border-[0.5px] shadow-1 border-gray-4 py-2.5 px-4 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-transparent peer-checked:bg-gray-2 cursor-pointer">
                            Sama dengan Billing
                          </div>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="other"
                            checked={field.value === "other"}
                            onChange={field.onChange}
                            name={field.name}
                          />
                          <div className="rounded-md border-[0.5px] shadow-1 border-gray-4 py-2.5 px-4 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-transparent peer-checked:bg-gray-2 cursor-pointer">
                            Lainnya, Isi Alamat Pengiriman
                          </div>
                        </label>
                      </div>
                    )}
                  />
                </div>

                <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div>
                    <Controller
                      control={control}
                      name="shipping.province"
                      render={({ field }) => (
                        <InputGroup
                          type="text"
                          label="Provinsi Tujuan"
                          placeholder="Provinsi Tujuan"
                          value={field.value !== undefined ? field.value : ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="shipping.city"
                      render={({ field }) => (
                        <InputGroup
                          type="text"
                          label="Kota Tujuan"
                          placeholder="Kota Tujuan"
                          value={field.value !== undefined ? field.value : ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="shipping.zipCode"
                      render={({ field }) => (
                        <InputGroup
                          type="text"
                          label="Kode Pos"
                          placeholder="Kode Pos"
                          value={field.value !== undefined ? field.value : ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label htmlFor="destination-city-search" className="block mb-1.5 text-sm text-gray-6">
                    Konfirmasi Ketersediaan Kota Tujuan <span className="text-red">*</span>
                    {loadingCitySearch && (
                      <span className="ml-2 text-blue-500 text-xs">Loading...</span>
                      )}
                  </label>
                  {/* <input
                    id="destination-city-search"
                    className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11 focus:border-blue focus:outline-0 placeholder:text-dark-5 w-full py-2.5 px-4 duration-200 focus:ring-0"
                    list="destination-city-options"
                    value={citySearch}
                    required
                    onChange={handleCitySearch}
                    onBlur={handleCitySelect}
                    placeholder="Mulai cari nama kota atau kabupaten tujuan..."
                  />
                  <datalist id="destination-city-options">
                    {cityOptions.map(opt => (
                      <option key={opt.id} value={opt.label} />
                    ))}
                  </datalist> */}
                  <select 
                    id="destination-city-search"
                    className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11 focus:border-blue focus:outline-0 placeholder:text-dark-5 w-full py-2.5 pl-4 pr-8 duration-200 focus:ring-0"
                    onFocus={handleFetchCityOptions}
                    onChange={handleSelectedCity}
                  >
                    <option value="">-- Pilih Kota Destinasi --</option>
                    { !loadingCitySearch && filteredCityOptions.length > 0 && (
                      filteredCityOptions.map(opt => (
                        <option key={opt.id} value={opt.label}>{opt.label}</option>
                      ))
                    )}
                    {loadingCitySearch && (
                      <option value="loading" disabled>Loading...</option>
                    )}
                    { !loadingCitySearch && filteredCityOptions.length === 0 && (
                      <option value="not-found" disabled>Kota tujuan tidak ditemukan</option>
                    )}
                  </select>
                </div>

                <div className="mb-5">
                  <Controller
                    control={control}
                    name="shipping.address.address1"
                    render={({ field }) => (
                      <InputGroup
                        label="Street Address"
                        placeholder="House number and street name"
                        required
                        // readOnly={shippingAddressOption === "sameAsBilling" || shippingAddressOption === "default"}
                        name={field.name}
                        value={field.value !== undefined ? field.value : ""}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <div className="mt-5">
                    <input
                      type="text"
                      {...register("shipping.address.address2")}
                      // readOnly={shippingAddressOption === "sameAsBilling" || shippingAddressOption === "default"}
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      className={`
                        rounded-lg border placeholder:text-sm 
                        text-sm placeholder:font-normal border-gray-3 h-11
                        focus:border-blue focus:outline-0
                        placeholder:text-dark-5 w-full
                        py-2.5 px-4 duration-200 focus:ring-0
                        `}
                        // ${shippingAddressOption === "sameAsBilling" || shippingAddressOption === "default" ? "bg-gray-2" : ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-5">
                  <Controller
                    control={control}
                    name="shipping.phone"
                    render={({ field }) => (
                      <InputGroup
                        type="tel"
                        label="Phone"
                        required
                        // readOnly={shippingAddressOption === "sameAsBilling" || shippingAddressOption === "default"}
                        name={field.name}
                        value={field.value !== undefined ? field.value : ""}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="shipping.email"
                    render={({ field }) => (
                      <InputGroup
                        label="Email Address"
                        type="email"
                        required
                        // readOnly={shippingAddressOption === "sameAsBilling" || shippingAddressOption === "default"}
                        name={field.name}
                        value={field.value !== undefined ? field.value : ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="mb-5">
                  <label className="block mb-1.5 text-sm text-gray-6">Kurir ({formatPackageWeightKg(packageWeight || 0)})</label>
                  <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-4">
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
                    {/* <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="courier" 
                        value="free" 
                        checked={selectedCourier==="free"} 
                        onChange={()=>handleCourierChange("free")} />
                        <div className="rounded-md border-[0.5px] shadow-1 border-gray-4 py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-transparent peer-checked:bg-gray-2">
                          Pickup di Gerai <strong>AGRES</strong>
                        </div>
                    </label> */}
                  </div>
                </div>
              </div>
            </>
          )}

          {loadingOngkir && (
            <div className="text-sm mt-4 flex items-center px-4 py-1.5 gap-2 border border-gray-4 min-h-14 rounded-lg">
              Menghitung ongkir...
              <IconLoader2 className="w-5 h-5 animate-spin" />
            </div>
          )}
          {shippingCost!==null && !loadingOngkir && (
            <div className="text-sm text-green-600 mt-4 flex items-center justify-between px-4 py-1.5 gap-2 border border-gray-4 min-h-14 rounded-lg">
              <div className="text-sm flex flex-wrap">
                <p>
                  Ongkos kirim: 
                  <span className="font-bold ml-1 text-green">{formatPrice(shippingCost).toLocaleString()}</span>,
                </p>
                <p>
                  Estimasi Pengiriman (ETD)
                  <span className="font-bold ml-1 text-green">{shippingMethod.etd}</span>
                </p>
              </div>
              <span className="text-sm">
                <button type="button" onClick={()=>{
                  const element = document.getElementById("section-orders");
                  if (element) {
                    const elementPosition = element.offsetTop - 128;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: "smooth"
                    });
                  }
                }} className="text-sm text-blue-light flex items-center gap-2">
                  Next, Scroll ke Detil Pesanan
                  <IconChevronsUpRight className="w-5 h-5 hidden md:block" />
                  <IconChevronsDown className="w-5 h-5 block md:hidden" />
                </button>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
