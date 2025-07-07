
import PickupPointArea from "./_components/PickupPointArea";
import { getPickupPoints } from "@/get-api-data/pickup-point";
import { PickupPoint } from "@/types/pickup-point";
import { IconCirclePlus } from "@tabler/icons-react";
import Link from "next/link";

export const revalidate = 0;

export default async function PickupPointsPage() {
  const points: PickupPoint[] = await getPickupPoints();
  return (
    <div className="w-full bg-white border rounded-xl shadow-1 border-gray-3 overflow-x-auto">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-3">
        <h2 className="text-base font-semibold text-dark">Pickup Points</h2>
        <Link href="/admin/pickup-points/add" className="btn-primary flex items-center gap-2">
          <IconCirclePlus /> Add Pickup Point
        </Link>
      </div>
      <div>
        <PickupPointArea points={points} />
      </div>
    </div>
  );
}