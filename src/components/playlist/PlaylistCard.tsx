
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Edit, Plus } from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";

interface PlaylistCardProps {
  id: string;
  title: string;
  description?: string;
  trackCount: number;
  coverImage?: string;
  onPlay?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAddTrack?: (id: string) => void;
}

export function PlaylistCard({
  id,
  title,
  description,
  trackCount,
  coverImage = "https://placehold.co/300x300?text=Cover",
  onPlay,
  onEdit,
  onAddTrack
}: PlaylistCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/playlist/${id}`);
  };
  
  return (
    <Card 
      className="glass-card overflow-hidden relative transition-all duration-300 group hover-scale cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay with controls that appear on hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-vibeMixer-dark to-transparent p-4 flex flex-col justify-end transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex gap-2">
            <Button
              variant="default"
              size="icon"
              className="bg-vibeMixer-purple hover:bg-vibeMixer-purple/80 rounded-full h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                onPlay && onPlay(id);
              }}
            >
              <Play className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/10 hover:bg-white/20 rounded-full h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit-playlist/${id}`);
              }}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/10 hover:bg-white/20 rounded-full h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                onAddTrack && onAddTrack(id);
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-lg truncate">{title}</h3>
        {description && (
          <p className="text-sm text-white/60 line-clamp-2 mb-1">{description}</p>
        )}
        <p className="text-xs text-white/40">{trackCount} {trackCount === 1 ? 'faixa' : 'faixas'}</p>
      </div>
    </Card>
  );
}
