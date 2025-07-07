"use client";
import { useState } from "react";
import { updateOrderStatus } from "@/app/actions/order";
import { ChevronDownIcon } from "@/assets/icons";
import toast from "react-hot-toast";

enum EnumShippingStatus {
  "pending" = "pending",
  "processing" = "processing",
  "delivered" = "delivered",
  "cancel" = "cancel",
}

export default function OrderSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [orderStatus, setOrderStatus] = useState(status);
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    setOrderStatus(target.value);
    const data = await updateOrderStatus(
      id,
      target.value as EnumShippingStatus
    );
    if (data?.success) {
      toast.success(data?.message || "Order status updated successfully");
    } else {
      toast.error(data?.message || "Failed to update order status");
    }
  };
  return (
    <div className="w-full">
      <div className="relative">
        <select
          name="status"
          id="status"
          required
          onChange={(e) => handleChange(e)}
          value={orderStatus}
          className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
        >
          <option value={EnumShippingStatus.pending}>Pending</option>
          <option value={EnumShippingStatus.processing}>Processing</option>
          <option value={EnumShippingStatus.delivered}>Delivered</option>
          <option value={EnumShippingStatus.cancel}>Cancelled</option>
        </select>
      </div>
    </div>
  );
}
