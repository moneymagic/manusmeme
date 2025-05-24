
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, TrendingUp, Calendar } from "lucide-react";

interface RevenueMetricsProps {
  className?: string;
}

const RevenueMetrics = ({ className }: RevenueMetricsProps) => {
  const metricsData = {
    dailyRevenue: 0.45,
    dailyChange: "+12%",
    historicalRevenue: 8.75,
    historicalChange: "+32%"
  };

  return (
    <Card className={`${className} bg-black/30 border-white/10 backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className="text-white">Métricas de Faturamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Faturamento Diário */}
          <Card className="bg-black/40 border-white/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    Faturamento Diário
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-white mt-1">
                    {metricsData.dailyRevenue} SOL
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-green-400 text-xs">
                      {metricsData.dailyChange}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-green-400 ml-1" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Faturamento Histórico */}
          <Card className="bg-black/40 border-white/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                    Faturamento Histórico
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-white mt-1">
                    {metricsData.historicalRevenue} SOL
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-green-400 text-xs">
                      {metricsData.historicalChange}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-green-400 ml-1" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueMetrics;
