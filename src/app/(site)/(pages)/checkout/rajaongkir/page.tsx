import RajaOngkirCheckout from '@/components/Checkout/RajaOngkirCheckout';

export default function RajaOngkirCheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-1 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark mb-2">
              Kalkulator Ongkir RajaOngkir
            </h1>
            <p className="text-gray-5">
              Hitung ongkir real-time dari berbagai kurir di Indonesia
            </p>
          </div>
          
          <RajaOngkirCheckout />
        </div>
      </div>
    </div>
  );
} 