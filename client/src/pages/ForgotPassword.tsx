import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

      // En desarrollo, mostramos el token
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }

      // Redirigir a reset password
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation(-1)}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle>Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu email y te enviaremos un código para resetear tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            {resetToken && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                  Código de recuperación (desarrollo):
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 tracking-wider">
                  {resetToken}
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Guarda este código, lo necesitarás en el siguiente paso
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-submit"
            >
              {isLoading ? "Enviando..." : "Enviar código"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
