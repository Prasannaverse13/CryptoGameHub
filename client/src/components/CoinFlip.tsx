import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const coinAnimation = `
  @keyframes flipCoin {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(1800deg); }
  }
  
  .coin {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 20px auto;
    transform-style: preserve-3d;
    animation: \${isFlipping ? 'flipCoin 2s ease-out' : 'none'};
  }

  .coin-face {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    background: linear-gradient(45deg, #8b5cf6, #ec4899);
    box-shadow: 0 0 20px #8b5cf6;
  }
`;

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
    } else {
      toast({
        title: "You lost!",
        description: "Better luck next time!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <style>{coinAnimation}</style>
      <CardHeader>
        <CardTitle className="text-4xl text-center text-purple-400">
          CyberFlip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="coin">
            <div className="coin-face">
              {isFlipping ? (
                <div className="animate-pulse text-4xl font-bold text-white">
                  <div className="animate-spin">↻</div>
                </div>
              ) : (
                <span className="text-4xl">{result === 'heads' ? '🌕' : result === 'tails' ? '🌑' : '?'}</span>
              )}
            </div>
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
