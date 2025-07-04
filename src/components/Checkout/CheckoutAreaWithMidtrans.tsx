"use client";
import { useSession } from "next-auth/react";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";
import Coupon from "./Coupon";
import Login from "./Login";
import Notes from "./Notes";
import PaymentMethod from "./PaymentMethod";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import { CheckoutInput, useCheckoutForm } from "./form";
import Orders from "./orders";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useShoppingCart } from "use-shopping-cart";
import { formatPrice } from "@/utils/formatePrice";

const CheckoutAreaWithMidtrans = ({ amount }: { amount: number }) => {
  const { handleSubmit } = useCheckoutForm();

  const { data: session } = useSession();

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { cartDetails, clearCart } = useShoppingCart();

  // Handle checkout
  const handleCheckout = async (data: CheckoutInput) => {
    setLoading(true);
    setErrorMessage("");

    if (data.billing.createAccount) {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.billing.email,
          name: data.billing.firstName,
          password: "12345678",
        }),
      });
      const result = await response.json();
      if (!result?.success) {
        toast.error(
          `${result?.message} for creating account` || "Failed to register user"
        );
        setLoading(false);
        return;
      }
    }

    // Helper function to create order
    const createOrder = async (paymentStatus: "pending" | "paid") => {
      // console.log('🔔 Creating order with data:', data);

      const orderData = {
        ...data,
        totalAmount: amount,
        userId: session?.user?.id || null,
        paymentStatus,
        couponCode: data.couponCode,
        products: Object.values(cartDetails ?? {}).map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item?.color || "",
          size: item?.size || "",
          attribute: item?.attribute || "",
        })),
      };

      try {
        const orderResponse = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const result = await orderResponse.json();
        // console.log('🔔 Order result:', result);

        if (!result?.success) {
          toast.error(result?.message || "Failed to create order");
          return false;
        }

        return result.data;
      } catch (err: any) {
        // console.error("Order creation error:", err);
        toast.error(err?.message || "Failed to create order");
        return false;
      }
    };

    if (data.paymentMethod === "cod") {
      const order = await createOrder("pending");
      setLoading(false);
      if (!order) return;
      
      toast.success("Order created successfully");
      clearCart();
      router.push(`/success?amount=${amount}`);
      return;
    }

    // Create order first for Midtrans payments
    const order = await createOrder("pending");
    // console.log('🔔 Creating order for Midtrans payments', order);

    if (!order) {
      setLoading(false);
      return;
    }

    try {
      if (data.paymentMethod === "snap") {
        // Create Midtrans transaction
        const midtransResponse = await fetch("/api/midtrans/create-transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            amount: amount,
            customerDetails: {
              firstName: data.billing.firstName,
              lastName: data.billing.lastName,
              email: data.billing.email,
              phone: data.billing.phone,
              billingAddress: {
                firstName: data.billing.firstName,
                lastName: data.billing.lastName,
                phone: data.billing.phone,
                address: `${data.billing.address.address1} ${data.billing.address.address2}`,
                city: data.billing.city,
                postalCode: "",
                countryCode: "IDN",
              },
              shippingAddress: data.shipToDifferentAddress && data.shipping ? {
                firstName: data.billing.firstName, // Use billing name as fallback
                lastName: data.billing.lastName || "",
                phone: data.shipping.phone,
                address: `${data.shipping.address.street} ${data.shipping.address.apartment || ""}`,
                city: data.shipping.town,
                postalCode: "",
                countryCode: "IDN",
              } : undefined,
            },
            itemDetails: Object.values(cartDetails ?? {}).map((item) => ({
              id: item.id,
              price: item.price,
              quantity: item.quantity,
              name: item.name,
            })),
          }),
        });

        const midtransResult = await midtransResponse.json();

        // console.log('🔔 Midtrans result:', midtransResult);

        if (!midtransResult?.success) {
          toast.error(midtransResult?.message || "Failed to create Midtrans transaction");
          setLoading(false);
          return;
        }

        // Redirect to Midtrans payment page
        window.location.href = midtransResult.data.redirect_url;
      } else if (data.paymentMethod === "bank_transfer") {
        // Create bank transfer transaction
        const bankTransferResponse = await fetch("/api/midtrans/bank-transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            amount: amount,
            customerDetails: {
              firstName: data.billing.firstName,
              lastName: data.billing.lastName,
              email: data.billing.email,
              phone: data.billing.phone,
            },
            itemDetails: Object.values(cartDetails ?? {}).map((item) => ({
              id: item.id,
              price: item.price,
              quantity: item.quantity,
              name: item.name,
            })),
            bankType: data.selectedBank || "bca", // Use selected bank or default to BCA
          }),
        });

        const bankTransferResult = await bankTransferResponse.json();

        if (!bankTransferResult?.success) {
          toast.error(bankTransferResult?.message || "Failed to create bank transfer");
          setLoading(false);
          return;
        }

        // Show bank transfer instructions
        const vaNumbers = bankTransferResult.data.va_numbers;
        const permataVaNumber = bankTransferResult.data.permata_va_number;
        
        let bankInfo = "";
        if (vaNumbers && vaNumbers.length > 0) {
          bankInfo = vaNumbers.map((va: any) => 
            `${va.bank.toUpperCase()}: ${va.va_number}`
          ).join("\n");
        } else if (permataVaNumber) {
          bankInfo = `Permata Bank: ${permataVaNumber}`;
        }

        toast.success("Bank transfer instructions sent to your email");
        clearCart();
        router.push(`/success?amount=${amount}&bankInfo=${encodeURIComponent(bankInfo)}`);
      }
    } catch (err: any) {
      console.error("Payment processing error:", err);
      setErrorMessage("Payment processing failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <section className="pb-20 overflow-hidden bg-gray-2">
        <div className="w-full gap-6 px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          {!Boolean(session?.user) && (
            <div className="mb-6">
              <Login />
            </div>
          )}
          <form onSubmit={handleSubmit(handleCheckout)}>
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="w-full space-y-6 lg:col-span-3">
                <Billing />
                <Shipping />
              </div>
              <div className="w-full space-y-6 lg:col-span-2">
                <Orders />
                <Notes />
                {/* <Coupon /> */}
                {/* <ShippingMethod /> */}


                <PaymentMethod amount={amount} />

                <button
                  type="submit"
                  className="flex justify-center w-full px-6 py-3 font-medium text-white duration-200 ease-out rounded-md bg-blue hover:bg-blue-dark "
                >
                  {!loading ? `Bayar ${formatPrice(amount)}` : "Processing..."}
                </button>
              </div>
            </div>
            {errorMessage && (
              <p className="mt-2 text-center text-red">{errorMessage}</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

export default CheckoutAreaWithMidtrans; 