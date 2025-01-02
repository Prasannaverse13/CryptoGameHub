import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';

interface CreateNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: string | null;
}

export default function CreateNFTModal({ isOpen, onClose, account }: CreateNFTModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
  });

  const handleFileSelection = (file: File) => {
    if (file.type.startsWith('image/')) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelection(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create NFTs",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image || !formData.name || !formData.description || !formData.price) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      const imageBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(formData.image!);
      });

      const response = await fetch('/api/nfts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          image: imageBase64,
          owner: account // Get this from WalletConnect context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create NFT');
      }

      await queryClient.invalidateQueries({ queryKey: ['nfts'] });
      toast({
        title: "NFT Created",
        description: "Your NFT has been created successfully!",
      });
      onClose();
    } catch (error) {
      console.error("NFT creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-purple-500">
        <DialogHeader>
          <DialogTitle className="text-2xl text-purple-400">Create New NFT</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image" className="text-purple-300">Image</Label>
            <div className="flex justify-center">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                  isDragging 
                    ? 'border-purple-400 bg-purple-500/20' 
                    : 'border-purple-500 hover:border-purple-400'
                }`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-purple-400 block">Drag & Drop Image</span>
                    <span className="text-purple-400/60 text-sm">or</span>
                    <label className="block mt-2">
                      <span className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md cursor-pointer">
                        Choose File
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-purple-300">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-black/50 border-purple-500 text-purple-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-black/50 border-purple-500 text-purple-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-purple-300">Price (ETH)</Label>
            <Input
              id="price"
              type="number"
              step="0.001"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="bg-black/50 border-purple-500 text-purple-300"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating NFT...
              </>
            ) : (
              'Submit NFT'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
