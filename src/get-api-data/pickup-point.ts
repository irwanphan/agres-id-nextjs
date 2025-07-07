import { prisma } from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";

// get pickup points
export const getPickupPoints = unstable_cache(
  async () => {
    try {
      return await prisma.pickupPoint.findMany({ where: { isActive: true } });
    } catch (error) {
      console.error("Error fetching pickup points:", error);
      throw new Error("Failed to fetch pickup points");
    }
  },
  ['pickup-points'], { tags: ['pickup-points'], revalidate: 60 }
);