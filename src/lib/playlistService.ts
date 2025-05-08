
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Playlist {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string | null;
  source: "youtube" | "spotify";
  url: string;
  playlist_id: string;
  user_id: string;
  position: number;
  created_at: string;
}

export async function getPlaylists() {
  const { data, error } = await supabase.from("playlists").select("*").order("created_at", { ascending: false });

  if (error) {
    toast.error("Erro ao carregar playlists");
    console.error("Error fetching playlists:", error);
    return [];
  }

  return data as Playlist[];
}

export async function getPlaylist(id: string) {
  const { data, error } = await supabase.from("playlists").select("*").eq("id", id).single();

  if (error) {
    toast.error("Erro ao carregar detalhes da playlist");
    console.error("Error fetching playlist:", error);
    return null;
  }

  return data as Playlist;
}

export async function createPlaylist(title: string, description?: string, coverFile?: File) {
  try {
    const user = supabase.auth.getUser();
    if (!user) {
      toast.error("Você precisa estar logado para criar uma playlist");
      return null;
    }

    let coverImageURL = null;

    // Upload cover image if provided
    if (coverFile) {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user?.id;
      
      if (!user_id) {
        throw new Error("User ID not found");
      }

      const fileExt = coverFile.name.split(".").pop();
      const fileName = `${user_id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("playlist_covers")
        .upload(fileName, coverFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("playlist_covers")
        .getPublicUrl(fileName);

      coverImageURL = urlData.publicUrl;
    }

    // Create playlist
    const { data, error } = await supabase
      .from("playlists")
      .insert([
        {
          title,
          description: description || null,
          cover_image: coverImageURL,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Playlist;
  } catch (error: any) {
    toast.error("Erro ao criar playlist");
    console.error("Error creating playlist:", error);
    return null;
  }
}

export async function updatePlaylist(
  id: string,
  title: string,
  description?: string,
  coverFile?: File
) {
  try {
    let updates: any = {
      title,
      description: description || null,
    };

    // Upload new cover image if provided
    if (coverFile) {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user?.id;
      
      if (!user_id) {
        throw new Error("User ID not found");
      }

      const fileExt = coverFile.name.split(".").pop();
      const fileName = `${user_id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("playlist_covers")
        .upload(fileName, coverFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("playlist_covers")
        .getPublicUrl(fileName);

      updates.cover_image = urlData.publicUrl;
    }

    // Update playlist
    const { data, error } = await supabase
      .from("playlists")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Playlist;
  } catch (error: any) {
    toast.error("Erro ao atualizar playlist");
    console.error("Error updating playlist:", error);
    return null;
  }
}

export async function deletePlaylist(id: string) {
  const { error } = await supabase.from("playlists").delete().eq("id", id);

  if (error) {
    toast.error("Erro ao excluir playlist");
    console.error("Error deleting playlist:", error);
    return false;
  }

  return true;
}

export async function getTracksForPlaylist(playlistId: string) {
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true });

  if (error) {
    toast.error("Erro ao carregar faixas");
    console.error("Error fetching tracks:", error);
    return [];
  }

  return data as Track[];
}

export async function addTrackToPlaylist(
  playlistId: string,
  title: string,
  artist: string | null,
  url: string,
  source: "youtube" | "spotify"
) {
  // Get the current highest position
  const { data: tracks } = await supabase
    .from("tracks")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1);

  const position = tracks && tracks.length > 0 ? tracks[0].position + 1 : 0;

  // Add the new track
  const { data, error } = await supabase
    .from("tracks")
    .insert([
      {
        playlist_id: playlistId,
        title,
        artist,
        url,
        source,
        position,
      },
    ])
    .select()
    .single();

  if (error) {
    toast.error("Erro ao adicionar faixa");
    console.error("Error adding track:", error);
    return null;
  }

  return data as Track;
}

export async function updateTrackPosition(trackId: string, newPosition: number) {
  const { data, error } = await supabase
    .from("tracks")
    .update({ position: newPosition })
    .eq("id", trackId)
    .select()
    .single();

  if (error) {
    console.error("Error updating track position:", error);
    return null;
  }

  return data as Track;
}

export async function deleteTrack(trackId: string) {
  const { error } = await supabase.from("tracks").delete().eq("id", trackId);

  if (error) {
    toast.error("Erro ao remover faixa");
    console.error("Error deleting track:", error);
    return false;
  }

  return true;
}
