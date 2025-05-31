"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import React from "react";
import randomColor from "randomcolor";

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
  // Hardcoded total portfolio value for now
  const hardcodedTotal = "$12,345.67";

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
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2 flex flex-col items-center justify-center min-h-[500px]">
        {/* Donut Chart */}
        <div className="w-56 h-56 flex items-center justify-center mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value">
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
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
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Total Portfolio Value
          </h3>
          <div
            className="text-5xl font-extrabold mb-2 text-gray-900 max-w-full overflow-x-auto whitespace-nowrap px-2"
            style={{ fontSize: "2.5rem", maxWidth: 400, margin: "0 auto" }}
            title={hardcodedTotal}>
            {hardcodedTotal}
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
