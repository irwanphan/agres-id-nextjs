import { formatPrice } from "@/utils/formatPrice";

const OrderDetails = ({ orderItem }: any) => {
  const products = orderItem?.products || [];
  const shippingCost = orderItem?.shippingMethod?.price || 0;
  const discount = orderItem?.couponDiscount || 0;
  const totalAmount = orderItem?.totalAmount || 0;

  return (
    <div className="w-full ">
      {/* Product Table */}
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-7">
          No. Pesanan #{orderItem?.orderNumber}
        </h1>
        <p className="text-sm font-normal text-gray-6">
          Tanggal Pesanan:
          <span className="ml-1 font-semibold">
            {new Date(orderItem?.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full border-collapse text-left mb-6">
          <thead className="bg-gray-100 border-b text-gray-7 border-gray-3">
            <tr>
              <th className="p-2 text-sm font-normal capitalize whitespace-nowrap">
                SR.
              </th>
              <th className="p-2 text-sm font-normal capitalize whitespace-nowrap">
                Nama Produk
              </th>
              <th className="p-2 text-sm font-normal capitalize whitespace-nowrap">
                Jumlah
              </th>
              <th className="p-2 text-sm font-normal capitalize whitespace-nowrap">
                Harga Satuan
              </th>
              <th className="p-2 text-sm font-normal capitalize whitespace-nowrap">
                Subtotal Harga
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-3">
                <td className="p-2 whitespace-nowrap">{index + 1}</td>
                <td className="p-2 whitespace-nowrap">{item?.name}</td>
                <td className="p-2 whitespace-nowrap">{item?.quantity}</td>
                <td className="p-2 whitespace-nowrap">
                  {formatPrice(item?.price)}
                </td>
                <td className="p-2 font-medium text-green whitespace-nowrap">
                  {formatPrice(parseInt(item?.quantity) * parseInt(item?.price))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5">
        <ul className="space-y-3">
          <li className="flex items-center justify-between">
            <p className="font-medium">Ongkos Kirim</p>
            <p>{formatPrice(shippingCost)}</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="font-medium">Diskon</p>
            <p>{formatPrice(discount)}</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="font-medium">Total Harga</p>
            <p className="text-lg font-bold text-green">
              {formatPrice(totalAmount)}
            </p>
          </li>
          <li className="flex items-center justify-between">
            <p className="font-medium">Status Pembayaran</p>
            <p className={`text-lg font-bold ${orderItem?.paymentStatus === "pending"
              ? "text-yellow-500"
              : orderItem?.paymentStatus === "paid"
                ? "text-green"
                : orderItem?.paymentStatus === "cancel"
                  ? "text-red-500"
                  : "text-gray-7"}`}>
              {orderItem?.paymentStatus}
            </p>
          </li>
          <li className="flex items-center justify-between">
            <p className="font-medium">Status Pengiriman</p>
            <p className={`text-lg font-bold ${orderItem?.shippingStatus === "pending"
              ? "text-yellow-500"
              : orderItem?.shippingStatus === "delivered"
                ? "text-green"
                : orderItem?.shippingStatus === "cancel"
                  ? "text-red-500"
                  : "text-gray-7"}`}>
              {orderItem?.shippingStatus}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
