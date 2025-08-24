import React, { createContext, useContext, useEffect, useState } from "react";
// Remove: import { useSession } from "next-auth/react";

interface RoutingContextType {
  currentRoute: string;
  setRoute: (newRoute: string) => void;
}

const RoutingContext = createContext<RoutingContextType | undefined>(undefined);

export const RoutingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Remove session logic
  const defaultRoute = "meetings"; // Set default route
  const localStorageKey = "currentRoute";

  const [currentRoute, setCurrentRoute] = useState(defaultRoute);

  useEffect(() => {
    const routeFromStorage = localStorage.getItem(localStorageKey);
    if (routeFromStorage) {
      setCurrentRoute(routeFromStorage);
    }
  }, []);

  // Remove all session-based routing logic

  const setRoute = (newRoute: string) => {
    setCurrentRoute(newRoute);
    localStorage.setItem(localStorageKey, newRoute);
  };

  return (
    <RoutingContext.Provider value={{ currentRoute, setRoute }}>
      {children}
    </RoutingContext.Provider>
  );
};

// Custom hook for easy context consumption
export const useRouting = () => {
  const context = useContext(RoutingContext);
  if (context === undefined) {
    throw new Error("useRouting must be used within a RoutingProvider");
  }
  return context;
};
