"use client";
import { useState } from 'react';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';

interface PaymentHistoryProps {
  orderId: string;
  paymentMethod: string;
  paymentStatus: string;
  midtransTransactionId?: string;
  midtransPaymentType?: string;
  midtransTransactionTime?: Date;
  midtransGrossAmount?: number;
  midtransStatusCode?: string;
  totalAmount: number;
}

const PaymentHistory = ({
  orderId,
  paymentMethod,
  paymentStatus,
  midtransTransactionId,
  midtransPaymentType,
  midtransTransactionTime,
  midtransGrossAmount,
  midtransStatusCode,
  totalAmount,
}: PaymentHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    status,
    isChecking,
    lastChecked,
    checkStatus,
    getStatusColor,
    getStatusText,
  } = usePaymentStatus({
    orderId,
    paymentMethod,
    initialStatus: paymentStatus,
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <div className="space-y-3">
        {/* Payment Method */}
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium">
            {paymentMethod === 'midtrans' && 'Midtrans'}
            {paymentMethod === 'bank_transfer' && 'Bank Transfer'}
            {paymentMethod === 'cod' && 'Cash on Delivery'}
          </span>
        </div>

        {/* Payment Status */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
            {(paymentMethod === 'midtrans' || paymentMethod === 'bank_transfer') && (
              <button
                onClick={checkStatus}
                disabled={isChecking}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? 'Checking...' : 'Refresh'}
              </button>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">{formatCurrency(totalAmount)}</span>
        </div>

        {/* Last Checked */}
        {lastChecked && (
          <div className="flex justify-between">
            <span className="text-gray-600">Last Checked:</span>
            <span className="text-sm text-gray-500">{formatDate(lastChecked)}</span>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (midtransTransactionId || midtransPaymentType) && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <h4 className="font-medium text-gray-900">Transaction Details</h4>
            
            {midtransTransactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="text-sm font-mono">{midtransTransactionId}</span>
              </div>
            )}

            {midtransPaymentType && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Type:</span>
                <span className="text-sm">{midtransPaymentType}</span>
              </div>
            )}

            {midtransTransactionTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction Time:</span>
                <span className="text-sm">{formatDate(midtransTransactionTime)}</span>
              </div>
            )}

            {midtransGrossAmount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Amount:</span>
                <span className="text-sm">{formatCurrency(midtransGrossAmount)}</span>
              </div>
            )}

            {midtransStatusCode && (
              <div className="flex justify-between">
                <span className="text-gray-600">Status Code:</span>
                <span className="text-sm font-mono">{midtransStatusCode}</span>
              </div>
            )}
          </div>
        )}

        {/* Payment Instructions for Bank Transfer */}
        {paymentMethod === 'bank_transfer' && status === 'pending' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Bank Transfer Instructions</h4>
            <p className="text-sm text-blue-800 mb-2">
              Please complete your bank transfer within 24 hours to avoid order cancellation.
            </p>
            <p className="text-xs text-blue-600">
              Check your email for detailed transfer instructions.
            </p>
          </div>
        )}

        {/* Payment Instructions for COD */}
        {paymentMethod === 'cod' && status === 'pending' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">Cash on Delivery</h4>
            <p className="text-sm text-yellow-800">
              Payment will be collected upon delivery. Please have the exact amount ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory; 