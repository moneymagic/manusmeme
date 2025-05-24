
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// Dados de exemplo para o crescimento do capital
const growthData = [
  { date: "01/05", value: 2.5 },
  { date: "02/05", value: 2.7 },
  { date: "03/05", value: 3.1 },
  { date: "04/05", value: 3.0 },
  { date: "05/05", value: 3.4 },
  { date: "06/05", value: 3.5 },
  { date: "07/05", value: 3.8 },
  { date: "08/05", value: 4.2 },
  { date: "09/05", value: 4.3 },
  { date: "10/05", value: 4.5 },
];

interface GrowthChartProps {
  className?: string;
}

const GrowthChart = ({ className }: GrowthChartProps) => {
  return (
    <Card className={`${className} bg-black/30 border-white/10 backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className="text-white">Crescimento do Capital</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                tick={{ fill: "#94a3b8" }}
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{ fill: "#94a3b8" }} 
                axisLine={{ stroke: "#334155" }}
                tickFormatter={(value) => `${value} SOL`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569", color: "#f8fafc" }} 
                formatter={(value) => [`${value} SOL`, "Capital"]}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4, stroke: "#064e3b" }}
                activeDot={{ fill: "#10b981", stroke: "#064e3b", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
