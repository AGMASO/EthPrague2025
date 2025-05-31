"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Copy, HelpCircle, Info, Search, Wallet, AlertCircle } from "lucide-react"

export default function WalletInput() {
  const [walletAddress, setWalletAddress] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("ethereum")

  // Example wallet addresses
  const exampleAddresses = {
    ethereum: "0x742d35Cc6635C0532925a3b8D403C",
    bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    solana: "DRpbCBMxVnDK4aBcVYzuJLubP3HJ7N8L8HrLPeL7vvq4",
  }

  // Simple validation for demonstration
  const validateWalletAddress = (address: string, type: string) => {
    if (!address.trim()) return null

    // Very basic validation - in a real app you'd use proper validation libraries
    if (type === "ethereum" && address.startsWith("0x") && address.length >= 20) {
      return true
    } else if (
      type === "bitcoin" &&
      (address.startsWith("1") || address.startsWith("3") || address.startsWith("bc1"))
    ) {
      return true
    } else if (type === "solana" && address.length >= 32) {
      return true
    }
    return false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsValid(validateWalletAddress(walletAddress, activeTab))
  }

  const copyExample = (address: string) => {
    setWalletAddress(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Wallet Analyse</CardTitle>
          </div>
          <CardDescription className="text-gray-600 text-base">
            Geben Sie Ihre Wallet-Adresse ein, um detaillierte Einblicke in Transaktionsmuster, Bestände und
            Blockchain-Aktivitäten zu erhalten.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="ethereum" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
              <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
              <TabsTrigger value="solana">Solana</TabsTrigger>
            </TabsList>
            <TabsContent value="ethereum" className="mt-0">
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                <span>Unterstützt ERC-20 Tokens, NFTs und DeFi-Protokolle</span>
              </div>
            </TabsContent>
            <TabsContent value="bitcoin" className="mt-0">
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                <span>Unterstützt BTC, Segwit und Native Segwit Adressen</span>
              </div>
            </TabsContent>
            <TabsContent value="solana" className="mt-0">
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                <span>Unterstützt SPL Tokens und Solana Programme</span>
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="wallet-address" className="text-sm font-medium text-gray-700">
                  Wallet-Adresse
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                        <HelpCircle className="h-4 w-4 text-gray-500" />
                        <span className="sr-only">Hilfe</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Geben Sie Ihre vollständige Wallet-Adresse ein. Diese beginnt bei Ethereum mit 0x, bei Bitcoin
                        oft mit 1, 3 oder bc1.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="relative">
                <Input
                  id="wallet-address"
                  placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}-Adresse eingeben`}
                  className="pl-10 pr-10 h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                {walletAddress && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setWalletAddress("")}
                  >
                    <span className="sr-only">Löschen</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs font-normal">
                    {activeTab === "ethereum" ? "EVM" : activeTab === "bitcoin" ? "UTXO" : "SPL"}
                  </Badge>
                  <span>Kompatibel</span>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
                  onClick={() => copyExample(exampleAddresses[activeTab as keyof typeof exampleAddresses])}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      <span>Kopiert</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Beispiel verwenden</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {isValid === false && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ungültige {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}-Adresse. Bitte überprüfen Sie Ihre
                  Eingabe.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-medium rounded-lg"
            >
              Wallet analysieren
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col border-t border-gray-100 pt-4 gap-4">
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Sichere Verbindung</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Nur Leserechte</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Durch die Nutzung dieses Services stimmen Sie unseren{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Nutzungsbedingungen
            </a>{" "}
            und{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Datenschutzrichtlinien
            </a>{" "}
            zu.
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Warum Ihre Wallet-Adresse?</h4>
          <p className="text-sm text-gray-600">
            Ihre Wallet-Adresse ist öffentlich und kann sicher analysiert werden. Wir benötigen keinen privaten
            Schlüssel und haben keinen Zugriff auf Ihre Vermögenswerte. Unsere Analyse basiert ausschließlich auf
            öffentlichen Blockchain-Daten.
          </p>
        </div>
      </div>
    </div>
  )
}
