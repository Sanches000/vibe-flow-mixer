
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Music, 
  LogIn, 
  LogOut,
  User,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserProfile } from "@/lib/userService";
import { useState, useEffect } from "react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user;
  const [profile, setProfile] = useState<{ name?: string, avatar_url?: string } | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const profileData = await getUserProfile(user.id);
        if (profileData) {
          setProfile({
            name: profileData.name || undefined,
            avatar_url: profileData.avatar_url || undefined
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };
  
  const getInitial = (): string => {
    if (profile?.name) {
      return profile.name.charAt(0).toUpperCase();
    }
    
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "U";
  };
  
  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/welcome");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 backdrop-blur-md bg-vibeMixer-dark/80 border-b border-white/5">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="rounded-full bg-gradient-to-br from-vibeMixer-purple to-vibeMixer-magenta p-1.5">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-vibeMixer-purple to-vibeMixer-magenta bg-clip-text text-transparent">
            VibeFlow
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-vibeMixer-purple/50 text-white hover:bg-vibeMixer-purple/10">
                <Link to="/create-playlist"><PlusCircle className="mr-2 h-4 w-4" /> Nova Playlist</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                    <Avatar>
                      {profile?.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt="Avatar" />
                      ) : null}
                      <AvatarFallback className="bg-vibeMixer-purple/20 text-white">
                        {getInitial()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-vibeMixer-dark-card border-white/10 text-white">
                  <DropdownMenuItem 
                    className="text-white/70 focus:text-white focus:bg-vibeMixer-purple/20"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Editar Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-white/70 focus:text-white focus:bg-vibeMixer-purple/20"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-white/70 focus:text-white focus:bg-vibeMixer-purple/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="outline" size="sm" className="border-vibeMixer-purple/50 text-white hover:bg-vibeMixer-purple/10">
              <Link to="/login"><LogIn className="mr-2 h-4 w-4" /> Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
