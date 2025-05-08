
import { create } from 'zustand';
import { Track } from '@/lib/playlistService';

interface PlayerStore {
  // Current track and playlist
  currentTrack: Track | null;
  currentPlaylist: Track[] | null;
  setCurrentTrack: (track: Track) => void;
  setCurrentPlaylist: (tracks: Track[]) => void;
  
  // Playback control
  isPlaying: boolean;
  togglePlayPause: () => void;
  playTrack: (track: Track) => void;
  
  // Navigation
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  
  // Shuffle mode
  shuffleMode: boolean;
  toggleShuffleMode: () => void;
  shuffledPlaylist: Track[] | null;
  
  // Queue management
  queue: Track[];
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial state
  currentTrack: null,
  currentPlaylist: null,
  isPlaying: false,
  shuffleMode: false,
  shuffledPlaylist: null,
  queue: [],
  
  // Current track and playlist
  setCurrentTrack: (track) => {
    set({ currentTrack: track, isPlaying: true });
  },
  
  setCurrentPlaylist: (tracks) => {
    set({ currentPlaylist: tracks });
    
    // If shuffle mode is on, create a shuffled version
    if (get().shuffleMode) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      set({ shuffledPlaylist: shuffled });
    } else {
      set({ shuffledPlaylist: null });
    }
  },
  
  // Playback control
  togglePlayPause: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },
  
  playTrack: (track) => {
    set({ currentTrack: track, isPlaying: true });
  },
  
  // Navigation
  playNextTrack: () => {
    const { currentTrack, currentPlaylist, shuffleMode, shuffledPlaylist } = get();
    
    if (!currentTrack || !currentPlaylist || currentPlaylist.length === 0) {
      return;
    }
    
    // Determine which playlist to use
    const playlist = shuffleMode && shuffledPlaylist ? shuffledPlaylist : currentPlaylist;
    
    // Find current index
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    
    // If not found or last track, play first track
    if (currentIndex === -1 || currentIndex === playlist.length - 1) {
      set({ currentTrack: playlist[0], isPlaying: true });
    } else {
      set({ currentTrack: playlist[currentIndex + 1], isPlaying: true });
    }
  },
  
  playPreviousTrack: () => {
    const { currentTrack, currentPlaylist, shuffleMode, shuffledPlaylist } = get();
    
    if (!currentTrack || !currentPlaylist || currentPlaylist.length === 0) {
      return;
    }
    
    // Determine which playlist to use
    const playlist = shuffleMode && shuffledPlaylist ? shuffledPlaylist : currentPlaylist;
    
    // Find current index
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    
    // If not found or first track, play last track
    if (currentIndex === -1 || currentIndex === 0) {
      set({ currentTrack: playlist[playlist.length - 1], isPlaying: true });
    } else {
      set({ currentTrack: playlist[currentIndex - 1], isPlaying: true });
    }
  },
  
  // Shuffle mode
  toggleShuffleMode: () => {
    const { currentPlaylist, shuffleMode } = get();
    
    if (!shuffleMode && currentPlaylist) {
      // Enable shuffle mode and create shuffled playlist
      const shuffled = [...currentPlaylist].sort(() => Math.random() - 0.5);
      set({ shuffleMode: true, shuffledPlaylist: shuffled });
    } else {
      // Disable shuffle mode
      set({ shuffleMode: false, shuffledPlaylist: null });
    }
  },
  
  // Queue management
  addToQueue: (track) => {
    set((state) => ({
      queue: [...state.queue, track]
    }));
  },
  
  clearQueue: () => {
    set({ queue: [] });
  }
}));
