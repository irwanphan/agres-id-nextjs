"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useShoppingCart } from "use-shopping-cart";
import { ArrowLeftIcon } from "./_components/icons";
import { formatPrice } from "@/utils/formatPrice";
import { IconLogin, IconShoppingCart, IconUserCircle, IconWind } from "@tabler/icons-react";

const CheckoutSuccess = ({ amount, bankInfo }: { amount: string; bankInfo?: string }) => {
  const { clearCart } = useShoppingCart();
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      clearCart();
    }, 1000);
  }, [clearCart]);

  return (
    <section className="overflow-hidden pt-5 pb-20 bg-gray-2">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 xl:px-0">
        {loading ? (
          <>
            <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-8 lg:py-10 xl:py-25">
              <div className="text-center">
                <h1 className="font-bold text-blue text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
                  Successful!
                </h1>

                <h2 className="font-medium text-dark text-xl sm:text-2xl mb-3">
                  Order Placed Successfully! amount: {amount}
                </h2>

                <p className="max-w-[491px] w-full mx-auto mb-7.5">
                  Wait a second while we save the order. You will receive an
                  email with details of your order.
                </p>

                <div className="flex justify-center gap-5">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="currentColor">
                      <path
                        fill="currentColor"
                        d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
                      >
                        <animateTransform
                          attributeName="transform"
                          dur="0.75s"
                          repeatCount="indefinite"
                          type="rotate"
                          values="0 12 12;360 12 12"
                        />
                      </path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-8 lg:py-10 xl:py-25">
              <div className="text-center">
                <h1 className="font-bold text-blue text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
                  Terima Kasih!
                </h1>

                <h2 className="font-medium text-dark text-xl sm:text-2xl mb-3">
                  Pesanan Anda telah berhasil diproses! amount: {formatPrice(Number(amount))}
                </h2>

                <p className="max-w-[491px] w-full mx-auto mb-7.5">
                  Silakan cek email Anda untuk detail pesanan.
                </p>

                {bankInfo && (
                  <div className="max-w-[491px] w-full mx-auto mb-7.5 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue mb-2">Bank Transfer Instructions</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Please transfer the amount to the following account:
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                        {decodeURIComponent(bankInfo)}
                      </pre>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Please complete the transfer within 24 hours to avoid order cancellation.
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-5">
                  <Link
                    href={`${session?.user ? "/my-account/orders" : "/signin"}`}
                    className="inline-flex items-center gap-2 font-medium text-white bg-blue-light py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
                  >
                    {/* <ArrowLeftIcon /> */}
                    { session?.user ? (
                        <div className="flex items-center gap-2">
                          <IconUserCircle stroke={1.5} />
                          Cek Pesanan
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <IconLogin stroke={1.5} />
                          Masuk
                        </div>
                      ) }
                  </Link>

                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
                  >
                    Gasss, Lanjut Belanja
                    <div className="flex items-center">
                      <IconWind className="rotate-180 -mr-1" stroke={1.2} />
                      <IconShoppingCart stroke={1.5} />
                    </div>
                    {/* <ArrowLeftIcon className="rotate-180" /> */}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CheckoutSuccess;
