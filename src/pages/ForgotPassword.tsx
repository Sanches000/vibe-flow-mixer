
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "sonner";
import { Music } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor, insira seu e-mail");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(error.message);
      } else {
        setSent(true);
        toast.success("E-mail de redefinição enviado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao enviar e-mail de redefinição");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-vibeMixer-purple to-vibeMixer-magenta p-4 mb-4">
              <Music className="h-full w-full text-white" />
            </div>
            <h1 className="text-2xl font-bold">Recuperar Senha</h1>
            <p className="text-white/60 text-sm mt-2">
              Enviaremos um link para redefinir sua senha
            </p>
          </div>
          
          {sent ? (
            <div className="glass-card rounded-2xl p-6 mb-4 text-center">
              <p className="mb-4">
                Enviamos um e-mail para <strong>{email}</strong> com instruções para redefinir sua senha.
              </p>
              <p className="text-white/60 text-sm">
                Se não receber o e-mail em alguns minutos, verifique sua pasta de spam ou tente novamente.
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 mb-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="bg-black/20 border-white/10 focus-visible:ring-vibeMixer-purple"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-vibeMixer-purple hover:bg-vibeMixer-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Link de Redefinição"}
                </Button>
              </form>
            </div>
          )}
          
          <p className="text-center text-white/60 text-sm">
            <Link to="/login" className="text-vibeMixer-purple hover:underline">
              Voltar para o login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
