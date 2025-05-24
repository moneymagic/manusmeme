import React from 'react';
import { CheckCircle, AlertCircle, Info, Loader2, ExternalLink } from 'lucide-react';

interface TransactionFeedbackProps {
  status: 'pending' | 'success' | 'error' | 'info';
  title: string;
  description?: string;
  txHash?: string;
  explorerUrl?: string;
  className?: string;
}

const TransactionFeedback: React.FC<TransactionFeedbackProps> = ({
  status,
  title,
  description,
  txHash,
  explorerUrl = 'https://explorer.solana.com/tx',
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-blue-900/20 border-blue-500/20';
      case 'success':
        return 'bg-green-900/20 border-green-500/20';
      case 'error':
        return 'bg-red-900/20 border-red-500/20';
      case 'info':
        return 'bg-blue-900/20 border-blue-500/20';
      default:
        return '';
    }
  };
  
  return (
    <div className={`premium-card ${getStatusColor()} premium-fade-in ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <h4 className="body font-medium text-white">{title}</h4>
          {description && (
            <p className="small mt-1">{description}</p>
          )}
          {txHash && (
            <a 
              href={`${explorerUrl}/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="small text-accent-primary flex items-center mt-2 hover:underline"
            >
              Ver no Solana Explorer
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook para usar o componente de feedback
export const useTransactionFeedback = () => {
  const [status, setStatus] = React.useState<'pending' | 'success' | 'error' | 'info' | null>(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState<string | undefined>(undefined);
  const [txHash, setTxHash] = React.useState<string | undefined>(undefined);
  
  const showPending = (title: string, description?: string) => {
    setStatus('pending');
    setTitle(title);
    setDescription(description);
    setTxHash(undefined);
  };
  
  const showSuccess = (title: string, description?: string, txHash?: string) => {
    setStatus('success');
    setTitle(title);
    setDescription(description);
    setTxHash(txHash);
  };
  
  const showError = (title: string, description?: string) => {
    setStatus('error');
    setTitle(title);
    setDescription(description);
    setTxHash(undefined);
  };
  
  const showInfo = (title: string, description?: string) => {
    setStatus('info');
    setTitle(title);
    setDescription(description);
    setTxHash(undefined);
  };
  
  const clear = () => {
    setStatus(null);
  };
  
  const feedbackElement = status ? (
    <TransactionFeedback
      status={status}
      title={title}
      description={description}
      txHash={txHash}
    />
  ) : null;
  
  return {
    showPending,
    showSuccess,
    showError,
    showInfo,
    clear,
    feedbackElement,
    status
  };
};

export default TransactionFeedback;
