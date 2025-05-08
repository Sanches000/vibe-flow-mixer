
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MusicPlayer } from "@/components/layout/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/userService";
import { Loader2, User, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      
      setIsLoading(true);
      try {
        const profileData = await getUserProfile(user.id);
        if (profileData) {
          setName(profileData.name || "");
          setAvatarUrl(profileData.avatar_url);
          if (profileData.avatar_url) {
            setPreviewUrl(profileData.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erro ao carregar perfil");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, navigate]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo é muito grande. O tamanho máximo é 5MB.");
      return;
    }
    
    setAvatarFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };
  
  const clearImage = () => {
    setPreviewUrl(null);
    setAvatarFile(null);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const success = await updateUserProfile(
        user.id,
        name,
        avatarFile || undefined,
        avatarFile === null && previewUrl === null // If both are null, we're removing the avatar
      );
      
      if (success) {
        toast.success("Perfil atualizado com sucesso");
        navigate("/dashboard");
      } else {
        toast.error("Erro ao atualizar perfil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
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
            <p className="text-white/70">Carregando perfil...</p>
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
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border border-white/10">
                {previewUrl ? (
                  <>
                    <img 
                      src={previewUrl} 
                      alt="Avatar" 
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
                  <div className="w-full h-full flex items-center justify-center bg-vibeMixer-purple/20">
                    <User className="h-16 w-16 text-white/30" />
                  </div>
                )}
              </div>
              
              <div>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Label
                  htmlFor="avatar"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                >
                  {previewUrl ? "Alterar Avatar" : "Carregar Avatar"}
                </Label>
              </div>
            </div>
            
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
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

export default EditProfile;
