# 🚚 Integrasi RajaOngkir - E-commerce Shipping Calculator

Integrasi lengkap RajaOngkir untuk aplikasi e-commerce dengan UI/UX yang modern dan user-friendly. Sistem ini memungkinkan perhitungan ongkir real-time dari berbagai kurir di Indonesia.

## ✨ Features

- 🔍 **Pencarian Destinasi Cerdas** - Autocomplete dengan debouncing
- 📦 **Perhitungan Ongkir Real-time** - Multi-kurir support
- 🎨 **UI/UX Modern** - Responsive design dengan Tailwind CSS
- 🔒 **Type Safety** - Full TypeScript support
- ⚡ **Performance Optimized** - Debouncing, caching, lazy loading
- 🛡️ **Error Handling** - Comprehensive error management
- 📱 **Mobile Friendly** - Responsive design

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Setup

Buat file `.env.local`:

```env
NEXT_PUBLIC_RAJAONGKIR_API_KEY=your_rajaongkir_api_key_here
```

### 3. Get API Key

1. Daftar di [RajaOngkir](https://rajaongkir.com/)
2. Pilih paket (Starter, Basic, Pro)
3. Dapatkan API key dari dashboard
4. Masukkan ke environment variable

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

### 5. Access Demo Page

Buka [http://localhost:3000/checkout/rajaongkir](http://localhost:3000/checkout/rajaongkir)

## 📁 Project Structure

```
src/
├── components/Checkout/
│   ├── RajaOngkirCheckout.tsx      # Main component
│   ├── DestinationSearch.tsx       # Search component
│   ├── OriginAddress.tsx           # Origin address
│   ├── DestinationAddress.tsx      # Destination address
│   ├── PackageWeight.tsx           # Weight input
│   └── RajaOngkirShippingMethod.tsx # Shipping options
├── lib/
│   └── rajaongkir.ts               # API service
├── hooks/
│   └── useRajaOngkir.ts            # Custom hook
├── utils/
│   └── rajaongkir.ts               # Utility functions
└── app/(site)/(pages)/checkout/rajaongkir/
    └── page.tsx                    # Demo page
```

## 🎯 Usage Examples

### Basic Implementation

```tsx
import RajaOngkirCheckout from '@/components/Checkout/RajaOngkirCheckout';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto p-6">
      <RajaOngkirCheckout />
    </div>
  );
}
```

### Custom Hook Usage

```tsx
import { useRajaOngkir } from '@/hooks/useRajaOngkir';

function MyComponent() {
  const {
    originDestination,
    destinationDestination,
    packageWeight,
    shippingOptions,
    canCalculateShipping,
    setOriginDestination,
    setDestinationDestination,
    setPackageWeight,
  } = useRajaOngkir();

  return (
    <div>
      {/* Your custom UI */}
    </div>
  );
}
```

### API Service Usage

```tsx
import { rajaOngkirService } from '@/lib/rajaongkir';

// Search destinations
const searchDestinations = async (keyword: string) => {
  try {
    const response = await rajaOngkirService.searchDestination(keyword);
    return response.data;
  } catch (error) {
    console.error('Search failed:', error);
  }
};

// Calculate shipping cost
const calculateShipping = async () => {
  try {
    const response = await rajaOngkirService.calculateShippingCost({
      shipper_destination_id: 'origin_id',
      receiver_destination_id: 'destination_id',
      weight: 1.5,
      item_value: 100000,
      cod: 'no'
    });
    return response.data;
  } catch (error) {
    console.error('Calculation failed:', error);
  }
};
```

## 🎨 UI Components

### DestinationSearch
Autocomplete search dengan debouncing dan dropdown yang informatif.

```tsx
<DestinationSearch
  name="destination"
  label="Cari Destinasi"
  placeholder="Cari kota, kecamatan, atau kode pos..."
  required
  onDestinationSelect={(destination) => {
    console.log('Selected:', destination);
  }}
/>
```

### OriginAddress & DestinationAddress
Komponen untuk mengatur alamat asal dan tujuan dengan edit mode.

```tsx
<OriginAddress
  onOriginSelect={setOriginDestination}
  selectedOrigin={originDestination}
/>
```

### PackageWeight
Input berat paket dengan validasi dan tips.

```tsx
<PackageWeight
  onWeightChange={setPackageWeight}
  defaultWeight={1}
/>
```

### RajaOngkirShippingMethod
Menampilkan opsi pengiriman dari berbagai kurir.

```tsx
<RajaOngkirShippingMethod
  originDestination={originDestination}
  destinationDestination={destinationDestination}
  weight={packageWeight}
  itemValue={totalItemValue}
/>
```

## 🔧 Configuration

### Environment Variables

```env
# Required
NEXT_PUBLIC_RAJAONGKIR_API_KEY=your_api_key_here

# Optional
NEXT_PUBLIC_RAJAONGKIR_BASE_URL=https://api-sandbox.collaborator.komerce.id/tariff/api/v1
```

### API Endpoints

- **Search Destination**: `GET /destination/search?keyword={keyword}`
- **Calculate Shipping**: `GET /calculate?shipper_destination_id={origin}&receiver_destination_id={destination}&weight={weight}&item_value={value}&cod={yes/no}`

### Supported Couriers

- JNE
- POS Indonesia
- TIKI
- SiCepat
- J&T Express
- Ninja Express
- AnterAja
- Wahana
- Lion Parcel
- Pandu Logistics
- SAP Express
- Jet Express
- Indah Logistic
- DSE
- First Logistics
- NCS
- Star Cargo
- IDL Cargo
- Rex Express
- Pahala Express
- Cahaya Logistik
- Satria Express

## 🛠️ Customization

### Styling

Semua komponen menggunakan Tailwind CSS dan dapat dikustomisasi:

```tsx
// Custom styling
<div className="bg-white shadow-1 rounded-[10px] custom-shipping-card">
  <RajaOngkirCheckout />
</div>
```

### Business Logic

Tambahkan logic bisnis sesuai kebutuhan:

```tsx
// Custom weight calculation
const calculateTotalWeight = (items) => {
  return items.reduce((total, item) => total + (item.weight * item.quantity), 0);
};

// Custom item value calculation
const calculateItemValue = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};
```

### Error Handling

Custom error handling:

```tsx
import { rajaOngkirService } from '@/lib/rajaongkir';

try {
  const result = await rajaOngkirService.calculateShippingCost(params);
  // Handle success
} catch (error) {
  if (error.message.includes('Invalid Api Key')) {
    // Handle API key error
  } else if (error.message.includes('Rate limit')) {
    // Handle rate limiting
  } else {
    // Handle other errors
  }
}
```

## 📊 Performance Optimization

### Debouncing
Search input menggunakan debouncing 500ms untuk mengurangi API calls.

### Caching
Implementasi caching untuk destination data (bisa ditambahkan sesuai kebutuhan).

### Lazy Loading
Shipping options dimuat hanya ketika diperlukan.

### Error Boundaries
Proper error handling untuk network issues dan API errors.

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Pastikan API key valid dan aktif
   - Check API key permissions
   - Verify account status

2. **CORS Issues**
   - RajaOngkir API supports CORS
   - Pastikan domain terdaftar di dashboard

3. **Rate Limiting**
   - Implement exponential backoff
   - Cache responses when possible
   - Monitor API usage

4. **Network Issues**
   - Check internet connection
   - Verify API endpoint availability
   - Implement retry mechanism

### Debug Mode

Enable debug mode untuk melihat detailed logs:

```tsx
// In development
localStorage.setItem('rajaongkir_debug', 'true');
```

## 📈 Monitoring

### API Usage Tracking
Monitor API usage untuk optimasi biaya:

```tsx
// Track API calls
const trackApiCall = (endpoint: string, success: boolean) => {
  // Send to analytics
  analytics.track('rajaongkir_api_call', {
    endpoint,
    success,
    timestamp: new Date().toISOString()
  });
};
```

### Error Tracking
Track errors untuk debugging:

```tsx
// Track errors
const trackError = (error: Error, context: string) => {
  // Send to error tracking service
  errorTracker.captureException(error, {
    tags: { context, service: 'rajaongkir' }
  });
};
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📖 Documentation: [Full documentation](https://docs.example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/example/repo/issues)

## 🙏 Acknowledgments

- [RajaOngkir](https://rajaongkir.com/) for providing the API
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Tabler Icons](https://tabler-icons.io/) for icons
- [React Hook Form](https://react-hook-form.com/) for form management

---

Made with ❤️ for the Indonesian e-commerce community 