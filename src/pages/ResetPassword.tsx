
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "sonner";
import { Music, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if we have a hash in the URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (!hashParams.get("access_token")) {
      toast.error("Link inválido ou expirado");
      navigate("/login");
    }
  }, [navigate]);
  
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (password.length < minLength) {
      return "A senha deve ter pelo menos 8 caracteres";
    }
    
    if (!hasUppercase) {
      return "A senha deve conter pelo menos uma letra maiúscula";
    }
    
    if (!hasNumber) {
      return "A senha deve conter pelo menos um número";
    }
    
    return null;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    
    // Verify passwords match
    if (password !== confirmPassword) {
      toast.error("As senhas não conferem");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Senha atualizada com sucesso!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Erro ao redefinir senha");
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
            <h1 className="text-2xl font-bold">Redefinir Senha</h1>
            <p className="text-white/60 text-sm mt-2">
              Crie uma nova senha para sua conta
            </p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 mb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Nova Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-black/20 border-white/10 focus-visible:ring-vibeMixer-purple pr-10"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-white/50">
                  A senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula e um número.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  Confirme a Senha
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-black/20 border-white/10 focus-visible:ring-vibeMixer-purple pr-10"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-vibeMixer-purple hover:bg-vibeMixer-purple/90"
                disabled={isLoading}
              >
                {isLoading ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
