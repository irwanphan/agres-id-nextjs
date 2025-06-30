import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Xendit callback received:', body);

    // Handle different payment statuses
    const { status, external_id, payment_id } = body;

    // Update order status based on payment status
    if (status === 'PAID') {
      // Update order to paid status
      console.log(`Payment ${payment_id} for order ${external_id} is PAID`);
      
      // Here you would typically update your database
      // await updateOrderStatus(external_id, 'paid');
      
    } else if (status === 'FAILED') {
      // Update order to failed status
      console.log(`Payment ${payment_id} for order ${external_id} FAILED`);
      
      // await updateOrderStatus(external_id, 'failed');
      
    } else if (status === 'EXPIRED') {
      // Update order to expired status
      console.log(`Payment ${payment_id} for order ${external_id} EXPIRED`);
      
      // await updateOrderStatus(external_id, 'expired');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Xendit callback:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests for payment status checks
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('payment_id');
  
  if (!paymentId) {
    return NextResponse.json(
      { error: 'Payment ID is required' },
      { status: 400 }
    );
  }

  try {
    // Here you would typically check the payment status with Xendit
    // const paymentStatus = await getPaymentStatus(paymentId);
    
    return NextResponse.json({
      success: true,
      paymentId,
      status: 'PENDING', // Mock status
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
} 