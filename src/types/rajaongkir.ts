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

export interface RajaOngkirCheckoutData {
  origin: RajaOngkirDestination;
  destination: RajaOngkirDestination;
  weight: number;
  selectedOption: RajaOngkirShippingCost;
  itemValue?: number;
} 


// V2 API
export interface RajaOngkirDomesticDestination {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export interface RajaOngkirDomesticDestinationResponse {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: RajaOngkirDomesticDestination[];
}

export interface RajaOngkirDomesticShippingCost {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface RajaOngkirCalculateDomesticCostResponse {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: RajaOngkirDomesticShippingCost[];
}