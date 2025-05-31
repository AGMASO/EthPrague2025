"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Wallet, BarChart3 } from "lucide-react";
import FeatureCards from "./FeatureCards";
import TeamSection from "./TeamSection";
import Footer from "./Footer";

interface HeaderProps {
  walletAddress?: string;
}

export default function Header({
  walletAddress = "0x3A5D...8c40",
}: HeaderProps) {
  return (
    <div className="container mx-auto px-4 -mt-23">
      <div className="text-center mb-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Blockchain Explorer
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Analyze wallet addresses with artificial intelligence and gain
          detailed insights into transaction patterns and blockchain activities
        </p>

        {/* App Preview */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-50 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

            {/* Wallet Address Header */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Wallet className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-500">Wallet</span>
              <span className="font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                0x742d35Cc...D403C
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Portfolio Chart Preview */}
              <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Portfolio</h3>
                  </div>

                  {/* Mini Donut Chart */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="rgb(243 244 246)"
                        strokeWidth="12"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="url(#miniGradient1)"
                        strokeWidth="12"
                        strokeDasharray="120 100"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="miniGradient1"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="rgb(147 51 234)" />
                          <stop offset="100%" stopColor="rgb(168 85 247)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      $52.6K
                    </div>
                    <div className="text-sm text-gray-500">Total Value</div>
                  </div>
                </CardContent>
              </Card>

              {/* Token Holdings Preview */}
              <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                      Top Holdings
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          Ξ
                        </div>
                        <span className="text-sm font-medium">ETH</span>
                      </div>
                      <span className="text-sm text-gray-600">12.5K</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          ◉
                        </div>
                        <span className="text-sm font-medium">USDC</span>
                      </div>
                      <span className="text-sm text-gray-600">8.9K</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          D
                        </div>
                        <span className="text-sm font-medium">DAI</span>
                      </div>
                      <span className="text-sm text-gray-600">5.8K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Preview */}
              <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Recent Activity
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600">
                          Uniswap Swap
                        </div>
                        <div className="text-sm font-medium">ETH → USDC</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600">
                          Aave Deposit
                        </div>
                        <div className="text-sm font-medium">1.2 ETH</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600">
                          NFT Purchase
                        </div>
                        <div className="text-sm font-medium">
                          CryptoPunk #1234
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">247</div>
                <div className="text-sm text-gray-500">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-500">DeFi Protocols</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">5</div>
                <div className="text-sm text-gray-500">NFT Collections</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FeatureCards />

      <TeamSection />
    </div>
  );
}
