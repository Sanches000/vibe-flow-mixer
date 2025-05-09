
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MusicPlayer } from "@/components/layout/MusicPlayer";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { AddTrackModal } from "@/components/playlist/AddTrackModal";
import { Button } from "@/components/ui/button";
import { PlusCircle, Music } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getPlaylists, addTrackToPlaylist, Playlist, getTracksForPlaylist } from "@/lib/playlistService";
import { usePlayerStore } from "@/stores/playerStore";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);
  const [trackCounts, setTrackCounts] = useState<Record<string, number>>({});
  
  const { setCurrentPlaylist, setCurrentTrack } = usePlayerStore();
  
  // Fetch playlists data using React Query
  const { data: playlists, isLoading, error, refetch } = useQuery({
    queryKey: ['playlists'],
    queryFn: getPlaylists,
    enabled: !!user,
  });
  
  // Fetch track counts for each playlist
  useEffect(() => {
    const fetchTrackCounts = async () => {
      if (!playlists || playlists.length === 0) return;
      
      const counts: Record<string, number> = {};
      
      for (const playlist of playlists) {
        const tracks = await getTracksForPlaylist(playlist.id);
        counts[playlist.id] = tracks.length;
      }
      
      setTrackCounts(counts);
    };
    
    fetchTrackCounts();
  }, [playlists]);
  
  // Handle actions
  const handlePlay = async (id: string) => {
    const tracks = await getTracksForPlaylist(id);
    if (tracks.length === 0) return;
    
    setCurrentPlaylist(tracks);
    setCurrentTrack(tracks[0]);
  };
  
  const handleEdit = (id: string) => {
    navigate(`/edit-playlist/${id}`);
  };
  
  const handleAddTrack = (id: string) => {
    setSelectedPlaylist(id);
    setIsAddTrackModalOpen(true);
  };
  
  const handleAddTrackSubmit = async (link: string) => {
    if (!selectedPlaylist) return;
    
    // Extract info from link
    // This is a simplified example - in a real app you'd use the YouTube/Spotify APIs
    let title = "New Track";
    let artist = null;
    let source: "youtube" | "spotify" = "youtube";
    
    if (link.includes("youtube.com") || link.includes("youtu.be")) {
      source = "youtube";
      // Try to extract video title from URL (would require API in real implementation)
      title = "YouTube Track";
    } else if (link.includes("spotify.com")) {
      source = "spotify";
      // Try to extract track info from URL (would require API in real implementation)
      title = "Spotify Track";
      artist = "Unknown Artist";
    }
    
    const result = await addTrackToPlaylist(
      selectedPlaylist,
      title,
      artist,
      link,
      source
    );
    
    if (result) {
      refetch(); // Refresh playlists data
      
      // Update track counts
      setTrackCounts(prev => ({
        ...prev,
        [selectedPlaylist]: (prev[selectedPlaylist] || 0) + 1
      }));
    }
  };
  
  return (
    <div className="min-h-screen pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Minhas Playlists</h1>
          
          <Button asChild className="bg-vibeMixer-purple hover:bg-vibeMixer-purple/90">
            <Link to="/create-playlist">
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Playlist
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vibeMixer-purple"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            Erro ao carregar playlists. Por favor, tente novamente.
          </div>
        ) : playlists && playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                id={playlist.id}
                title={playlist.title}
                description={playlist.description || undefined}
                trackCount={trackCounts[playlist.id] || 0}
                coverImage={playlist.cover_image || undefined}
                onPlay={handlePlay}
                onEdit={handleEdit}
                onAddTrack={handleAddTrack}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-vibeMixer-dark-card flex items-center justify-center mb-6">
              <Music className="h-10 w-10 text-vibeMixer-purple" />
            </div>
            <h3 className="text-xl font-medium mb-2">Suas playlists aparecerão aqui</h3>
            <p className="text-white/70 max-w-md mb-6">
              Comece criando sua primeira playlist e adicionando músicas do YouTube e Spotify.
            </p>
            <Button asChild className="bg-vibeMixer-purple hover:bg-vibeMixer-purple/90">
              <Link to="/create-playlist">
                <PlusCircle className="mr-2 h-4 w-4" /> Criar Playlist
              </Link>
            </Button>
          </div>
        )}
      </main>
      
      <MusicPlayer />
      
      <AddTrackModal
        open={isAddTrackModalOpen}
        onOpenChange={setIsAddTrackModalOpen}
        onAddTrack={handleAddTrackSubmit}
        playlistId={selectedPlaylist || undefined}
      />
    </div>
  );
};

export default Dashboard;
