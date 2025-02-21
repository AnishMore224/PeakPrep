import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  return (
    <UIContext.Provider
      value={{
        isSidebarVisible,
        toggleSidebar,
        hamburgerRef,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export interface UIContextProps {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  hamburgerRef: React.RefObject<HTMLButtonElement>; 
}

export const useUIContext = (): UIContextProps => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
