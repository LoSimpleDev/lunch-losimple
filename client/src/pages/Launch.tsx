import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, ArrowRight, Send, Loader2, FileText, AlertTriangle, XCircle, Scale, Shield, Globe, Search, CheckCircle2, Users, Target, Award, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";
import decoratorPerson from "@assets/blog-decorator-person.png";
import decoratorGrid from "@assets/blog-decorator-grid.png";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function Launch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessDescription: "",
    phone: "",
    email: ""
  });
  
  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/contact/launch", data);
    },
    onSuccess: () => {
      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        businessDescription: "",
        phone: "",
        email: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const legalInclusions = [
    "Contrato Constitutivo aprobado de la SAS",
    "Títulos de acciones",
    "Nombramientos inscritos",
    "RUC habilitado",
    "Firma electrónica de la empresa",
    "Balance inicial presentado ante la Superintendencia de Compañías",
    "Declaración inicial de patente municipal"
  ];

  const summaryInclusions = [
    "Guía estratégica para SAS",
    "Contrato Constitutivo aprobado",
    "Títulos de acciones",
    "Nombramientos inscritos",
    "RUC habilitado",
    "Firma electrónica empresarial",
    "Balance inicial ante Superintendencia de Compañías",
    "Declaración inicial de patente municipal",
    "Acompañamiento en registro marcario",
    "Página web profesional",
    "Blog incluido",
    "Chatbot de recepción",
    "Optimización SEO, AEO y AIO",
    "Análisis inicial de visibilidad",
    "Verificación de presencia digital"
  ];

  const targetAudience = [
    "Planeas buscar contratos de mayor tamaño",
    "Quieres presentarte ante inversionistas con orden y credibilidad",
    "Necesitas dejar reglas claras con tus socios desde el día uno",
    "Debes prepararte para certificaciones o procesos de evaluación",
    "Quieres que tu negocio funcione incluso cuando tú no estás presente"
  ];
  
  return (
    <>
      <SEO 
        title="Launch: crea tu SAS y tu web con estructura integral | Lo Simple"
        description="Launch es un servicio integral para crear tu SAS en Ecuador con estructura legal completa, marca, web, chatbot y optimización SEO, AEO y AIO."
        canonical="/launch"
        keywords="crear SAS Ecuador, constitución SAS completa, lanzar empresa Ecuador, SAS para inversión, estructura legal emprendimiento, web optimizada para IA"
      />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 lg:py-20">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 opacity-20 transform -rotate-12 hidden lg:block">
          <img src={decoratorPerson} alt="" className="w-full h-full object-contain" loading="lazy" />
        </div>
        <div className="absolute top-16 right-16 w-32 h-32 opacity-15 transform rotate-6 hidden lg:block">
          <img src={decoratorGrid} alt="" className="w-full h-full object-contain" loading="lazy" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs 
            items={[
              { label: "Servicios", href: "/#services" },
              { label: "Launch" }
            ]}
            className="mb-6"
          />
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold mb-6">
              Nuestro Servicio Más Completo
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Lanza tu negocio con una estructura{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">
                legal, digital y operativa
              </span>{" "}
              preparada para crecer
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Launch es un servicio integral que combina constitución legal de una SAS, activos societarios, marca, presencia digital y automatización básica para emprendedores que buscan crecer, contratar o invertir con una base sólida.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Intro Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Launch es nuestro servicio más completo.
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Está diseñado para quienes no solo quieren crear una empresa, sino lanzar un negocio con reglas claras, activos formales y presencia digital operativa desde el inicio.
              </p>
              <div className="border-l-4 border-[#6C5CE7] pl-6 py-2">
                <p className="text-lg font-medium text-foreground">
                  No es un trámite rápido.
                </p>
                <p className="text-muted-foreground">
                  Es una estructura llave en mano, pensada para jugar en una liga más grande.
                </p>
              </div>
            </div>
          </div>

          {/* ¿Para quién es Launch? */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              ¿Para quién es Launch?
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              Launch es para ti si:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {targetAudience.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  data-testid={`target-audience-${index}`}
                >
                  <CheckCircle2 className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl max-w-2xl mx-auto">
              <p className="text-muted-foreground">
                Nuestros{" "}
                <Link href="/cotizar-creacion-sas" className="text-[#6C5CE7] font-medium hover:underline">
                  servicios
                </Link>{" "}
                se adaptan a distintos momentos del emprendimiento.
                <br />
                <strong className="text-foreground">Launch está pensado para cuando el proyecto va a comercializarse con base en lo digital y no depende al 100% del espacio físico.</strong>
              </p>
            </div>
          </div>

          {/* Las 4 cosas más poderosas */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Las 4 cosas más poderosas para lanzar un negocio serio
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Un negocio preparado para crecer necesita reglas claras, identidad protegida, presencia digital activa y una estructura entendible por terceros. Launch integra estos cuatro pilares en un solo proceso.
              </p>
            </div>

            <div className="space-y-8">
              {/* Pilar 1: Reglas claras */}
              <Card className="overflow-hidden" data-testid="card-pillar-legal">
                <div className="md:flex">
                  <div className="md:w-1/4 bg-[#6C5CE7] p-6 flex items-center justify-center">
                    <div className="text-center">
                      <Scale className="w-12 h-12 text-white mx-auto mb-2" />
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                  </div>
                  <div className="md:w-3/4 p-6">
                    <CardTitle className="text-2xl mb-4">Reglas claras y estructura legal completa</CardTitle>
                    <p className="text-muted-foreground mb-4">
                      Incluye todo lo necesario para operar formalmente desde el inicio:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {legalInclusions.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 italic">
                      Esta base reduce fricciones legales, bloqueos operativos y confusiones entre socios.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Pilar 2: Marca */}
              <Card className="overflow-hidden" data-testid="card-pillar-brand">
                <div className="md:flex">
                  <div className="md:w-1/4 bg-cyan-600 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <Shield className="w-12 h-12 text-white mx-auto mb-2" />
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                  </div>
                  <div className="md:w-3/4 p-6">
                    <CardTitle className="text-2xl mb-4">Marca e identidad legal protegida</CardTitle>
                    <p className="text-muted-foreground mb-4">Incluye:</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Acompañamiento en búsqueda y registro de marca</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Coherencia entre empresa, nombre comercial y presencia digital</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Preparación para evaluaciones de terceros (clientes, aliados, certificadores)</span>
                      </li>
                    </ul>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Importante:</strong> Las tasas oficiales de búsqueda y registro marcario, así como el pago de la patente municipal, no están incluidas. Estas tasas suman aproximadamente <strong>USD 240</strong> y se pagan directamente a las instituciones correspondientes. Esto garantiza transparencia y control total del proceso.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pilar 3: Presencia digital */}
              <Card className="overflow-hidden" data-testid="card-pillar-digital">
                <div className="md:flex">
                  <div className="md:w-1/4 bg-green-600 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="w-12 h-12 text-white mx-auto mb-2" />
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                  </div>
                  <div className="md:w-3/4 p-6">
                    <CardTitle className="text-2xl mb-4">Presencia digital que recibe y responde</CardTitle>
                    <p className="text-muted-foreground mb-4">Incluye:</p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">Página web profesional completa</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Diseño alineado a tu modelo de negocio</li>
                          <li>• Blog incluido desde el inicio</li>
                          <li>• Hasta 3 rondas de revisión</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Chatbot de recepción integrado</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Atender consultas</li>
                          <li>• Filtrar contactos</li>
                          <li>• Responder 24/7</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[#6C5CE7]">
                      Tu negocio empieza a operar digitalmente desde el primer día.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Pilar 4: Visibilidad SEO/AEO/AIO */}
              <Card className="overflow-hidden" data-testid="card-pillar-seo">
                <div className="md:flex">
                  <div className="md:w-1/4 bg-orange-500 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <Search className="w-12 h-12 text-white mx-auto mb-2" />
                      <span className="text-white font-bold text-xl">4</span>
                    </div>
                  </div>
                  <div className="md:w-3/4 p-6">
                    <CardTitle className="text-2xl mb-4">Negocio visible y entendible por personas y por IA</CardTitle>
                    <p className="text-muted-foreground mb-4">Incluye:</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Web optimizada para SEO, AEO y AIO</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Estructura semántica clara</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Contenidos pensados para buscadores tradicionales, motores de respuesta con IA y procesos de evaluación digital</span>
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground italic">
                      Esto es clave cuando te buscan, te comparan o te analizan terceros.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Un solo proceso */}
          <div className="bg-[#6C5CE7] text-white rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Un solo proceso, no piezas sueltas
            </h2>
            <p className="text-lg text-center text-white/90 max-w-3xl mx-auto">
              Launch integra en un solo proceso lo que normalmente se resuelve en etapas separadas y con múltiples proveedores. Empresa, marca, web, automatización y base operativa quedan alineadas desde el inicio. No porque sea más lento, sino porque es más completo.
            </p>
          </div>

          {/* Qué incluye Launch (resumen) */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Qué incluye Launch
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
              {summaryInclusions.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  data-testid={`inclusion-${index}`}
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Precio Section */}
          <div className="text-center mb-12 py-12 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl">
            <p className="text-muted-foreground text-lg mb-2">Precio</p>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl md:text-6xl font-extrabold text-[#6C5CE7]">$1.499</span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              Incluye todo lo descrito en esta página, en un solo proceso, con acompañamiento completo.
            </p>
          </div>

          {/* Empezar Launch Button */}
          <div className="flex justify-center mb-16">
            <Link href="/login">
              <Button 
                size="lg" 
                className="text-lg px-12 py-6 bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white font-semibold"
                data-testid="button-start-launch"
              >
                Empieza tu Launch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Costos operativos posteriores */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
                Costos operativos posteriores al Launch
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
                Todo negocio digital requiere una infraestructura mínima para mantenerse operativo, visible y atendiendo. Una vez lanzado, tu negocio opera sobre una infraestructura básica que incluye:
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Globe className="w-8 h-8 text-[#6C5CE7] mx-auto mb-2" />
                  <span className="text-sm font-medium">Hosting profesional</span>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Users className="w-8 h-8 text-[#6C5CE7] mx-auto mb-2" />
                  <span className="text-sm font-medium">Soporte técnico básico</span>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Target className="w-8 h-8 text-[#6C5CE7] mx-auto mb-2" />
                  <span className="text-sm font-medium">Chatbot activo</span>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-[#6C5CE7] mx-auto mb-2" />
                  <span className="text-sm font-medium">Continuidad y estabilidad</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mb-8">
                Estos costos no son exclusivos de Launch; son parte natural de operar online.
              </p>
              
              {/* Pricing Options */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">Opción mensual</CardTitle>
                    <CardDescription>Infraestructura operativa</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold text-foreground mb-2">$35</div>
                    <p className="text-muted-foreground">/ mes</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-[#6C5CE7] relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#6C5CE7] text-white text-xs font-semibold rounded-full">
                    Recomendada
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">Opción anual</CardTitle>
                    <CardDescription>Infraestructura operativa anual</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold text-[#6C5CE7] mb-2">$299</div>
                    <p className="text-muted-foreground">/ año</p>
                    <p className="text-sm text-green-600 mt-2">(equivalente a menos de $25/mes)</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                La anualidad evita fricciones, cortes y recordatorios innecesarios.
              </p>
            </div>
          </div>

          {/* ¿Launch es para todos? */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              ¿Launch es para todos?
            </h2>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-2xl font-bold text-[#6C5CE7] mb-4">No.</p>
              <p className="text-lg text-muted-foreground mb-6">
                Y está bien que no lo sea.
              </p>
              <p className="text-foreground leading-relaxed">
                Launch es para quienes ven su negocio como un activo, no solo como un trámite. Para quienes prefieren orden, claridad y proyección desde el inicio.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div 
            className="text-center py-12 px-8 rounded-2xl mb-16"
            style={{ backgroundColor: '#FEF9C3' }}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900">¿Listo para lanzar tu negocio con estructura completa?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Si estás construyendo algo serio y quieres lanzarlo con una estructura a la altura, este servicio fue diseñado para ti.
            </p>
            <Link href="/login">
              <Button 
                size="lg" 
                className="text-lg px-12 bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white font-semibold" 
                data-testid="button-start-launch-cta"
              >
                Empieza tu Launch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Contact Form Section */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">¿Necesitas una reunión?</CardTitle>
                <CardDescription className="text-lg">
                  Déjanos tus datos y nos pondremos en contacto contigo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        placeholder="Tu nombre"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        data-testid="input-first-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        placeholder="Tu apellido"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">¿Qué hace tu negocio?</Label>
                    <Textarea
                      id="businessDescription"
                      placeholder="Cuéntanos brevemente sobre tu negocio o idea"
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                      required
                      rows={3}
                      data-testid="input-business-description"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+593 999 999 999"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        data-testid="input-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1]"
                    disabled={contactMutation.isPending}
                    data-testid="button-submit-contact"
                  >
                    {contactMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Enviar mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Services Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center mb-8">Otros servicios que te pueden interesar</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/documentos-sas">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-600" />
                    Documentos SAS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Toda la documentación legal que necesitas para tu empresa SAS en Ecuador.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/multas-sas-ecuador">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-purple-600" />
                    Consulta de Multas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Verifica si tu empresa SAS tiene multas pendientes con entidades del Estado.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/cerrar-sas">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Cerrar SAS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Proceso de liquidación y cierre de tu empresa SAS de forma legal y ordenada.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#141464] text-white py-12 px-4 mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img src={logoUrl} alt="Lo Simple" className="h-8 w-auto mb-4 brightness-0 invert" />
              <p className="text-sm mb-4 opacity-80">
                La puerta de entrada a la formalización en Ecuador.
              </p>
              <p className="text-sm opacity-60">
                Hecho en Ecuador con 💜
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="https://sasecuador.com" className="hover:opacity-100 transition-opacity" data-testid="link-main-site">
                    Sitio Principal
                  </a>
                </li>
                <li>
                  <a href="https://sasecuador.com/blog" className="hover:opacity-100 transition-opacity" data-testid="link-blog">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="https://chat.whatsapp.com/Bq5HBYmLeEaAp2pKuonsqM" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity" data-testid="link-community">
                    Comunidad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Ecuador</li>
                <li>
                  <a href="mailto:hola@losimple.ai" className="hover:opacity-100 transition-opacity" data-testid="link-email">
                    hola@losimple.ai
                  </a>
                </li>
                <li>
                  <a href="tel:+593958613237" className="hover:opacity-100 transition-opacity" data-testid="link-phone">
                    +593 958 613 237
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
              <p>© 2024 Lo Simple. Todos los derechos reservados.</p>
              <div className="flex gap-6">
                <a href="/terminos-y-condiciones" className="hover:opacity-100 transition-opacity" data-testid="link-terms">
                  Términos y Condiciones
                </a>
                <a href="/politica-privacidad-datos-lo-simple" className="hover:opacity-100 transition-opacity" data-testid="link-privacy">
                  Política de Privacidad
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
