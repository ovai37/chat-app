import { createContext, useContext, useState, ReactNode } from "react";

type LayoutContextType = {
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        sidebarCollapsed,
        rightPanelCollapsed,
        toggleSidebar: () => setSidebarCollapsed((v) => !v),
        toggleRightPanel: () => setRightPanelCollapsed((v) => !v),
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error("useLayout must be used inside LayoutProvider");
  }

  return context;
}
