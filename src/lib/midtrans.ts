import midtransClient from 'midtrans-client';

// Create Snap API instance
export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// Create Core API instance for bank transfer
export const core = new midtransClient.CoreApi({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// Create Iris API instance for disbursement
export const iris = new midtransClient.Iris({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MIDTRANS_SERVER_KEY:', process.env.MIDTRANS_SERVER_KEY);

export interface MidtransTransactionDetails {
  order_id: string;
  gross_amount: number;
  customer_details: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    billing_address: {
      first_name: string;
      last_name: string;
      phone: string;
      address: string;
      city: string;
      postal_code: string;
      country_code: string;
    };
    shipping_address: {
      first_name: string;
      last_name: string;
      phone: string;
      address: string;
      city: string;
      postal_code: string;
      country_code: string;
    };
  };
  item_details: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
  enabled_payments?: string[];
  callbacks?: {
    finish?: string;
    error?: string;
    pending?: string;
  };
} 