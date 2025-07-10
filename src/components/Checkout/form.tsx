import { createContext, useContext } from 'react';
import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

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
    phone: string;
    email: string;
    companyName?: string;
    // regionName: string;
    province: string;
    provinceId: string;
    city: string;
    cityId: string;
    zipCode: string;
    address: {
      address1: string;
      address2?: string;
    };
    // town: string;
    // country?: string;
    createAccount?: boolean;
  };
  shipToDifferentAddress: boolean;
  shippingAddressOption: "default" | "sameAsBilling" | "other";
  shipping?: {
    // origin: string;
    pickupPointId?: string;
    destination: string;
    weight?: number;
    // countryName: string;
    address: {
      address1: string;
      address2?: string;
    };
    // town: string;
    // country?: string;
    phone: string;
    email: string;
    city: string;
    cityId: string;
    province: string;
    provinceId: string;
    zipCode: string;
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
};
