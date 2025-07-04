import { useShoppingCart } from "use-shopping-cart";
import { useCheckoutForm } from "./form";
import { formatPrice } from "@/utils/formatePrice";
import { IconTruck, IconMapPin, IconChevronsDown } from "@tabler/icons-react";

export default function Orders() {
  const { watch } = useCheckoutForm();
  const { cartCount, cartDetails, totalPrice = 0 } = useShoppingCart();

  const shippingMethod = watch("shippingMethod");
  const couponDiscount = ((watch("couponDiscount") || 0) * totalPrice) / 100;
  const originDestination = watch("originDestination");
  const destinationDestination = watch("destinationDestination");
  const packageWeight = watch("packageWeight");

  return (
    <div id="section-orders" className="bg-white shadow-1 rounded-[10px]">
      <h3 className="px-4 py-5 text-lg font-medium border-b text-dark border-gray-3 sm:px-6">
        Pesanan Anda
      </h3>

      <div className="px-6 pt-1 pb-6">
        <table className="w-full text-dark">
          <thead>
            <tr className="border-b border-gray-3">
              <th className="py-5 text-base font-medium text-left">Produk</th>
              <th className="py-5 text-base font-medium text-right">
                Subtotal
              </th>
            </tr>
          </thead>

          <tbody>
            {cartCount && cartCount > 0 ? (
              Object.values(cartDetails ?? {}).map((product, key) => (
                <tr key={key} className="border-b border-gray-3">
                  <td className="py-5 text-sm truncate">{product.name}</td>
                  <td className="py-5 text-sm text-right">
                    {formatPrice(product.price)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-5 text-center" colSpan={2}>
                  Tidak ada produk di keranjang
                </td>
              </tr>
            )}

            {/* Shipping Information */}
            {shippingMethod?.price ? (
              <>
                <tr className="border-b border-gray-3">
                  <td className="py-5">
                    <div className="flex items-center gap-2">
                      <IconTruck className="h-4 w-4 text-blue" />
                      <span>Ongkos Kirim</span>
                    </div>
                    {shippingMethod.courier && (
                      <div className="text-xs text-gray-5 mt-1 ml-6">
                        {shippingMethod.courier} - {shippingMethod.service}
                        {shippingMethod.etd && (
                          <span className="ml-2">({shippingMethod.etd})</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-5 text-right">
                    {formatPrice(shippingMethod.price)}
                  </td>
                </tr>

                {/* Package Weight */}
                {packageWeight && (
                  <tr className="border-b border-gray-3">
                    <td className="py-5 text-sm text-gray-5">
                      Package Weight: {packageWeight} kg
                    </td>
                    <td className="py-5 text-right"></td>
                  </tr>
                )}
              </>
            ) : (
              <tr className="border-b border-gray-3">
                <td className="py-5">
                  <div className="flex items-center gap-2">
                    <IconTruck className="h-4 w-4 text-gray-4" />
                    <span>Shipping Fee</span>
                  </div>
                </td>
                <td className="py-5 text-right">
                  {formatPrice(0)}
                </td>
              </tr>
            )}

            {!!couponDiscount && (
              <tr className="border-b border-gray-3">
                <td className="py-5">
                  Coupon Discount ({watch("couponDiscount")}%)
                </td>
                <td className="py-5 text-right">
                  - {formatPrice(couponDiscount)}
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr>
              <td className="pt-5 text-base font-medium">Total</td>
              <td className="pt-5 text-base font-medium text-right">
                {formatPrice(totalPrice - couponDiscount + (shippingMethod?.price || 0))}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Shipping Details */}
        {originDestination && destinationDestination && (
          <div className="mt-6 p-4 bg-gray-1 rounded-lg">
            <h4 className="font-medium text-dark mb-3 flex items-center gap-2">
              <IconMapPin className="h-4 w-4 text-blue" />
              Shipping Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-5">From:</span>
                <span className="text-dark">{originDestination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-5">To:</span>
                <span className="text-dark">{destinationDestination}</span>
              </div>
              {packageWeight && (
                <div className="flex justify-between">
                  <span className="text-gray-5">Weight:</span>
                  <span className="text-dark">{packageWeight} kg</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-sm text-green-600 mt-4 flex items-center justify-end gap-2 h-14 rounded-lg">
          <span className="text-sm">
          <button type="button" onClick={()=>{
              const element = document.getElementById("section-payment-method");
              if (element) {
                const elementPosition = element.offsetTop - 128;
                window.scrollTo({
                  top: elementPosition,
                  behavior: "smooth"
                });
              }
            }} className="text-sm text-blue-light flex items-center gap-2">
              Next, Scroll ke Detail Pesanan <IconChevronsDown className="w-4 h-4" />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
