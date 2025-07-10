export type PickupPoint = {
  id: string;
  name: string;
  phone: string | null;
  address: string;
  pinAddress: string | null;
  province: string;
  city: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  teamCode: string | null;
  isActive: boolean;
};