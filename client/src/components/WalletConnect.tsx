import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { connectWallet, getAccount } from "../lib/web3";
import { useToast } from "@/hooks/use-toast";

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const address = await getAccount();
    setAccount(address);
  };

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setAccount(address);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Please install MetaMask or check your connection",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {account ? (
        <div className="text-green-400">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
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
