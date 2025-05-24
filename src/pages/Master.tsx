
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Settings, TrendingUp, DollarSign, Activity, Users, Award, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase, calculateProportionalTradeAmount, getBalanceRequirements } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Master = () => {
  const [botActive, setBotActive] = useState(true);
  const [maxRisk, setMaxRisk] = useState('5');
  const [minProfit, setMinProfit] = useState('10');
  const { toast } = useToast();

  // Estado para exemplo de proporcionalidade
  const [masterBalance, setMasterBalance] = useState(1);
  const [followerBalance, setFollowerBalance] = useState(2);
  const [masterTradeAmount, setMasterTradeAmount] = useState(0.1);
  const [followerTradeAmount, setFollowerTradeAmount] = useState(0.2);

  // Estado para requisitos de saldo
  const [balanceRequirements, setBalanceRequirements] = useState({
    minActiveBalance: 0.5,
    minMaintenanceBalance: 0.1
  });

  // Efeito para calcular o valor proporcional do seguidor quando os valores mudam
  useEffect(() => {
    if (masterBalance > 0 && masterTradeAmount > 0) {
      const proportionalAmount = calculateProportionalTradeAmount(
        masterTradeAmount,
        masterBalance,
        followerBalance
      );
      setFollowerTradeAmount(proportionalAmount);
    }
  }, [masterBalance, followerBalance, masterTradeAmount]);

  // Efeito para obter requisitos de saldo
  useEffect(() => {
    const fetchBalanceRequirements = async () => {
      const requirements = await getBalanceRequirements();
      setBalanceRequirements(requirements);
    };
    
    fetchBalanceRequirements();
  }, []);

  // Fetch rank requirements
  const { data: rankRequirements } = useQuery({
    queryKey: ['rankRequirements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rank_requirements')
        .select('*')
        .order('rank');
      
      if (error) {
        console.error('Erro ao carregar requisitos de rank:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar requisitos de ranking",
          variant: "destructive"
        });
        return [];
      }
      return data || [];
    }
  });

  // Fetch system settings
  const { data: systemSettings } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Erro ao carregar configurações do sistema:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar configurações do sistema",
          variant: "destructive"
        });
        return null;
      }
      return data;
    }
  });

  const tradingPairs = [
    { name: 'BONK/SOL', status: 'active', profit24h: '+12.5%' },
    { name: 'PEPE/SOL', status: 'active', profit24h: '+8.3%' },
    { name: 'DOGE/SOL', status: 'paused', profit24h: '-2.1%' },
    { name: 'SHIB/SOL', status: 'active', profit24h: '+15.7%' },
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-white">Carteira Master</h1>
            </div>
            <Badge variant="outline" className="border-green-500 text-green-400">
              Ativa
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requisitos de Saldo */}
            <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  Requisitos de Saldo Mínimo
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Saldos mínimos necessários para ativação e manutenção da conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                    <h3 className="text-white font-medium flex items-center mb-2">
                      <Activity className="h-4 w-4 mr-2 text-green-400" />
                      Saldo de Ativação
                    </h3>
                    <p className="text-3xl font-bold text-white">
                      {balanceRequirements.minActiveBalance} <span className="text-sm text-gray-400">SOL</span>
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Saldo mínimo para ativar sua conta e começar a operar
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <h3 className="text-white font-medium flex items-center mb-2">
                      <Activity className="h-4 w-4 mr-2 text-blue-400" />
                      Saldo de Manutenção
                    </h3>
                    <p className="text-3xl font-bold text-white">
                      {balanceRequirements.minMaintenanceBalance} <span className="text-sm text-gray-400">SOL</span>
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Saldo mínimo para manter sua conta operacional
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white text-center">
                    Sua conta será desativada automaticamente se o saldo cair abaixo do valor mínimo de manutenção.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Operações Proporcionais Demo */}
            <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Simulador de Operações Proporcionais
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Veja como as operações são proporcionais ao capital disponível
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Master Trader Side */}
                  <div className="space-y-4 p-4 rounded-lg bg-purple-900/20">
                    <h3 className="text-white font-medium">Master Trader</h3>
                    <div className="space-y-2">
                      <Label className="text-white">Saldo Total (SOL)</Label>
                      <Input 
                        type="number" 
                        value={masterBalance}
                        onChange={(e) => setMasterBalance(parseFloat(e.target.value) || 0)}
                        className="bg-white/5 border-white/20 text-white"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Valor da Operação (SOL)</Label>
                      <Input 
                        type="number" 
                        value={masterTradeAmount}
                        onChange={(e) => setMasterTradeAmount(parseFloat(e.target.value) || 0)}
                        className="bg-white/5 border-white/20 text-white"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <p className="text-gray-400">Percentual do Capital:</p>
                      <p className="text-white font-bold text-lg">
                        {masterBalance > 0 ? ((masterTradeAmount / masterBalance) * 100).toFixed(2) : 0}%
                      </p>
                    </div>
                  </div>

                  {/* Follower Side */}
                  <div className="space-y-4 p-4 rounded-lg bg-blue-900/20">
                    <h3 className="text-white font-medium">Seguidor</h3>
                    <div className="space-y-2">
                      <Label className="text-white">Saldo Total (SOL)</Label>
                      <Input 
                        type="number" 
                        value={followerBalance}
                        onChange={(e) => setFollowerBalance(parseFloat(e.target.value) || 0)}
                        className="bg-white/5 border-white/20 text-white"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Valor Proporcional (SOL)</Label>
                      <Input 
                        type="number" 
                        value={followerTradeAmount}
                        readOnly
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <p className="text-gray-400">Percentual do Capital:</p>
                      <p className="text-white font-bold text-lg">
                        {followerBalance > 0 ? ((followerTradeAmount / followerBalance) * 100).toFixed(2) : 0}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white text-center">O sistema replica as operações do Master de forma proporcional ao capital de cada seguidor, mantendo o mesmo percentual de exposição ao risco.</p>
                </div>
              </CardContent>
            </Card>

            {/* Bot Configuration */}
            <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configurações do Bot
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure os parâmetros de trading automático
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Bot Ativo</Label>
                    <p className="text-sm text-gray-400">Ativar/desativar trading automático</p>
                  </div>
                  <Switch checked={botActive} onCheckedChange={setBotActive} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Risco Máximo (%)</Label>
                    <Input 
                      value={maxRisk}
                      onChange={(e) => setMaxRisk(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Lucro Mínimo (%)</Label>
                    <Input 
                      value={minProfit}
                      onChange={(e) => setMinProfit(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="10"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                  onClick={handleSaveSettings}
                >
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>

            {/* Trading Pairs Management */}
            <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Pares de Trading</CardTitle>
                <CardDescription className="text-gray-400">
                  Gerencie os pares de meme coins que o bot irá operar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tradingPairs.map((pair, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-2 rounded-full">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{pair.name}</p>
                          <Badge 
                            variant={pair.status === 'active' ? 'default' : 'secondary'}
                            className={pair.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                          >
                            {pair.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${pair.profit24h.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {pair.profit24h}
                        </p>
                        <p className="text-gray-400 text-sm">24h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Commission Structure */}
            <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Estrutura de Comissões
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Comissões do Master e distribuição na rede afiliada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white/10 rounded-lg">
                    <div className="flex-1 text-center md:text-left mb-3 md:mb-0">
                      <p className="text-gray-400">Performance Fee Total</p>
                      <p className="text-white text-2xl font-bold">
                        {systemSettings?.platform_fee_percentage || 30}%
                      </p>
                    </div>
                    <div className="flex-1 text-center mb-3 md:mb-0">
                      <p className="text-gray-400">Master Trader</p>
                      <p className="text-white text-2xl font-bold">
                        {systemSettings?.master_trader_fee_percentage || 10}%
                      </p>
                    </div>
                    <div className="flex-1 text-center md:text-right">
                      <p className="text-gray-400">Rede Afiliada</p>
                      <p className="text-white text-2xl font-bold">
                        {systemSettings?.affiliate_fee_percentage || 20}%
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-medium mb-3">Distribuição por Ranking (Diferencial)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      {rankRequirements?.map((rank) => (
                        <div 
                          key={rank.rank} 
                          className="bg-white/5 p-3 rounded-lg"
                        >
                          <h4 className="text-white font-bold">V{rank.rank}</h4>
                          <p className="text-emerald-400 text-lg">{rank.bonus_percentage}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Master Wallet Stats */}
            <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Estatísticas Master</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-gray-400">Saldo Total</span>
                  </div>
                  <span className="text-white font-bold">₴ 45.2K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-400">Lucro 24h</span>
                  </div>
                  <span className="text-green-400 font-bold">+₴ 1.28K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-400">Trades Ativos</span>
                  </div>
                  <span className="text-white font-bold">8</span>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Distribution */}
            <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Receita Master (10%)</CardTitle>
                <CardDescription className="text-gray-400">
                  Sua participação nos lucros
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">₴ 1,280</p>
                  <p className="text-green-400">+15.3% este mês</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hoje</span>
                    <span className="text-white">₴ 128</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Esta semana</span>
                    <span className="text-white">₴ 456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Este mês</span>
                    <span className="text-white">₴ 1,280</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ranking Requirements */}
            <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Requisitos de Ranking
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Volume e afiliados necessários para cada nível
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs">
                  <div className="flex justify-between text-gray-400 border-b border-white/10 py-2">
                    <span>Rank</span>
                    <span>Volume</span>
                    <span>Afiliados</span>
                  </div>
                  {rankRequirements?.map((rank) => (
                    <div key={rank.rank} className="flex justify-between border-b border-white/10 py-2">
                      <span className="text-white">V{rank.rank}</span>
                      <span className="text-white">{rank.volume_required} SOL</span>
                      <span className="text-white">
                        {rank.rank >= 3 ? `${rank.direct_referrals_required} x V${rank.rank-1}` : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Master;
