import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { fetchTokenPrices } from "@/utils/1inch/PriceFetcher";

interface TokenData {
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: string;
    total_supply: string;
  };
  value: string; // Balance in raw units
}

interface ProcessedToken {
  name: string;
  symbol: string;
  value: number; // USD value
  amount: number; // Token amount
  usdPrice: number; // Price per token
  color: string;
  address: string;
}

export function TopHoldingsChart({ tokenData }: { tokenData: TokenData[] }) {
  const [processedTokens, setProcessedTokens] = useState<ProcessedToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPricesAndProcess = async () => {
      try {
        // 1. Filter and prepare top tokens by raw balance
        const filteredTokens = tokenData
          .filter((t) => t.token.address)
          .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
          .slice(0, 5);

        // 2. Fetch prices directly from 1inch API
        const addresses = filteredTokens.map((t) => t.token.address);
        const prices = await fetchTokenPrices(addresses);

        // 3. Process data
        const processed = filteredTokens
          .map((token) => {
            const decimals = parseInt(token.token.decimals || "18");
            const balance = parseFloat(token.value);
            const tokenAmount = balance / Math.pow(10, decimals);
            const usdPrice = prices[token.token.address.toLowerCase()]?.usd || 0;
            const usdValue = tokenAmount * usdPrice;

            return {
              name: token.token.name,
              symbol: token.token.symbol,
              value: usdValue,
              amount: tokenAmount,
              usdPrice,
              color: getColorForSymbol(token.token.symbol),
              address: token.token.address,
            };
          })
          .filter((token) => token.value > 0)
          .sort((a, b) => b.value - a.value);

        setProcessedTokens(processed);
      } catch (error) {
        console.error("Error processing token data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricesAndProcess();
  }, [tokenData]);

  const getColorForSymbol = (symbol: string) => {
    const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
    return colors[symbol.charCodeAt(0) % colors.length];
  };

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl min-h-[500px] flex flex-col">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">Top Holdings</h2>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <p>Loading token data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl min-h-[500px] flex flex-col">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">Top Holdings</h2>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2 flex-1 flex flex-col">
        {processedTokens.length > 0 ? (
          <>
            <div className="w-full h-[220px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={processedTokens}
                  layout="vertical"
                  margin={{ top: 40, right: 20, bottom: 40, left: 20 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="symbol"
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
                      "Value",
                    ]}
                    cursor={{ fill: "#f1f5f9" }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                    {processedTokens.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-4 text-sm text-gray-400 font-semibold mb-4 px-1">
                <span>TOKEN</span>
                <span className="text-right">AMOUNT</span>
                <span className="text-right">PRICE</span>
                <span className="text-right">VALUE</span>
              </div>
              <div className="space-y-4">
                {processedTokens.map((token) => (
                  <div key={token.address} className="grid grid-cols-4 items-center">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: token.color }}
                      >
                        <span className="text-white text-xs font-bold">
                          {token.symbol[0]}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {token.symbol}
                      </span>
                    </div>
                    <span className="text-right text-gray-700">
                      {token.amount.toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                      })}
                    </span>
                    <span className="text-right text-gray-700">
                      ${token.usdPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </span>
                    <span className="text-right font-medium text-gray-900">
                      ${token.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No valuable token holdings found
          </div>
        )}
      </CardContent>
    </Card>
  );
}