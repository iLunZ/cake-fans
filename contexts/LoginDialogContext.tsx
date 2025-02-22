import { createContext, useContext, useState, ReactNode } from 'react';
import LoginDialog from '../components/LoginDialog';

type LoginDialogContextType = {
  openLoginDialog: () => void
  closeLoginDialog: () => void
}

const LoginDialogContext = createContext<LoginDialogContextType>({} as LoginDialogContextType);

export function LoginDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLoginDialog = () => setIsOpen(true);
  const closeLoginDialog = () => setIsOpen(false);

  return (
    <LoginDialogContext.Provider value={{ openLoginDialog, closeLoginDialog }}>
      {children}
      <LoginDialog open={isOpen} onClose={closeLoginDialog} />
    </LoginDialogContext.Provider>
  );
}

export const useLoginDialog = () => useContext(LoginDialogContext);
