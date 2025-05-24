
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ChevronDown, Users, Award, Crown } from 'lucide-react';

// Interfaces para tipos
interface TeamMember {
  id: string;
  username: string;
  joinDate: string;
  teamSize: number;
  rank?: number;
  avatar?: string;
}

const NetworkDetailPage = () => {
  // Estados para dados da rede
  const [networkStats, setNetworkStats] = useState({
    totalMembers: 121965,
    activeMembers: 4,
    inactiveMembers: 95,
    beginnerTeam: 583,
    intermediateTeam: 20,
    directDownlines: 4,
    maxTeamRequirement: 20,
    currentTeam: 2,
    maxDownlinesRequirement: 1500,
    currentDownlines: 621,
    maxDirectRequirement: 20,
    currentDirect: 4
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { 
      id: '1', 
      username: '3gu***7u*', 
      joinDate: '2024-09-30', 
      teamSize: 1 
    },
    { 
      id: '2', 
      username: 'lea***sar', 
      joinDate: '2024-02-04', 
      teamSize: 14,
      rank: 2
    },
    { 
      id: '3', 
      username: 'Fab***der', 
      joinDate: '2024-01-16', 
      teamSize: 1,
      rank: 1
    },
    { 
      id: '4', 
      username: 'dud***yal', 
      joinDate: '2024-01-11', 
      teamSize: 1,
      rank: 1
    },
    { 
      id: '5', 
      username: 'Vip***ho', 
      joinDate: '2024-01-11', 
      teamSize: 11,
      rank: 1
    },
  ]);

  // Função para calcular a porcentagem de progresso
  const calculateProgress = (current: number, max: number): number => {
    return Math.min((current / max) * 100, 100);
  };

  // Função para formatar números grandes
  const formatNumber = (num: number): string => {
    return num.toLocaleString('pt-BR');
  };

  // Ícone de rank baseado no nível
  const RankIcon = ({ rank }: { rank?: number }) => {
    if (!rank) return null;
    
    return (
      <span className="inline-flex items-center justify-center ml-1">
        <Award className="h-4 w-4 text-blue-400" />
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
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
              <h1 className="text-2xl font-bold text-white">Detalhes da Rede</h1>
            </div>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              Parceiro de equipe
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-blue-600/30 border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Número de equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <p className="text-3xl font-bold text-white">{formatNumber(networkStats.totalMembers)} <span className="text-sm font-normal text-white/70">pessoas</span></p>
                <div className="text-sm text-white/70 mt-4">
                  <p>ativado ontem</p>
                  <p>0 pessoas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600/30 border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Lucro cumulativo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <p className="text-3xl font-bold text-white">183986 <span className="text-sm font-normal text-white/70">SOL</span></p>
                <div className="text-sm text-white/70 mt-4">
                  <p>Lucro para hoje</p>
                  <p>0 SOL</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipe Global */}
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Equipe-Global</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Número de downlines diretos</span>
                  <span className="text-gray-300">({networkStats.currentDirect}/{networkStats.maxDirectRequirement})</span>
                </div>
                <Progress value={calculateProgress(networkStats.currentDirect, networkStats.maxDirectRequirement)} className="h-2 bg-gray-700" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Número de equipe</span>
                  <span className="text-gray-300">({formatNumber(networkStats.currentDownlines)}/{formatNumber(networkStats.maxDownlinesRequirement)})</span>
                </div>
                <Progress value={calculateProgress(networkStats.currentDownlines, networkStats.maxDownlinesRequirement)} className="h-2 bg-gray-700" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Equipe</span>
                  <span className="text-gray-300">({networkStats.currentTeam}/{networkStats.maxTeamRequirement})</span>
                </div>
                <Progress value={calculateProgress(networkStats.currentTeam, networkStats.maxTeamRequirement)} className="h-2 bg-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Linha Descendente */}
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center">
              <span>Linha Descendente Direta</span>
              <ChevronDown className="ml-2 h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50/10 rounded-lg p-4 mb-6">
              <p className="text-gray-300 text-sm">
                Os dados são contados uma vez por hora e são contados diariamente 
                de acordo com o horário de Cingapura (UTC + 8).
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-white font-bold text-xl">{networkStats.activeMembers} pessoas</p>
                  <p className="text-gray-300">Ativado</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-xl">{networkStats.inactiveMembers} pessoas</p>
                  <p className="text-gray-300">Desativado</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-white text-lg font-medium mb-4">Equipe (Ativado)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <p className="text-gray-300 mb-1">Iniciante</p>
                  <p className="text-white font-bold text-2xl">{networkStats.beginnerTeam} <span className="text-sm font-normal">pessoas</span></p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <p className="text-gray-300 mb-1">Intermediário</p>
                  <p className="text-white font-bold text-2xl">{networkStats.intermediateTeam} <span className="text-sm font-normal">pessoas</span></p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 mb-4">
                <h3 className="text-white text-lg font-medium">Detalhe direto da linha descendente</h3>
                <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Tudo
                </Button>
              </div>

              <div className="space-y-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                          {member.avatar ? (
                            <img src={member.avatar} alt="avatar" className="h-10 w-10 rounded-full" />
                          ) : (
                            <Users className="h-5 w-5 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {member.username}
                            <RankIcon rank={member.rank} />
                          </p>
                          <p className="text-gray-400 text-sm">{member.joinDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300">Número de equipe:</p>
                        <p className="text-white">{member.teamSize}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkDetailPage;
