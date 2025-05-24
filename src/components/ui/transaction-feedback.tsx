import React from 'react';
import { useToast } from "@/hooks/use-toast";

interface ToastProviderProps {
  children: React.ReactNode;
}

// Componente para notificações de transações blockchain
export const TransactionToast = ({ 
  type, 
  message, 
  txHash = null 
}: { 
  type: 'pending' | 'success' | 'error', 
  message: string,
  txHash?: string | null
}) => {
  const { toast } = useToast();
  
  React.useEffect(() => {
    const toastOptions: any = {
      title: type === 'pending' 
        ? 'Transação em andamento' 
        : type === 'success' 
          ? 'Transação confirmada' 
          : 'Falha na transação',
      description: message,
      variant: type === 'pending' 
        ? 'default' 
        : type === 'success' 
          ? 'success' 
          : 'destructive',
      duration: type === 'pending' ? Infinity : 5000,
    };
    
    if (txHash && type === 'success') {
      toastOptions.action = {
        label: 'Ver no Explorer',
        onClick: () => window.open(`https://explorer.solana.com/tx/${txHash}`, '_blank')
      };
    }
    
    toast(toastOptions);
  }, [type, message, txHash, toast]);
  
  return null;
};

// Provider para contexto de transações web3
export const Web3Provider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

// Hook para feedback de transações
export const useTransactionFeedback = () => {
  const { toast } = useToast();
  
  const showPendingTransaction = (message: string) => {
    return toast({
      title: 'Transação em andamento',
      description: message,
      duration: Infinity,
    });
  };
  
  const showSuccessTransaction = (message: string, txHash?: string) => {
    toast({
      title: 'Transação confirmada',
      description: message,
      variant: 'success',
      action: txHash ? {
        label: 'Ver no Explorer',
        onClick: () => window.open(`https://explorer.solana.com/tx/${txHash}`, '_blank')
      } : undefined
    });
  };
  
  const showErrorTransaction = (message: string) => {
    toast({
      title: 'Falha na transação',
      description: message,
      variant: 'destructive',
    });
  };
  
  return {
    showPendingTransaction,
    showSuccessTransaction,
    showErrorTransaction
  };
};
