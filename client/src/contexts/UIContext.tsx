import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UIContextProps {
  isSidebarCollapsed: boolean;
  isSidebarVisible: boolean;
  toggleSidebarCollapsed: () => void;
  toggleSidebarVisible: () => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebarCollapsed = () => setIsSidebarCollapsed((prev) => !prev);
  const toggleSidebarVisible = () => setIsSidebarVisible((prev) => !prev);

  return (
    <UIContext.Provider
      value={{
        isSidebarCollapsed,
        isSidebarVisible,
        toggleSidebarCollapsed,
        toggleSidebarVisible,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextProps => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
