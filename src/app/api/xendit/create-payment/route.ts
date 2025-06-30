import { createPayment } from '@/lib/xendit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, externalId, customer, description } = await request.json();

    if (!amount || !externalId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, externalId' },
        { status: 400 }
      );
    }

    const amountInIDR = Math.round(amount * 15000); // Jika amount dari frontend masih USD

    const invoice = await createPayment({
      externalId,
      amount: amountInIDR,
      customer,
      description,
    });

    // Use invoice.invoiceUrl (camelCase) sesuai Xendit SDK
    return NextResponse.json({
      success: true,
      invoice_url: invoice.invoiceUrl,
      invoice_id: invoice.id,
    });
  } catch (error) {
    console.error('Error creating Xendit payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 