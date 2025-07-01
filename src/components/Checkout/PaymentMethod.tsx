import Image from "next/image";
import { Controller } from "react-hook-form";
import { RadioInput } from "../ui/input/radio";
import { useCheckoutForm } from "./form";
import { PaymentElement } from "@stripe/react-stripe-js";

const PaymentMethod = ({ amount }: { amount: number }) => {
  const { register, errors, control, watch } = useCheckoutForm();
  const paymentMethod = watch("paymentMethod");
  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div className="px-6 py-5 border-b border-gray-3">
        <h3 className="text-lg font-medium text-dark">Payment Method</h3>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-3">
          {amount > 0 && (
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <RadioInput
                  {...field}
                  value="midtrans"
                  defaultChecked
                  label={<PaymentMethodCard method="midtrans" />}
                />
              )}
            />
          )}

          {amount > 0 && (
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <RadioInput
                  {...field}
                  value="bank_transfer"
                  label={<PaymentMethodCard method="bank_transfer" />}
                />
              )}
            />
          )}

          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <RadioInput
                {...field}
                value="cod"
                label={<PaymentMethodCard method="cod" />}
              />
            )}
          />
        </div>

        {errors.paymentMethod && (
          <p className="mt-2 text-sm text-red">
            Please select a payment method
          </p>
        )}

        {paymentMethod === "midtrans" && amount > 0 && (
          <div className="mt-5">
            <p className="text-sm text-gray-600">
              You will be redirected to Midtrans payment gateway to complete your payment.
            </p>
          </div>
        )}
        {paymentMethod === "bank_transfer" && amount > 0 && (
          <div className="mt-5">
            <p className="text-sm text-gray-600">
              You will receive bank transfer instructions after placing your order.
            </p>
          </div>
        )}
        {paymentMethod === "cod" && (
          <p className="mt-5 text-green">
            You have selected Cash on Delivery. Your order will be processed and
            payment will be collected upon delivery.
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;

type CardProps = {
  method: "midtrans" | "cod" | "bank_transfer";
};

function PaymentMethodCard({ method }: CardProps) {
  const data = {
    midtrans: {
      name: "Midtrans",
      image: {
        src: "/images/checkout/midtrans.svg",
        width: 75,
        height: 20,
      },
    },
    bank_transfer: {
      name: "Bank Transfer",
      image: {
        src: "/images/checkout/bank-transfer.svg",
        width: 75,
        height: 20,
      },
    },
    cod: {
      name: "Cash on delivery",
      image: {
        src: "/images/checkout/cash.svg",
        width: 21,
        height: 21,
      },
    },
  };

  return (
    <div className="rounded-md border-[0.5px] flex items-center shadow-1 border-gray-4 py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-transparent peer-checked:bg-gray-2 min-w-[240px]">
      <div className="pr-2.5">
        <Image
          src={data[method].image.src}
          className="shrink-0"
          alt={"Logo of " + data[method].name}
          width={data[method].image.width}
          height={data[method].image.height}
        />
      </div>

      <p className="border-l border-gray-4 pl-2.5">{data[method].name}</p>

      {/* {method === 'bank' && (
        
      )} */}
    </div>
  );
}
