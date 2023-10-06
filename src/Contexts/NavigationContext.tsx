import React, { createContext, useContext, useState, ReactNode } from "react";

type NavigationState = {
  search: string | null;
  isLive: boolean;
};

type NavContextValue = {
  navState: NavigationState;
  setState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const NavigationContext = createContext<NavContextValue | undefined>(undefined);

// Define an initial state
const initialState: NavigationState = {
  search: null,
  isLive: false,
};

function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavigationState>(initialState);

  return (
    <NavigationContext.Provider value={{ navState: state, setState }}>
      {children}
    </NavigationContext.Provider>
  );
}

function useNavContext(): NavContextValue {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavContext must be used within a NavgiationProvider");
  }
  return context;
}

export { NavigationProvider, useNavContext };
