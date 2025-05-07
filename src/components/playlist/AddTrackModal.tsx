
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube, Spotify } from "lucide-react";
import { toast } from "sonner";

interface AddTrackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTrack?: (link: string) => void;
  playlistId?: string;
}

export function AddTrackModal({ open, onOpenChange, onAddTrack, playlistId }: AddTrackModalProps) {
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!link) {
      toast.error("Por favor, insira um link válido");
      return;
    }
    
    // Check if link is valid Youtube or Spotify URL
    const isYoutube = link.includes("youtube.com") || link.includes("youtu.be");
    const isSpotify = link.includes("spotify.com") || link.includes("open.spotify.com");
    
    if (!isYoutube && !isSpotify) {
      toast.error("Por favor, insira um link válido do YouTube ou Spotify");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API to add the track
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onAddTrack && onAddTrack(link);
      toast.success("Faixa adicionada com sucesso!");
      setLink("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao adicionar faixa. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-vibeMixer-dark-card border border-white/5 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar faixa</DialogTitle>
          <DialogDescription className="text-white/60">
            Cole um link do YouTube ou Spotify para adicionar uma faixa à sua playlist.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20">
            <Youtube className="h-5 w-5 text-red-500" />
            <Spotify className="h-5 w-5 text-green-500" />
            <Input
              placeholder="Cole o link do YouTube ou Spotify"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-vibeMixer-purple to-vibeMixer-magenta hover:opacity-90"
              disabled={!link || isLoading}
            >
              {isLoading ? "Adicionando..." : "Adicionar Faixa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
