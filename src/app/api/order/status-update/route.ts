import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaDB';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/sendResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      paymentStatus,
      midtransTransactionId,
      midtransPaymentType,
      midtransTransactionTime,
      midtransGrossAmount,
      midtransStatusCode,
    } = body;

    if (!orderId || !paymentStatus) {
      return sendErrorResponse(400, 'Order ID and payment status are required');
    }

    // TOFIX: orderId should have been unique, but it's not, so we need to use updateMany
    const updatedPaymentTransaction = await prisma.paymentTransaction.updateMany({
      where: { orderId: orderId },
      data: {
        selectedBank: midtransPaymentType,
        paymentType: midtransPaymentType,
        transactionId: midtransTransactionId,
        transactionTime: new Date(midtransTransactionTime),
        grossAmount: parseFloat(midtransGrossAmount),
        statusCode: midtransStatusCode,
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

    return sendSuccessResponse(200, 'Order status updated successfully', updatedOrder);
  } catch (error: any) {
    console.error('Order status update error:', error);
    return sendErrorResponse(500, error.message || 'Failed to update order status');
  }
} 