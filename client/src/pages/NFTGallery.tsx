import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import WalletConnect from "../components/WalletConnect";
import { useState, useEffect } from "react";
import { getAccount } from "../lib/web3";

interface NFT {
  id: number;
  token_id: string;
  owner: string;
  metadata: string;
}

interface NFTMetadata {
  name: string;
  image: string;
}

export default function NFTGallery() {
  const { toast } = useToast();
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const address = await getAccount();
    setAccount(address);
  };
  const { data: nfts, isLoading, error } = useQuery<NFT[]>({
    queryKey: ['nfts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/nfts');
        if (!response.ok) {
          throw new Error('Failed to fetch NFTs');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load NFTs. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }
    }
  });

  return (
    <div 
      className="min-h-screen bg-cover bg-center p-8 flex items-center justify-center"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507120410856-1f35574c3b45)' }}
    >
      <Link href="/">
        <Button className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Home
        </Button>
      </Link>
      <Card className="bg-black/70 backdrop-blur-sm border-purple-500 w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-4xl text-center text-purple-400">
            NFT Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 p-4">
              Failed to load NFTs. Please try again later.
            </div>
          ) : nfts?.length === 0 ? (
            <div className="text-center text-gray-400 p-4">
              No NFTs found in your collection.
            </div>
          ) : (
            <div>
              {!account && (
                <div className="text-center mb-8">
                  <h2 className="text-xl text-purple-400 mb-4">Connect Wallet to View NFT Details</h2>
                  <WalletConnect />
                </div>
              )}
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
                          <p className="text-sm text-gray-400 mt-1">
                            Token ID: {nft.token_id}
                          </p>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
