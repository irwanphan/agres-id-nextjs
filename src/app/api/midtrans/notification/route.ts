import { NextRequest, NextResponse } from 'next/server';
import { core } from '@/lib/midtrans';
import { prisma } from '@/lib/prismaDB';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/sendResponse';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  console.log('🔔 Midtrans webhook hit at', new Date().toISOString())

  let body: any
  try {
    body = await req.json();
    
    // Verify signature key
    const signatureKey = body.signature_key;
    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const transactionStatus = body.transaction_status;

    // Create expected signature key
    const expectedSignature = crypto
      .createHash('sha512')
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest('hex');
    
      // console.log('orderId:', orderId);
      // console.log('statusCode:', statusCode, typeof statusCode);
      // console.log('grossAmount:', grossAmount, typeof grossAmount);
      // console.log('serverKey:', serverKey);
      // console.log('signatureKey (from midtrans):', signatureKey);
      // console.log('expectedSignature (backend):', expectedSignature);
    
    if (signatureKey !== expectedSignature) {
      console.error('Invalid signature key');
      return sendErrorResponse(400, 'Invalid signature key');
    }

    // Get transaction status from Midtrans
    
    // Update order status based on transaction status
    let paymentStatus: 'pending' | 'paid' | 'failed' | 'expired' = 'pending';
    
    switch (transactionStatus) {
      case 'capture':
      case 'settlement':
        paymentStatus = 'paid';
        break;
      case 'pending':
        paymentStatus = 'pending';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
        paymentStatus = 'failed';
        break;
      default:
        paymentStatus = 'pending';
    }

    const updatedPaymentTransaction = await prisma.paymentTransaction.upsert({
      where: { orderId: orderId },
      update: {
        selectedBank: body.va_numbers[0].bank,
        vaNumber: body.va_numbers[0].va_number,
        paymentType: body.payment_type,
        transactionId: body.transaction_id,
        transactionTime: new Date(body.transaction_time),
        grossAmount: parseFloat(body.gross_amount),
        statusCode: paymentStatus,
        updatedAt: new Date(),
      },
      create: {
        orderId: orderId,
        provider: 'midtrans',
        selectedBank: body.va_numbers[0].bank,
        vaNumber: body.va_numbers[0].va_number,
        paymentType: body.payment_type,
        transactionId: body.transaction_id,
        transactionTime: new Date(body.transaction_time),
        grossAmount: parseFloat(body.gross_amount),
        statusCode: paymentStatus,
        updatedAt: new Date(),
      },
    });
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        updatedAt: new Date(),
      },
    });

    // If payment is successful, you might want to send confirmation email
    if (paymentStatus === 'paid') {
      // Send payment confirmation email
      console.log(`Payment successful for order ${orderId}`);
    }

    return sendSuccessResponse(200, 'Notification processed successfully', {
      order_id: orderId,
      status: paymentStatus,
    });
  } catch (error: any) {
    console.error('Midtrans notification error:', error);
    return sendErrorResponse(500, error.message || 'Failed to process notification');
  }
} 