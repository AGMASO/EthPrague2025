"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface PortfolioOverviewProps {
  data?: ChartDataItem[];
  totalValue?: string;
  secondaryValue?: string;
}

export default function PortfolioOverview({
  data = [
    { name: "BTC", value: 14000, color: "#facc15" },
    { name: "ETH", value: 12000, color: "#8b5cf6" },
    { name: "SOL", value: 6000, color: "#22d3ee" },
  ],
  totalValue,
  secondaryValue = "$6,420.37",
}: PortfolioOverviewProps) {
  const computedTotal = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
      <CardContent className="p-8 flex flex-col items-center justify-center min-h-[500px]">
        {/* Title */}
        <div className="w-full text-left mb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Portfolio Overview
          </h2>
        </div>
        {/* Donut Chart */}
        <div className="w-56 h-56 flex items-center justify-center mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex flex-row justify-center gap-6 mt-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: entry.color }}></span>
              <span className="text-gray-700 font-medium">{entry.name}</span>
            </div>
          ))}
        </div>
        {/* Portfolio value */}
        <div className="text-center mt-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Total Portfolio Value
          </h3>
          <div className="text-5xl font-extrabold mb-2 text-gray-900">
            {totalValue ?? `$${computedTotal.toLocaleString()}`}
          </div>
          <div className="text-gray-400 text-lg">{secondaryValue}</div>
        </div>
      </CardContent>
    </Card>
  );
}
