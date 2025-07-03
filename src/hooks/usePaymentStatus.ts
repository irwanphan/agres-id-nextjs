import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface PaymentStatusData {
  transaction_id: string;
  order_id: string;
  payment_type: string;
  transaction_status: string;
  transaction_time: string;
  gross_amount: string;
  signature_key: string;
  status_code: string;
}

interface UsePaymentStatusProps {
  orderId: string;
  paymentMethod: string;
  initialStatus: string;
}

export const usePaymentStatus = ({ orderId, paymentMethod, initialStatus }: UsePaymentStatusProps) => {
  const [status, setStatus] = useState(initialStatus);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkStatus = async () => {
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
        setStatus(newStatus);
        setLastChecked(new Date());
        
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
        return result.data;
      } else {
        toast.error(result.message || 'Failed to check payment status');
        return null;
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('Failed to check payment status');
      return null;
    } finally {
      setIsChecking(false);
    }
  };

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

  // Auto-check status every 30 seconds for pending payments
  useEffect(() => {
    if (status === 'pending' && (paymentMethod === 'midtrans' || paymentMethod === 'bank_transfer')) {
      const interval = setInterval(() => {
        checkStatus();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [status, paymentMethod, orderId]);

  return {
    status,
    isChecking,
    lastChecked,
    checkStatus,
    getStatusColor,
    getStatusText,
  };
}; 