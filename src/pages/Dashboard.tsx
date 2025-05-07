
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MusicPlayer } from "@/components/layout/MusicPlayer";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { AddTrackModal } from "@/components/playlist/AddTrackModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { mockPlaylists } from "@/lib/playerUtils";

const Dashboard = () => {
  const [playlists, setPlaylists] = useState(mockPlaylists);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);
  
  // Handle actions
  const handlePlay = (id: string) => {
    console.log(`Playing playlist: ${id}`);
    // In a real app, this would start playing the playlist
  };
  
  const handleEdit = (id: string) => {
    console.log(`Editing playlist: ${id}`);
    // In a real app, this would navigate to edit page
  };
  
  const handleAddTrack = (id: string) => {
    setSelectedPlaylist(id);
    setIsAddTrackModalOpen(true);
  };
  
  const handleAddTrackSubmit = (link: string) => {
    console.log(`Adding track from link: ${link} to playlist: ${selectedPlaylist}`);
    // In a real app, this would add the track to the playlist
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
        
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                id={playlist.id}
                title={playlist.title}
                description={playlist.description}
                trackCount={playlist.tracks.length}
                coverImage={playlist.coverImage}
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
