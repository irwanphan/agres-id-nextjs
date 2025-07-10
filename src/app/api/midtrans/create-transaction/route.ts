import { NextRequest, NextResponse } from 'next/server';
import { snap } from '@/lib/midtrans';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/sendResponse';

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
    console.log('[Midtrans] Incoming create-transaction request:', body);
    const { 
      orderId, 
      amount, 
      customerDetails, 
      itemDetails, 
      enabledPayments = [
        'bank_transfer',
        'bca_va',
        'bni_va', 
        'bri_va',
        'mandiri_va',
        'permata_va',
        'credit_card', 
        'gopay', 
        'shopeepay'
      ],
      callbacks 
    } = body;

    if (!orderId || !amount || !customerDetails) {
      return sendErrorResponse(400, 'Missing required fields');
    }

    const transactionDetails = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName || '',
        email: customerDetails.email,
        phone: customerDetails.phone,
        billing_address: customerDetails.billingAddress ? {
          first_name: customerDetails.billingAddress.firstName,
          last_name: customerDetails.billingAddress.lastName || '',
          phone: customerDetails.billingAddress.phone,
          email: customerDetails.billingAddress.email,
          address: customerDetails.billingAddress.address,
          province: customerDetails.billingAddress.province,
          city: customerDetails.billingAddress.city,
          postal_code: customerDetails.billingAddress.postalCode || '',
          country_code: customerDetails.billingAddress.countryCode || 'IDN',
        } : undefined,
        shipping_address: customerDetails.shippingAddress ? {
          first_name: customerDetails.shippingAddress.firstName,
          last_name: customerDetails.shippingAddress.lastName || '',
          phone: customerDetails.shippingAddress.phone,
          email: customerDetails.shippingAddress.email,
          address: customerDetails.shippingAddress.address,
          city: customerDetails.shippingAddress.city,
          postal_code: customerDetails.shippingAddress.postalCode || '',
          country_code: customerDetails.shippingAddress.countryCode || 'IDN',
        } : undefined,
      },
      item_details: itemDetails || [],
      enabled_payments: enabledPayments,
      callbacks: callbacks || {
        finish: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
        error: `${process.env.NEXT_PUBLIC_SITE_URL}/error`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pending`,
      },
    };

    const transaction = await snap.createTransaction(transactionDetails);
    console.log('[Midtrans] Response from core.charge:', transaction);

    return sendSuccessResponse(200, 'Transaction created successfully', {
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error: any) {
    console.error('[Midtrans] Error in create-transaction:', error, error?.message, error?.stack);
    return sendErrorResponse(500, error.message || 'Failed to create transaction');
  }
} 