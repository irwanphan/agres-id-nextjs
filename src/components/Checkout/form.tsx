import { createContext, useContext } from 'react';
import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { RajaOngkirDestination, RajaOngkirShippingCost } from '../../lib/rajaongkir';

type FormContextType = {
  register: UseFormRegister<CheckoutInput>;
  errors: FieldErrors<CheckoutInput>;
  watch: UseFormWatch<CheckoutInput>;
  control: Control<CheckoutInput, any>;
  setValue: UseFormSetValue<CheckoutInput>;
  handleSubmit: UseFormHandleSubmit<CheckoutInput, undefined>
} | null;

const FormContext = createContext<FormContextType>(null);

type PropsType = {
  children: React.ReactNode;
  value: Exclude<FormContextType, null>;
};

export function CheckoutFormProvider({ children, value }: PropsType) {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useCheckoutForm() {
  const formContext = useContext(FormContext);

  if (!formContext) {
    throw new Error(
      'useCheckoutForm must be used within a CheckoutFormProvider'
    );
  }

  return formContext;
}

export type CheckoutInput = {
  billing: {
    firstName: string;
    lastName?: string;
    companyName?: string;
    // regionName: string;
    province: string;
    provinceId: string;
    city: string;
    cityId: string;
    address: {
      address1: string;
      address2?: string;
    };
    // town: string;
    country?: string;
    phone: string;
    email: string;
    createAccount?: boolean;
  };
  shipToDifferentAddress: boolean;
  shipping?: {
    countryName: string;
    address: {
      street: string;
      apartment?: string;
    };
    town: string;
    country?: string;
    phone: string;
    email: string;
  };
  shippingMethod: {
    name: string;
    price: number;
    courier?: string;
    service?: string;
    etd?: string;
  };
  paymentMethod: string;
  selectedBank?: string;
  notes?: string;
  couponDiscount?: number;
  couponCode?: string;
  products: {
    id: string;
    price: number;
    quantity: number;
  }[];
  // RajaOngkir specific fields
  originDestination?: string;
  destinationDestination?: string;
  packageWeight?: number;
  rajaOngkirData?: {
    origin: RajaOngkirDestination;
    destination: RajaOngkirDestination;
    weight: number;
    selectedOption: RajaOngkirShippingCost;
  };
};
