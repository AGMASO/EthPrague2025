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
  type NFTCollection = {
    name: string;
    items: number;
    icon: string;
    iconUrl?: string;
  };

  const emojiFallbacks: { [key: string]: string } = {
    Punk: "🎭",
    Ape: "🐵",
    Art: "🎨",
    Block: "🧱",
    Cat: "🐱",
    Dog: "🐶",
    Moon: "🌙",
    Alien: "👽",
  };

  function getIconFromName(name: string): string {
    const entry = Object.entries(emojiFallbacks).find(([keyword]) =>
      name.toLowerCase().includes(keyword.toLowerCase())
    );
    return entry ? entry[1] : "🖼️"; // Default NFT icon
  }

  function transformToNFTCollections(items: any[]): NFTCollection[] {
    const grouped: {
      [collectionName: string]: {
        count: number;
        name: string;
        iconUrl?: string; 
      };
    } = {};

    for (const item of items) {
      const tokenName = item.token?.name || "Unknown Collection";
      const imageUrl = item.image_url || item.media_url; 

      if (!grouped[tokenName]) {
        grouped[tokenName] = {
          count: 1,
          name: tokenName,
          iconUrl: imageUrl, 
        };
      } else {
        grouped[tokenName].count++;
        // Falls noch keine iconUrl gesetzt ist, setze sie jetzt
        if (!grouped[tokenName].iconUrl && imageUrl) {
          grouped[tokenName].iconUrl = imageUrl;
        }
      }
    }

    return Object.values(grouped).map(({ name, count, iconUrl }) => ({
      name,
      items: count,
      icon: getIconFromName(name), // Fallback-Emoji behalten
      iconUrl, // Bild-URL hinzufügen
    }));
  }

  const nftCollections: NFTCollection[] = transformToNFTCollections(data ?? []);

  const isEmpty = nftCollections.length === 0;

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
              {nftCollections.slice(0, 5).map((nft, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md flex items-center justify-center text-lg bg-slate-100">
                      <img src={nft.iconUrl} alt="" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {nft.name}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{nft.items}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
