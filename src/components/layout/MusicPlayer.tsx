
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Repeat } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  source: "youtube" | "spotify";
  link: string;
  thumbnail?: string;
}

interface MusicPlayerProps {
  isVisible?: boolean;
}

export function MusicPlayer({ isVisible = true }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>({
    id: "demo1",
    title: "Demo Track",
    artist: "Demo Artist",
    source: "youtube",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
  });

  if (!isVisible || !currentTrack) return null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the embedded player
  };

  // This would be replaced with an actual player component from YouTube/Spotify APIs
  const placeholderPlayer = (
    <div className="relative w-full h-full bg-black/20 rounded-lg flex items-center justify-center">
      <img
        src={currentTrack.thumbnail || "https://placehold.co/100x100?text=No+Image"}
        alt={currentTrack.title}
        className="w-full h-full object-cover rounded-lg opacity-50"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {isPlaying ? (
          <Pause className="w-12 h-12 text-white" />
        ) : (
          <Play className="w-12 h-12 text-white" />
        )}
      </div>
    </div>
  );

  return (
    <div className={`fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-vibeMixer-dark-lighter border-t border-white/5 backdrop-blur-md z-40 transition-transform duration-300`}>
      <div className="container mx-auto h-full flex items-center gap-4 px-4">
        <div className="h-16 w-16 rounded-lg overflow-hidden">
          {placeholderPlayer}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{currentTrack.title}</h3>
          <p className="text-sm text-white/60 truncate">{currentTrack.artist}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/5">
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-vibeMixer-purple text-white hover:bg-vibeMixer-purple/20 w-10 h-10"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/5">
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/5">
            <Repeat className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
