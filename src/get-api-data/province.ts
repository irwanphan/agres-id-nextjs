import { unstable_cache } from "next/cache";
import { Province } from "@/types/province";

// get provinces
export const getProvinces = unstable_cache(
  async () => {
    try {
      const res = await fetch('/api/location/province');
      const data = await res.json();
      return data as Province[];
    } catch (error) {
      console.error("Error fetching provinces:", error);
      throw new Error("Failed to fetch provinces");
    }
  },
  ['provinces'], { tags: ['provinces'], revalidate: 60 }
);

export const getProvinceById = async (provinceId: string) => {
  const res = await fetch(`/api/location/province/${provinceId}`);
  const data = await res.json();
  return data as Province;
};

export const getProvinceIdByName = async (provinceName: string) => {
  const res = await fetch(`/api/location/province?provinceName=${provinceName}`);
  const data = await res.json();
  return data as string;
};