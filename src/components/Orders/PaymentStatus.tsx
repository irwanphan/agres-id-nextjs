"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';

interface PaymentStatusProps {
  orderId: string;
  paymentStatus: string;
  paymentMethod: string;
  midtransTransactionId?: string;
}

const PaymentStatus = ({ 
  orderId, 
  paymentStatus, 
  paymentMethod,
  midtransTransactionId 
}: PaymentStatusProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(paymentStatus);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'settlement':
      case 'capture':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
      case 'deny':
      case 'cancel':
      case 'expire':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'settlement':
      case 'capture':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
      case 'deny':
      case 'cancel':
      case 'expire':
        return 'Failed';
      default:
        return status;
    }
  };

  const checkPaymentStatus = async () => {
    if (paymentMethod !== 'midtrans' && paymentMethod !== 'bank_transfer') {
      toast.error('Status checking is only available for Midtrans payments');
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(`/api/midtrans/status/${orderId}`);
      const result = await response.json();

      if (result.success) {
        const newStatus = result.data.transaction_status;
        setCurrentStatus(newStatus);
        
        // Update order status in database
        await fetch('/api/order/status-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            paymentStatus: newStatus,
            midtransTransactionId: result.data.transaction_id,
            midtransPaymentType: result.data.payment_type,
            midtransTransactionTime: result.data.transaction_time,
            midtransGrossAmount: parseFloat(result.data.gross_amount),
            midtransStatusCode: result.data.status_code,
          }),
        });

        toast.success('Payment status updated successfully');
      } else {
        toast.error(result.message || 'Failed to check payment status');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('Failed to check payment status');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
        {getStatusText(currentStatus)}
      </span>
      
      {(paymentMethod === 'midtrans' || paymentMethod === 'bank_transfer') && (
        <button
          onClick={checkPaymentStatus}
          disabled={isChecking}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChecking ? 'Checking...' : 'Check Status'}
        </button>
      )}
      
      {midtransTransactionId && (
        <span className="text-xs text-gray-500">
          TXN: {midtransTransactionId}
        </span>
      )}
    </div>
  );
};

export default PaymentStatus; 