"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Controller } from "react-hook-form";
import RajaOngkirProvinceDatalist from "./RajaOngkirProvinceDatalist";
import { InputGroup } from "../ui/input";
import { useCheckoutForm } from "./form";
import { splitName } from "@/utils/splitName";
import { CheckMarkIcon } from "@/assets/icons";
import RajaOngkirCityDatalist from "./RajaOngkirCityDatalist";
// import { ChevronDown } from "./icons";
import { Province } from "./RajaOngkirProvinceDatalist";
import { City } from "./RajaOngkirCityDatalist";

export default function Billing() {
  const { register, errors, control, setValue, watch } = useCheckoutForm();
  const session = useSession();
  const provinceId = watch("billing.provinceId");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  console.log(provinceId);

  useEffect(() => {
    fetch('/api/rajaongkir/province')
    .then((res) => res.json())
    .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (!provinceId) return setCities([]);
    fetch(`/api/rajaongkir/city?provinceId=${provinceId}`)
    .then((res) => res.json())
    .then((data) => setCities(data));
  }, [provinceId]);

  console.log(cities);

  useEffect(() => {
    if (session.data?.user?.name && session.data?.user?.email) {
      const { firstName, lastName } = splitName(session.data.user.name);
      setValue("billing.firstName", firstName);
      setValue("billing.lastName", lastName);
      setValue("billing.email", session.data.user.email);
    }
  }, [session.data?.user, setValue])

  return (
    <div className="bg-white shadow-1 rounded-[10px] ">
      <div className="p-6 py-5 border-b border-gray-3">
        <h2 className="text-lg font-medium text-dark">Detail Pengiriman</h2>
      </div>

      <div className="p-6 space-y-5">
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
          {/* <select
            {...register("billing.regionName", { required: true })}
            id="regionName"
            className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
            required
          >
            <option value="" hidden>
              Select your country
            </option>

            <option value="australia">Australia</option>
            <option value="america">America</option>
            <option value="england">England</option>
          </select> */}
          <RajaOngkirProvinceDatalist 
            provinces={provinces}
            name="billing.province"
            register={register} 
            error={errors.billing?.province}
            setValue={setValue}
          />
          <RajaOngkirCityDatalist 
            cities={cities}
            name="billing.city" 
            register={register} 
            error={errors.billing?.city} />
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

        {/* <div>
          <Controller
            control={control}
            rules={{ required: true }}
            name="billing.town"
            render={({ field, fieldState }) => (
              <InputGroup
                label="Town/City"
                required
                error={!!fieldState.error}
                errorMessage="Town is required"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div> */}

        {/* <div>
          <Controller
            control={control}
            rules={{ required: true }}
            name="billing.country"
            render={({ field }) => (
              <InputGroup
                label="Country"
                required
                name={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div> */}

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
                readOnly={!!session?.data?.user?.email}
              />
            )}
          />
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
      </div>
    </div>
  );
}
