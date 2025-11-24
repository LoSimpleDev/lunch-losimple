import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Palette, Globe, Share2, Building2, FileText, PenTool, ShieldCheck, MessageCircle } from "lucide-react";

export default function Launch() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              Launch
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Launch es un servicio todo incluido para quienes empiezan un negocio. Por un sólo precio, 
              <span className="font-semibold text-foreground"> en dos semanas puedes tener</span>:
            </p>
          </div>

          {/* Inclusiones Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <Card className="hover:shadow-lg transition-shadow" data-testid="card-logo">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Palette className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Logo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Identidad visual profesional para tu marca</p>
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
                    <Share2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Redes Sociales</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Cuentas verificadas de Facebook e Instagram</p>
              </CardContent>
            </Card>

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
                <p className="text-muted-foreground">Sistema listo para emitir facturas</p>
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
                <p className="text-muted-foreground">Firma digital con validez legal</p>
              </CardContent>
            </Card>
          </div>

          {/* Contactar Asesora Button */}
          <div className="flex justify-center mb-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600"
              onClick={() => window.open('https://wa.me/593958613237', '_blank')}
              data-testid="button-contact-whatsapp"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contactar Asesora
            </Button>
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

          {/* CTA Section */}
          <div className="text-center py-12 bg-primary/5 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">¿Listo para lanzar tu negocio?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              En solo dos semanas tendrás todo lo necesario para empezar a operar formalmente
            </p>
            <Button 
              size="lg" 
              className="text-lg px-12" 
              data-testid="button-start-launch"
              onClick={() => setLocation('/login')}
            >
              Solicitar Launch
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#141464] text-white py-12 px-4 mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Lo Simple</h3>
              <p className="text-sm mb-4 opacity-80">
                En Lo Simple ayudamos a construir patrimonios familiares sólidos 
                una pequeña empresa a la vez. Somos el socio que necesitas y no nos tienes que dar acciones.
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
