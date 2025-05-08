
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MusicPlayer } from "@/components/layout/MusicPlayer";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  Play, 
  Music, 
  ArrowUp, 
  ArrowDown,
  Loader2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getPlaylist, 
  getTracksForPlaylist, 
  deletePlaylist, 
  deleteTrack,
  updateTrackPosition,
  Playlist,
  Track
} from "@/lib/playlistService";
import { usePlayerStore } from "@/stores/playerStore";
import { toast } from "sonner";

const ViewPlaylist = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    setCurrentPlaylist, 
    setCurrentTrack, 
    isPlaying, 
    togglePlayPause 
  } = usePlayerStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const playlistData = await getPlaylist(id);
        if (playlistData) {
          setPlaylist(playlistData);
          
          const tracksData = await getTracksForPlaylist(id);
          if (tracksData) {
            setTracks(tracksData);
          }
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
        toast.error("Erro ao carregar playlist");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleDeletePlaylist = async () => {
    if (!id) return;
    
    try {
      const success = await deletePlaylist(id);
      if (success) {
        toast.success("Playlist excluída com sucesso");
        navigate("/dashboard");
      } else {
        toast.error("Erro ao excluir playlist");
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Erro ao excluir playlist");
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    try {
      const success = await deleteTrack(trackId);
      if (success) {
        setTracks(tracks.filter(track => track.id !== trackId));
        toast.success("Faixa removida com sucesso");
      } else {
        toast.error("Erro ao remover faixa");
      }
    } catch (error) {
      console.error("Error deleting track:", error);
      toast.error("Erro ao remover faixa");
    }
  };

  const handlePlayPlaylist = () => {
    if (!playlist || tracks.length === 0) return;
    
    setCurrentPlaylist(tracks);
    setCurrentTrack(tracks[0]);
    if (!isPlaying) togglePlayPause();
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentPlaylist(tracks);
    setCurrentTrack(track);
    if (!isPlaying) togglePlayPause();
  };

  const moveTrack = async (trackId: string, direction: "up" | "down") => {
    const trackIndex = tracks.findIndex(t => t.id === trackId);
    if (trackIndex === -1) return;
    
    // If trying to move up the first track or down the last track, do nothing
    if (
      (direction === "up" && trackIndex === 0) || 
      (direction === "down" && trackIndex === tracks.length - 1)
    ) {
      return;
    }
    
    const newTracks = [...tracks];
    const targetIndex = direction === "up" ? trackIndex - 1 : trackIndex + 1;
    
    // Swap positions
    const currentPosition = newTracks[trackIndex].position;
    const targetPosition = newTracks[targetIndex].position;
    
    try {
      // Update track positions in the database
      await updateTrackPosition(trackId, targetPosition);
      await updateTrackPosition(newTracks[targetIndex].id, currentPosition);
      
      // Update local state
      newTracks[trackIndex].position = targetPosition;
      newTracks[targetIndex].position = currentPosition;
      
      // Resort the array
      setTracks([...newTracks].sort((a, b) => a.position - b.position));
      
      toast.success("Ordem das faixas atualizada");
    } catch (error) {
      console.error("Error updating track positions:", error);
      toast.error("Erro ao atualizar ordem das faixas");
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
  
  if (!playlist) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 flex justify-center items-center h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <Music className="h-16 w-16 text-vibeMixer-purple/50" />
            <h2 className="text-xl font-medium">Playlist não encontrada</h2>
            <Button onClick={() => navigate("/dashboard")}>Voltar para Dashboard</Button>
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
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 mb-8">
          {/* Playlist Cover and Info */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-vibeMixer-dark-lighter">
              {playlist.cover_image ? (
                <img 
                  src={playlist.cover_image} 
                  alt={playlist.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-vibeMixer-dark-card">
                  <Music className="h-16 w-16 text-vibeMixer-purple/50" />
                </div>
              )}
            </div>
            
            <h1 className="text-2xl font-bold">{playlist.title}</h1>
            {playlist.description && (
              <p className="text-white/70">{playlist.description}</p>
            )}
            
            <p className="text-sm text-white/50">
              {tracks.length} {tracks.length === 1 ? 'faixa' : 'faixas'}
            </p>
            
            <div className="flex gap-2 mt-2">
              <Button 
                className="bg-vibeMixer-purple hover:bg-vibeMixer-purple/80 flex-1"
                onClick={handlePlayPlaylist}
                disabled={tracks.length === 0}
              >
                <Play className="mr-2 h-4 w-4" /> Reproduzir
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate(`/edit-playlist/${playlist.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="border-red-500/30 text-red-500 hover:text-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir playlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Você tem certeza que deseja excluir esta playlist?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600"
                      onClick={handleDeletePlaylist}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {/* Tracks List */}
          <div className="flex flex-col gap-4">
            {tracks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Artista</TableHead>
                    <TableHead>Fonte</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tracks.map((track, index) => (
                    <TableRow key={track.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{track.title}</TableCell>
                      <TableCell>{track.artist || "-"}</TableCell>
                      <TableCell>
                        {track.source === "youtube" ? "YouTube" : "Spotify"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handlePlayTrack(track)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => moveTrack(track.id, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => moveTrack(track.id, "down")}
                            disabled={index === tracks.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover faixa?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Você tem certeza que deseja remover esta faixa?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteTrack(track.id)}
                                >
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="bg-vibeMixer-dark-card rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Music className="h-16 w-16 text-vibeMixer-purple/50" />
                  <h3 className="text-xl font-medium">Esta playlist está vazia</h3>
                  <p className="text-white/70 max-w-md mb-4">
                    Adicione faixas do YouTube ou Spotify à sua playlist.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

export default ViewPlaylist;
