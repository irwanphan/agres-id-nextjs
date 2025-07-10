import { IconChevronLeft } from "@tabler/icons-react";
import PickupPointForm from "../_components/PickupPointForm";
import Link from "next/link";

async function PickupPointAddPage() {
  return (
    <div className="bg-white border rounded-xl shadow-1 border-gray-3">
      <div className="px-6 py-5 border-b border-gray-3">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/pickup-points"
            className="inline-flex items-center gap-2 font-normal text-sm text-dark"
          >
            <IconChevronLeft stroke={1.5} />
          </Link>
          <h1 className="text-base font-semibold text-dark">Tambah Pickup Point</h1>
        </div>
      </div>
      <div className="px-6 py-5">
        <PickupPointForm />
      </div>
    </div>
  );
}

export default PickupPointAddPage;
