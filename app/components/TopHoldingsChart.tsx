import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { List } from "lucide-react";

interface TokenData {
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: string;
    exchange_rate: string | null;
    icon_url: string | null;
    total_supply: string;
  };
  value: string; // Balance in wei/raw units
}

interface ProcessedToken {
  name: string;
  symbol: string;
  value: number; // Value in USD
  color: string;
  iconUrl: string | null;
}

export function TopHoldingsChart({ tokenData }: { tokenData: TokenData[] }) {
  // Process token data to calculate USD values and filter out tokens without exchange rate
  const processTokenData = (data: TokenData[]): ProcessedToken[] => {
    const colors = ["#8b5cf6", "#3b82f6", "#9333ea", "#a21caf", "#10b981"]; // Predefined colors
    
    return data
      .filter(token => token.token.exchange_rate !== null) // Filter out tokens without exchange rate
      .map((token, index) => {
        const balance = parseFloat(token.value);
        const decimals = parseInt(token.token.decimals || "18");
        const exchangeRate = parseFloat(token.token.exchange_rate || "0");
        
        // Calculate actual token amount and USD value
        const tokenAmount = balance / Math.pow(10, decimals);
        const usdValue = tokenAmount * exchangeRate;

        return {
          name: token.token.name,
          symbol: token.token.symbol,
          value: usdValue,
          color: colors[index % colors.length],
          iconUrl: token.token.icon_url
        };
      })
      .sort((a, b) => b.value - a.value) // Sort descending by value
      .slice(0, 3); // Take top 3
  };

  const processedTokens = processTokenData(tokenData);
  const isEmpty = processedTokens.length === 0;

  // Prepare data for the chart (top 3)
  const chartData = processedTokens.map(token => ({
    name: token.symbol,
    value: token.value,
    color: token.color
  }));

  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl min-h-[500px] flex flex-col">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900 text-left mb-2">
          Top Holdings
        </h2>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2 flex-1 flex flex-col">
        {/* Bar Chart - Only shown if we have data */}
        {!isEmpty && (
          <div className="w-full h-[220px] flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
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
                    `$${value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`,
                    "",
                  ]}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Token List */}
        <div className="mt-6">
          <div className="flex justify-between items-center text-gray-400 text-base font-semibold mb-4 px-1">
            <span>TOKEN</span>
            <span>VALUE</span>
          </div>
          
          {isEmpty ? (
            <div className="text-center py-10 text-muted-foreground">
              <h3 className="text-lg font-semibold text-gray-900">
                No token holdings with value
              </h3>
              <p className="text-sm mt-1">Tokens without exchange rate are excluded</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {processedTokens.map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {token.iconUrl ? (
                      <img 
                        src={token.iconUrl} 
                        alt={token.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          // Fallback to colored circle with first letter
                          const fallback = document.createElement('div');
                          fallback.className = `w-12 h-12 rounded-full flex items-center justify-center`;
                          fallback.style.background = token.color;
                          fallback.innerHTML = `<span class="font-bold text-white text-xl">${token.symbol[0]}</span>`;
                          const img = e.target as HTMLImageElement;
                          img.parentNode?.insertBefore(fallback, img);
                        }}
                      />
                    ) : (
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: token.color }}>
                        <span className="font-bold text-white text-xl">
                          {token.symbol[0]}
                        </span>
                      </div>
                    )}
                    <span className="font-bold text-xl text-gray-900">
                      {token.symbol}
                    </span>
                  </div>
                  <span className="font-semibold text-xl text-gray-900 tabular-nums">
                    ${token.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}