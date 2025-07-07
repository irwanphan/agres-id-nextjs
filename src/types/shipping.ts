export interface ShippingDestination {
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

export interface ShippingCost {
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
  note?: string;
}

export interface ShippingSearchResponse {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: ShippingDestination[];
}

export interface ShippingCalculateResponse {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: {
    origin: string;
    destination: string;
    weight: number;
    courier: ShippingCost[];
  };
}

export interface ShippingCheckoutData {
  origin: ShippingDestination;
  destination: ShippingDestination;
  weight: number;
  selectedOption: ShippingCost;
  itemValue?: number;
} 


// V2 API
export interface ShippingDomesticDestination {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export interface ShippingDomesticDestinationResponse {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: ShippingDomesticDestination[];
}

export interface ShippingDomesticShippingCost {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface ShippingCalculateDomesticCostResponse {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: ShippingDomesticShippingCost[];
}