import Xendit from 'xendit-node';

// Initialize Xendit with your secret key
const xendit = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY! });
console.log("Xendit Secret Key:", process.env.XENDIT_SECRET_KEY);
const { Invoice } = xendit;

// Payment channel types for Indonesia
export type PaymentChannel = 
  | 'OVO'
  | 'DANA'
  | 'LINKAJA'
  | 'SHOPEEPAY'
  | 'QRIS'
  | 'BCA_VIRTUAL_ACCOUNT'
  | 'BNI_VIRTUAL_ACCOUNT'
  | 'BRI_VIRTUAL_ACCOUNT'
  | 'MANDIRI_VIRTUAL_ACCOUNT'
  | 'PERMATA_VIRTUAL_ACCOUNT'
  | 'BSI_VIRTUAL_ACCOUNT'
  | 'CIMB_VIRTUAL_ACCOUNT'
  | 'ALFAMART'
  | 'INDOMARET'
  | 'KREDIVO'
  | 'AKULAKU'
  | 'ATOME'
  | 'JENIUSPAY'
  | 'ASTRAPAY';

export interface CreatePaymentRequest {
  externalId: string;
  amount: number;
  channelCode: PaymentChannel;
  currency: 'IDR';
  description?: string;
  customer?: {
    givenNames: string;
    surname?: string;
    email: string;
    mobileNumber?: string;
  };
  callbackUrl?: string;
  redirectUrl?: string;
}

export interface PaymentResponse {
  id: string;
  externalId: string;
  amount: number;
  currency: string;
  channelCode: string;
  status: string;
  paymentUrl?: string;
  qrCode?: string;
  accountNumber?: string;
  accountHolderName?: string;
  bankCode?: string;
  paymentCode?: string;
  expiresAt?: string;
  created?: string;
  updated?: string;
}

export interface PaymentStatusResponse {
  id: string;
  externalId: string;
  amount: number;
  currency: string;
  channelCode: string;
  status: string;
  paymentUrl?: string;
  qrCode?: string;
  accountNumber?: string;
  accountHolderName?: string;
  bankCode?: string;
  paymentCode?: string;
  expiresAt?: string;
  created?: string;
  updated?: string;
}

// Create payment using Xendit API
export async function createPayment({
  externalId,
  amount,
  customer,
  description,
}: {
  externalId: string;
  amount: number;
  customer?: {
    email: string;
    givenNames?: string;
    surname?: string;
    mobileNumber?: string;
  };
  description?: string;
}) {
  console.log("Xendit Invoice Payload:", JSON.stringify({
    external_id: externalId,
    amount,
    payer_email: customer?.email,
    description,
    success_redirect_url: process.env.NEXTAUTH_URL + '/success',
    failure_redirect_url: process.env.NEXTAUTH_URL + '/checkout?failed=1',
    customer: {
      given_names: customer?.givenNames,
      surname: customer?.surname,
      email: customer?.email,
      mobile_number: customer?.mobileNumber,
    },
    currency: 'IDR',
  }, null, 2));

  const invoice = await Invoice.createInvoice({
    data: {
      external_id: externalId,
      amount: amount,
      payer_email: customer?.email,
      description,
      success_redirect_url: process.env.NEXTAUTH_URL + '/success',
      failure_redirect_url: process.env.NEXTAUTH_URL + '/checkout?failed=1',
      customer: {
        given_names: customer?.givenNames,
        surname: customer?.surname,
        email: customer?.email,
        mobile_number: customer?.mobileNumber,
      },
      currency: 'IDR',
    }
  });
  return invoice;
}

// Get payment status
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
  try {
    // Mock response for now
    const mockResponse = {
      id: paymentId,
      referenceId: `order_${Date.now()}`,
      amount: 100000,
      currency: 'IDR',
      status: 'PENDING',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    return {
      id: mockResponse.id,
      externalId: mockResponse.referenceId,
      amount: mockResponse.amount,
      currency: mockResponse.currency,
      channelCode: 'OVO',
      status: mockResponse.status,
      created: mockResponse.created,
      updated: mockResponse.updated,
    };
  } catch (error) {
    console.error('Error getting Xendit payment status:', error);
    throw new Error('Failed to get payment status');
  }
}

// Get available payment channels for Indonesia
export function getAvailableChannels(): Array<{
  code: PaymentChannel;
  name: string;
  type: 'ewallet' | 'virtual_account' | 'convenience_store' | 'installment' | 'qr';
  minAmount: number;
  maxAmount: number;
  logo: string;
}> {
  return [
    // E-Wallets
    {
      code: 'OVO',
      name: 'OVO',
      type: 'ewallet',
      minAmount: 100,
      maxAmount: 20000000,
      logo: '/images/payment/ovo.svg',
    },
    {
      code: 'DANA',
      name: 'DANA',
      type: 'ewallet',
      minAmount: 100,
      maxAmount: 20000000,
      logo: '/images/payment/dana.svg',
    },
    {
      code: 'LINKAJA',
      name: 'LinkAja',
      type: 'ewallet',
      minAmount: 100,
      maxAmount: 20000000,
      logo: '/images/payment/linkaja.svg',
    },
    {
      code: 'SHOPEEPAY',
      name: 'ShopeePay',
      type: 'ewallet',
      minAmount: 100,
      maxAmount: 20000000,
      logo: '/images/payment/shopeepay.svg',
    },
    {
      code: 'JENIUSPAY',
      name: 'Jenius Pay',
      type: 'ewallet',
      minAmount: 1000,
      maxAmount: 20000000,
      logo: '/images/payment/jeniuspay.svg',
    },
    {
      code: 'ASTRAPAY',
      name: 'AstraPay',
      type: 'ewallet',
      minAmount: 100,
      maxAmount: 20000000,
      logo: '/images/payment/astrapay.svg',
    },
    
    // Virtual Accounts
    {
      code: 'BCA_VIRTUAL_ACCOUNT',
      name: 'BCA Virtual Account',
      type: 'virtual_account',
      minAmount: 1000,
      maxAmount: 100000000,
      logo: '/images/payment/bca.svg',
    },
    {
      code: 'BNI_VIRTUAL_ACCOUNT',
      name: 'BNI Virtual Account',
      type: 'virtual_account',
      minAmount: 1000,
      maxAmount: 100000000,
      logo: '/images/payment/bni.svg',
    },
    {
      code: 'BRI_VIRTUAL_ACCOUNT',
      name: 'BRI Virtual Account',
      type: 'virtual_account',
      minAmount: 1000,
      maxAmount: 100000000,
      logo: '/images/payment/bri.svg',
    },
    {
      code: 'MANDIRI_VIRTUAL_ACCOUNT',
      name: 'Mandiri Virtual Account',
      type: 'virtual_account',
      minAmount: 1000,
      maxAmount: 100000000,
      logo: '/images/payment/mandiri.svg',
    },
    {
      code: 'PERMATA_VIRTUAL_ACCOUNT',
      name: 'Permata Virtual Account',
      type: 'virtual_account',
      minAmount: 1,
      maxAmount: 9999999999,
      logo: '/images/payment/permata.svg',
    },
    
    // Convenience Stores
    {
      code: 'ALFAMART',
      name: 'Alfamart',
      type: 'convenience_store',
      minAmount: 10000,
      maxAmount: 5000000,
      logo: '/images/payment/alfamart.svg',
    },
    {
      code: 'INDOMARET',
      name: 'Indomaret',
      type: 'convenience_store',
      minAmount: 10000,
      maxAmount: 2500000,
      logo: '/images/payment/indomaret.svg',
    },
    
    // Installment
    {
      code: 'KREDIVO',
      name: 'Kredivo',
      type: 'installment',
      minAmount: 1000,
      maxAmount: 30000000,
      logo: '/images/payment/kredivo.svg',
    },
    {
      code: 'AKULAKU',
      name: 'Akulaku',
      type: 'installment',
      minAmount: 1000,
      maxAmount: 25000000,
      logo: '/images/payment/akulaku.svg',
    },
    {
      code: 'ATOME',
      name: 'Atome',
      type: 'installment',
      minAmount: 50000,
      maxAmount: 6000000,
      logo: '/images/payment/atome.svg',
    },
    
    // QR Payment
    {
      code: 'QRIS',
      name: 'QRIS',
      type: 'qr',
      minAmount: 100,
      maxAmount: 5000000,
      logo: '/images/payment/qris.svg',
    },
  ];
}

export default xendit; 