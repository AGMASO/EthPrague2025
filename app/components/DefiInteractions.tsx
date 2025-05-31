"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

const defiProtocols = [
  { name: "Uniswap", icon: "🦄", color: "#a78bfa", interactions: 11 },
  { name: "Aave", icon: "A", color: "#a21caf", interactions: 7 },
  { name: "Curve", icon: "🌐", color: "#9333ea", interactions: 4 },
];

export function DefiInteractions() {
  return (
    <Card className="bg-white border-gray-200 shadow-sm rounded-2xl min-h-[500px] flex flex-col">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900 text-left mb-2">
          DeFi Interactions
        </h2>
      </CardHeader>
      <CardContent className="px-6 pb-6 flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-center text-gray-400 text-base font-semibold mb-4 px-1">
          <span>PROTOCOL</span>
          <span>INTERACTIONS</span>
        </div>
        <div className="flex flex-col gap-6">
          {defiProtocols.map((protocol) => (
            <div
              key={protocol.name}
              className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: protocol.color }}>
                  {protocol.icon}
                </span>
                <span className="font-bold text-xl text-gray-900">
                  {protocol.name}
                </span>
              </div>
              <span className="font-semibold text-xl text-gray-900 tabular-nums">
                {protocol.interactions}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
