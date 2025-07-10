import { PlusIcon } from "@/assets/icons";
import PickupPointArea from "./_components/PickupPointArea";
import { getPickupPoints } from "@/get-api-data/pickup-point";
import { PickupPoint } from "@/types/pickup-point";
import Link from "next/link";

export const revalidate = 0;

export default async function PickupPointsPage() {
  const points: PickupPoint[] = await getPickupPoints();
  return (
    <div className="w-full bg-white border rounded-xl shadow-1 border-gray-3 overflow-x-auto">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-3">
        <h2 className="text-base font-semibold text-dark">Pickup Points</h2>
        <Link
          href="/admin/pickup-points/add"
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-normal text-white duration-200 ease-out rounded-lg bg-dark hover:bg-darkLight"
        >
          <PlusIcon className="w-3 h-3" /> Add Pickup Point
        </Link>
      </div>
      <div>
        <PickupPointArea points={points} />
      </div>
    </div>
  );
}