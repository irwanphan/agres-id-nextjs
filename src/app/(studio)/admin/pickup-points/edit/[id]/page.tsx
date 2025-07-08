import { getSiteName } from "@/get-api-data/seo-setting";
import PickupPointForm from "../../_components/PickupPointForm";
import { getSinglePickupPoint } from "@/get-api-data/pickup-point";
import { Metadata } from "next";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const pickupPointData = await getSinglePickupPoint(id);
  const siteURL = process.env.SITE_URL;
  const site_name = await getSiteName();
  if (pickupPointData) {
    return {
      title: `${
        pickupPointData?.name || "Pickup Point Page"
      } | ${site_name} - Next.js E-commerce Template`,
      authors: [{ name: `${site_name}` }],
      alternates: {
        canonical: `${siteURL}/admin/pickup-points/edit/${pickupPointData.id}`,
      },
    };
  } else {
    return {
      title: "Not Found",
      description: "No pickup point has been found",
    };
  }
}

export default async function EditPickupPointPage({ params }: Params) {
  const { id } = await params;
  const pickupPoint = await getSinglePickupPoint(id);
  return (
    <div className="w-full bg-white border rounded-xl shadow-1 border-gray-3">
      <div className="px-6 py-5 border-b border-gray-3">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/pickup-points"
            className="inline-flex items-center gap-2 font-normal text-sm text-dark"
          >
            <IconChevronLeft stroke={1.5} />
          </Link>
          <h1 className="text-base font-semibold text-dark">Edit Pickup Point</h1>
        </div>
      </div>
      <div className="p-6">
        {pickupPoint ? <PickupPointForm pickupPointItem={pickupPoint} /> : <p>Pickup point not found</p>}
      </div>
    </div>
  );
}
