import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Wallet, Shield } from "lucide-react";

export interface Message {
  id: string;
  type: "user" | "assistant" | "wallet-profile";
  content: string;
  timestamp: Date;
  walletData?: any;
}

interface WalletHeaderProps {
  message: Message;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ message }) => {
  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Wallet className="w-8 h-8 text-purple-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Wallet Profile
            </h3>
            <p className="text-gray-600 font-mono text-sm">
              {message.walletData?.address}
            </p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-bold text-gray-900">
              {message.walletData?.totalValue}
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">
                {message.walletData?.riskScore}
              </span>
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
  );
};

export default WalletHeader;
