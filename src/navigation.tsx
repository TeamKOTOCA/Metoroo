import { createContext, useContext } from 'react';

export type NavigateByFileName = (fileName: string) => void;

const NavigationContext = createContext<NavigateByFileName | null>(null);

export const NavigationProvider = NavigationContext.Provider;

export const useMainNavigation = (): NavigateByFileName => {
  const navigate = useContext(NavigationContext);

  if (!navigate) {
    throw new Error('useMainNavigation must be used within NavigationProvider');
  }

  return navigate;
};
