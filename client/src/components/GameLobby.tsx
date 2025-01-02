import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameLobbyProps {
  onGameStart: () => void;
}

export default function GameLobby({ onGameStart }: GameLobbyProps) {
  return (
    <div className="p-6">
      <CardHeader>
        <CardTitle className="text-4xl text-center text-purple-400">
          Game Lobby
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl text-purple-300">CyberFlip</h2>
          <p className="text-gray-300">
            Flip the coin and win NFT rewards! Each flip costs 0.01 ETH.
          </p>
          <Button
            onClick={onGameStart}
            className="w-48 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Start Game
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
