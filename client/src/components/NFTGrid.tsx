import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NFT {
  id: number;
  token_id: string;
  owner: string;
  metadata: string;
}

interface NFTMetadata {
  name: string;
  image: string;
  description: string;
  price: string;
}

interface NFTGridProps {
  nfts: NFT[];
  account: string | null;
}

export default function NFTGrid({ nfts, account }: NFTGridProps) {
  const { toast } = useToast();

  const handleBuyNFT = async (nft: NFT) => {
    // TODO: Implement NFT purchase functionality
    toast({
      title: "Coming Soon",
      description: "NFT purchasing will be available soon!",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {nfts?.map((nft) => {
        const metadata: NFTMetadata = JSON.parse(nft.metadata);
        return (
          <Card key={nft.id} className="border-purple-500 relative group">
            <CardContent className="p-4">
              <img 
                src={metadata.image} 
                alt={metadata.name} 
                className="rounded-lg w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/200/300';
                }}
              />
              <h3 className="text-xl mt-2 text-purple-300">{metadata.name}</h3>
              {account ? (
                <div className="space-y-1 mt-1">
                  <p className="text-sm text-gray-400">
                    Token ID: {nft.token_id}
                  </p>
                  <p className="text-sm text-purple-400">
                    {metadata.price} ETH
                  </p>
                  {account && nft.owner !== account && (
                    <Button
                      onClick={() => handleBuyNFT(nft)}
                      className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Buy for {metadata.price} ETH
                    </Button>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <div className="text-center text-white">
                    <Lock className="w-8 h-8 mx-auto mb-2" />
                    <p>Connect wallet to view details</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
