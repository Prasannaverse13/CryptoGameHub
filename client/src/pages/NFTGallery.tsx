import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
}

export default function NFTGallery() {
  const { toast } = useToast();
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
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507120410856-1f35574c3b45)' }}
    >
      <div className="max-w-6xl mx-auto">
        <Card className="bg-black/70 backdrop-blur-sm border-purple-500">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nfts?.map((nft) => {
                  const metadata: NFTMetadata = JSON.parse(nft.metadata);
                  return (
                    <Card key={nft.id} className="border-purple-500">
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
                        <p className="text-sm text-gray-400 mt-1">
                          Token ID: {nft.token_id}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
