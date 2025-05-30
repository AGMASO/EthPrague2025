import React, { useMemo } from "react";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

//Chart config: Explain to the chart what is the data we want to show and the label is Desktop
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface Props {
  tokens: any;
  transactions: any;
  addressInfo: any;
  chartCoins: any;
}

//DataCharts: This component is used to display charts and cards with info about the address.
export default function DataCharts({
  tokens,
  transactions,
  addressInfo,
  chartCoins,
}: Props) {
  // Detecta el array de tokens
  let tokensArray: any[] = [];
  if (Array.isArray(tokens)) {
    tokensArray = tokens;
  } else if (tokens?.items && Array.isArray(tokens.items)) {
    tokensArray = tokens.items;
  } else if (tokens?.token && Array.isArray(tokens.token)) {
    tokensArray = tokens.token;
  }
  // Detecta el array de coin balance
  let chartCoinsArray: any[] = [];
  if (Array.isArray(chartCoins)) {
    chartCoinsArray = chartCoins;
  } else if (chartCoins?.items && Array.isArray(chartCoins.items)) {
    chartCoinsArray = chartCoins.items;
  } else if (chartCoins?.token && Array.isArray(chartCoins.token)) {
    chartCoinsArray = chartCoins.token;
  }

  const chartData = useMemo(() => {
    if (!chartCoinsArray.length) return [];
    return chartCoinsArray
      .map((item) => ({
        // Puedes formatear la fecha como quieras, aquí solo YYYY-MM-DD
        label: item.block_timestamp.slice(0, 10),
        desktop: Number(item.value) / 1e18, // O usa formatUnits(item.value, 18) si usas ethers.js
      }))
      .reverse();
  }, [chartCoins]);

  return (
    <div className='flex flex-col gap-4'>
      {tokensArray.length ? (
        <>
          <h2 className='text-2xl font-bold'>Token Holdings</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {tokensArray.map((item: any, idx: number) => (
              <Card key={idx}>
                <CardHeader>
                  <div className='flex items-center gap-2'>
                    {item.icon_url && (
                      <img
                        src={item.icon_url}
                        alt={item.symbol}
                        className='w-6 h-6'
                      />
                    )}
                    <CardTitle>{item.symbol || item.token?.symbol}</CardTitle>
                  </div>
                  <CardDescription>
                    {item.name || item.token?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <span className='font-semibold'>Address: </span>
                      <span className='break-all text-xs'>
                        {item.address || item.token?.address}
                      </span>
                    </div>
                    <div>
                      <span className='font-semibold'>Value: </span>
                      <span>{item.value}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        ""
      )}

      {chartCoinsArray.length > 0 ? (
        <Card className='w-fit'>
          <CardHeader>
            <CardTitle>Token Balances History</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className=' w-[800px] h-[300px]'
            >
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='label'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey='desktop'
                  type='natural'
                  stroke='var(--color-desktop)'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className='flex-col items-start gap-2 text-sm'>
            <div className='flex gap-2 font-medium leading-none'>
              Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
            </div>
            <div className='leading-none text-muted-foreground'>
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      ) : (
        ""
      )}
    </div>
  );
}
