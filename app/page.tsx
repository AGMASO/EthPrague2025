"use client";

import Image from "next/image";
import NavBarMain from "./components/NavBarMain";
import { keccak256, toBytes } from "viem";
// import Chat from "./components/Chat";
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
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <NavBarMain />
        {/* {isConnected && <Chat addressSessionId={sessionId as string} />} */}
      </main>
    </div>
  );
}
