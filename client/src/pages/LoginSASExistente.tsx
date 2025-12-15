import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Shield, CheckCircle, Loader2, ArrowRight } from "lucide-react";

export default function LoginSASExistente() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    ruc: "",
    companyName: "",
    fullName: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read RUC from URL parameters if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rucFromUrl = urlParams.get('ruc');
    if (rucFromUrl) {
      setFormData(prev => ({ ...prev, ruc: rucFromUrl.replace(/\D/g, '').substring(0, 13) }));
    }
  }, []);

  const validateRuc = (value: string): boolean => {
    const cleanRuc = value.replace(/\D/g, '');
    return cleanRuc.length === 13;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRuc(formData.ruc)) {
      toast({
        title: "Error",
        description: "El RUC debe tener 13 dígitos",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register-existing-sas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          ruc: formData.ruc,
          companyName: formData.companyName
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al registrar');
      }

      const data = await response.json();
      
      toast({
        title: "Cuenta creada exitosamente",
        description: `Bienvenido ${data.user.fullName}! Tu empresa ${formData.companyName} ha sido registrada.`,
      });

      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al registrar la cuenta",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Acceso inmediato a tu panel de control",
    "Monitoreo de obligaciones tributarias",
    "Gestión de facturación electrónica",
    "Firma digital para documentos",
    "Soporte especializado para SAS"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column - Benefits */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                <Shield className="w-3 h-3 mr-1" />
                Para empresas SAS existentes
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Registra tu empresa SAS existente
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Si ya tienes una empresa SAS constituida con número de RUC, 
                puedes acceder directamente a todos los beneficios de Lo Simple.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Beneficios incluidos
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Al registrar tu empresa existente, podrás acceder a servicios adicionales 
              como facturación electrónica y firma digital con tarifas preferenciales.
            </p>
          </div>

          {/* Right Column - Form */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Datos de tu empresa
              </CardTitle>
              <CardDescription>
                Ingresa los datos de tu empresa SAS existente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ruc">Número de RUC *</Label>
                  <Input
                    id="ruc"
                    type="text"
                    placeholder="1234567890001"
                    value={formData.ruc}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      ruc: e.target.value.replace(/\D/g, '').substring(0, 13) 
                    }))}
                    className={!formData.ruc || validateRuc(formData.ruc) ? "" : "border-red-500"}
                    required
                    data-testid="input-ruc-existente"
                  />
                  {formData.ruc && !validateRuc(formData.ruc) && (
                    <p className="text-sm text-red-500">El RUC debe tener 13 dígitos</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Razón Social *</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Mi Empresa S.A.S."
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    required
                    data-testid="input-company-name"
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-500 mb-4">Datos de acceso a la plataforma</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Tu nombre completo *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                    data-testid="input-full-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    data-testid="input-email-existente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    data-testid="input-password-existente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    data-testid="input-confirm-password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !validateRuc(formData.ruc)}
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  data-testid="button-register-existing-sas"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      Registrar mi empresa
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  Al registrarte aceptas nuestros términos y condiciones 
                  y política de privacidad.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
