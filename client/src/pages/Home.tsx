import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Cart } from "@/components/Cart";
import { ShoppingCart, Star, Users, Building, CheckCircle, MessageCircle, Phone, Mail } from "lucide-react";
import isotipoUrl from "@assets/aArtboard 1@2x_1757538290957.png";
import type { Service } from "@shared/schema";

export default function Home() {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  const { addToCart, itemCount } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (service: Service) => {
    addToCart(service);
    toast({
      title: "Servicio agregado",
      description: `${service.name} se ha agregado a tu carrito`,
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error cargando servicios</h2>
          <p className="text-muted-foreground">Por favor intenta recargar la página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section - Lo Simple Brand Design */}
      <section className="bg-gradient-to-br from-primary/15 via-background to-accent/10 py-20 px-4 relative overflow-hidden">
        {/* Abstract Brand Elements - Inspired by Lo Simple isotipo */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Official Lo Simple S Isotipo */}
          <div className="absolute top-20 -right-32 w-64 h-64 opacity-20">
            <img 
              src={isotipoUrl} 
              alt="Lo Simple Isotipo" 
              className="w-full h-full object-contain"
              data-testid="img-isotipo"
            />
          </div>
          
          {/* Accent circles */}
          <div className="absolute top-32 left-20 w-12 h-12 bg-accent/20 rounded-full"></div>
          <div className="absolute bottom-40 right-48 w-8 h-8 bg-primary/20 rounded-full"></div>
          <div className="absolute top-72 left-1/3 w-6 h-6 bg-accent/30 rounded-full"></div>
          
          {/* Abstract geometric lines */}
          <div className="absolute top-16 left-16 w-32 h-1 bg-gradient-to-r from-primary/20 to-transparent transform -rotate-12"></div>
          <div className="absolute bottom-32 right-20 w-24 h-1 bg-gradient-to-r from-accent/30 to-transparent transform rotate-12"></div>
        </div>
        
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              <span className="text-primary">Lo Simple</span>
              <br />
              Servicios Empresariales
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              En Lo Simple, entendemos que tomar decisiones para tu empresa puede parecer un desafío, 
              pero estamos aquí para hacerlo simple. Dar el primer paso hacia tu futuro nunca fue tan fácil.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-view-services"
            >
              Ver Servicios
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600"
              onClick={() => window.open('https://wa.me/593964274013', '_blank')}
              data-testid="button-contact-whatsapp"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contactar Asesor
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center" data-testid="stat-services">
              <div className="text-3xl font-bold text-primary mb-2">10+</div>
              <div className="text-muted-foreground">Servicios Especializados</div>
            </div>
            <div className="text-center" data-testid="stat-experience">
              <div className="text-3xl font-bold text-primary mb-2">5 días</div>
              <div className="text-muted-foreground">Tiempo de entrega promedio</div>
            </div>
            <div className="text-center" data-testid="stat-clients">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Satisfacción garantizada</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h3 className="text-lg font-semibold mb-6 text-muted-foreground">
            Reconocidos por
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="text-xl font-bold">Forbes Ecuador</div>
            <div className="text-xl font-bold">Endeavor</div>
            <div className="text-xl font-bold">Impaqto</div>
            <div className="text-xl font-bold">Strive Community</div>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que Dicen Nuestros Clientes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Más de 500 empresas han confiado en Lo Simple para formalizar y hacer crecer sus negocios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-background rounded-lg p-6 shadow-sm" data-testid="testimonial-card-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">5.0</span>
              </div>
              <p className="text-sm mb-4 italic">
                "Excelente servicio, muy profesionales y rápidos. Me ayudaron a constituir mi SAS en tiempo record."
              </p>
              <div className="text-sm">
                <div className="font-semibold">María González</div>
                <div className="text-muted-foreground">Fundadora, Tech Solutions</div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm" data-testid="testimonial-card-2">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">5.0</span>
              </div>
              <p className="text-sm mb-4 italic">
                "El proceso fue súper simple y transparente. Recomiendo 100% los servicios de Lo Simple."
              </p>
              <div className="text-sm">
                <div className="font-semibold">Carlos Mendoza</div>
                <div className="text-muted-foreground">CEO, Mendoza Consulting</div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm" data-testid="testimonial-card-3">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">5.0</span>
              </div>
              <p className="text-sm mb-4 italic">
                "Asesoría especializada y seguimiento personalizado. Definitivamente los mejores."
              </p>
              <div className="text-sm">
                <div className="font-semibold">Ana Rodriguez</div>
                <div className="text-muted-foreground">Directora, Digital Marketing Pro</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Basado en más de 150 reseñas verificadas
            </p>
            <Button
              variant="outline"
              onClick={() => window.open('https://maps.app.goo.gl/A99V3DxESVZBNWSp8', '_blank')}
              data-testid="button-view-all-reviews"
            >
              Ver Todas las Reseñas en Google Maps
              <Star className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Servicios profesionales para formalizar y hacer crecer tu empresa. 
              Todos incluyen asesoría personalizada y garantía de satisfacción.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-[400px]">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service) => (
                <Card key={service.id} className="h-full hover:shadow-lg transition-shadow duration-300" data-testid={`card-service-${service.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="mb-2">
                        {service.category}
                      </Badge>
                      <div className="text-2xl font-bold text-primary">
                        ${service.price}
                      </div>
                    </div>
                    <CardTitle className="text-xl" data-testid={`text-service-name-${service.id}`}>
                      {service.name}
                    </CardTitle>
                    <CardDescription data-testid={`text-service-description-${service.id}`}>
                      {service.shortDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Incluye:</h4>
                      <ul className="space-y-1">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {service.features.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            +{service.features.length - 3} beneficios más
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => handleAddToCart(service)}
                      data-testid={`button-add-to-cart-${service.id}`}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Agregar al Carrito
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para dar un paso en firme?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Con Lo Simple, crear tu empresa deja de ser un trámite engorroso y 
            se convierte en una experiencia integral con asesoría, automatización y aprendizaje continuo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-lg px-8 py-6 bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600"
              onClick={() => window.open('https://wa.me/593964274013', '_blank')}
              data-testid="button-contact-advisor"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contactar a un Asesor
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => window.open('https://sasecuador.com/blog', '_blank')}
              data-testid="button-blog"
            >
              Ir al Blog
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Lo Simple</h3>
              <p className="text-sm mb-4 opacity-80">
                En Lo Simple ayudamos a construir patrimonios familiares sólidos 
                una pequeña empresa a la vez. Somos el socio que necesitas.
              </p>
              <p className="text-sm opacity-60">
                Hecho en Ecuador con 💜
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="https://sasecuador.com" className="hover:opacity-100 transition-opacity">
                    Sitio Principal
                  </a>
                </li>
                <li>
                  <a href="https://sasecuador.com/blog" className="hover:opacity-100 transition-opacity">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="https://comunidad.losimple.co" className="hover:opacity-100 transition-opacity">
                    Comunidad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <a href="https://wa.me/593964274013" className="hover:opacity-100 transition-opacity">
                    WhatsApp
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Consultas
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm opacity-60">
            © 2025 Lo Simple. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}