import { useState, useEffect } from "react";
import GameLobby from "../components/GameLobby";
import CoinFlip from "../components/CoinFlip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import WalletConnect from "../components/WalletConnect";
import { useToast } from "@/hooks/use-toast";
import { getAccount } from "../lib/web3";
import Footer from "../components/Footer";

export default function Game() {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const address = await getAccount();
    setAccount(address);
  };

  const handleGameStart = () => {
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to play the game",
        variant: "destructive",
      });
      return;
    }
    setGameStarted(true);
  };

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center p-8 flex items-center justify-center"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529641484336-ef35148bab06)' }}
    >
      <Link href="/">
        <Button className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Home
        </Button>
      </Link>
      <Card className="bg-black/70 backdrop-blur-sm border-purple-500 w-full max-w-6xl">
        {!account ? (
          <div className="text-center p-6">
            <h2 className="text-xl text-purple-400 mb-4">Connect Wallet to Play</h2>
            <WalletConnect />
          </div>
        ) : gameStarted ? (
          <CoinFlip onGameEnd={() => setGameStarted(false)} />
        ) : (
          <GameLobby onGameStart={handleGameStart} />
        )}
      </Card>
      <Footer />
    </div>
  );
}
