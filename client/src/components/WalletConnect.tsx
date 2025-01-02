import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { connectWallet, getAccount, disconnectWallet, checkMetaMask } from "../lib/web3";
import { useToast } from "@/hooks/use-toast";

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();

    // Listen for account changes
    const handleAccountChanged = (event: CustomEvent<{ account: string }>) => {
      setAccount(event.detail.account);
      toast({
        title: "Account Changed",
        description: `Connected to ${event.detail.account.slice(0, 6)}...${event.detail.account.slice(-4)}`,
      });
    };

    // Listen for disconnection
    const handleDisconnected = () => {
      setAccount(null);
      toast({
        title: "Wallet Disconnected",
        description: "Wallet has been disconnected",
      });
    };

    window.addEventListener('walletAccountChanged', handleAccountChanged as EventListener);
    window.addEventListener('walletDisconnected', handleDisconnected);

    return () => {
      window.removeEventListener('walletAccountChanged', handleAccountChanged as EventListener);
      window.removeEventListener('walletDisconnected', handleDisconnected);
    };
  }, [toast]);

  const checkConnection = async () => {
    const address = await getAccount();
    setAccount(address);
  };

  const handleConnect = async () => {
    if (!checkMetaMask()) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask browser extension to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      const address = await connectWallet();
      setAccount(address);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error: any) {
      if (error.message.includes("User rejected")) {
        toast({
          title: "Connection Rejected",
          description: "You rejected the connection request",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Error",
          description: error.message || "Failed to connect to MetaMask",
          variant: "destructive",
        });
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setAccount(null);
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected your wallet",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {account ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-green-400">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
          <Button
            onClick={handleDisconnect}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            Disconnect Wallet
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
