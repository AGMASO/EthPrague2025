"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  walletAddress?: string
}

export default function DashboardHeader({ walletAddress = "0x3A5D...8c40" }: DashboardHeaderProps) {
  return (
    <div className="text-center mb-12">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Blockchain Explorer</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Analysiere Wallet-Adressen mit künstlicher Intelligenz und erhalte detaillierte Einblicke in Transaktionsmuster
        und Blockchain-Aktivitäten
      </p>

      {/* Search */}
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Wallet-Adresse eingeben (z.B. 0x742d35Cc6635C0532925a3b8D403C"
              className="pl-10 border-0 focus-visible:ring-0 text-lg h-12"
              defaultValue={walletAddress}
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12 text-lg rounded-xl">
            Analysieren
          </Button>
        </div>
      </div>
    </div>
  )
}
