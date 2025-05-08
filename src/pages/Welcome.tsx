
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MusicPlayer } from "@/components/layout/MusicPlayer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/lib/userService";
import { getPlaylists } from "@/lib/playlistService";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { PlusCircle, Headphones, Music } from "lucide-react";

interface Profile {
  id: string;
  name: string | null;
}

const Welcome = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentPlaylists, setRecentPlaylists] = useState<any[]>([]);
  
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        // Get user profile
        const profileData = await getUserProfile(user.id);
        setProfile(profileData);
        
        // Get some recent playlists
        const playlists = await getPlaylists();
        setRecentPlaylists(playlists.slice(0, 3)); // Take just the first 3
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, [user]);
  
  const handlePlayPlaylist = (id: string) => {
    // This will be handled by the music player store
    console.log("Play playlist:", id);
  };
  
  const displayName = profile?.name || user?.email?.split('@')[0] || "Usuário";
  
  return (
    <div className="min-h-screen pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-12">
          <div className="bg-gradient-to-br from-vibeMixer-purple to-vibeMixer-magenta p-4 rounded-full mb-6">
            <Headphones className="h-16 w-16 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Olá, {displayName}!</h1>
          <p className="text-xl text-white/70 mb-8">
            Bem-vindo(a) ao VibeFlow! Crie playlists e organize suas músicas favoritas do YouTube e Spotify.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button asChild className="bg-vibeMixer-purple hover:bg-vibeMixer-purple/90">
              <Link to="/create-playlist">
                <PlusCircle className="mr-2 h-4 w-4" /> Criar Nova Playlist
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">
                Ver Minhas Playlists
              </Link>
            </Button>
          </div>
          
          {recentPlaylists.length > 0 && (
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-6 text-left">Playlists Recentes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPlaylists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    id={playlist.id}
                    title={playlist.title}
                    description={playlist.description || undefined}
                    trackCount={0} // We'll update this later
                    coverImage={playlist.cover_image || undefined}
                    onPlay={handlePlayPlaylist}
                    onEdit={() => {}}
                    onAddTrack={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

export default Welcome;
