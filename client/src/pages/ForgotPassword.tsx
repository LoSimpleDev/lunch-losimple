import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/forgot-password", { email });
      const data = await response.json();
      
      toast({
        title: "Código enviado",
        description: data.message,
      });

      if (data.resetToken) {
        setResetToken(data.resetToken);
      }

      setTimeout(() => {
        setLocation(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al solicitar recuperación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Recuperar Contraseña | Lo Simple"
        description="Recupera el acceso a tu cuenta de Lo Simple"
        canonical="/forgot-password"
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
                  onClick={() => setLocation("/login")}
                  className="text-[#6C5CE7] hover:text-[#5a4bd1] hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Volver
                </Button>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Recuperar Contraseña
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Ingresa tu email y te enviaremos un código para resetear tu contraseña
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

                {resetToken && (
                  <div className="p-4 bg-[#FFEAA7]/30 border border-[#FFEAA7] rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Código de recuperación (desarrollo):
                    </p>
                    <p className="text-2xl font-bold text-[#6C5CE7] tracking-wider">
                      {resetToken}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Guarda este código, lo necesitarás en el siguiente paso
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white font-semibold h-12"
                  disabled={isLoading}
                  data-testid="button-submit"
                >
                  {isLoading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Enviar código
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  ¿Recordaste tu contraseña?{" "}
                  <Link href="/login" className="text-[#6C5CE7] hover:underline font-medium">
                    Inicia sesión
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
