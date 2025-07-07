"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputGroup } from "@/components/ui/input";
import cn from "@/utils/cn";
import { useRouter } from "next/navigation";
import { PickupPoint } from "@prisma/client";
import toast from "react-hot-toast";
import { createPickupPoint, updatePickupPoint } from "@/app/actions/pickup-point";
import LocationProvinceDatalist, { Province } from "@/components/Checkout/LocationProvinceDatalist";
import LocationCityDatalist, { City } from "@/components/Checkout/LocationCityDatalist";

interface PickupPointInput {
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string | null;
  isActive: boolean;
}

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
  } = useForm<PickupPointInput>({
    defaultValues: {
      name: pickupPointItem?.name || "",
      address: pickupPointItem?.address || "",
      city: pickupPointItem?.city || "",
      province: pickupPointItem?.province || "",
      phone: pickupPointItem?.phone || "",
      isActive: pickupPointItem?.isActive || true,
    },
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const selectedProvince = watch("province");
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetch('/api/location/province')
    .then((res) => res.json())
    .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (!selectedProvince) return setCities([]);
    fetch(`/api/location/city?provinceId=${selectedProvince}`)
    .then((res) => res.json())
    .then((data) => setCities(data));
  }, [selectedProvince]);

  useEffect(() => {
    if (pickupPointItem) {
      setValue("isActive", pickupPointItem.isActive);
    }
  }, [pickupPointItem, setValue]);

  const onSubmit = async (data: PickupPointInput) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("province", data.province);
      formData.append("phone", data.phone || "");
      formData.append("isActive", data.isActive.toString());
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
        <div className="grid grid-cols-2 gap-5">
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

        <div className="grid grid-cols-2 gap-5">
          <LocationProvinceDatalist 
            provinces={provinces}
            name="province"
            register={register} 
            error={errors.province}
            setValue={setValue}
          />
          <LocationCityDatalist 
            cities={cities}
            name="city" 
            register={register} 
            error={errors.city}
            setValue={setValue}
          />
        </div>

        {/* isActive */}
        <div>
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
