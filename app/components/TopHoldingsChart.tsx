"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, List } from "lucide-react";

const data = [
  { name: "ETH", value: 12500, color: "#8b5cf6" },
  { name: "USDC", value: 8900, color: "#3b82f6" },
  { name: "DAI", value: 5800, color: "#9333ea" },
];

const tokens = [
  {
    name: "ETH",
    value: 12535.0,
    color: "#a78bfa",
    icon: <List className="w-5 h-5" />,
  },
  {
    name: "USDC",
    value: 8900.0,
    color: "#a21caf",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="white"
        strokeWidth={2}
        viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "DAI",
    value: 5895.45,
    color: "#9333ea",
    icon: <span className="font-bold text-white">D</span>,
  },
];

export function TopHoldingsChart() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl min-h-[500px] flex flex-col">
      <CardHeader>
        <div className="w-full flex items-center text-left mb-2">
          <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Top Holdings</h2>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2 flex-1 flex flex-col">
        {/* Bar Chart */}
        <div className="w-full h-[220px] flex items-center justify-center mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 40, right: 20, bottom: 40, left: 20 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#334155", fontSize: 14 }}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString()} Tokens`,
                  "",
                ]}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Table/List */}
        <div className="mt-6">
          <div className="flex justify-between items-center text-gray-400 text-base font-semibold mb-4 px-1">
            <span>TOKEN</span>
            <span>VALUE</span>
          </div>
          <div className="flex flex-col gap-6">
            {tokens.map((token, i) => (
              <div
                key={token.name}
                className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: token.color }}>
                    {token.icon}
                  </span>
                  <span className="font-bold text-xl text-gray-900">
                    {token.name}
                  </span>
                </div>
                <span className="font-semibold text-xl text-gray-900 tabular-nums">
                  {token.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TokenHoldingsCard() {
  // Calculate progress for the bars (example: top 2 tokens)
  const max = tokens[0].value;
  const progress = tokens.slice(0, 2).map((t) => (t.value / max) * 100);

  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl min-h-[500px] flex flex-col justify-between">
      <CardContent className="p-8">
        {/* Title */}
        <div className="flex items-center mb-6">
          <List className="w-6 h-6 text-purple-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Token Holdings</h2>
        </div>
        {/* Progress Bars */}
        <div className="flex flex-col gap-3 mb-8">
          {progress.map((p, i) => (
            <div key={i} className="w-full h-4 bg-gray-100 rounded-full">
              <div
                className={`h-4 rounded-full`}
                style={{
                  width: `${p}%`,
                  background: tokens[i].color,
                  transition: "width 0.3s",
                }}
              />
            </div>
          ))}
        </div>
        {/* Table/List */}
        <div className="mt-6">
          <div className="flex justify-between items-center text-gray-400 text-base font-semibold mb-4 px-1">
            <span>TOKEN</span>
            <span>VALUE</span>
          </div>
          <div className="flex flex-col gap-6">
            {tokens.map((token, i) => (
              <div
                key={token.name}
                className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: token.color }}>
                    {token.icon}
                  </span>
                  <span className="font-bold text-xl text-gray-900">
                    {token.name}
                  </span>
                </div>
                <span className="font-semibold text-xl text-gray-900 tabular-nums">
                  {token.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
