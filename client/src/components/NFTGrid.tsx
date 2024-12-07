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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {nfts?.map((nft) => {
        const metadata: NFTMetadata = JSON.parse(nft.metadata);
        return (
          <Card 
            key={nft.id} 
            className="border-purple-500 relative group h-[400px] flex flex-col transition-transform hover:scale-[1.02]"
          >
            <CardContent className="p-4 flex flex-col h-full">
              <div className="relative w-full pt-[100%] mb-4">
                <img 
                  src={metadata.image} 
                  alt={metadata.name} 
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/200/300';
                  }}
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-purple-300 mb-2">{metadata.name}</h3>
                {account ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Token ID: {nft.token_id}</p>
                    <p className="text-lg font-bold text-purple-400">{metadata.price} ETH</p>
                    {account && nft.owner !== account && (
                      <Button
                        onClick={() => handleBuyNFT(nft)}
                        className="w-full mt-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
