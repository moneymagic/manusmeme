
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, Search, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Followers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const followers = [
    { 
      id: 1, 
      wallet: '9mF2...7x8s', 
      status: 'active', 
      copyAmount: '₴ 5,000', 
      profit24h: '+₴ 450',
      joinDate: '2024-01-15',
      totalCopied: '₴ 25,000'
    },
    { 
      id: 2, 
      wallet: '3kR1...9pL4', 
      status: 'active', 
      copyAmount: '₴ 12,000', 
      profit24h: '+₴ 890',
      joinDate: '2024-01-10',
      totalCopied: '₴ 45,000'
    },
    { 
      id: 3, 
      wallet: '8nQ7...2mK9', 
      status: 'paused', 
      copyAmount: '₴ 3,500', 
      profit24h: '+₴ 120',
      joinDate: '2024-01-20',
      totalCopied: '₴ 15,000'
    },
    { 
      id: 4, 
      wallet: '5vB6...1dF3', 
      status: 'active', 
      copyAmount: '₴ 8,200', 
      profit24h: '+₴ 670',
      joinDate: '2024-01-05',
      totalCopied: '₴ 38,000'
    },
    { 
      id: 5, 
      wallet: '2hW9...6tG5', 
      status: 'active', 
      copyAmount: '₴ 15,000', 
      profit24h: '+₴ 1,200',
      joinDate: '2023-12-28',
      totalCopied: '₴ 67,000'
    },
  ];

  const filteredFollowers = followers.filter(follower =>
    follower.wallet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFollowers = followers.length;
  const activeFollowers = followers.filter(f => f.status === 'active').length;
  const totalVolume = followers.reduce((sum, f) => sum + parseFloat(f.totalCopied.replace('₴ ', '').replace(',', '')), 0);

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
              <h1 className="text-2xl font-bold text-white">Gerenciar Seguidores</h1>
            </div>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              {totalFollowers} Seguidores
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Seguidores</p>
                  <p className="text-2xl font-bold text-white">{totalFollowers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Seguidores Ativos</p>
                  <p className="text-2xl font-bold text-white">{activeFollowers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Volume Total</p>
                  <p className="text-2xl font-bold text-white">₴ {totalVolume.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por endereço da carteira..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0">
                Adicionar Seguidor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Followers List */}
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Lista de Seguidores</CardTitle>
            <CardDescription className="text-gray-400">
              Gerencie todas as carteiras que estão copiando suas operações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFollowers.map((follower) => (
                <div key={follower.id} className="p-4 bg-white/5 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-2 rounded-full">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium font-mono">{follower.wallet}</p>
                          <p className="text-gray-400 text-sm">Desde {follower.joinDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Badge 
                        variant={follower.status === 'active' ? 'default' : 'secondary'}
                        className={follower.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                      >
                        {follower.status === 'active' ? 'Ativo' : 'Pausado'}
                      </Badge>
                    </div>

                    <div className="text-center">
                      <p className="text-white font-medium">{follower.copyAmount}</p>
                      <p className="text-gray-400 text-sm">Valor de Cópia</p>
                    </div>

                    <div className="text-center">
                      <p className="text-green-400 font-bold">{follower.profit24h}</p>
                      <p className="text-gray-400 text-sm">Lucro 24h</p>
                    </div>

                    <div className="text-center">
                      <p className="text-white font-medium">{follower.totalCopied}</p>
                      <p className="text-gray-400 text-sm">Total Copiado</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      Detalhes
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500/10">
                      {follower.status === 'active' ? 'Pausar' : 'Ativar'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Followers;
