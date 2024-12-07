import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Lock, Plus } from "lucide-react";
import CreateNFTModal from "../components/CreateNFTModal";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import WalletConnect from "../components/WalletConnect";
import { useState, useEffect } from "react";
import { getAccount } from "../lib/web3";
import { ThemeProvider } from "../components/ui/theme-provider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import NFTGrid from "../components/NFTGrid";
import Footer from "../components/Footer";

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

export default function NFTGallery() {
  const { toast } = useToast();
  const [account, setAccount] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const address = await getAccount();
    setAccount(address);
  };

  const { data: globalNFTs, isLoading: isLoadingGlobal } = useQuery<NFT[]>({
    queryKey: ['nfts', 'global'],
    queryFn: async () => {
      const response = await fetch('/api/nfts/global');
      if (!response.ok) throw new Error('Failed to fetch global NFTs');
      return response.json();
    },
    enabled: true
  });

  const { data: ownedNFTs, isLoading: isLoadingOwned } = useQuery<NFT[]>({
    queryKey: ['nfts', 'owned', account],
    queryFn: async () => {
      if (!account) return [];
      const response = await fetch(`/api/nfts/owned/${account}`);
      if (!response.ok) throw new Error('Failed to fetch owned NFTs');
      return response.json();
    },
    enabled: !!account
  });

  const { data: purchasedNFTs, isLoading: isLoadingPurchased } = useQuery<NFT[]>({
    queryKey: ['nfts', 'purchased', account],
    queryFn: async () => {
      if (!account) return [];
      const response = await fetch(`/api/nfts/purchased/${account}`);
      if (!response.ok) throw new Error('Failed to fetch purchased NFTs');
      return response.json();
    },
    enabled: !!account
  });

  const isLoading = isLoadingGlobal || isLoadingOwned || isLoadingPurchased;

  return (
    <ThemeProvider>
      <div 
        className="relative min-h-screen bg-cover bg-center p-8 flex items-center justify-center"
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
            {account && (
              <Button
                onClick={() => setIsCreating(true)}
                className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" /> Create NFT
              </Button>
            )}
            <Tabs defaultValue="global" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/50">
                <TabsTrigger value="global">Global Marketplace</TabsTrigger>
                <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
                <TabsTrigger value="purchased">Purchased NFTs</TabsTrigger>
              </TabsList>

              {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : (
                <>
                  <TabsContent value="global">
                    {globalNFTs?.length === 0 ? (
                      <div className="text-center text-gray-400 p-4">
                        No NFTs available in the marketplace.
                      </div>
                    ) : (
                      <NFTGrid nfts={globalNFTs || []} account={account} />
                    )}
                  </TabsContent>

                  <TabsContent value="my-nfts">
                    {!account ? (
                      <div className="text-center mb-8">
                        <h2 className="text-xl text-purple-400 mb-4">Connect Wallet to View Your NFTs</h2>
                        <WalletConnect />
                      </div>
                    ) : ownedNFTs?.length === 0 ? (
                      <div className="text-center text-gray-400 p-4">
                        No NFTs found in your collection.
                      </div>
                    ) : (
                      <NFTGrid nfts={ownedNFTs || []} account={account} />
                    )}
                  </TabsContent>

                  <TabsContent value="purchased">
                    {!account ? (
                      <div className="text-center mb-8">
                        <h2 className="text-xl text-purple-400 mb-4">Connect Wallet to View Purchased NFTs</h2>
                        <WalletConnect />
                      </div>
                    ) : purchasedNFTs?.length === 0 ? (
                      <div className="text-center text-gray-400 p-4">
                        No purchased NFTs found.
                      </div>
                    ) : (
                      <NFTGrid nfts={purchasedNFTs || []} account={account} />
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
        <CreateNFTModal isOpen={isCreating} onClose={() => setIsCreating(false)} account={account} />
      <Footer />
      </div>
    </ThemeProvider>
  );
}
