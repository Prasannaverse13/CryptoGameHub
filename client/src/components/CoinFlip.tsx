import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CoinFlipProps {
  onGameEnd: () => void;
}

export default function CoinFlip({ onGameEnd }: CoinFlipProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const { toast } = useToast();

  const flipCoin = async () => {
    setIsFlipping(true);
    // Simulate blockchain transaction time
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newResult = Math.random() > 0.5 ? 'heads' : 'tails';
    setResult(newResult);
    setIsFlipping(false);

    if (newResult === 'heads') {
      toast({
        title: "You won!",
        description: "NFT reward is being minted...",
      });
    }
  };

  return (
    <div className="p-6">
      <CardHeader>
        <CardTitle className="text-4xl text-center text-purple-400">
          CyberFlip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-8">
            {isFlipping ? '🔄' : result === 'heads' ? '🌕' : result === 'tails' ? '🌑' : '?'}
          </div>
          <div className="space-x-4">
            <Button
              onClick={flipCoin}
              disabled={isFlipping}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Flip Coin (0.01 ETH)
            </Button>
            <Button
              onClick={onGameEnd}
              variant="outline"
              className="border-purple-500 text-purple-400"
            >
              Exit Game
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
