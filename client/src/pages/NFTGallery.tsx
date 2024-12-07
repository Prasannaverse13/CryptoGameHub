import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function NFTGallery() {
  const { data: nfts, isLoading } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      const response = await fetch('/api/nfts');
      return response.json();
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
              <div>Loading NFTs...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nfts?.map((nft: any) => (
                  <Card key={nft.id} className="border-purple-500">
                    <CardContent className="p-4">
                      <img src={nft.image} alt={nft.name} className="rounded-lg" />
                      <h3 className="text-xl mt-2">{nft.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
