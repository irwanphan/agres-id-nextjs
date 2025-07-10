import { unstable_cache } from "next/cache";

// get cities
export const getCities = unstable_cache(
  async (provinceId: string) => {
    try {
      const res = await fetch(`/api/location/city?provinceId=${provinceId}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw new Error("Failed to fetch cities");
    }
  },
  ['cities'], { tags: ['cities'], revalidate: 60 }
);