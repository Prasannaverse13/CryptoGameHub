import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import WalletConnect from "../components/WalletConnect";
import { Link } from "wouter";
import { ThemeProvider } from "../components/ui/theme-provider";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <ThemeProvider>
      <div 
        className="relative min-h-screen bg-cover bg-center p-8 flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476445704028-a36e0c798192)' }}
    >
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-purple-500 hover:border-purple-400">
              <Menu className="h-6 w-6 text-purple-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96 bg-black/90 border-purple-500">
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-purple-400 mb-2">Analog Watch SDK Integration</h3>
                <p className="text-gray-300 text-sm">
                  Implemented in CoinFlip.tsx for precise timing control during coin flips.
                  Features used:
                  - Timer synchronization
                  - High-precision intervals
                  - Animation frame management
                  Used to ensure fair and accurate game timing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-400 mb-2">GMP SDK Implementation</h3>
                <p className="text-gray-300 text-sm">
                  Integrated in NFTGallery.tsx for cross-chain NFT transfers.
                  Features used:
                  - Cross-chain messaging
                  - Asset bridging
                  - Transaction verification
                  Enables seamless NFT trading across different blockchain networks.
                </p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="max-w-6xl mx-auto">
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

            <div className="mt-8 space-y-4">
              <h2 className="text-2xl text-purple-400 font-bold">How to Play</h2>
              <div className="grid grid-cols-1 gap-4 text-gray-300">
                <div className="space-y-2">
                  <h3 className="text-xl text-purple-300">CyberFlip Game</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Connect your wallet using MetaMask</li>
                    <li>Each flip costs 0.01 ETH</li>
                    <li>Win NFT rewards for correct guesses</li>
                    <li>Your NFTs will appear in the NFT Gallery</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    <Footer />
      </div>
    </ThemeProvider>
  );
}
