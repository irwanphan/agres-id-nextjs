'use client';
import { deletePickupPoint } from "@/app/actions/pickup-point";
import { TrashIcon } from "@/assets/icons";
import { confirmDialog, successDialog } from "@/utils/confirmDialog";
import { PickupPoint } from "@/types/pickup-point";
import { useTransition } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { IconMapPin2, IconPencil } from "@tabler/icons-react";

export default function PickupPointItem({ pickupPoint }: { pickupPoint: PickupPoint }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const isConfirmed = await confirmDialog(
          "Are you sure?",
          "Delete this pickup point?"
        );

        if (!isConfirmed) {
          return;
        }
        const response = await deletePickupPoint(pickupPoint.id);
        if (response?.success) {
          const msg = response?.message || "pickup point deleted successfully";
          successDialog(msg);
        } else {
          toast.error(response?.message || "Failed to delete pickup point");
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete pickup point");
      }
    });
  };
  return (
    <tr key={pickupPoint.id}>
      <td className="px-6 py-3 whitespace-nowrap">#{pickupPoint?.id?.slice(-6)}</td>
      <td className="px-6 py-3 whitespace-nowrap">{pickupPoint.name}</td>
      <td className="px-6 py-3 whitespace-nowrap">{pickupPoint.province}</td>
      <td className="px-6 py-3 whitespace-nowrap">{pickupPoint.city}</td>
      <td className="px-6 py-3 whitespace-nowrap">
        { pickupPoint.latitude && pickupPoint.longitude && (
          <Link 
            href={`https://www.google.com/maps/search/?api=1&query=${pickupPoint.latitude},${pickupPoint.longitude}`} 
            target="_blank"
            className="flex items-center gap-1 hover:text-blue transition-colors duration-200"
          >
            <IconMapPin2 className="w-4 h-4" /> {pickupPoint.latitude}, {pickupPoint.longitude}
          </Link>
        )}
      </td>
      <td className="px-6 py-3 whitespace-nowrap">{pickupPoint.isActive ? "Active" : "Inactive"}</td>
      <td className="px-6 py-3">
        <div className="flex items-center justify-end gap-2.5">
          <Link
            href={`/admin/pickup-points/edit/${pickupPoint.id}`}
            className="p-1.5 border rounded-md text-gray-7  hover:bg-blue-light-6 hover:border-blue-light-4 hover:text-blue size-8 inline-flex items-center justify-center border-gray-3"
          >
            <IconPencil className="w-4 h-4" />
          </Link>
          <button
            aria-label="button for favorite select"
            onClick={handleClick}
            disabled={isPending}
            className="p-1.5 border rounded-md text-gray-7  hover:bg-red-light-6 hover:border-red-light-4 hover:text-red size-8 inline-flex items-center justify-center border-gray-3"
            title="Delete"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-gray-300 rounded-full border-blue animate-spin" />
            ) : (
              <TrashIcon />
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}
