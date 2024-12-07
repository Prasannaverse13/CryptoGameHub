import { useState } from "react";
import GameLobby from "../components/GameLobby";
import CoinFlip from "../components/CoinFlip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div 
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529641484336-ef35148bab06)' }}
    >
      <Link href="/">
        <Button className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Home
        </Button>
      </Link>
      <div className="max-w-6xl mx-auto">
        <Card className="bg-black/70 backdrop-blur-sm border-purple-500">
          {gameStarted ? (
            <CoinFlip onGameEnd={() => setGameStarted(false)} />
          ) : (
            <GameLobby onGameStart={() => setGameStarted(true)} />
          )}
        </Card>
      </div>
    </div>
  );
}
