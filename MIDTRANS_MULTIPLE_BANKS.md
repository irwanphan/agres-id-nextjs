# Midtrans Multiple Bank Configuration

This document explains how to configure multiple bank transfer accounts in your Midtrans integration.

## Overview

Midtrans supports multiple Indonesian banks for Virtual Account (VA) payments. This implementation allows customers to choose from multiple banks instead of being limited to just BCA.

## Supported Banks

The following banks are supported for Virtual Account payments:

1. **BCA** (Bank Central Asia) - `bca`
2. **BNI** (Bank Negara Indonesia) - `bni`
3. **Mandiri** (Bank Mandiri) - `mandiri`
4. **BRI** (Bank Rakyat Indonesia) - `bri`
5. **Permata** (Bank Permata) - `permata`

## Implementation Options

### Option 1: Midtrans Snap (Recommended)

This approach uses Midtrans Snap API which automatically shows all available banks to customers on the payment page.

#### Configuration

In `src/app/api/midtrans/create-transaction/route.ts`:

```typescript
const enabledPayments = [
  'bank_transfer',
  'bca_va',
  'bni_va', 
  'bri_va',
  'mandiri_va',
  'permata_va',
  'credit_card', 
  'gopay', 
  'shopeepay'
];
```

#### Benefits
- ✅ Automatic bank selection UI provided by Midtrans
- ✅ No additional frontend development required
- ✅ Consistent user experience
- ✅ Automatic handling of bank-specific instructions

#### How it works
1. Customer selects "Bank Transfer" payment method
2. Customer is redirected to Midtrans payment page
3. Midtrans shows all available banks
4. Customer selects their preferred bank
5. Midtrans generates Virtual Account number
6. Customer completes payment

### Option 2: Custom Bank Selection (Implemented)

This approach provides a custom bank selection interface before creating the transaction.

#### Components

1. **BankSelection Component** (`src/components/Checkout/BankSelection.tsx`)
   - Reusable bank selection interface
   - Professional styling with Tailwind CSS
   - Follows SOLID principles
   - Supports customization

2. **Updated PaymentMethod Component** (`src/components/Checkout/PaymentMethod.tsx`)
   - Integrates bank selection when "Bank Transfer" is chosen
   - Manages selected bank state

3. **Updated Checkout Form** (`src/components/Checkout/form.tsx`)
   - Added `selectedBank` field to form data

#### Features

- **Professional UI**: Clean, modern design with bank logos
- **Responsive**: Works on mobile and desktop
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Customizable**: Easy to add/remove banks or modify styling
- **Type Safe**: Full TypeScript support

#### Bank Configuration

```typescript
const defaultBanks: BankOption[] = [
  {
    id: 'bca',
    name: 'BCA Virtual Account',
    code: 'bca',
    logo: '/images/checkout/bca.svg',
    description: 'Bank Central Asia'
  },
  {
    id: 'bni',
    name: 'BNI Virtual Account',
    code: 'bni',
    logo: '/images/checkout/bni.svg',
    description: 'Bank Negara Indonesia'
  },
  // ... more banks
];
```

#### Usage

```typescript
<BankSelection
  selectedBank={selectedBank}
  onBankSelect={handleBankSelect}
  banks={customBanks} // Optional: override default banks
  disabled={false}
/>
```

## API Integration

### Bank Transfer API

The bank transfer API (`src/app/api/midtrans/bank-transfer/route.ts`) accepts a `bankType` parameter:

```typescript
const { bankType = 'bca' } = body; // bca, bni, bri, mandiri, permata

const bankTransferDetails = {
  payment_type: 'bank_transfer',
  bank_transfer: {
    bank: bankType,
  },
  // ... other details
};
```

### Response Format

The API returns Virtual Account information:

```typescript
{
  success: true,
  data: {
    transaction_id: "123456789",
    va_numbers: [
      {
        bank: "bca",
        va_number: "12345678901"
      }
    ],
    // For Permata Bank
    permata_va_number: "12345678901",
    // For Mandiri Bank
    bill_key: "12345678901",
    biller_code: "12345"
  }
}
```

## Bank-Specific Instructions

Different banks have different Virtual Account formats:

### BCA, BNI, BRI
- Returns `va_numbers` array
- Each bank has its own VA number format

### Permata Bank
- Returns `permata_va_number` string
- Uses different VA number format

### Mandiri Bank
- Returns `bill_key` and `biller_code`
- Uses bill payment system instead of VA

## Frontend Integration

### Checkout Flow

1. **Payment Method Selection**
   ```typescript
   // User selects "Bank Transfer"
   paymentMethod: "bank_transfer"
   ```

2. **Bank Selection**
   ```typescript
   // User selects specific bank
   selectedBank: "bni"
   ```

3. **Transaction Creation**
   ```typescript
   // API call with selected bank
   bankType: data.selectedBank || "bca"
   ```

4. **Success Page**
   ```typescript
   // Display bank-specific instructions
   const bankInfo = vaNumbers.map(va => 
     `${va.bank.toUpperCase()}: ${va.va_number}`
   ).join("\n");
   ```

## Configuration in Midtrans Dashboard

### 1. Enable Bank Transfer Methods

In your Midtrans dashboard:
1. Go to **Settings** → **Payment Methods**
2. Enable the following:
   - Bank Transfer
   - BCA Virtual Account
   - BNI Virtual Account
   - Mandiri Virtual Account
   - BRI Virtual Account
   - Permata Virtual Account

### 2. Configure Callback URLs

Ensure your callback URLs are properly configured:
- Success: `https://yourdomain.com/success`
- Error: `https://yourdomain.com/error`
- Pending: `https://yourdomain.com/pending`

### 3. Test Configuration

Use Midtrans sandbox to test:
- Create test transactions with different banks
- Verify Virtual Account generation
- Test payment notifications

## Testing

### Sandbox Testing

1. **BCA Test**
   ```bash
   curl -X POST /api/midtrans/bank-transfer \
     -H "Content-Type: application/json" \
     -d '{"bankType": "bca", ...}'
   ```

2. **BNI Test**
   ```bash
   curl -X POST /api/midtrans/bank-transfer \
     -H "Content-Type: application/json" \
     -d '{"bankType": "bni", ...}'
   ```

3. **Mandiri Test**
   ```bash
   curl -X POST /api/midtrans/bank-transfer \
     -H "Content-Type: application/json" \
     -d '{"bankType": "mandiri", ...}'
   ```

### Test Virtual Account Numbers

Use any valid Indonesian bank account for testing. Midtrans will generate test Virtual Account numbers in sandbox mode.

## Production Considerations

### 1. Bank Activation

Ensure all banks are activated in your production Midtrans account:
- Contact Midtrans support if banks are not available
- Verify bank-specific requirements

### 2. Error Handling

Implement proper error handling for:
- Unavailable banks
- Network failures
- Invalid bank codes

### 3. Monitoring

Monitor:
- Transaction success rates per bank
- Virtual Account generation failures
- Payment completion rates

### 4. User Experience

- Provide clear instructions for each bank
- Show expected processing times
- Display bank logos and branding

## Troubleshooting

### Common Issues

1. **Bank Not Available**
   - Check Midtrans dashboard configuration
   - Verify bank is activated for your account
   - Contact Midtrans support

2. **Virtual Account Not Generated**
   - Check API response for errors
   - Verify transaction amount is valid
   - Ensure customer details are complete

3. **Payment Not Confirmed**
   - Check notification endpoint
   - Verify signature verification
   - Monitor transaction status

### Debug Steps

1. Check API logs for errors
2. Verify Midtrans dashboard settings
3. Test with sandbox environment
4. Contact Midtrans support if needed

## Best Practices

1. **Always provide fallback**: Default to BCA if no bank is selected
2. **Clear instructions**: Show bank-specific transfer instructions
3. **Error handling**: Handle cases where banks are unavailable
4. **User feedback**: Provide clear status updates during payment process
5. **Mobile optimization**: Ensure bank selection works on mobile devices

## Security Considerations

1. **Validate bank codes**: Ensure only valid bank codes are accepted
2. **Signature verification**: Always verify Midtrans notifications
3. **HTTPS only**: Use HTTPS for all payment-related communications
4. **Input validation**: Validate all user inputs before API calls

## Performance Optimization

1. **Lazy loading**: Load bank logos only when needed
2. **Caching**: Cache bank configurations
3. **Minimal API calls**: Reduce unnecessary API requests
4. **Optimized images**: Use optimized bank logo images

This implementation provides a robust, user-friendly solution for multiple bank transfers while maintaining security and performance standards. 