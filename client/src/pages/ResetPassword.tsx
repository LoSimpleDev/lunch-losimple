import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Mail, KeyRound, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/reset-password", {
        email,
        token,
        newPassword,
      });
      
      const data = await response.json();
      
      toast({
        title: "¡Contraseña actualizada!",
        description: "Tu contraseña ha sido cambiada exitosamente",
      });

      setTimeout(() => {
        setLocation("/login");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al resetear contraseña",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Resetear Contraseña | Lo Simple"
        description="Establece una nueva contraseña para tu cuenta de Lo Simple"
        canonical="/reset-password"
        noindex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/">
              <img 
                src={logoUrl} 
                alt="Lo Simple" 
                className="h-12 mx-auto cursor-pointer"
              />
            </Link>
          </div>

          <Card className="border-purple-100 dark:border-purple-900 shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/forgot-password")}
                  className="text-[#6C5CE7] hover:text-[#5a4bd1] hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Volver
                </Button>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Resetear Contraseña
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Ingresa el código que recibiste y tu nueva contraseña
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-gray-200 dark:border-gray-700 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]"
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token" className="text-gray-700 dark:text-gray-300">Código de recuperación</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="token"
                      type="text"
                      placeholder="123456"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="pl-10 text-center text-xl tracking-widest border-gray-200 dark:border-gray-700 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]"
                      maxLength={6}
                      required
                      data-testid="input-token"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ingresa el código de 6 dígitos que te enviamos por email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">Nueva contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 border-gray-200 dark:border-gray-700 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]"
                      required
                      data-testid="input-new-password"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 border-gray-200 dark:border-gray-700 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]"
                      required
                      data-testid="input-confirm-password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white font-semibold h-12"
                  disabled={isLoading}
                  data-testid="button-submit"
                >
                  {isLoading ? (
                    "Actualizando..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Actualizar contraseña
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  ¿No recibiste el código?{" "}
                  <Link href="/forgot-password" className="text-[#6C5CE7] hover:underline font-medium">
                    Reenviar código
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
