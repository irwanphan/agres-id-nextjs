import React, { createContext, useContext, useState } from "react";

interface ShippingContextProps {
  originCityId: string;
  destinationCityId: string;
  setDestinationCityId: (id: string) => void;
}

const ShippingContext = createContext<ShippingContextProps>({
  originCityId: "17650", // Jakarta Utara
  destinationCityId: "",
  setDestinationCityId: () => {},
});

export const ShippingProvider = ({ children }: { children: React.ReactNode }) => {
  const [destinationCityId, setDestinationCityId] = useState("");
  // Nanti bisa dihubungkan ke form address
  return (
    <ShippingContext.Provider value={{
      originCityId: "17650",
      destinationCityId,
      setDestinationCityId,
    }}>
      {children}
    </ShippingContext.Provider>
  );
};

export const useShippingContext = () => useContext(ShippingContext); 