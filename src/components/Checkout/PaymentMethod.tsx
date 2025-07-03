import Image from "next/image";
import { Controller } from "react-hook-form";
import { RadioInput } from "../ui/input/radio";
import { useCheckoutForm } from "./form";
import { PaymentElement } from "@stripe/react-stripe-js";
import BankSelection from "./BankSelection";

const PaymentMethod = ({ amount }: { amount: number }) => {
  const { register, errors, control, watch, setValue } = useCheckoutForm();
  const paymentMethod = watch("paymentMethod");
  const selectedBank = watch("selectedBank") || "bca";

  const handleBankSelect = (bankCode: string) => {
    setValue("selectedBank", bankCode);
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div className="px-6 py-5 border-b border-gray-3">
        <h3 className="text-lg font-medium text-dark">Metode Pembayaran</h3>
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
                  value="snap"
                  defaultChecked
                  label={<PaymentMethodCard method="snap" />}
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
                value="manual"
                label={<PaymentMethodCard method="manual" />}
              />
            )}
          />
        </div>

        {errors.paymentMethod && (
          <p className="mt-2 text-sm text-red">
            Silahkan pilih metode pembayaran
          </p>
        )}

          {paymentMethod === "snap" && amount > 0 && (
          <div className="mt-5">
            <p className="text-sm text-gray-600">
              Anda akan diarahkan ke Midtrans Snap payment gateway untuk menyelesaikan pembayaran.
            </p>
          </div>
        )}
        
        {paymentMethod === "bank_transfer" && amount > 0 && (
          <div className="mt-5">
            <BankSelection
              selectedBank={selectedBank}
              onBankSelect={handleBankSelect}
              disabled={false}
            />
          </div>
        )}
        
        {paymentMethod === "manual" && (
          <p className="mt-5 text-green">
            Anda telah memilih Pembayaran Transfer dengan Konfirmasi Manual. Pesanan Anda akan diproses dan pembayaran akan dikonfirmasi secara manual.
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;

type CardProps = {
  method: "snap" | "manual" | "bank_transfer";
};

function PaymentMethodCard({ method }: CardProps) {
  const data = {
    bank_transfer: {
      name: "Transfer Bank",
      image: {
        src: "/images/checkout/bank-transfer.svg",
        width: 75,
        height: 20,
      },
    },
    snap: {
      name: "Ragam Pembayaran",
      image: {
        src: "/images/checkout/midtrans.svg",
        width: 75,
        height: 20,
      },
    },
    manual: {
      name: "COD / Konfirmasi Manual",
      image: {
        src: "/images/checkout/cash.svg",
        width: 21,
        height: 21,
      },
    },
  };

  return (
    <div className="
      rounded-md border-[0.5px] flex items-center shadow-1 
      border-gray-4 py-3.5 px-5 ease-out duration-200 bg-white
      hover:bg-blue-light-5 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-blue peer-checked:bg-blue-light-5 min-w-[240px]">
      <div className="pr-2.5 max-w-[32px]">
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
