export interface RajaOngkirDestination {
  id: string;
  name: string;
  type: string;
  province_id: string;
  province_name: string;
  city_id: string;
  city_name: string;
  subdistrict_id?: string;
  subdistrict_name?: string;
  postal_code?: string;
}

export interface RajaOngkirShippingCost {
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
  note?: string;
}

export interface RajaOngkirSearchResponse {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: RajaOngkirDestination[];
}

export interface RajaOngkirCalculateResponse {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: {
    origin: string;
    destination: string;
    weight: number;
    courier: RajaOngkirShippingCost[];
  };
}

class RajaOngkirService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_RAJAONGKIR_API_KEY || '';
    this.baseUrl = 'https://api-sandbox.collaborator.komerce.id/tariff/api/v1';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`RajaOngkir API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchDestination(keyword: string): Promise<RajaOngkirSearchResponse> {
    // Panggil endpoint proxy Next.js, bukan langsung ke RajaOngkir
    const response = await fetch(`/api/rajaongkir-destination?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) {
      throw new Error(`Proxy API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async calculateShippingCost(params: {
    shipper_destination_id: string;
    receiver_destination_id: string;
    weight: number;
    item_value?: number;
    cod?: 'yes' | 'no';
  }): Promise<RajaOngkirCalculateResponse> {
    const searchParams = new URLSearchParams({
      shipper_destination_id: params.shipper_destination_id,
      receiver_destination_id: params.receiver_destination_id,
      weight: params.weight.toString(),
      item_value: (params.item_value || 0).toString(),
      cod: params.cod || 'no',
    });

    return this.makeRequest(`/calculate?${searchParams.toString()}`);
  }
}

export const rajaOngkirService = new RajaOngkirService(); 