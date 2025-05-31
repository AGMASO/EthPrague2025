"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Wallet, Shield } from "lucide-react"
import PortfolioOverview from "./portfolio-overview"
import TokenHoldings from "./token-holdings"
import NFTHoldings from "./nft-holdings"
import Interactions from "./interactions"

interface Message {
  id: string
  type: "user" | "assistant" | "wallet-profile"
  content: string
  timestamp: Date
  walletData?: any
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "wallet-profile",
      content: "Wallet Analysis Complete",
      timestamp: new Date(),
      walletData: {
        address: "0x742d35Cc6635C0532925a3b8D403C",
        totalValue: "$52,630.45",
        riskScore: "Low Risk",
        lastActivity: "2 hours ago",
      },
    },
    {
      id: "2",
      type: "assistant",
      content:
        "I've analyzed the wallet 0x742d35Cc...D403C. This appears to be an active DeFi user with a diversified portfolio. The wallet holds primarily ETH, USDC, and DAI, with significant interactions across major protocols like Uniswap and Aave. What specific aspects would you like me to explore further?",
      timestamp: new Date(Date.now() - 30000),
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Yes, this wallet has interacted with Uniswap 11 times in the last 30 days, primarily swapping between ETH and stablecoins. The largest swap was 5.2 ETH for USDC.",
        "Based on the transaction patterns, this appears to be a reliable account. It shows consistent DeFi usage, maintains diversified holdings, and has no suspicious activity flags.",
        "This wallet demonstrates sophisticated DeFi behavior with positions across multiple protocols. The risk assessment is low due to the use of established protocols and reasonable position sizes.",
        "The account shows strong liquidity management, regularly rebalancing between ETH and stablecoins. This suggests an experienced user who actively manages their portfolio.",
        "I notice this wallet has been accumulating NFTs from established collections like CryptoPunks. This indicates long-term holding behavior rather than speculative trading.",
      ]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const suggestedQuestions = [
    "Did this account interact with Uniswap?",
    "Is this account reliable?",
    "What's the risk level of this wallet?",
    "Show me the largest transactions",
    "Are there any suspicious activities?",
    "What DeFi protocols does this wallet use?",
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Blockchain Analyst</h1>
            <p className="text-sm text-gray-500">Analyzing wallet patterns and blockchain data</p>
          </div>
          <div className="ml-auto">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === "wallet-profile" ? (
              <div className="space-y-4">
                {/* Wallet Header */}
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Wallet className="w-8 h-8 text-purple-600" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Wallet Profile</h3>
                        <p className="text-gray-600 font-mono text-sm">{message.walletData?.address}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-2xl font-bold text-gray-900">{message.walletData?.totalValue}</div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">{message.walletData?.riskScore}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">247</div>
                        <div className="text-sm text-gray-500">Transactions</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">12</div>
                        <div className="text-sm text-gray-500">Protocols</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">5</div>
                        <div className="text-sm text-gray-500">NFT Collections</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="lg:row-span-2">
                    <PortfolioOverview />
                  </div>
                  <TokenHoldings />
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NFTHoldings />
                    <Interactions />
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                {message.type === "assistant" && (
                  <Avatar className="w-8 h-8 bg-purple-100">
                    <AvatarFallback>
                      <Bot className="w-4 h-4 text-purple-600" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-2xl ${message.type === "user" ? "order-first" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-purple-600 text-white ml-auto"
                        : "bg-white border border-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.type === "user" ? "text-right" : ""}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {message.type === "user" && (
                  <Avatar className="w-8 h-8 bg-gray-100">
                    <AvatarFallback>
                      <User className="w-4 h-4 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <Avatar className="w-8 h-8 bg-purple-100">
              <AvatarFallback>
                <Bot className="w-4 h-4 text-purple-600" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-xs"
                onClick={() => setInputValue(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Ask me anything about this wallet... e.g., 'Did this account interact with Uniswap?'"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pr-12 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
