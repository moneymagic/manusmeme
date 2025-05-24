
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Wallet, Users, BarChart3, ChevronRight, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { motion } from 'framer-motion';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);

  // Project showcase metrics
  const projectMetrics = [
    { 
      label: 'Volume Total Negociado', 
      value: '₴ 12.8M', 
      icon: BarChart3, 
      change: '+15.3%',
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'bg-gradient-to-r from-blue-900/80 to-indigo-900/80'
    },
    { 
      label: 'Lucro Total Gerado', 
      value: '₴ 3.2M', 
      icon: TrendingUp, 
      change: '+21.7%',
      color: 'from-green-600 to-emerald-700',
      bgColor: 'bg-gradient-to-r from-green-900/80 to-emerald-900/80'
    },
    { 
      label: 'Usuários Ativos', 
      value: '8,547', 
      icon: Users, 
      change: '+32.4%',
      color: 'from-amber-600 to-orange-700',
      bgColor: 'bg-gradient-to-r from-amber-900/80 to-orange-900/80'
    },
    { 
      label: 'Rentabilidade Média', 
      value: '26.4%', 
      icon: Gem, 
      change: '+8.2%',
      color: 'from-purple-600 to-fuchsia-700',
      bgColor: 'bg-gradient-to-r from-purple-900/80 to-fuchsia-900/80'
    },
  ];

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
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
            
            <div className="flex items-center space-x-4">
              <NavigationMenu className="hidden md:block">
                <NavigationMenuList className="gap-2">
                  <NavigationMenuItem>
                    <Link to="/">
                      <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-white/10 hover:text-white"}>
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/dashboard">
                      <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-white/10 hover:text-white"}>
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/network">
                      <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-white/10 hover:text-white"}>
                        Network
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              {!isConnected ? (
                <Button 
                  onClick={() => setIsConnected(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Conectar Carteira
                </Button>
              ) : (
                <Link to="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
                    Acessar Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.h1 
            variants={fadeInUpVariants}
            custom={0}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Potencialize seus <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Investimentos</span>
          </motion.h1>
          <motion.p 
            variants={fadeInUpVariants}
            custom={1}
            className="text-gray-300 text-xl mb-12"
          >
            A plataforma definitiva para maximizar seus lucros com Meme Coins na blockchain Solana
          </motion.p>
          <motion.div 
            variants={fadeInUpVariants}
            custom={2}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button 
              onClick={() => setIsConnected(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 px-8 py-6 text-lg"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Começar Agora
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {projectMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card className="overflow-hidden backdrop-blur-sm border-0 shadow-xl">
                <div className={`bg-gradient-to-r ${metric.color} h-2`} />
                <CardContent className={`p-8 ${metric.bgColor} text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-200 text-sm">{metric.label}</p>
                      <p className="text-4xl font-bold text-white mt-2">{metric.value}</p>
                      <div className="flex items-center mt-3">
                        <span className="text-green-300 text-sm font-medium">{metric.change}</span>
                        <TrendingUp className="h-3 w-3 text-green-300 ml-1" />
                      </div>
                    </div>
                    <div className={`bg-gradient-to-r ${metric.color} p-4 rounded-lg`}>
                      <metric.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Features Section - Visually Attractive */}
        <div className="mb-24">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Potencialize seus Resultados com Nossa Tecnologia
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative p-8 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl transform group-hover:scale-125 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Trading Automatizado</h3>
                <p className="text-gray-400 mb-6">
                  Nossos algoritmos avançados identificam as melhores oportunidades de negociação de meme coins em tempo real.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative p-8 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-2xl transform group-hover:scale-125 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Sistema MLM Exclusivo</h3>
                <p className="text-gray-400 mb-6">
                  Ganhe comissões ao convidar novos usuários para a plataforma, com até 8 níveis de profundidade.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative p-8 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl transform group-hover:scale-125 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Análise de Desempenho</h3>
                <p className="text-gray-400 mb-6">
                  Acompanhe o crescimento do seu capital e o desempenho da sua rede em tempo real.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-12 text-center border border-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAwLDMwMCkiPgogICAgPHBhdGggZD0iTTEyMi42LC0xMTQuOEMxNzAuMywtNzUuMiwyMjYuMSwtMzcuNiwyNTQsOC45QzI4MS45LDU1LjMsMjgxLjksMTEwLjcsMjUzLjgsMTUyLjZDMjI1LjgsMTk0LjUsMTY5LjcsMjIzLDExMS4yLDI0MC42QzUyLjcsMjU4LjIsLTgsOTMuMywtODYsMTA2LjZDLTE2NCwxMTkuOSwtMjUwLjEsMjExLjQsLTI4My4yLDE5OUMtMzE2LjMsMTg2LjYsLTI5MS4xLDkzLjMsLTI2NS44LDE4LjFDLTI0MC41LC01Ny4yLC0yMTUuMiwtMTE0LjQsLTE3My42LC0xNTAuNUMtMTMyLC0xODYuNSwtNzQuOSwtMjAxLjQsLTE2LjksLTE5MC40QzQxLjEsLTE3OS41LDc0LjksLTE1NC4zLDEyMi42LC0xMTQuOFoiIGZpbGw9IiM0MzM4QzQiIG9wYWNpdHk9IjAuMDUiLz4KICA8L2c+Cjwvc3ZnPg==')] bg-center opacity-50 z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Entre para a revolução dos Meme Coins
            </h2>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já estão aproveitando o potencial dos meme coins na blockchain Solana.
            </p>
            <Link to="/dashboard">
              <Button 
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 px-8 py-6 text-lg group"
              >
                Comece Agora 
                <ChevronRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold">MemeFlow</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 MemeFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
