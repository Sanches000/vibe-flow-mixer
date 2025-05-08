
import { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MusicPlayer } from "@/components/layout/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Music, Loader2, X, ImageIcon } from "lucide-react";
import { getPlaylist, updatePlaylist, Playlist } from "@/lib/playlistService";
import { toast } from "sonner";

const EditPlaylist = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const playlistData = await getPlaylist(id);
        if (playlistData) {
          setTitle(playlistData.title);
          setDescription(playlistData.description || "");
          setCoverImage(playlistData.cover_image);
          if (playlistData.cover_image) {
            setPreviewUrl(playlistData.cover_image);
          }
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
        toast.error("Erro ao carregar detalhes da playlist");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlaylist();
  }, [id]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo é muito grande. O tamanho máximo é 5MB.");
      return;
    }
    
    setCoverFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };
  
  const clearImage = () => {
    setPreviewUrl(null);
    setCoverFile(null);
    // Don't clear coverImage yet as we want to show nothing if user is removing an existing image
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    if (!title.trim()) {
      toast.error("O título da playlist é obrigatório");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedPlaylist = await updatePlaylist(
        id,
        title,
        description || undefined,
        coverFile || undefined
      );
      
      if (updatedPlaylist) {
        toast.success("Playlist atualizada com sucesso");
        navigate(`/playlist/${id}`);
      } else {
        toast.error("Erro ao atualizar playlist");
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
      toast.error("Erro ao atualizar playlist");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 flex justify-center items-center h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 text-vibeMixer-purple animate-spin" />
            <p className="text-white/70">Carregando playlist...</p>
          </div>
        </div>
        <MusicPlayer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Editar Playlist</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
              {/* Cover Image */}
              <div className="space-y-4">
                <Label htmlFor="cover">Capa da Playlist</Label>
                <div className="relative aspect-square bg-vibeMixer-dark-card rounded-md overflow-hidden border border-white/10">
                  {previewUrl ? (
                    <>
                      <img 
                        src={previewUrl} 
                        alt="Capa da playlist" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-white/30 mb-2" />
                      <span className="text-sm text-white/50">Sem imagem</span>
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Label
                    htmlFor="cover"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full cursor-pointer"
                  >
                    {previewUrl ? "Alterar Imagem" : "Carregar Imagem"}
                  </Label>
                </div>
              </div>
              
              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nome da playlist"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição da playlist (opcional)"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/playlist/${id}`)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-vibeMixer-purple hover:bg-vibeMixer-purple/80"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

export default EditPlaylist;
