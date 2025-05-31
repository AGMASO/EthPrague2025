"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bot, Sparkles, TrendingUp } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
  variant?: "default" | "chat" | "analysis"
}

export default function LoadingSpinner({
  message = "Analyzing wallet data...",
  variant = "default",
}: LoadingSpinnerProps) {
  const getVariantContent = () => {
    switch (variant) {
      case "chat":
        return {
          icon: Bot,
          title: "Starting AI Chat",
          subtitle: "Preparing blockchain analysis...",
          color: "text-purple-600",
        }
      case "analysis":
        return {
          icon: TrendingUp,
          title: "Analyzing Wallet",
          subtitle: "Processing blockchain data...",
          color: "text-blue-600",
        }
      default:
        return {
          icon: Sparkles,
          title: "Loading",
          subtitle: message,
          color: "text-purple-600",
        }
    }
  }

  const content = getVariantContent()
  const IconComponent = content.icon

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <Card className="bg-white border-gray-200 shadow-lg max-w-md w-full mx-4">
        <CardContent className="p-8 text-center">
          {/* Main Spinner */}
          <div className="relative mb-6">
            {/* Outer rotating ring */}
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>

              {/* Inner icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Floating dots animation */}
            <div className="absolute -top-2 -right-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            </div>
            <div className="absolute -bottom-2 -left-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <div className="absolute top-0 -left-4">
              <div
                className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">{content.title}</h3>
            <p className="text-gray-600">{content.subtitle}</p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1 mt-6">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>

          {/* Loading steps */}
          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-between">
              <span>Connecting to blockchain</span>
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Fetching transaction data</span>
              <div
                className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                style={{ animationDelay: "0.1s" }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Analyzing patterns</span>
              <div
                className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
