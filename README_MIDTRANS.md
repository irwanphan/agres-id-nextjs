# Midtrans Payment Gateway Integration

Implementasi lengkap payment gateway Midtrans untuk aplikasi e-commerce Next.js dengan fitur bank transfer dan konfirmasi pembayaran otomatis.

## 🚀 Fitur yang Diimplementasikan

### ✅ Payment Methods
- **Midtrans Snap**: Redirect ke halaman pembayaran Midtrans dengan multiple opsi
- **Bank Transfer**: Transfer bank langsung dengan Virtual Account
- **Cash on Delivery (COD)**: Pembayaran tunai saat pengiriman

### ✅ API Endpoints
- `POST /api/midtrans/create-transaction` - Membuat transaksi Midtrans Snap
- `POST /api/midtrans/bank-transfer` - Membuat transaksi bank transfer
- `POST /api/midtrans/notification` - Handle notifikasi pembayaran dari Midtrans
- `GET /api/midtrans/status/[orderId]` - Cek status pembayaran manual
- `POST /api/order/status-update` - Update status order

### ✅ Database Schema
Model Order telah diperluas dengan field Midtrans:
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

### ✅ Components
- `PaymentMethod.tsx` - Pilihan metode pembayaran
- `CheckoutAreaWithMidtrans.tsx` - Area checkout dengan Midtrans
- `PaymentStatus.tsx` - Status pembayaran dengan tombol refresh
- `PaymentHistory.tsx` - Riwayat pembayaran lengkap
- `usePaymentStatus.ts` - Hook untuk mengelola status pembayaran

## 🛠️ Setup dan Konfigurasi

### 1. Install Dependencies
```bash
npm install midtrans-client
```

### 2. Environment Variables
Tambahkan ke file `.env.local`:
```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY="SB-Mid-server-your_server_key_here"
MIDTRANS_CLIENT_KEY="SB-Mid-client-your_client_key_here"

# Site URL (untuk callbacks)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Update Database Schema
```bash
npx prisma generate
npx prisma db push
```

## 📋 Alur Pembayaran

### 1. Checkout Process
```
User → Pilih Payment Method → Create Order → Create Transaction → Redirect/Show Instructions
```

### 2. Payment Status Flow
```
Pending → Midtrans Notification → Update Order Status → Email Confirmation
```

### 3. Bank Transfer Flow
```
Create Bank Transfer → Generate VA Numbers → Show Instructions → User Transfer → Auto Confirmation
```

## 🔧 Konfigurasi Midtrans

### Sandbox vs Production
Sistem otomatis mendeteksi environment:
- Development: Menggunakan Sandbox keys
- Production: Menggunakan Production keys

### Payment Methods yang Didukung
Secara default, metode pembayaran berikut diaktifkan:
- Bank Transfer (BCA, BNI, BRI, Mandiri, Permata)
- Credit Card
- GoPay
- ShopeePay

### Callback URLs
URL callback default:
- Success: `${SITE_URL}/success`
- Error: `${SITE_URL}/error`
- Pending: `${SITE_URL}/pending`

## 🧪 Testing

### Test Cards (Credit Card)
- **Visa**: 4811 1111 1111 1114
- **Mastercard**: 5211 1111 1111 1117
- **JCB**: 3566 0020 2036 0505

### Test Bank Accounts
Gunakan akun bank Indonesia yang valid untuk testing bank transfer.

## 🔒 Security Features

### Signature Verification
Notifikasi pembayaran diverifikasi menggunakan signature key:
```javascript
const expectedSignature = crypto
  .createHash('sha512')
  .update(orderId + statusCode + grossAmount + serverKey)
  .digest('hex');
```

### Environment Variables
Semua kunci sensitif disimpan dalam environment variables.

## 📱 User Experience

### 1. Payment Method Selection
- Tampilan yang clean dan professional
- Logo untuk setiap metode pembayaran
- Informasi tambahan untuk setiap metode

### 2. Bank Transfer Instructions
- Virtual Account numbers ditampilkan dengan jelas
- Instruksi transfer yang mudah dipahami
- Batas waktu 24 jam untuk transfer

### 3. Payment Status Tracking
- Auto-refresh setiap 30 detik untuk pembayaran pending
- Manual refresh button
- Status yang mudah dipahami (Paid, Pending, Failed)

### 4. Success Page
- Informasi bank transfer (jika applicable)
- Link ke halaman account
- Konfirmasi order berhasil

## 🎨 UI/UX Features

### Professional Styling
- Menggunakan Tailwind CSS
- Design yang konsisten dengan aplikasi
- Responsive design untuk mobile dan desktop

### User-Friendly Interface
- Loading states yang jelas
- Error handling yang informatif
- Toast notifications untuk feedback

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly

## 🔄 Status Mapping

| Midtrans Status | Application Status | Description |
|----------------|-------------------|-------------|
| `settlement`, `capture` | `paid` | Pembayaran berhasil |
| `pending` | `pending` | Menunggu pembayaran |
| `deny`, `cancel`, `expire` | `failed` | Pembayaran gagal |

## 📧 Email Notifications

Sistem mengirim email otomatis untuk:
- Order confirmation
- Payment confirmation
- Bank transfer instructions

## 🚨 Error Handling

### Common Errors
1. **Invalid Signature**: Periksa server key configuration
2. **Transaction Failed**: Verifikasi aktivasi metode pembayaran
3. **Notification Not Received**: Periksa callback URL

### Error Messages
- User-friendly error messages
- Detailed logging untuk debugging
- Fallback mechanisms

## 📊 Monitoring

### Logs
- Transaction creation logs
- Notification processing logs
- Status check logs

### Metrics
- Payment success rate
- Transaction volume
- Error rates

## 🔧 Customization

### Payment Methods
Anda dapat menyesuaikan metode pembayaran yang diaktifkan:
```javascript
enabledPayments: ['bank_transfer', 'credit_card', 'gopay', 'shopeepay']
```

### Bank Transfer Banks
Default bank adalah BCA, dapat diubah:
```javascript
bankType: "bca" // bca, bni, bri, mandiri, permata
```

### Callback URLs
URL callback dapat dikustomisasi per transaksi.

## 📚 Documentation

### API Reference
Lihat file `MIDTRANS_SETUP.md` untuk dokumentasi lengkap API.

### Components
Setiap komponen memiliki TypeScript interfaces yang jelas.

### Hooks
Custom hooks tersedia untuk state management yang konsisten.

## 🤝 Support

### Midtrans Support
- [Midtrans Documentation](https://docs.midtrans.com/)
- [Midtrans Support](https://midtrans.com/support)

### Application Support
- Check application logs untuk error details
- Review error messages di console
- Verify environment variables

## 🔄 Updates

### Version History
- v1.0.0: Initial implementation
- Added bank transfer support
- Added payment status tracking
- Added professional UI components

### Future Enhancements
- [ ] Disbursement support (Iris API)
- [ ] Subscription payments
- [ ] Multi-currency support
- [ ] Advanced fraud detection

---

**Note**: Pastikan untuk selalu menggunakan environment variables untuk kunci sensitif dan tidak pernah commit kunci ke version control. 