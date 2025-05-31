"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface NftItem {
  name: string;
  icon: string;
  count: number;
}

interface NftHoldingsProps {
  data?: NftItem[]; // pass as a prop if dynamic
}

export function NftHoldings({ data }: NftHoldingsProps) {
  const nftData =
    data ??
    [
      // Example fallback if no prop is passed
      // { name: "CryptoPunks", icon: "🧑‍🎤", count: 2 },
      // { name: "Bored Apes", icon: "🐵", count: 1 },
      // { name: "Art Blocks", icon: "🎨", count: 3 },
    ];

  const isEmpty = nftData.length === 0;

  return (
    <Card className="bg-white border-gray-200 shadow-sm rounded-2xl min-h-[500px] flex flex-col">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900 text-left mb-2">
          NFT Holdings
        </h2>
      </CardHeader>
      <CardContent className="px-6 pb-6 flex-1 flex flex-col justify-center">
        {isEmpty ? (
          <div className="text-center py-10 text-muted-foreground flex-1 flex flex-col justify-center items-center">
            <div className="text-5xl mb-4">🖼️</div>
            <h3 className="text-lg font-semibold text-gray-900">
              No NFTs found
            </h3>
            <p className="text-sm mt-1">Wallet is still a blank canvas.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 text-sm text-muted-foreground font-medium mt-2 mb-3">
              <div>COLLECTION</div>
              <div className="text-right">ITEMS</div>
            </div>
            <div className="space-y-4">
              {nftData.map((nft, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md flex items-center justify-center text-lg bg-slate-100">
                      {nft.icon}
                    </div>
                    <span className="font-medium text-gray-900">
                      {nft.name}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{nft.count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
