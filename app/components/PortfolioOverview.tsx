"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import React from "react";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface PortfolioOverviewProps {
  data: ChartDataItem[];
  totalValue?: string;
}

export default function PortfolioOverview({
  data = [],
  totalValue,
}: PortfolioOverviewProps) {
  const computedTotal = data.reduce((sum, entry) => sum + entry.value, 0);

  // Format number in compact notation (e.g., 1.2B, 3.4M)
  function formatCompactNumber(num: number) {
    if (!isFinite(num)) return "-";
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(num);
  }

  // Format for tooltip (full number with commas)
  function formatFullNumber(num: number) {
    if (!isFinite(num)) return "-";
    return num.toLocaleString();
  }

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
        <div className="flex flex-row flex-wrap justify-center gap-4 mt-2 max-w-full">
          {data.map((entry) => (
            <div
              key={entry.name}
              className="flex items-center gap-2 max-w-[160px]">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: entry.color }}></span>
              <span
                className="text-gray-700 font-medium truncate max-w-[120px]"
                title={entry.name}>
                {entry.name}
              </span>
            </div>
          ))}
        </div>
        {/* Portfolio value */}
        <div className="text-center mt-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Total Portfolio Value
          </h3>
          <div
            className="text-5xl font-extrabold mb-2 text-gray-900 max-w-full overflow-x-auto whitespace-nowrap px-2"
            style={{ fontSize: "2.5rem", maxWidth: 400, margin: "0 auto" }}
            title={totalValue ? totalValue : formatFullNumber(computedTotal)}>
            {totalValue ? totalValue : `$${formatCompactNumber(computedTotal)}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function formatTokenData(dataTokens: any[], topN = 5): ChartDataItem[] {
  if (!Array.isArray(dataTokens)) return [];

  const safeParse = (str: string | null) => {
    try {
      return BigInt(str || "0");
    } catch {
      return BigInt(0);
    }
  };

  // Convert and filter
  let items = dataTokens
    .filter(
      (item) =>
        item.token?.type === "ERC-20" &&
        item.token?.decimals !== null &&
        item.value &&
        safeParse(item.value) > 0n
    )
    .map((item, index) => {
      const decimals = parseInt(item.token.decimals, 10);
      const rawValue = safeParse(item.value);
      const value = Number(rawValue) / 10 ** decimals;

      return {
        name: item.token.symbol || `Token ${index}`,
        value,
        color: randomColor({ luminosity: "bright", seed: item.token.address }),
      };
    });

  // Sort by value descending
  items = items.sort((a, b) => b.value - a.value);

  // Group small tokens as 'Other'
  if (items.length > topN) {
    const top = items.slice(0, topN);
    const rest = items.slice(topN);
    const otherValue = rest.reduce((sum, item) => sum + item.value, 0);
    top.push({
      name: "Other",
      value: otherValue,
      color: "#d1d5db", // gray
    });
    return top;
  }

  return items;
}
