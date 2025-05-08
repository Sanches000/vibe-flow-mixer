
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MusicPlayer } from "@/components/layout/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createPlaylist } from "@/lib/playlistService";

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle cover image selection
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error("Por favor, insira um título para a playlist");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newPlaylist = await createPlaylist(title, description, coverFile || undefined);
      
      if (newPlaylist) {
        toast.success("Playlist criada com sucesso!");
        navigate("/dashboard");
      } else {
        throw new Error("Falha ao criar playlist");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar playlist. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen pb-24">
      <Navbar />
      
      <main className="container max-w-2xl mx-auto px-4 pt-24">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Criar Nova Playlist</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Nome da Playlist
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Minha Playlist Incrível"
                className="bg-black/20 border-white/10 focus-visible:ring-vibeMixer-purple"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Descrição (opcional)
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Uma breve descrição sobre a sua playlist..."
                className="bg-black/20 border-white/10 focus-visible:ring-vibeMixer-purple min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Capa da Playlist (opcional)
              </label>
              
              <div className="flex items-start gap-4">
                <div className="relative aspect-square w-32 h-32 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/40 text-xs text-center px-2">
                      Imagem da capa
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5"
                      onClick={() => document.getElementById("cover-upload")?.click()}
                    >
                      Escolher Imagem
                    </Button>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                    <p className="text-xs text-white/40">
                      Recomendado: 300x300px ou maior, formato quadrado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              className="text-white/70 hover:text-white"
              onClick={() => navigate("/dashboard")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-vibeMixer-purple to-vibeMixer-magenta hover:opacity-90"
              disabled={!title || isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar Playlist"}
            </Button>
          </div>
        </form>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

export default CreatePlaylist;
