"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import WalletHeader from "./WalletHeader";
import LoadingSpinner from "./LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Wallet, Shield, Sparkles } from "lucide-react";
import SimplePrompt from "./SimplePrompt";
// import PortfolioOverview from "./portfolio-overview"
// import TokenHoldings from "./token-holdings"
// import NFTHoldings from "./nft-holdings"
// import Interactions from "./interactions"

interface Props {
  addressSessionId: string;
}

interface Message {
  id: string;
  type: "user" | "assistant" | "wallet-profile";
  content: string;
  timestamp: Date;
  walletData?: any;
}

export default function ChatInterface({ addressSessionId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  // States by AI
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // States by Alejandro
  const [answer, setAnswer] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [dataGeneral, setDataGeneral] = useState<any>(null);
  const [dataTokens, setDataTokens] = useState<any>(null);
  const [dataTxs, setDataTxs] = useState<any>(null);
  const [dataChartCoins, setDataChartCoins] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // States by me
  const [chatStarted, setChatStarted] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChatStarted(true);
    setIsLoading(true);

    const message = inputMessage;
    console.log(message);

    let messageSplitted = await message.split(" ");

    // Busca una palabra en el mensaje que comience con "0x" (una dirección Ethereum)
    let addressExtracted = await messageSplitted.find(
      (word) => word.startsWith("0x") && word.length === 42
    );
    console.log(addressExtracted);

    if (addressExtracted) {
      try {
        const responseGeneral = await fetch(
          `https://eth.blockscout.com/api/v2/addresses/${addressExtracted}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseTokens = await fetch(
          `https://eth.blockscout.com/api/v2/addresses/${addressExtracted}/token-balances`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseTxs = await fetch(
          `https://eth.blockscout.com/api/v2/addresses/${addressExtracted}/transactions`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseChartCoins = await fetch(
          `https://eth.blockscout.com/api/v2/addresses/${addressExtracted}/coin-balance-history`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!responseGeneral.ok) {
          throw new Error("Error en el servidor");
        }

        if (!responseTokens.ok) {
          throw new Error("Error to get token balances");
        }
        if (!responseTxs.ok) {
          throw new Error("Error to get transactions");
        }
        if (!responseChartCoins.ok) {
          throw new Error("Error to get chart coins");
        }

        const dataGeneralFetched = await responseGeneral.json();
        console.log(dataGeneralFetched);
        setDataGeneral(dataGeneralFetched);

        const dataTokensFetched = await responseTokens.json();
        console.log(dataTokensFetched);
        setDataTokens(dataTokensFetched);

        const dataTxsFetched = await responseTxs.json();
        console.log(dataTxsFetched);
        setDataTxs(dataTxsFetched);

        const dataChartCoins = await responseChartCoins.json();
        console.log(dataChartCoins);
        setDataChartCoins(dataChartCoins);

        //!Version llamada con todo el json y solo usar ChatGpt para configurar mensaje.
        try {
          const response = await fetch(
            "https://n8n-demo-u45914.vm.elestio.app/webhook-test/39430311-e25e-4993-a439-f043900c2f4b",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                addressSessionId: addressSessionId,
                message: message,
                dataGeneral: dataGeneralFetched,
                dataTokens: dataTokensFetched,
                dataTxs: dataTxsFetched,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Error en el servidor");
          }

          const data = await response.json();
          const formattedOutput = markdownToHtml(data.output);

          setAnswer(formattedOutput);
          setInputMessage("");
        } catch (error: any) {
          setAnswer("Failed to get data: " + error.message);
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error(
          "Error al obtener la información de la dirección:",
          error
        );
      }
    }

    if (!addressExtracted) {
      try {
        const response = await fetch(
          "https://n8n-demo-u45914.vm.elestio.app/webhook-test/39430311-e25e-4993-a439-f043900c2f4b",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              addressSessionId,
              message,
              dataGeneral: null,
              dataTokens: null,
              dataTxs: null,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error en el servidor");
        }

        const data = await response.json();
        const formattedOutput = markdownToHtml(data.output);
        setAnswer(formattedOutput);
        setInputMessage("");
      } catch (error: any) {
        setAnswer("Hubo un error: " + error.message);
      } finally {
        console.log("finally route 2", dataTokens);
        setIsLoading(false);
      }
    }
  };

  function markdownToHtml(markdown: string) {
    // Headings
    let html = markdown.replace(/^### (.*?)(?=\n|$)/gm, "<h3>$1</h3>");
    html = html.replace(/^#### (.*?)(?=\n|$)/gm, "<h4>$1</h4>");
    html = html.replace(/^## (.*?)(?=\n|$)/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*?)(?=\n|$)/gm, "<h1>$1</h1>");
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      "<code class='bg-gray-100 px-1 rounded'>$1</code>"
    );
    // Bullets
    html = html.replace(
      /(?:^|\n)- (.*?)(?=\n|$)/g,
      (match, p1) => `<li>${p1}</li>`
    );
    // Group <li> into <ul>
    html = html.replace(
      /(<li>.*?<\/li>)+/g,
      (match) => `<ul class="ml-6 list-disc space-y-1">${match}</ul>`
    );
    // Line breaks
    html = html.replace(/\n/g, "<br>");
    return html;
  }

  const suggestedQuestions = [
    "Did this account interact with Uniswap?",
    "Is this account reliable?",
    "What's the risk level of this wallet?",
    "Show me the largest transactions",
    "Are there any suspicious activities?",
    "What DeFi protocols does this wallet use?",
  ];

  if (isLoading) {
    return <LoadingSpinner variant="chat" />;
  }

  return (
    <div className="w-full flex flex-col h-screen bg-gray-50">
      {!chatStarted ? (
        <div className="flex-1 flex items-center justify-center p-4">
          {/* Simple Prompt Mask */}
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
            </div>

            {/* Prompt Input Field */}
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="relative">
                <Input
                  placeholder="z.B. Analysiere die Wallet 0x742d35Cc6635C0532925a3b8D403C oder stelle eine andere Frage..."
                  className="w-full h-16 text-lg pl-6 pr-16 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 shadow-sm"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 px-4"
                  disabled={!inputMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                  <span className="sr-only">Sent</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Messages Container - with bottom padding for fixed elements */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-44">
            {/* Assistant Answer Bubble */}
            {answer && (
              <div className="flex gap-3 justify-start p-4">
                {/* Bot Avatar */}
                <Avatar className="w-8 h-8 bg-purple-100">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-purple-600" />
                  </AvatarFallback>
                </Avatar>

                {/* Bubble */}
                <div className="max-w-2xl">
                  <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200 text-gray-900">
                    <div
                      className="text-sm leading-relaxed break-words max-w-full overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: answer }}
                    />
                  </div>
                </div>
              </div>
            )}

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

          {/* Fixed Bottom Section */}
          <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t">
            {/* Suggested Questions - Fixed at bottom */}
            {answer && (
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-lg border-gray-300 hover:bg-gray-100 transition-colors justify-start text-left h-auto py-2 px-3"
                        onClick={() => setInputMessage(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Input Bar - Fixed at bottom */}
            <div className="px-4 py-6">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <Input
                    placeholder="Ask me anything about this wallet..."
                    value={inputValue}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500 pr-12 shadow-sm"
                  />
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
          </div>
        </>
      )}
    </div>
  );
}