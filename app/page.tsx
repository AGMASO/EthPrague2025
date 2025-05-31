"use client";

import Image from "next/image";
import NavBarMain from "./components/NavBarMain";
import { keccak256, toBytes } from "viem";
import Chat from "./components/Chat";
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
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <NavBarMain />
        {isConnected ? (
          <Chat addressSessionId={sessionId as string} />
        ) : (
          <Header />
        )}
      </main>
      <footer className="text-xs text-gray-400 mt-4 row-start-3">
        © 2024 EthPrague2025. All rights reserved.
      </footer>
    </div>
  );
}
