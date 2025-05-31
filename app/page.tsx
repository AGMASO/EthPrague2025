"use client";

import Image from "next/image";
import NavBarMain from "./components/NavBarMain";
import { keccak256, toBytes } from "viem";
import Chat from "./components/Chat";
import ChatInterface from "./components/ChatInterface";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
export default function Home() {
  const { isConnected, isDisconnected, address } = useAccount();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const getSessionId = async () => {
      const sessionIdcalculated = keccak256(toBytes(address!)).slice(0, 18);
      setSessionId(sessionIdcalculated);
      console.log(sessionId);
    };

    getSessionId();
  }, [address]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <NavBarMain />
      </div>

      {/* Main Content */}
      {isConnected ? (
        // ChatInterface - Full screen layout
        <div className="h-[calc(100vh-60px)]">
          <ChatInterface addressSessionId={sessionId as string} />
        </div>
      ) : (
        // Header - Centered layout (wie original)
        <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-[calc(100vh-60px)] p-8 pb-20 gap-16 sm:p-20">
          <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
            <Header />
          </main>
          <footer className="text-xs text-gray-400 mt-4 row-start-2">
            © 2024 EthPrague2025. All rights reserved.
          </footer>
        </div>
      )}
    </div>
  );
}
