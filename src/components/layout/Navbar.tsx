
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Music, LogIn } from "lucide-react";

export function Navbar() {
  // Mock authentication state - would be replaced with actual auth state
  const isAuthenticated = false;

  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 backdrop-blur-md bg-vibeMixer-dark/80 border-b border-white/5">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-full bg-gradient-to-br from-vibeMixer-purple to-vibeMixer-magenta p-1.5">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-vibeMixer-purple to-vibeMixer-magenta bg-clip-text text-transparent">
            VibeFlow
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-vibeMixer-purple/50 text-white hover:bg-vibeMixer-purple/10">
                <Link to="/create-playlist"><PlusCircle className="mr-2 h-4 w-4" /> Nova Playlist</Link>
              </Button>
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
