import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Globe, Share2, Building2, FileText, PenTool, ShieldCheck, ArrowRight, Package, Star, Building, Calculator, Megaphone, Laptop, BadgeCheck } from "lucide-react";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";
import decoratorPerson from "@assets/blog-decorator-person.png";
import decoratorGrid from "@assets/blog-decorator-grid.png";

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
  
  return (
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-website">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Sitio Web</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Presencia digital lista para tus clientes</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-social">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BadgeCheck className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Verificación de Redes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Cuentas verificadas en Meta por si quieres montar un chatbot después</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-billing">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Facturación Electrónica</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sistema listo para emitir facturas por un año</p>
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

          {/* Beneficios Section */}
          <div className="bg-primary/5 rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Beneficios</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Negocios formales y seguros desde el principio</h3>
                  <p className="text-muted-foreground">Inicia con todas las bases legales establecidas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Era digital con cuentas aptas para chatbots</h3>
                  <p className="text-muted-foreground">Accede a herramientas empresariales que solo compañías pueden tener</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Un solo proveedor para todo</h3>
                  <p className="text-muted-foreground">No repartas tu esfuerzo entre múltiples proveedores</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Ahorra dinero y tiempo</h3>
                  <p className="text-muted-foreground">Todo incluido en un solo paquete</p>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficio Adicional Especial */}
          <Card className="border-primary border-2 mb-12" data-testid="card-guarantee">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Beneficio Adicional: Garantía de Cierre</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground">
                Si no te va bien dentro del primer año, <span className="font-semibold text-foreground">incluimos el cierre de tu empresa 
                en el precio sin costo adicional</span>. Emprendes con tranquilidad.
              </p>
            </CardContent>
          </Card>

          {/* Marketplace de Aliados */}
          <div className="bg-gradient-to-b from-muted/20 to-background rounded-lg py-20 px-8 mb-16">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8">
                <Package className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Red de Aliados Verificados
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Accede a servicios complementarios de calidad. Continúa tu crecimiento con aliados de confianza.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {aliadosCategories.map((category) => {
                const IconComponent = category.icon;
                const colorClasses = {
                  blue: {
                    bg: 'bg-blue-100 dark:bg-blue-900/20',
                    text: 'text-blue-600 dark:text-blue-400'
                  },
                  green: {
                    bg: 'bg-green-100 dark:bg-green-900/20',
                    text: 'text-green-600 dark:text-green-400'
                  },
                  purple: {
                    bg: 'bg-purple-100 dark:bg-purple-900/20',
                    text: 'text-purple-600 dark:text-purple-400'
                  },
                  orange: {
                    bg: 'bg-orange-100 dark:bg-orange-900/20',
                    text: 'text-orange-600 dark:text-orange-400'
                  }
                };
                const colors = colorClasses[category.color as keyof typeof colorClasses] || colorClasses.blue;
                
                return (
                  <div key={category.title} className="group" data-testid={`card-aliado-${category.title.toLowerCase()}`}>
                    <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-8 w-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-3xl p-12 md:p-16 text-center border border-primary/10">
              <Star className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Beneficios y descuentos exclusivos
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Como cliente de Lo Simple, accedes a descuentos especiales y condiciones preferenciales 
                con nuestros aliados. Ahorra dinero mientras haces crecer tu negocio.
              </p>
              <Link href="/beneficios">
                <Button size="lg" className="text-xl px-12 py-8 font-semibold shadow-lg hover:shadow-xl transition-all" data-testid="button-explore-benefits">
                  Explorar Beneficios
                </Button>
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-12 bg-primary/5 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">¿Listo para lanzar tu negocio?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              En solo 2 días tendrás todo lo necesario para empezar a operar formalmente
            </p>
            <Link href="/login">
              <Button 
                size="lg" 
                className="text-lg px-12 bg-[#6C5CE7] hover:bg-[#5a4bd1]" 
                data-testid="button-start-launch"
              >
                Empezar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

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
  );
}
