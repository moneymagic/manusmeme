import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RefreshCw, Save, Wallet, ExternalLink, ArrowRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

// Simulação da integração com Solana Web3
// Em um ambiente real, importaríamos:
// import { useWallet } from '@solana/wallet-adapter-react';
// import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Constantes para simulação
const CONTRACT_ADDRESS = "5xyzAb123..."; // Endereço do contrato simulado
const SOLANA_EXPLORER_URL = "https://explorer.solana.com/tx";

interface CopyTradeSettingsProps {
  walletData: {
    balance: number;
    depositAddress: string;
    isActive: boolean;
  };
  isLoading: boolean;
}

const CopyTradeSettings = ({ walletData, isLoading }: CopyTradeSettingsProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(1.0);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    isActive: walletData.isActive,
    allocatedCapital: 1
  });
  
  // Simulação do hook useWallet do Solana
  // Em um ambiente real, usaríamos:
  // const { publicKey, sendTransaction } = useWallet();
  const walletConnected = true; // Simulando carteira conectada
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Get copy settings
        const { data, error } = await supabase
          .from('copy_settings')
          .select('*')
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setSettings({
            isActive: data.is_active,
            allocatedCapital: data.allocated_capital_sol
          });
        }
      } catch (error) {
        console.error("Error fetching copy settings:", error);
      }
    };
    
    fetchSettings();
  }, []);

  // Simulação de transação Solana
  const handleDeposit = async () => {
    if (!walletConnected) {
      toast({
        title: "Carteira não conectada",
        description: "Por favor, conecte sua carteira para continuar",
        variant: "destructive"
      });
      return;
    }

    if (depositAmount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor maior que zero",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setTransactionStatus('pending');
    
    try {
      // Simulação de transação
      // Em um ambiente real, faríamos:
      /*
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(CONTRACT_ADDRESS),
          lamports: LAMPORTS_PER_SOL * depositAmount
        })
      );
      
      const signature = await sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction(signature);
      */
      
      // Simulando tempo de processamento da blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulando hash de transação
      const mockTxHash = "3xR9t2dnbLmHQKLECDk1r4vCkPGGBQXPARHCJw8rWBFKKKuoV4zcnUW7WPo9JB4EFSKfYPVcivxz1Bp";
      setTransactionHash(mockTxHash);
      setTransactionStatus('success');
      
      // Atualizar saldo (simulado)
      // Em um ambiente real, buscaríamos o novo saldo
      
      toast({
        title: "Depósito realizado com sucesso!",
        description: `${depositAmount} SOL adicionados à sua carteira de copy trading`,
      });
      
      // Fechar modal após sucesso
      setTimeout(() => {
        setShowFundsModal(false);
        setTransactionStatus('idle');
        setTransactionHash(null);
      }, 3000);
      
    } catch (error) {
      console.error("Erro ao processar depósito:", error);
      setTransactionStatus('error');
      toast({
        title: "Falha no depósito",
        description: "Ocorreu um erro ao processar sua transação",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsProcessing(true);
      
      // Get current user ID
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!userId) {
        toast({
          title: "Erro de autenticação",
          description: "Por favor, faça login para salvar as configurações",
          variant: "destructive"
        });
        return;
      }
      
      // Update or insert copy settings
      const { data: existingSettings } = await supabase
        .from('copy_settings')
        .select('id')
        .maybeSingle();
        
      if (existingSettings) {
        // Update existing settings
        const { error } = await supabase
          .from('copy_settings')
          .update({
            is_active: settings.isActive,
            allocated_capital_sol: settings.allocatedCapital,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSettings.id);
          
        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('copy_settings')
          .insert({
            user_id: userId,
            is_active: settings.isActive,
            allocated_capital_sol: settings.allocatedCapital
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Configurações salvas!",
        description: settings.isActive 
          ? "Seu copy trading está ativo agora" 
          : "Copy trading foi pausado"
      });
      
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Falha ao salvar configurações",
        description: "Por favor, tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="premium-card-glass premium-fade-in">
        <div className="flex justify-center p-6">
          <RefreshCw className="animate-spin text-white h-8 w-8" />
        </div>
      </div>
    );
  }
  
  const lowBalanceWarning = walletData.balance < 0.05;
  
  return (
    <>
      <Dialog open={showFundsModal} onOpenChange={setShowFundsModal}>
        <DialogContent className="premium-card-glass premium-slide-up max-w-md">
          <DialogHeader>
            <DialogTitle className="h2 text-white">Adicionar Fundos</DialogTitle>
            <DialogDescription className="caption">
              Deposite SOL diretamente da sua carteira conectada
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="premium-card">
              <p className="caption">Saldo Disponível</p>
              <p className="h2">{walletData.balance} SOL</p>
              <div className="flex items-center mt-2">
                <div className={`premium-status-indicator ${
                  walletData.balance > 0.05 ? 'premium-status-success' : 'premium-status-error'
                }`}></div>
                <p className={`small ${
                  walletData.balance > 0.05 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {walletData.balance > 0.05 
                    ? 'Saldo suficiente para copy trading' 
                    : 'Saldo baixo! Adicione pelo menos 0.05 SOL'}
                </p>
              </div>
            </div>
            
            {transactionStatus === 'idle' && (
              <div className="premium-card">
                <Label htmlFor="deposit-amount" className="body mb-2 block">Valor a Depositar (SOL)</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="deposit-amount"
                    type="number"
                    placeholder="1.0"
                    className="premium-input"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                    min={0.1}
                    step="0.1"
                  />
                  <span className="body font-medium">SOL</span>
                </div>
                <p className="small mt-2">
                  Taxa estimada: ~0.000005 SOL
                </p>
              </div>
            )}
            
            {transactionStatus === 'pending' && (
              <div className="premium-card bg-blue-900/20 border-blue-500/20">
                <div className="flex flex-col items-center justify-center p-6">
                  <RefreshCw className="animate-spin text-blue-400 h-10 w-10 mb-4" />
                  <p className="body text-blue-300 text-center">
                    Processando transação...
                    <br />
                    <span className="small text-blue-400">Confirme na sua carteira</span>
                  </p>
                </div>
              </div>
            )}
            
            {transactionStatus === 'success' && transactionHash && (
              <div className="premium-card bg-green-900/20 border-green-500/20">
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="body text-green-300 text-center mb-2">
                    Transação confirmada!
                  </p>
                  <a 
                    href={`${SOLANA_EXPLORER_URL}/${transactionHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="small text-green-400 flex items-center hover:underline"
                  >
                    Ver no Solana Explorer
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            )}
            
            {transactionStatus === 'error' && (
              <div className="premium-card bg-red-900/20 border-red-500/20">
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="body text-red-300 text-center">
                    Falha na transação
                    <br />
                    <span className="small text-red-400">Por favor, tente novamente</span>
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setShowFundsModal(false);
                setTransactionStatus('idle');
                setTransactionHash(null);
              }}
              className="premium-button-secondary flex-1"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            
            {transactionStatus === 'idle' && (
              <button 
                onClick={handleDeposit}
                className="premium-button-primary flex-1"
                disabled={isProcessing || depositAmount <= 0}
              >
                Confirmar
              </button>
            )}
            
            {transactionStatus === 'success' && (
              <button 
                onClick={() => {
                  setShowFundsModal(false);
                  setTransactionStatus('idle');
                  setTransactionHash(null);
                }}
                className="premium-button-primary flex-1 bg-green-600 hover:bg-green-700"
              >
                Concluir
              </button>
            )}
            
            {transactionStatus === 'error' && (
              <button 
                onClick={() => setTransactionStatus('idle')}
                className="premium-button-primary flex-1"
              >
                Tentar Novamente
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="premium-card premium-fade-in">
        <div className="mb-6">
          <h2 className="h2">Copy Trading Settings</h2>
          <p className="caption">
            Configure your copy trading parameters
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="premium-card bg-black/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="caption">Saldo Disponível</p>
                <p className="h3">{walletData.balance} SOL</p>
              </div>
              <button 
                onClick={() => setShowFundsModal(true)}
                className="premium-button-primary"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Adicionar Fundos
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="copy-active" className="h3">Trading Status</Label>
                <p className="caption">Enable or disable copy trading</p>
              </div>
              <label className="premium-switch">
                <input 
                  type="checkbox"
                  checked={settings.isActive}
                  onChange={(e) => setSettings({...settings, isActive: e.target.checked})}
                  disabled={lowBalanceWarning}
                />
                <span className="premium-switch-slider"></span>
              </label>
            </div>
            
            {lowBalanceWarning && (
              <div className="premium-card bg-red-900/20 border-red-500/20 p-3">
                <p className="small text-red-300">
                  Saldo insuficiente! Adicione pelo menos 0.05 SOL para ativar o copy trading.
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allocated-capital" className="h3">Allocated Capital (SOL)</Label>
            <p className="caption">This determines the size of your copy trades relative to the Master Trader</p>
            <Input 
              id="allocated-capital"
              type="number"
              className="premium-input"
              value={settings.allocatedCapital}
              onChange={(e) => setSettings({...settings, allocatedCapital: parseFloat(e.target.value) || 0})}
              min={0.1}
              step="0.1"
            />
          </div>
          
          <div className="premium-card bg-black/20 p-4">
            <h3 className="h3 mb-2">Performance Fee Structure</h3>
            <p className="body">30% of profit is deducted from your gas fee wallet:</p>
            <ul className="space-y-2 mt-3">
              <li className="caption flex items-center">
                <div className="w-1 h-1 rounded-full bg-white mr-2"></div>
                10% goes to Master Trader
              </li>
              <li className="caption flex items-center">
                <div className="w-1 h-1 rounded-full bg-white mr-2"></div>
                20% goes to the affiliate network
              </li>
            </ul>
          </div>
          
          <button 
            onClick={handleSaveSettings}
            className="premium-button-primary w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <RefreshCw className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Salvar Configurações
          </button>
        </div>
      </div>
    </>
  );
};

export default CopyTradeSettings;
