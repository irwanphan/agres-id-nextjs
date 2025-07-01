# Midtrans Payment Gateway Integration

This document explains how to set up and use Midtrans payment gateway in your e-commerce application.

## Prerequisites

1. Midtrans account (Sandbox/Production)
2. Server Key and Client Key from Midtrans dashboard
3. Node.js and npm installed

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY="SB-Mid-server-your_server_key_here"
MIDTRANS_CLIENT_KEY="SB-Mid-client-your_client_key_here"

# Site URL (for callbacks)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## Installation

1. Install the Midtrans client library:
```bash
npm install midtrans-client
```

2. Generate Prisma client after schema changes:
```bash
npx prisma generate
```

## Features Implemented

### 1. Payment Methods
- **Midtrans Snap**: Redirects to Midtrans payment page with multiple payment options
- **Bank Transfer**: Direct bank transfer with Virtual Account numbers
- **Cash on Delivery**: Traditional COD payment

### 2. API Endpoints

#### Create Transaction
- **POST** `/api/midtrans/create-transaction`
- Creates a Midtrans Snap transaction
- Returns redirect URL to payment page

#### Bank Transfer
- **POST** `/api/midtrans/bank-transfer`
- Creates a bank transfer transaction
- Returns Virtual Account numbers

#### Payment Notification
- **POST** `/api/midtrans/notification`
- Handles payment status updates from Midtrans
- Updates order status automatically

#### Check Status
- **GET** `/api/midtrans/status/[orderId]`
- Manually check payment status
- Useful for pending payments

### 3. Database Schema

The Order model has been extended with Midtrans fields:

```prisma
model Order {
  // ... existing fields
  
  // Midtrans fields
  midtransTransactionId  String?
  midtransPaymentType    String?
  midtransTransactionTime DateTime?
  midtransGrossAmount    Float?
  midtransStatusCode     String?
}
```

## Usage

### 1. Checkout Process

1. User selects payment method (Midtrans, Bank Transfer, or COD)
2. For Midtrans/Bank Transfer:
   - Order is created with "pending" status
   - Payment transaction is created
   - User is redirected to payment page or shown bank details
3. For COD:
   - Order is created with "pending" status
   - User proceeds to success page

### 2. Payment Status Updates

- **Automatic**: Midtrans sends notifications to `/api/midtrans/notification`
- **Manual**: Users can check status using the "Check Status" button
- **Status Mapping**:
  - `settlement`, `capture` → `paid`
  - `pending` → `pending`
  - `deny`, `cancel`, `expire` → `failed`

### 3. Bank Transfer Instructions

When using bank transfer:
1. Virtual Account numbers are generated
2. Instructions are displayed on success page
3. Users have 24 hours to complete payment

## Configuration

### Sandbox vs Production

The system automatically detects environment:
- Development: Uses Sandbox keys
- Production: Uses Production keys

### Supported Payment Methods

By default, the following payment methods are enabled:
- Bank Transfer (BCA, BNI, BRI, Mandiri, Permata)
- Credit Card
- GoPay
- ShopeePay

You can customize this in the API call:

```javascript
enabledPayments: ['bank_transfer', 'credit_card', 'gopay', 'shopeepay']
```

### Callback URLs

Default callback URLs:
- Success: `${SITE_URL}/success`
- Error: `${SITE_URL}/error`
- Pending: `${SITE_URL}/pending`

## Testing

### Sandbox Testing

1. Use Sandbox keys in development
2. Test with Midtrans test cards and accounts
3. Monitor notifications in logs

### Test Cards (Credit Card)

- **Visa**: 4811 1111 1111 1114
- **Mastercard**: 5211 1111 1111 1117
- **JCB**: 3566 0020 2036 0505

### Test Bank Accounts

Use any valid Indonesian bank account for bank transfer testing.

## Security

### Signature Verification

Payment notifications are verified using signature keys to prevent fraud:

```javascript
const expectedSignature = crypto
  .createHash('sha512')
  .update(orderId + statusCode + grossAmount + serverKey)
  .digest('hex');
```

### Environment Variables

Never commit sensitive keys to version control. Use environment variables for all sensitive data.

## Troubleshooting

### Common Issues

1. **Invalid Signature**: Check server key configuration
2. **Transaction Failed**: Verify payment method activation in Midtrans dashboard
3. **Notification Not Received**: Check callback URL configuration

### Logs

Check server logs for detailed error messages:
- Transaction creation errors
- Notification processing errors
- Status check errors

## Support

For Midtrans-specific issues, refer to:
- [Midtrans Documentation](https://docs.midtrans.com/)
- [Midtrans Support](https://midtrans.com/support)

For application-specific issues, check the application logs and error messages. 