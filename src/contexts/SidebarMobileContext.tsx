import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarMobileContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarMobileContext = createContext<SidebarMobileContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const SidebarMobileProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarMobileContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((v) => !v),
      }}
    >
      {children}
    </SidebarMobileContext.Provider>
  );
};

export const useSidebarMobile = () => useContext(SidebarMobileContext);
