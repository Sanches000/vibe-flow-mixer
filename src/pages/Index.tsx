
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Play, ArrowRight, Youtube, Music } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-24">
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute inset-0 bg-vibeMixer-dark" />
            <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-vibeMixer-purple/30 blur-[120px]" />
            <div className="absolute top-1/3 -right-1/4 w-1/2 h-1/2 rounded-full bg-vibeMixer-magenta/20 blur-[120px]" />
          </div>
          
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-vibeMixer-purple via-vibeMixer-magenta to-vibeMixer-orange bg-clip-text text-transparent">
              Crie playlists com músicas do YouTube e Spotify
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10">
              Combine suas músicas favoritas em um só lugar, independente da plataforma.
              Reproduza-as sem restrições e compartilhe seu gosto musical.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-vibeMixer-purple to-vibeMixer-magenta hover:opacity-90 h-12 px-8 rounded-full">
                <Link to="/register">Comece Agora <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-vibeMixer-purple/50 text-white hover:bg-vibeMixer-purple/10 h-12 px-8 rounded-full">
                <Link to="/login">Já tenho uma conta</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-vibeMixer-dark-lighter">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-16 text-center">
              <span className="bg-gradient-to-r from-vibeMixer-purple to-vibeMixer-magenta bg-clip-text text-transparent">Como Funciona</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Youtube className="h-10 w-10 text-red-500" />,
                  title: "Adicione links",
                  description: "Cole links do YouTube ou Spotify para adicionar músicas à sua playlist."
                },
                {
                  icon: <Music className="h-10 w-10 text-vibeMixer-purple" />,
                  title: "Crie playlists",
                  description: "Organize suas músicas favoritas em playlists temáticas."
                },
                {
                  icon: <Play className="h-10 w-10 text-vibeMixer-cyan" />,
                  title: "Reproduza sem restrições",
                  description: "Ouça suas músicas favoritas sem precisar alternar entre plataformas."
                }
              ].map((feature, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover-scale">
                  <div className="h-16 w-16 rounded-full flex items-center justify-center bg-black/20 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-vibeMixer-dark" />
            <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 rounded-full bg-vibeMixer-purple/20 blur-[100px]" />
          </div>
          
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-vibeMixer-purple to-vibeMixer-magenta bg-clip-text text-transparent">
              Pronto para unir suas músicas?
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
              Crie uma conta agora e comece a construir suas playlists perfeitas misturando YouTube e Spotify.
            </p>
            
            <Button asChild className="bg-gradient-to-r from-vibeMixer-purple to-vibeMixer-magenta hover:opacity-90 h-12 px-8 rounded-full">
              <Link to="/register">Começar Gratuitamente</Link>
            </Button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-white/40 text-sm">
          <p>© 2025 VibeFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
