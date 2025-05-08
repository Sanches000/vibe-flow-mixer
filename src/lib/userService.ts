
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    toast.error("Erro ao carregar perfil");
    return null;
  }

  return data as UserProfile;
}

export async function updateUserProfile(
  userId: string,
  name: string,
  avatarFile?: File,
  removeAvatar: boolean = false
): Promise<boolean> {
  try {
    let updates: any = { name };

    // Handle avatar upload or removal
    if (avatarFile) {
      // Upload new avatar
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      updates.avatar_url = urlData.publicUrl;
    } else if (removeAvatar) {
      // Remove avatar
      updates.avatar_url = null;
    }

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    toast.error("Erro ao atualizar perfil");
    return false;
  }
}
