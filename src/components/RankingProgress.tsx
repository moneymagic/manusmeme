
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUserRankingProgress } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface RankingProgressProps {
  className?: string;
}

const RankingProgress = ({ className }: RankingProgressProps) => {
  const [rankingData, setRankingData] = useState({
    currentRank: 2,
    nextRank: 3,
    currentVolume: 80,
    requiredVolume: 120,
    directReferrals: 1,
    requiredDirectReferrals: 2
  });
  
  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const userId = "dummy-user-id"; // Em produção, seria o ID do usuário autenticado
        const data = await getUserRankingProgress(userId);
        if (data) {
          setRankingData(data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados de ranking:", error);
      }
    };
    
    fetchRankingData();
  }, []);
  
  const volumeProgress = Math.min((rankingData.currentVolume / rankingData.requiredVolume) * 100, 100);
  const referralsProgress = Math.min((rankingData.directReferrals / rankingData.requiredDirectReferrals) * 100, 100);
  
  // Determinar os benefícios do próximo nível com base no rank
  const getNextLevelBenefits = () => {
    switch (rankingData.nextRank) {
      case 3:
        return [
          { text: "+2% Bônus MLM", bgColor: "bg-purple-500/20", textColor: "text-purple-300" },
          { text: "Acesso a rede até 3 níveis", bgColor: "bg-blue-500/20", textColor: "text-blue-300" }
        ];
      case 4:
        return [
          { text: "+2% Bônus MLM", bgColor: "bg-purple-500/20", textColor: "text-purple-300" },
          { text: "Acesso a rede até 4 níveis", bgColor: "bg-blue-500/20", textColor: "text-blue-300" }
        ];
      case 5:
        return [
          { text: "+3% Bônus MLM", bgColor: "bg-purple-500/20", textColor: "text-purple-300" },
          { text: "Acesso a rede até 5 níveis", bgColor: "bg-blue-500/20", textColor: "text-blue-300" }
        ];
      default:
        return [
          { text: `+2% Bônus MLM`, bgColor: "bg-purple-500/20", textColor: "text-purple-300" },
          { text: `Acesso a rede até ${rankingData.nextRank} níveis`, bgColor: "bg-blue-500/20", textColor: "text-blue-300" }
        ];
    }
  };

  const nextLevelBenefits = getNextLevelBenefits();
  
  return (
    <Card className={`${className} bg-black/30 border-white/10 backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Status</CardTitle>
            <CardDescription className="text-gray-400">
              Progresso para o próximo nível
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full">
            <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
            <span className="text-sm font-medium">V{rankingData.currentRank}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Volume da Rede</span>
            <span className="text-white font-medium">
              {rankingData.currentVolume} / {rankingData.requiredVolume} SOL
            </span>
          </div>
          <div className="relative h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <Progress 
              value={volumeProgress} 
              className="h-2"
              style={{
                background: volumeProgress === 100 
                  ? 'linear-gradient(to right, #10b981, #059669)' 
                  : 'linear-gradient(to right, #3b82f6, #8b5cf6)'
              }}
            />
          </div>
          <div className="flex justify-end">
            <span className="text-gray-400 text-xs">
              Faltam {rankingData.requiredVolume - rankingData.currentVolume} SOL
            </span>
          </div>
        </div>
        
        {rankingData.nextRank >= 3 && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">
                Diretos V{rankingData.nextRank - 1}
              </span>
              <span className="text-white font-medium">
                {rankingData.directReferrals} / {rankingData.requiredDirectReferrals}
              </span>
            </div>
            <div className="relative h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <Progress 
                value={referralsProgress} 
                className="h-2"
                style={{
                  background: referralsProgress === 100 
                    ? 'linear-gradient(to right, #8b5cf6, #6d28d9)' 
                    : 'linear-gradient(to right, #8b5cf6, #3b82f6)'
                }}
              />
            </div>
            <div className="flex justify-end">
              <span className="text-gray-400 text-xs">
                Faltam {rankingData.requiredDirectReferrals - rankingData.directReferrals} diretos V{rankingData.nextRank - 1}
              </span>
            </div>
          </div>
        )}
        
        {/* Próximo nível */}
        <div className="rounded-lg border border-white/10 p-3 bg-black/20">
          <p className="text-white text-sm font-medium mb-3">Próximo nível: V{rankingData.nextRank}</p>
          <div className="flex flex-wrap gap-2">
            {nextLevelBenefits.map((benefit, index) => (
              <span 
                key={index}
                className={`${benefit.bgColor} ${benefit.textColor} text-xs px-2 py-1 rounded-full`}
              >
                {benefit.text}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingProgress;
