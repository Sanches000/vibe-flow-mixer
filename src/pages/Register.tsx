
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "sonner";
import { Music, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um e-mail válido");
      return;
    }
    
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
    
    // Verify terms acceptance
    if (!acceptTerms) {
      toast.error("Você deve aceitar os termos de uso");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API to create the user account
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast.success("Cadastro realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-vibeMixer-purple to-vibeMixer-magenta p-4 mb-4">
              <Music className="h-full w-full text-white" />
            </div>
            <h1 className="text-2xl font-bold">Criar conta no VibeFlow</h1>
            <p className="text-white/60 text-sm mt-2">
              Registre-se para criar suas playlists
            </p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 mb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="bg-black/20 border-white/10 focus-visible:ring-vibeMixer-purple"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
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
                <Label htmlFor="confirmPassword">Confirme a senha</Label>
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
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms} 
                  onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') {
                      setAcceptTerms(checked);
                    }
                  }}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-white/70 cursor-pointer">
                  Eu concordo com os <Link to="/terms" className="text-vibeMixer-purple hover:underline">Termos de Uso</Link> e <Link to="/privacy" className="text-vibeMixer-purple hover:underline">Política de Privacidade</Link>.
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-vibeMixer-purple hover:bg-vibeMixer-purple/90"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </div>
          
          <p className="text-center text-white/60 text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-vibeMixer-purple hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
