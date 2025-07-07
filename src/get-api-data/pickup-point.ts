import { prisma } from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";

// get pickup points
export const getPickupPoints = unstable_cache(
  async () => {
    return await prisma.pickupPoint.findMany({ where: { isActive: true } });
  },
  ['pickupPoints'], { tags: ['pickupPoints'] }
);