import { NextRequest, NextResponse } from 'next/server';
import { core } from '@/lib/midtrans';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/sendResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      orderId, 
      amount, 
      customerDetails, 
      itemDetails,
      bankType = 'bca' // bca, bni, bri, mandiri, permata
    } = body;

    if (!orderId || !amount || !customerDetails) {
      return sendErrorResponse(400, 'Missing required fields');
    }

    const bankTransferDetails = {
      payment_type: 'bank_transfer',
      bank_transfer: {
        bank: bankType,
      },
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName || '',
        email: customerDetails.email,
        phone: customerDetails.phone,
      },
      item_details: itemDetails || [],
    };

    const transaction = await core.charge(bankTransferDetails);

    return sendSuccessResponse(200, 'Bank transfer transaction created successfully', {
      formData: {
        transaction_id: transaction.transaction_id,
        order_id: transaction.order_id,
        payment_type: transaction.payment_type,
        transaction_status: transaction.transaction_status,
        transaction_time: transaction.transaction_time,
        gross_amount: transaction.gross_amount,
        va_numbers: transaction.va_numbers,
        permata_va_number: transaction.permata_va_number,
        bill_key: transaction.bill_key,
        biller_code: transaction.biller_code,
      }
    });
  } catch (error: any) {
    console.error('Midtrans bank transfer error:', error);
    return sendErrorResponse(500, error.message || 'Failed to create bank transfer');
  }
} 