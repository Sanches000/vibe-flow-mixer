
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  Volume2,
  Volume1,
  VolumeX,
  Shuffle,
  Youtube,
  Music
} from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";
import { toast } from "sonner";

export function MusicPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause,
    playNextTrack,
    playPreviousTrack,
    shuffleMode,
    toggleShuffleMode
  } = usePlayerStore();
  
  const [volume, setVolume] = useState(70);
  const [repeat, setRepeat] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const youtubePlayerRef = useRef<YT.Player | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      // Create script tag for YouTube API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      // Insert the script tag into the document
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      // Define the onYouTubeIframeAPIReady callback
      window.onYouTubeIframeAPIReady = () => {
        setIsReady(true);
      };
    } else {
      setIsReady(true);
    }
    
    return () => {
      // Clean up the onYouTubeIframeAPIReady callback
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, []);
  
  // Initialize or update YouTube player when track changes
  useEffect(() => {
    if (!isReady || !currentTrack || !playerContainerRef.current) return;
    
    // Only handle YouTube tracks for now
    if (currentTrack.source !== 'youtube') {
      toast.error("Somente faixas do YouTube são suportadas no momento");
      return;
    }
    
    // Extract video ID from URL
    const videoId = extractYouTubeVideoId(currentTrack.url);
    if (!videoId) {
      toast.error("URL do YouTube inválida");
      return;
    }
    
    // Check if we already have a player
    if (youtubePlayerRef.current) {
      // Load the new video
      youtubePlayerRef.current.loadVideoById(videoId);
      if (isPlaying) {
        youtubePlayerRef.current.playVideo();
      } else {
        youtubePlayerRef.current.pauseVideo();
      }
    } else {
      // Create a new player
      youtubePlayerRef.current = new YT.Player(playerContainerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(volume);
            if (isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setDuration(event.target.getDuration());
            } else if (event.data === YT.PlayerState.ENDED) {
              if (repeat) {
                event.target.seekTo(0);
                event.target.playVideo();
              } else {
                playNextTrack();
              }
            }
          },
          onError: (event) => {
            toast.error("Erro ao reproduzir o vídeo");
            console.error("YouTube player error:", event.data);
          }
        }
      });
    }
    
    // Start progress update interval
    const intervalId = setInterval(() => {
      if (youtubePlayerRef.current && youtubePlayerRef.current.getCurrentTime) {
        setCurrentTime(youtubePlayerRef.current.getCurrentTime());
      }
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [currentTrack, isReady, isPlaying, volume, repeat, playNextTrack]);
  
  // Handle play/pause
  useEffect(() => {
    if (!youtubePlayerRef.current) return;
    
    if (isPlaying) {
      youtubePlayerRef.current.playVideo();
    } else {
      youtubePlayerRef.current.pauseVideo();
    }
  }, [isPlaying]);
  
  // Handle volume change
  useEffect(() => {
    if (!youtubePlayerRef.current) return;
    
    youtubePlayerRef.current.setVolume(volume);
  }, [volume]);
  
  // Extract YouTube video ID from URL
  const extractYouTubeVideoId = (url: string): string | null => {
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    
    // Handle youtube.com format
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      return urlParams.get('v');
    }
    
    return null;
  };
  
  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle seek
  const handleSeek = (value: number[]) => {
    if (!youtubePlayerRef.current) return;
    
    const seekTime = value[0];
    youtubePlayerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };
  
  // Get volume icon
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume <= 50) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };
  
  // Toggle volume mute
  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(70);
    }
  };
  
  // If no track is playing, don't render the player
  if (!currentTrack) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-vibeMixer-dark-lighter border-t border-white/5 backdrop-blur-md z-40 transition-transform duration-300">
      <div className="container mx-auto h-full flex items-center gap-4 px-4">
        {/* Hidden container for YouTube player */}
        <div className="hidden">
          <div ref={playerContainerRef} id="youtube-player"></div>
        </div>
        
        {/* Track info with thumbnail */}
        <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
          {/* Show a YouTube icon or source-specific thumbnail */}
          <div className="relative w-full h-full bg-vibeMixer-dark rounded-lg flex items-center justify-center">
            {currentTrack.source === 'youtube' ? (
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 opacity-50"></div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 opacity-50"></div>
            )}
            
            {currentTrack.source === 'youtube' ? (
              <Youtube className="w-8 h-8 text-white z-10" />
            ) : (
              <Music className="w-8 h-8 text-white z-10" />
            )}
          </div>
        </div>
        
        {/* Track info */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">{currentTrack.title}</h3>
              <p className="text-sm text-white/60 truncate">{currentTrack.artist || "Desconhecido"}</p>
            </div>
            
            {/* Mobile controls */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/5"
                onClick={playPreviousTrack}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-vibeMixer-purple text-white hover:bg-vibeMixer-purple/20 w-10 h-10"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/5"
                onClick={playNextTrack}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Progress bar - Only on desktop */}
          <div className="hidden md:flex items-center gap-2 mt-1">
            <span className="text-xs text-white/60">{formatTime(currentTime)}</span>
            <Slider 
              defaultValue={[0]} 
              max={duration} 
              step={1} 
              value={[currentTime]}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-white/60">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Desktop controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Shuffle button */}
          <Button
            variant="ghost"
            size="icon"
            className={`text-white/80 hover:text-white hover:bg-white/5 ${
              shuffleMode ? "text-vibeMixer-purple" : ""
            }`}
            onClick={toggleShuffleMode}
          >
            <Shuffle className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/5"
            onClick={playPreviousTrack}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-vibeMixer-purple text-white hover:bg-vibeMixer-purple/20 w-10 h-10"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/5"
            onClick={playNextTrack}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
          
          {/* Repeat button */}
          <Button
            variant="ghost"
            size="icon"
            className={`text-white/80 hover:text-white hover:bg-white/5 ${
              repeat ? "text-vibeMixer-purple" : ""
            }`}
            onClick={() => setRepeat(!repeat)}
          >
            <Repeat className="h-5 w-5" />
          </Button>
          
          {/* Volume control */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/5"
              onClick={toggleMute}
            >
              {getVolumeIcon()}
            </Button>
            
            <Slider 
              defaultValue={[70]} 
              max={100} 
              step={1} 
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Add YouTube Player API type declaration
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: typeof YT;
  }
}
