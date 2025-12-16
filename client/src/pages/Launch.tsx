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
import { Building2, PenTool, ShieldCheck, ArrowRight, Building, Calculator, Megaphone, Laptop, Headphones, Send, Loader2, FileText, AlertTriangle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";
import decoratorPerson from "@assets/blog-decorator-person.png";
import decoratorGrid from "@assets/blog-decorator-grid.png";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const aliadosCategories = [
  {
    icon: Building,
    title: "Oficinas",
    description: "Espacios de coworking y oficinas virtuales para tu empresa",
    color: "blue"
  },
  {
    icon: Calculator,
    title: "Contabilidad",
    description: "Servicios contables profesionales para mantener tu empresa al día",
    color: "green"
  },
  {
    icon: Megaphone,
    title: "Marketing",
    description: "Agencias especializadas en hacer crecer tu negocio digitalmente",
    color: "purple"
  },
  {
    icon: Laptop,
    title: "Tecnología",
    description: "Desarrollo de software y soluciones tecnológicas para tu empresa",
    color: "orange"
  }
];

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
  
  return (
    <>
      <SEO 
        title="Launch: Lanza tu negocio todo incluido | SAS + Firma + Facturación"
        description="Servicio todo incluido para emprendedores. Constituye tu SAS, obtén firma electrónica, facturación y soporte por un año. En 2 días tu negocio operando en Ecuador."
        canonical="/launch"
        keywords="lanzar negocio Ecuador, constituir empresa Ecuador, SAS todo incluido, emprender Ecuador"
      />
      <div className="min-h-screen bg-background">
      {/* Hero Section - Similar to Blog */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 lg:py-20">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 opacity-20 transform -rotate-12 hidden lg:block">
          <img src={decoratorPerson} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-16 right-16 w-32 h-32 opacity-15 transform rotate-6 hidden lg:block">
          <img src={decoratorGrid} alt="" className="w-full h-full object-contain" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs 
            items={[
              { label: "Servicios", href: "/#services" },
              { label: "Launch" }
            ]}
            className="mb-6"
          />
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold mb-6">
              Servicio Todo Incluido
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Launch:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">
                Lánzalo simple
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todo incluido para quienes empiezan un negocio. Por un solo precio, 
              <span className="font-semibold text-foreground"> en 2 días puedes tener</span>:
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Inclusiones Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Card className="hover:shadow-lg transition-shadow" data-testid="card-company">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Compañía Constituida</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">SAS 100% legal y lista para operar</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-support">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Soporte Anual</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nuestro equipo resuelve tus dudas legales y las relacionadas con inclusiones, por un año</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-signature">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <PenTool className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Firma Electrónica</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Firma digital con validez legal por un año</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-benefits">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Beneficios por Miles de Dólares</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Acceso exclusivo a perks y descuentos de nuestros aliados</p>
              </CardContent>
            </Card>
          </div>

          {/* Precio Section */}
          <div className="text-center mb-12 py-12 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl">
            <p className="text-muted-foreground text-lg mb-2">Precio del servicio</p>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl md:text-6xl font-extrabold text-[#6C5CE7]">$350</span>
              <span className="text-xl text-muted-foreground">+ IVA</span>
            </div>
            <p className="text-muted-foreground mb-2">Total: <span className="font-semibold">$392</span></p>
          </div>

          {/* Empezar Ahora Button */}
          <div className="flex justify-center mb-12">
            <Link href="/login">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white font-semibold"
                data-testid="button-start-now"
              >
                Empezar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Beneficios del servicio Launch - Perks estilo aceleradora */}
          <div className="bg-gradient-to-b from-purple-50 to-background dark:from-gray-900 dark:to-background rounded-2xl py-20 px-8 mb-16">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold mb-6">
                Exclusivo para clientes Launch
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Beneficios del servicio Launch
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Acceso a perks y descuentos exclusivos que representan{" "}
                <span className="font-bold text-[#6C5CE7]">miles de dólares en ahorros</span>{" "}
                para hacer crecer tu negocio.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aliadosCategories.map((category) => {
                const IconComponent = category.icon;
                const colorClasses = {
                  blue: {
                    bg: 'bg-blue-100 dark:bg-blue-900/20',
                    text: 'text-blue-600 dark:text-blue-400',
                    border: 'border-blue-200 dark:border-blue-800'
                  },
                  green: {
                    bg: 'bg-green-100 dark:bg-green-900/20',
                    text: 'text-green-600 dark:text-green-400',
                    border: 'border-green-200 dark:border-green-800'
                  },
                  purple: {
                    bg: 'bg-purple-100 dark:bg-purple-900/20',
                    text: 'text-purple-600 dark:text-purple-400',
                    border: 'border-purple-200 dark:border-purple-800'
                  },
                  orange: {
                    bg: 'bg-orange-100 dark:bg-orange-900/20',
                    text: 'text-orange-600 dark:text-orange-400',
                    border: 'border-orange-200 dark:border-orange-800'
                  }
                };
                const colors = colorClasses[category.color as keyof typeof colorClasses] || colorClasses.blue;
                
                return (
                  <div 
                    key={category.title} 
                    className={`group bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 ${colors.border} hover:shadow-lg transition-all`}
                    data-testid={`card-perk-${category.title.toLowerCase()}`}
                  >
                    <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-7 w-7 ${colors.text}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section - Yellow Card */}
          <div 
            className="text-center py-12 px-8 rounded-2xl"
            style={{ backgroundColor: '#FEF9C3' }}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900">¿Listo para lanzar tu negocio?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              En solo 2 días tendrás todo lo necesario para empezar a operar formalmente
            </p>
            <Link href="/login">
              <Button 
                size="lg" 
                className="text-lg px-12 bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white font-semibold" 
                data-testid="button-start-launch"
              >
                Empezar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Contact Form Section */}
          <div className="mt-16 max-w-2xl mx-auto">
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
