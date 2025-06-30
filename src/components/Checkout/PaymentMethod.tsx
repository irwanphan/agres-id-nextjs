import Image from "next/image";
import { Controller } from "react-hook-form";
import { RadioInput } from "../ui/input/radio";
import { useCheckoutForm } from "./form";
import { getAvailableChannels, PaymentChannel } from "@/lib/xendit";
import { useState } from "react";

const PaymentMethod = ({ amount }: { amount: number }) => {
  const { register, errors, control, watch } = useCheckoutForm();
  const paymentMethod = watch("paymentMethod");
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel | null>(null);
  
  const availableChannels = getAvailableChannels();
  
  // Group channels by type
  const eWallets = availableChannels.filter(channel => channel.type === 'ewallet');
  const virtualAccounts = availableChannels.filter(channel => channel.type === 'virtual_account');
  const convenienceStores = availableChannels.filter(channel => channel.type === 'convenience_store');
  const installments = availableChannels.filter(channel => channel.type === 'installment');
  const qrPayments = availableChannels.filter(channel => channel.type === 'qr');

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div className="px-6 py-5 border-b border-gray-3">
        <h3 className="text-lg font-medium text-dark">Payment Method</h3>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-3">
          {/* E-Wallets */}
          {amount > 0 && eWallets.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">E-Wallet</h4>
              <div className="grid grid-cols-2 gap-3">
                {eWallets.map((channel) => (
                  <Controller
                    key={channel.code}
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioInput
                        {...field}
                        value={channel.code}
                        label={<PaymentMethodCard method={channel} />}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedChannel(channel.code);
                        }}
                      />
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Virtual Accounts */}
          {amount > 0 && virtualAccounts.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Virtual Account</h4>
              <div className="grid grid-cols-2 gap-3">
                {virtualAccounts.map((channel) => (
                  <Controller
                    key={channel.code}
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioInput
                        {...field}
                        value={channel.code}
                        label={<PaymentMethodCard method={channel} />}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedChannel(channel.code);
                        }}
                      />
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Convenience Stores */}
          {amount > 0 && convenienceStores.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Convenience Store</h4>
              <div className="grid grid-cols-2 gap-3">
                {convenienceStores.map((channel) => (
                  <Controller
                    key={channel.code}
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioInput
                        {...field}
                        value={channel.code}
                        label={<PaymentMethodCard method={channel} />}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedChannel(channel.code);
                        }}
                      />
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Installments */}
          {amount > 0 && installments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Installment</h4>
              <div className="grid grid-cols-2 gap-3">
                {installments.map((channel) => (
                  <Controller
                    key={channel.code}
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioInput
                        {...field}
                        value={channel.code}
                        label={<PaymentMethodCard method={channel} />}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedChannel(channel.code);
                        }}
                      />
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* QR Payments */}
          {amount > 0 && qrPayments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">QR Payment</h4>
              <div className="grid grid-cols-2 gap-3">
                {qrPayments.map((channel) => (
                  <Controller
                    key={channel.code}
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioInput
                        {...field}
                        value={channel.code}
                        label={<PaymentMethodCard method={channel} />}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedChannel(channel.code);
                        }}
                      />
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cash on Delivery */}
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <RadioInput
                {...field}
                value="cod"
                label={<PaymentMethodCard method={{
                  code: 'cod' as PaymentChannel,
                  name: 'Cash on Delivery',
                  type: 'cod',
                  minAmount: 0,
                  maxAmount: 999999999,
                  logo: '/images/checkout/cash.svg'
                }} />}
                onChange={(e) => {
                  field.onChange(e);
                  setSelectedChannel(null);
                }}
              />
            )}
          />
        </div>

        {errors.paymentMethod && (
          <p className="mt-2 text-sm text-red">
            Please select a payment method
          </p>
        )}

        {/* Payment method details */}
        {selectedChannel && amount > 0 && (
          <div className="mt-5 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Payment Details
            </h5>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Amount: Rp {Math.round(amount * 15000).toLocaleString('id-ID')}</p>
              <p>• You will be redirected to complete your payment</p>
              <p>• Payment will be processed securely by Xendit</p>
            </div>
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
  method: {
    code: PaymentChannel | 'cod';
    name: string;
    type: 'ewallet' | 'virtual_account' | 'convenience_store' | 'installment' | 'qr' | 'cod';
    minAmount: number;
    maxAmount: number;
    logo: string;
  };
};

function PaymentMethodCard({ method }: CardProps) {
  return (
    <div className="rounded-md border-[0.5px] flex items-center shadow-1 border-gray-4 py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none peer-checked:shadow-none peer-checked:border-transparent peer-checked:bg-gray-2 min-w-[240px]">
      <div className="pr-2.5">
        <Image
          src={method.logo}
          className="shrink-0"
          alt={`Logo of ${method.name}`}
          width={method.type === 'cod' ? 21 : 40}
          height={method.type === 'cod' ? 21 : 40}
        />
      </div>

      <div className="border-l border-gray-4 pl-2.5">
        <p className="text-sm font-medium">{method.name}</p>
        {method.type !== 'cod' && (
          <p className="text-xs text-gray-500">
            Rp {method.minAmount.toLocaleString('id-ID')} - Rp {method.maxAmount.toLocaleString('id-ID')}
          </p>
        )}
      </div>
    </div>
  );
}
