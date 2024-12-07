import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WalletConnect from "../components/WalletConnect";
import { Link } from "wouter";

export default function Home() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476445704028-a36e0c798192)' }}
    >
      <div className="max-w-6xl mx-auto mt-20">
        <Card className="bg-black/70 backdrop-blur-sm border-purple-500">
          <CardHeader>
            <CardTitle className="text-4xl text-center text-purple-400">
              CyberGame Hub
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <WalletConnect />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/game">
                <Button className="w-full h-24 text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Play Games
                </Button>
              </Link>
              <Link href="/nft">
                <Button className="w-full h-24 text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  NFT Gallery
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
