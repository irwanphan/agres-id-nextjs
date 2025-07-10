"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import cn from "@/utils/cn";
import Loader from "../Common/Loader";
import { XIcon } from "@/assets/icons";
import { InputGroup } from "../ui/input";
import { Province } from "@/types/province";
import { City } from "@/types/city";
import { IconDeviceFloppy } from "@tabler/icons-react";

type AddressInputForm = {
  name: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  zipCode: string;
  address: {
    address1: string;
    address2: string;
  };
};

type PropsType = {
  userId?: string;
  isOpen: boolean;
  closeModal: () => void;
  addressType: "SHIPPING" | "BILLING";
  data?: AddressInputForm & {
    id: string;
  };
  onSubmitSuccess?: () => void;
};

const AddressModal = ({
  isOpen,
  closeModal,
  addressType,
  data,
  userId,
  onSubmitSuccess,
}: PropsType) => {
  const { register, setValue, watch, ...form } = useForm<AddressInputForm>({
    defaultValues: {
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      city: data?.city,
      zipCode: data?.zipCode,
      province: data?.province,
      address: data?.address,
    },
  });

  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (addressType === "BILLING" && data?.email !== userEmail) {
      setValue("email", userEmail);
    }
  }, [addressType, data?.email, userEmail, setValue]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await fetch('/api/location/province');
        const data = await res.json();
        setProvinces(data);
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
    // closing modal while clicking outside
    function handleClickOutside(event: any) {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

  const onSubmit = async (inputData: AddressInputForm) => {
    // console.log("inputData", inputData);
    if (data === null) {
      setIsLoading(true);
      // create new address
      try {
        await axios.post(`/api/user/${userId}/address`, {
          address: {
            address: inputData.address,
            city: inputData.city,
            province: inputData.province,
            zipCode: inputData.zipCode,
            name: inputData.name,
            email: inputData.email,
            phone: inputData.phone,
            type: addressType,
          },
        });

        toast.success("Address added successfully");
        onSubmitSuccess?.();
      } catch (error) {
        toast.error("Failed to add address");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      // update address
      try {
        await axios.patch(`/api/user/${userId}/address`, {
          id: data?.id,
          address: {
            name: inputData.name,
            email: inputData.email,
            phone: inputData.phone,
            address: inputData.address,
            city: inputData.city,
            province: inputData.province,
            zipCode: inputData.zipCode,
            type: addressType,
          },
        });

        toast.success("Address updated successfully");
        onSubmitSuccess?.();
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data);
        }
        toast.error("Failed to update address " + error);
      } finally {
        setIsLoading(false);
      }
    }

    closeModal();
  };

  return (
    <div
      className={`fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5 ${
        isOpen ? "block z-99999" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center ">
        <div
          x-show="addressModal"
          className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content"
        >
          <button
            onClick={closeModal}
            aria-label="button for close modal"
            className="absolute top-0 right-0 flex items-center justify-center w-10 h-10 duration-150 ease-in rounded-full sm:top-3 sm:right-3 bg-meta text-body hover:text-dark"
          >
            <XIcon />
          </button>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 mb-5 lg:flex-row sm:gap-8">
              <div className="w-full">
                <Controller
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field, fieldState }) => (
                    <InputGroup
                      label="Name"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      error={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 mb-5 md:flex-row">
              <div className="w-full">
                <Controller
                  control={form.control}
                  name="phone"
                  rules={{ required: "Phone number is required" }}
                  render={({ field, fieldState }) => (
                    <InputGroup
                      type="tel"
                      label="Phone"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      error={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      required
                    />
                  )}
                />
              </div>

              <div className="w-full">
                <Controller
                  control={form.control}
                  name="email"
                  rules={{ required: "Email is required" }}
                  render={({ field, fieldState }) => (
                    <InputGroup
                      type="email"
                      label="Email"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      error={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      readOnly={addressType === "BILLING"}
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
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
              </div>

              <div className="flex flex-col gap-5 md:flex-row">
                <div className="w-full">
                  <label htmlFor="city" className="block text-sm font-normal text-gray-6 mb-1.5">
                    Kota <span className="text-red">*</span>
                  </label>
                  <select
                    id="city"
                    {...register("city", {
                      required: "Kota is required",
                    })}
                    className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
                  >
                    {cities.map((city) => (
                      <option key={city.city_id} value={city.city_name}>{city.city_name}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <Controller
                    control={form.control}
                    name="zipCode"
                    rules={{ required: "Zip Code is required" }}
                    render={({ field, fieldState }) => (
                      <InputGroup
                        type="text"
                        label="Zip Code"
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                        // required
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="w-full mb-5">
              <Controller
                control={form.control}
                name="address.address1"
                rules={{ required: "Address is required" }}
                render={({ field, fieldState }) => (
                  <InputGroup
                    label="Address"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    required
                  />
                )}
              />
            </div>

            <div className="w-full mb-5">
              <Controller
                control={form.control}
                name="address.address2"
                render={({ field, fieldState }) => (
                  <InputGroup
                    label="Address 2"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <button
              className={cn(
                "inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-5 text-sm rounded-lg ease-out duration-200 hover:bg-blue-dark w-full md:w-auto justify-center",
                {
                  "opacity-80 pointer-events-none": isLoading,
                }
              )}
              disabled={isLoading}
            >
              <IconDeviceFloppy stroke={1.5} /> Save Changes {isLoading && <Loader />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
