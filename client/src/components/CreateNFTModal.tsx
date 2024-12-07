import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CreateNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateNFTModal({ isOpen, onClose }: CreateNFTModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // TODO: Implement NFT creation logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast({
        title: "NFT Created",
        description: "Your NFT has been created successfully!",
      });
      onClose();
    } catch (error) {
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
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded-lg border-2 border-purple-500" />
              ) : (
                <div className="w-48 h-48 border-2 border-dashed border-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-purple-400">Upload Image</span>
                </div>
              )}
            </div>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-black/50 border-purple-500 text-purple-300"
            />
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
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create NFT'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
