import React, { createContext } from "react";

interface AppContextInterface {
  name: string;
}

const AppContext = createContext<AppContextInterface>({ name: "Next Auth" });

export const AppContextProvider: React.FC = ({ children }) => {
  return (
    <AppContext.Provider value={{ name: "Next-Auth" }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
