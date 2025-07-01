declare module 'midtrans-client' {
  export interface SnapOptions {
    isProduction?: boolean;
    serverKey: string;
    clientKey: string;
  }

  export interface CoreApiOptions {
    isProduction?: boolean;
    serverKey: string;
    clientKey: string;
  }

  export interface IrisOptions {
    isProduction?: boolean;
    serverKey: string;
    clientKey: string;
  }

  export interface TransactionDetails {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      billing_address?: {
        first_name: string;
        last_name: string;
        phone: string;
        address: string;
        city: string;
        postal_code: string;
        country_code: string;
      };
      shipping_address?: {
        first_name: string;
        last_name: string;
        phone: string;
        address: string;
        city: string;
        postal_code: string;
        country_code: string;
      };
    };
    item_details?: Array<{
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

  export interface BankTransferDetails {
    payment_type: string;
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
    item_details?: Array<{
      id: string;
      price: number;
      quantity: number;
      name: string;
    }>;
  }

  export class Snap {
    constructor(options: SnapOptions);
    createTransaction(transactionDetails: TransactionDetails): Promise<{
      token: string;
      redirect_url: string;
    }>;
  }

  export class CoreApi {
    constructor(options: CoreApiOptions);
    charge(transactionDetails: BankTransferDetails): Promise<{
      transaction_id: string;
      order_id: string;
      payment_type: string;
      transaction_status: string;
      transaction_time: string;
      gross_amount: string;
      va_numbers?: Array<{
        bank: string;
        va_number: string;
      }>;
      permata_va_number?: string;
      bill_key?: string;
      biller_code?: string;
    }>;
    status(orderId: string): Promise<{
      transaction_id: string;
      order_id: string;
      payment_type: string;
      transaction_status: string;
      transaction_time: string;
      gross_amount: string;
      signature_key: string;
      status_code: string;
    }>;
  }

  export class Iris {
    constructor(options: IrisOptions);
    createBeneficiaries(beneficiaryData: any): Promise<any>;
    getBeneficiaries(): Promise<any>;
    createPayouts(payoutData: any): Promise<any>;
    getPayouts(): Promise<any>;
  }
} 