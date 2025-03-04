
import React, { createContext, useContext } from 'react';
import { useToast as useToastHook } from '@/hooks/use-toast';

const ToastContext = createContext({});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <ToastContext.Provider value={{}}>{children}</ToastContext.Provider>;
};

export { useToastHook as useToast };
