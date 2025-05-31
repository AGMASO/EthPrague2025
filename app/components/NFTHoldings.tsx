"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface NftItem {
  name: string
  icon: string
  count: number
}

interface NftHoldingsProps {
  data?: NftItem[] // pass as a prop if dynamic
}

export function NftHoldings({ data }: NftHoldingsProps) {
  type NFTCollection = {
    name: string
    items: number
    icon: string
    iconUrl?: string
  }

  const emojiFallbacks: { [key: string]: string } = {
    Punk: "🎭",
    Ape: "🐵",
    Art: "🎨",
    Block: "🧱",
    Cat: "🐱",
    Dog: "🐶",
    Moon: "🌙",
    Alien: "👽",
  }

  function getIconFromName(name: string): string {
    const entry = Object.entries(emojiFallbacks).find(([keyword]) => name.toLowerCase().includes(keyword.toLowerCase()))
    return entry ? entry[1] : "🖼️" // Default NFT icon
  }

  function transformToNFTCollections(items: any[]): NFTCollection[] {
    const grouped: {
      [collectionName: string]: {
        count: number
        name: string
        iconUrl?: string
      }
    } = {}

    for (const item of items) {
      const tokenName = item.token?.name || "Unknown Collection"
      const imageUrl = item.image_url || item.media_url

      if (!grouped[tokenName]) {
        grouped[tokenName] = {
          count: 1,
          name: tokenName,
          iconUrl: imageUrl,
        }
      } else {
        grouped[tokenName].count++
        // Falls noch keine iconUrl gesetzt ist, setze sie jetzt
        if (!grouped[tokenName].iconUrl && imageUrl) {
          grouped[tokenName].iconUrl = imageUrl
        }
      }
    }

    return Object.values(grouped).map(({ name, count, iconUrl }) => ({
      name,
      items: count,
      icon: getIconFromName(name), // Fallback-Emoji behalten
      iconUrl, // Bild-URL hinzufügen
    }))
  }

  const nftCollections: NFTCollection[] = transformToNFTCollections(data ?? [])
  const isEmpty = nftCollections.length === 0
  const displayedCollections = nftCollections.slice(0, 5)

  return (
    <Card className="bg-white border-gray-200 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-900">NFT Holdings</CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        {isEmpty ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🖼️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No NFTs found</h3>
            <p className="text-sm text-gray-500">Wallet is still a blank canvas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header row */}
            <div className="grid grid-cols-2 text-xs text-gray-500 font-medium uppercase tracking-wide border-b border-gray-100 pb-2">
              <div>Collection</div>
              <div className="text-right">Items</div>
            </div>

            {/* NFT Collections list */}
            <div className="space-y-3">
              {displayedCollections.map((nft, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-200 flex-shrink-0 overflow-hidden">
                      {nft.iconUrl ? (
                        <img
                          src={nft.iconUrl || "/placeholder.svg"}
                          alt={nft.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                            target.nextElementSibling!.textContent = nft.icon
                          }}
                        />
                      ) : (
                        <span className="text-sm">{nft.icon}</span>
                      )}
                      <span className="text-sm hidden">{nft.icon}</span>
                    </div>
                    <span className="font-medium text-gray-900 truncate">{nft.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 ml-2">{nft.items}</span>
                </div>
              ))}
            </div>

            {/* Show more indicator if there are more than 5 collections */}
            {nftCollections.length > 5 && (
              <div className="text-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">+{nftCollections.length - 5} more collections</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
