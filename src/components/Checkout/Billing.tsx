"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Controller } from "react-hook-form";
import LocationProvinceDatalist from "./LocationProvinceDatalist";
import { InputGroup } from "../ui/input";
import { useCheckoutForm } from "./form";
import { splitName } from "@/utils/splitName";
import { CheckMarkIcon } from "@/assets/icons";
import LocationCityDatalist from "./LocationCityDatalist";
import { Province } from "@/types/province";
import { City } from "@/types/city";
import { ChevronDown } from "./icons";
import { AddressType } from "@/get-api-data/address";
import { IconChevronsDown } from "@tabler/icons-react";

export default function Billing() {
  const [dropdown, setDropdown] = useState(true);

  const { register, errors, control, setValue, watch } = useCheckoutForm();
  const session = useSession();
  const provinceId = watch("billing.provinceId");
  // const cityId = watch("billing.cityId");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [addressData, setAddressData] = useState<AddressType>();
  // console.log(cityId);

  useEffect(() => {
    fetch('/api/location/province')
    .then((res) => res.json())
    .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (!provinceId) return setCities([]);
    fetch(`/api/location/city?provinceId=${provinceId}`)
    .then((res) => res.json())
    .then((data) => setCities(data));
  }, [provinceId]);

  useEffect(() => {
    if (!session.data?.user?.id) return;
    fetch(`/api/user/${session.data.user.id}/address?type=BILLING`)
      .then(res => res.json())
      .then(data => setAddressData(data));
  }, [session.data?.user?.id]);

  useEffect(() => {
    if (addressData && session.data?.user?.name) {
      const { firstName, lastName } = splitName(session.data.user.name);
      setValue("billing.firstName", firstName);
      setValue("billing.lastName", lastName);
      setValue("billing.phone", addressData.phone || "");
      setValue("billing.email", addressData.email || "");
      setValue("billing.city", addressData.city || "");
      setValue("billing.province", addressData.province || "");
      setValue("billing.zipCode", addressData.zipCode || "");
      setValue("billing.address.address1", addressData.address?.address1 || "");
      setValue("billing.address.address2", addressData.address?.address2 || "");
    }
  }, [addressData, setValue, session.data?.user?.name]);

  return (
    <div className="bg-white shadow-1 rounded-[10px] ">
      <div
        onClick={() => setDropdown(!dropdown)}
        className="cursor-pointer flex items-center gap-2.5 font-medium text-lg text-dark py-5 px-6 "
      >
        Detil Billing
        <ChevronDown
          className={`fill-current ease-out duration-200 ${
            dropdown && "rotate-180"
          }`}
          aria-hidden
        />
      </div>

      {/* <!-- dropdown menu --> */}
      {dropdown && (

        <div className="p-6 border-t border-gray-3 space-y-5">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Controller
              control={control}
              rules={{ required: true }}
              name="billing.firstName"
              render={({ field, fieldState }) => (
                <InputGroup
                  label="First Name"
                  placeholder="John"
                  required
                  error={!!fieldState.error}
                  errorMessage="First name is required"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  readOnly={!!session.data?.user?.name}
                />
              )}
            />

            <Controller
              control={control}
              rules={{ required: true }}
              name="billing.lastName"
              render={({ field, fieldState }) => (
                <InputGroup
                  label="Last Name"
                  placeholder="Doe"
                  required
                  error={!!fieldState.error}
                  errorMessage="Last name is required"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  readOnly={!!session.data?.user?.name}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Controller
              control={control}
              rules={{ required: true }}
              name="billing.phone"
              render={({ field, fieldState }) => (
                <InputGroup
                  type="tel"
                  label="Phone"
                  required
                  error={!!fieldState.error}
                  errorMessage="Phone number is required"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              rules={{ required: true }}
              name="billing.email"
              render={({ field, fieldState }) => (
                <InputGroup
                  label="Email Address"
                  type="email"
                  required
                  error={!!fieldState.error}
                  errorMessage="Email is required"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="billing.companyName"
              render={({ field }) => (
                <InputGroup
                  label="Company Name"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <LocationProvinceDatalist 
              provinces={provinces}
              name="billing.province"
              register={register} 
              error={errors.billing?.province}
              setValue={setValue}
            />
            <LocationCityDatalist 
              cities={cities}
              name="billing.city" 
              register={register} 
              error={errors.billing?.city}
              setValue={setValue}
            />
          </div>

          <div>
            <Controller
              control={control}
              rules={{ required: true }}
              name="billing.address.address1"
              render={({ field, fieldState }) => (
                <InputGroup
                  label="Street Address"
                  placeholder="House number and street name"
                  required
                  error={!!fieldState.error}
                  errorMessage="Street address is required"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <div className="mt-5">
              <input
                type="text"
                {...register("billing.address.address2")}
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
              />
            </div>
          </div>

          {!session?.data?.user?.email && (
            <div>
              <label
                htmlFor="create-account-checkbox"
                className="flex items-center space-x-2 text-sm cursor-pointer text-gray-6"
              >
                <input
                  type="checkbox"
                  {...register("billing.createAccount")}
                  id="create-account-checkbox"
                  className="sr-only peer"
                />

                <div className="rounded border size-4 text-white flex items-center justify-center border-gray-4 peer-checked:bg-blue peer-checked:border-blue [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                  <CheckMarkIcon />
                </div>

                <span>Create an Account</span>
              </label>
            </div>
          )}

          <div className="text-sm text-green-600 flex items-center justify-end gap-2 h-14 rounded-lg">
            <button type="button" onClick={()=>{
              const element = document.getElementById("section-shipping");
              if (element) {
                const elementPosition = element.offsetTop - 128;
                window.scrollTo({
                  top: elementPosition,
                  behavior: "smooth"
                });
              }
            }} className="text-sm text-blue-light flex items-center gap-2">
              Next, Scroll ke Detil Alamat Pengiriman <IconChevronsDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
