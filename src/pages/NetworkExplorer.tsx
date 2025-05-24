
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const NetworkExplorer = () => {
  // Dados de exemplo para a rede
  const networkData = [
    { 
      user: "Alex M.", 
      level: 1, 
      volume: 32,
      rank: "V2",
      referrals: 3
    },
    { 
      user: "Sarah K.", 
      level: 1, 
      volume: 105,
      rank: "V3", 
      referrals: 4
    },
    { 
      user: "Marcus T.", 
      level: 2, 
      volume: 25,
      rank: "V2",
      referrals: 1
    },
    { 
      user: "Lisa P.", 
      level: 2, 
      volume: 46,
      rank: "V2",
      referrals: 2
    },
    { 
      user: "John D.", 
      level: 3, 
      volume: 12,
      rank: "V1",
      referrals: 0
    }
  ];

  const networkStats = {
    totalMembers: 15,
    totalVolume: 398,
    averageRank: 2.1
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">MemeFlow</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                  Dashboard
                </Button>
              </Link>
              <Link to="/mlm">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                  Rede MLM
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Explorador de Rede</h1>
        
        {/* Estatísticas da Rede */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Membros</p>
                  <p className="text-2xl font-bold text-white mt-1">{networkStats.totalMembers}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Volume Total</p>
                  <p className="text-2xl font-bold text-white mt-1">{networkStats.totalVolume} SOL</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Rank Médio</p>
                  <p className="text-2xl font-bold text-white mt-1">V{networkStats.averageRank}</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-lg">
                  <ArrowUpRight className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabela da Rede */}
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Membros da Sua Rede</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-400 py-3 px-4">Usuário</th>
                    <th className="text-left text-gray-400 py-3 px-4">Nível</th>
                    <th className="text-left text-gray-400 py-3 px-4">Rank</th>
                    <th className="text-left text-gray-400 py-3 px-4">Volume</th>
                    <th className="text-left text-gray-400 py-3 px-4">Referidos</th>
                  </tr>
                </thead>
                <tbody>
                  {networkData.map((member, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <span className="text-white">{member.user}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full w-fit">
                          Nível {member.level}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full w-fit">
                          {member.rank}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white">{member.volume} SOL</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white">{member.referrals}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Link para mais informações */}
        <div className="mt-6 text-center">
          <Link to="/mlm">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
              Ver detalhes do programa MLM
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NetworkExplorer;
