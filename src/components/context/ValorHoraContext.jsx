import { createContext, useContext, useState } from "react";

const ValorHoraContext = createContext();

export const ValorHoraProvider = ({ children }) => {
  const [valorHora, setValorHora] = useState(null);

  return (
    <ValorHoraContext.Provider value={{ valorHora, setValorHora }}>
      {children}
    </ValorHoraContext.Provider>
  );
};

export const useValorHora = () => useContext(ValorHoraContext);
