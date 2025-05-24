
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Copy, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode.react';

interface CopyTradeWalletProps {
  walletData: {
    balance: number;
    depositAddress: string;
    isActive: boolean;
  };
  isLoading: boolean;
}

const CopyTradeWallet = ({ walletData, isLoading }: CopyTradeWalletProps) => {
  const { toast } = useToast();
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletData.depositAddress);
    toast({
      title: "Address copied!",
      description: "Deposit address copied to clipboard"
    });
  };
  
  if (isLoading) {
    return (
      <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <RefreshCw className="animate-spin text-white h-8 w-8" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">SOL Wallet</CardTitle>
          <CardDescription className="text-gray-400">
            Your pre-paid gas fee wallet for copy trading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black/40 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Available Balance</p>
            <p className="text-white text-3xl font-bold">{walletData.balance} SOL</p>
            <div className="flex items-center mt-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                walletData.balance > 0.05 ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <p className={`text-sm ${
                walletData.balance > 0.05 ? 'text-green-500' : 'text-red-500'
              }`}>
                {walletData.balance > 0.05 
                  ? 'Sufficient balance for copy trading' 
                  : 'Low balance! Add funds to continue copy trading'}
              </p>
            </div>
          </div>
          
          <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Your Deposit Address</p>
            <div className="flex items-center justify-between">
              <p className="text-white text-sm font-mono truncate">{walletData.depositAddress}</p>
              <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                <Copy className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
            <div className="flex justify-center my-4">
              <div className="bg-white p-2 rounded">
                <QRCode value={walletData.depositAddress} size={150} />
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-3 mt-2">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-blue-300 text-sm">
                  Send only SOL to this address. Do not send any other tokens or they may be lost.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CopyTradeWallet;
