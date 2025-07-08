export type PickupPoint = {
  id: string;
  name: string;
  address: string;
  pinAddress: string | null;
  city: string;
  province: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  teamCode: string | null;
  isActive: boolean;
};