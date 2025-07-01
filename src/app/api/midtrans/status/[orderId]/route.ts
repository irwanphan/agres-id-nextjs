import { NextRequest } from "next/server";
import { core } from '@/lib/midtrans';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/sendResponse';

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    const { orderId } = context.params;

    if (!orderId) {
      return sendErrorResponse(400, 'Order ID is required');
    }

    const transactionStatus = await core.status(orderId);

    return sendSuccessResponse(200, 'Transaction status retrieved successfully', {
      transaction_id: transactionStatus.transaction_id,
      order_id: transactionStatus.order_id,
      payment_type: transactionStatus.payment_type,
      transaction_status: transactionStatus.transaction_status,
      transaction_time: transactionStatus.transaction_time,
      gross_amount: transactionStatus.gross_amount,
      signature_key: transactionStatus.signature_key,
      status_code: transactionStatus.status_code,
    });
  } catch (error: any) {
    console.error('Midtrans status check error:', error);
    return sendErrorResponse(500, error.message || 'Failed to check transaction status');
  }
} 