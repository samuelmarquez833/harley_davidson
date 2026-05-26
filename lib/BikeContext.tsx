"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { bikeModels, BikeModel } from "@/lib/content";

type BikeContextType = {
  active: number;
  setActive: (i: number) => void;
  model: BikeModel;
};

const BikeContext = createContext<BikeContextType>({
  active: 0,
  setActive: () => {},
  model: bikeModels[0],
});

export function BikeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  return (
    <BikeContext.Provider value={{ active, setActive, model: bikeModels[active] }}>
      {children}
    </BikeContext.Provider>
  );
}

export function useBike() {
  return useContext(BikeContext);
}
