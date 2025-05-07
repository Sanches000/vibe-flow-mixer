
// This is a mock implementation that would be replaced with actual YouTube and Spotify SDK integration

// Types
export interface Track {
  id: string;
  title: string;
  artist: string;
  source: "youtube" | "spotify";
  link: string;
  thumbnail?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  tracks: Track[];
  createdAt: Date;
  userId: string;
}

// Mock data for development
export const mockPlaylists: Playlist[] = [
  {
    id: "playlist1",
    title: "Minha Playlist de Rock",
    description: "Uma coleção das melhores músicas de rock",
    coverImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tracks: [
      {
        id: "track1",
        title: "Bohemian Rhapsody",
        artist: "Queen",
        source: "youtube",
        link: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
        thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/mqdefault.jpg",
      },
      {
        id: "track2",
        title: "Sweet Child O' Mine",
        artist: "Guns N' Roses",
        source: "youtube",
        link: "https://www.youtube.com/watch?v=1w7OgIMMRc4",
        thumbnail: "https://img.youtube.com/vi/1w7OgIMMRc4/mqdefault.jpg",
      },
    ],
    createdAt: new Date(),
    userId: "user1",
  },
  {
    id: "playlist2",
    title: "Pop Vibes",
    description: "As melhores músicas pop do momento",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tracks: [
      {
        id: "track3",
        title: "Blinding Lights",
        artist: "The Weeknd",
        source: "spotify",
        link: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
        thumbnail: "https://i.scdn.co/image/ab67616d0000b27302c9617237d0cc0a9644c86b",
      },
    ],
    createdAt: new Date(),
    userId: "user1",
  },
  {
    id: "playlist3",
    title: "Chill Lofi Beats",
    description: "Relaxe com estas batidas lofi",
    coverImage: "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tracks: [],
    createdAt: new Date(),
    userId: "user1",
  },
];

// Function to extract information from YouTube links
export const extractYoutubeInfo = async (url: string): Promise<Partial<Track>> => {
  // In a real implementation, this would use YouTube API or oEmbed to get video information
  // For now, this is a mock implementation
  const videoId = url.includes("youtu.be") 
    ? url.split("youtu.be/")[1].split("?")[0] 
    : url.includes("v=") 
      ? url.split("v=")[1].split("&")[0]
      : "";
  
  return {
    title: "YouTube Video Title", // This would come from API
    artist: "YouTube Channel", // This would come from API
    source: "youtube" as const,
    link: url,
    thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined,
  };
};

// Function to extract information from Spotify links
export const extractSpotifyInfo = async (url: string): Promise<Partial<Track>> => {
  // In a real implementation, this would use Spotify API to get track information
  // For now, this is a mock implementation
  return {
    title: "Spotify Track Title", // This would come from API
    artist: "Spotify Artist", // This would come from API
    source: "spotify" as const,
    link: url,
  };
};

// Extract info from either YouTube or Spotify link
export const extractTrackInfo = async (url: string): Promise<Partial<Track>> => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return extractYoutubeInfo(url);
  } else if (url.includes("spotify.com")) {
    return extractSpotifyInfo(url);
  }
  
  throw new Error("Unsupported link format");
};
