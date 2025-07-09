"use client";
// import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useForm } from "react-hook-form";
import { CheckoutFormProvider, CheckoutInput } from "./form";
import { useShoppingCart } from "use-shopping-cart";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { EmptyCartIcon } from "@/assets/icons";
import CheckoutAreaWithMidtrans from "./CheckoutAreaWithMidtrans";
import { splitName } from "@/utils/splitName";

// Stripe
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import CheckoutPaymentArea from "./CheckoutPaymentArea";
// import CheckoutAreaWithoutStripe from "./CheckoutAreaWithoutStripe";

// if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
//   throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
// }
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// );

export default function CheckoutMain() {
  const session = useSession();
  const { register, formState, watch, control, handleSubmit, setValue } =
    useForm<CheckoutInput>({
      defaultValues: {
        billing: {
          address: {
            address1: "",
            address2: "",
          },
          companyName: "",
          // country: "",
          email: session.data?.user?.email || "",
          firstName: session.data?.user?.name ? splitName(session.data.user.name).firstName : "",
          lastName: session.data?.user?.name ? splitName(session.data.user.name).lastName : "",
          phone: "",
          // regionName: "",
          province: "",
          provinceId: "",
          // town: "",
          city: "",
          cityId: "",
          zipCode: "",
          createAccount: false,
        },
        shipping: {
          address: {
            address1: "",
            address2: "",
          },
          // country: "",
          email: "",
          phone: "",
          // town: "",
          // countryName: "",
          destination: "",
          weight: 0,
          province: "",
          provinceId: "",
          city: "",
          cityId: "",
          zipCode: "",
        },
        shippingMethod: {
          name: "",
          price: 0,
          courier: "",
          service: "",
          etd: "",
        },
        paymentMethod: "midtrans",
        couponDiscount: 0,
        couponCode: "",
        notes: "",
        shipToDifferentAddress: false,
      },
    });

  const { totalPrice = 0, cartDetails } = useShoppingCart();
  const cartIsEmpty = !cartDetails || Object.keys(cartDetails).length === 0;

  const shippingFee = watch("shippingMethod");
  const couponDiscount = ((watch("couponDiscount") || 0) * totalPrice) / 100;
  const amount = totalPrice - couponDiscount + (shippingFee?.price || 0);

  if (cartIsEmpty) {
    return (
      <div className="py-20">
        <div className="flex items-center justify-center mb-5">
          <EmptyCartIcon className="mx-auto text-blue" />
        </div>
        <h2 className="pb-5 text-2xl font-medium text-center text-dark">
          Tidak ada produk di keranjang untuk checkout.
        </h2>
        <Link
          href="/shop"
          className="w-96 mx-auto flex justify-center font-medium text-white bg-blue py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
        >
          Gasss! Lanjut Belanja!
        </Link>
      </div>
    );
  }

  // Use Midtrans for all payments
  return (
    <CheckoutFormProvider
      value={{
        register,
        watch,
        control,
        setValue,
        errors: formState.errors,
        handleSubmit,
      }}
    >
      <CheckoutAreaWithMidtrans amount={amount} />
    </CheckoutFormProvider>
  );
}
