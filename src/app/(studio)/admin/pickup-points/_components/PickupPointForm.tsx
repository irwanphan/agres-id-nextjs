"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputGroup } from "@/components/ui/input";
import cn from "@/utils/cn";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createPickupPoint, updatePickupPoint } from "@/app/actions/pickup-point";
import LocationCityDatalist from "@/components/Checkout/LocationCityDatalist";
import { Province } from "@/types/province";
import { City } from "@/types/city";
import { PickupPoint } from "@/types/pickup-point";

type PickupPointProps = {
  pickupPointItem?: PickupPoint | null; // Existing pickup point for editing
};

export default function PickupPointForm({ pickupPointItem }: PickupPointProps) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<PickupPoint>({
    defaultValues: {
      name: pickupPointItem?.name || "",
      address: pickupPointItem?.address || "",
      pinAddress: pickupPointItem?.pinAddress || "",
      city: pickupPointItem?.city || "",
      province: pickupPointItem?.province || "",
      zipCode: pickupPointItem?.zipCode || "",
      phone: pickupPointItem?.phone || "",
      isActive: pickupPointItem?.isActive || true,
      latitude: pickupPointItem?.latitude || null,
      longitude: pickupPointItem?.longitude || null,
      teamCode: pickupPointItem?.teamCode || "",
    },
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);

  // console.log('selectedProvince', selectedProvince);

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await fetch('/api/location/province');
        const data = await res.json();
        setProvinces(data);
        // console.log('provinces', data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    }
    fetchProvinces();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      try {
        if (!selectedProvince) return setCities([]);
        const res = await fetch(`/api/location/city?provinceId=${selectedProvince}`);
        const data = await res.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
    fetchCities();
  }, [selectedProvince]);

  useEffect(() => {
    if (pickupPointItem) {
      setValue("isActive", pickupPointItem.isActive);
    }
  }, [pickupPointItem, setValue]);

  const onSubmit = async (data: PickupPoint) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("pinAddress", data.pinAddress || "");
      formData.append("city", data.city);
      formData.append("province", data.province);
      formData.append("zipCode", data.zipCode || "");
      formData.append("phone", data.phone || "");
      formData.append("isActive", data.isActive.toString());
      formData.append("latitude", data.latitude?.toString() || "");
      formData.append("longitude", data.longitude?.toString() || "");
      formData.append("teamCode", data.teamCode || "");
      let result;
      if (pickupPointItem) {
        result = await updatePickupPoint(pickupPointItem.id, formData);
      } else {
        result = await createPickupPoint(formData);
      }
      if (result?.success) {
        toast.success(
          `Pickup Point ${pickupPointItem ? "updated" : "created"} successfully`
        );
        reset();
        router.push("/admin/pickup-points");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to upload pickup point");
      }
    } catch (error: any) {
      console.error("Error uploading pickup point:", error);
      toast.error(error?.message || "Failed to upload pickup point");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 mb-5">
        <div className="grid grid-cols-3 gap-5">
          {/* Title Input */}
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <div className="w-full">
                <InputGroup
                  label="Nama"
                  type="text"
                  required
                  error={!!fieldState.error}
                  errorMessage="Nama Pickup Point harus diisi"
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </div>
            )}
          />

          {/* teamCode */}
          <Controller
            control={control}
            name="teamCode"
            rules={{ required: false }}
            render={({ field }) => (
              <div className="w-full">
                <InputGroup
                  label="Team Code"
                  type="text"
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </div>
            )}
          />

          {/* phone */}
          <Controller
            control={control}
            name="phone"
            rules={{ required: false }}
            render={({ field }) => (
              <div className="w-full">
                <InputGroup
                  label="No. Telepon"
                  type="text"
                  required
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <label htmlFor="province" className="block text-sm font-normal text-gray-6 mb-1.5">
              Provinsi <span className="text-red">*</span>
            </label>
            
            <input
              list="province-list" 
              id="province" 
              {...register("province", {
                required: true,
                validate: (value: string) =>
                  provinces.some(province => province.province === value) || "Pilih provinsi yang valid"
              })}
              type="text" 
              name="province" 
              className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
              placeholder="Silahkan Ketik dan Pilih Provinsi..."
              onBlur={() => {
                const selected = provinces.find(p => p.province === watch("province"));
                // console.log('selected', selected);
                setSelectedProvince(selected ? selected.province_id : "");
              }}
            />
            <datalist id="province-list">
              {provinces.map((province) => (
                <option key={province.province_id} value={province.province} />
              ))}
            </datalist>
            {errors.province && <p className="text-sm text-red mt-1.5">{errors.province.message}</p>}
          </div>
          <LocationCityDatalist 
            cities={cities}
            name="city" 
            register={register} 
            error={errors.city}
            setValue={setValue}
          />

          {/* zipCode */}
          <Controller
            control={control}
            name="zipCode"
            rules={{ required: false }}
            render={({ field }) => (
              <div className="w-full">
                <InputGroup
                  label="Kode Pos"
                  type="text"
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
        </div>

        {/* address Input */}
        <div>
          <Controller
            control={control}
            name="address"
            rules={{ required: false }}
            render={({ field }) => (
              <div className="w-full">
                <InputGroup
                  label="Alamat"
                  type="text"
                  required
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
        </div>

        {/* pinAddress Input */}
        <div>
          <Controller
            control={control}
            name="pinAddress"
            rules={{ required: false }}
            render={({ field }) => (
              <div className="w-full">
                <InputGroup
                  label="Alamat Pencarian / Pin Google Maps"
                  type="text"
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
        </div>        

        <div className="grid grid-cols-2 gap-5">
          <Controller
            control={control}
            name="longitude"
            rules={{ required: false }}
            render={({ field }) => (
              <div className="w-full">
                <InputGroup
                  label="Longitude"
                  type="number"
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="latitude"
            rules={{ required: false }}
            render={({ field }) => (
              <div className="w-full">
                <InputGroup
                  label="Latitude"
                  type="number"
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
        </div>

        {/* isActive */}
        <div className="">
          <Controller
            control={control}
            name="isActive"
            rules={{ required: false }}
            render={({ field }) => (
              <div className="w-full">
                <InputGroup
                  label="Is Active"
                  type="checkbox"
                  name={field.name}
                  checked={field.value ?? false}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        className={cn(
          "inline-flex mt-1.5 items-center gap-2 font-normal text-sm text-white bg-blue py-3 px-5  rounded-lg ease-out duration-200 hover:bg-blue-dark",
          { "opacity-80 pointer-events-none": isLoading }
        )}
        disabled={isLoading}
      >
        {isLoading ? "Menyimpan..." : pickupPointItem ? "Update Pickup Point" : "Simpan Pickup Point"}
      </button>
    </form>
  );
}
