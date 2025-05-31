"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Sparkles } from "lucide-react";

interface SimplePromptProps {
  onClickSubmit: (prompt: string) => void;
}

export default function SimplePrompt({ onClickSubmit }: SimplePromptProps) {
  const [prompt, setPrompt] = useState("");

  const suggestions = [
    "Analysiere die Wallet 0x742d35Cc6635C0532925a3b8D403C",
    "Zeige mir die größten Transaktionen dieser Woche",
    "Welche DeFi-Protokolle nutzt diese Adresse am häufigsten?",
    "Finde verdächtige Aktivitäten in dieser Wallet",
    "Erstelle einen Risikobericht für 0x1234...5678",
    "Welche NFT-Sammlungen besitzt diese Adresse?",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onClickSubmit(prompt);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 -mt-28">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Enter the Wallet Address you want to analyze
        </h1>
        {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ask questions about wallet addresses, transactions or blockchain
          activities. Our AI analyzes the data and gives you detailed answers.
        </p> */}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <Input
            placeholder="z.B. Analysiere die Wallet 0x742d35Cc6635C0532925a3b8D403C oder stelle eine andere Frage..."
            className="w-full h-16 text-lg pl-6 pr-16 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 shadow-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 px-4"
            disabled={!prompt.trim()}
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Sent</span>
          </Button>
        </div>
      </form>

      {/* Suggestions */}
      {/* <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          Or try one of these questions:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-gray-200 hover:border-purple-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <CardContent className="p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {suggestion}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div> */}

      {/* Info */}
      {/* <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: You can enter wallet addresses, ENS names or specific
          questions about blockchain data
        </p>
      </div> */}
    </div>
  );
}
