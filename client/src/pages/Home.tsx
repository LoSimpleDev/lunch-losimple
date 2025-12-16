import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Cart } from "@/components/Cart";
import { ShoppingCart, CheckCircle, Phone, Mail, Edit, Info, MessageCircle, Shield } from "lucide-react";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";
import { Link } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Service } from "@shared/schema";
import { useState } from "react";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { FAQSection } from "@/components/FAQSection";

// Componente interactivo para Servicios Digitales
function DigitalServicesSection({ services, onAddToCart }: { 
  services: Service[], 
  onAddToCart: (service: Service) => void 
}) {
  // Simplificado para mostrar solo firmas electrónicas
  
  const firmasServices = services.filter(s => s.category === "Firmas Electrónicas");

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-2 text-primary">✍️ Firmas Electrónicas</h4>
          <p className="text-muted-foreground">Certificados digitales con validez legal</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {firmasServices.map((service) => (
            <Card key={service.id} className="relative hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20" data-testid={`card-firmas-${service.id}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="text-xs">
                    {service.name.includes('30 días') ? '30 días' :
                     service.name.includes('1 año') ? '1 año' :
                     service.name.includes('2 años') ? '2 años' :
                     service.name.includes('3 años') ? '3 años' : '4 años'} de vigencia
                  </Badge>
                  <div className="text-2xl font-bold text-primary">
                    ${service.price}
                  </div>
                </div>
                <CardTitle className="text-lg" data-testid={`text-firmas-name-${service.id}`}>
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {service.shortDescription}
                </p>
                <div className="space-y-1">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-start text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => onAddToCart(service)}
                  data-testid={`button-add-firmas-${service.id}`}
                >
                  <Edit className="mr-2 h-3 w-3" />
                  Obtener Firma
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    <>
      <SchemaMarkup />
      <div className="min-h-screen bg-background">
      <main role="main">
        {/* Services Section */}
        <section id="services" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros Servicios Legales para SAS en Ecuador
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Servicios profesionales para constituir y hacer crecer tu empresa SAS. 
              Todos incluyen asesoría personalizada y garantía de satisfacción.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-16">
              {Array.from({ length: 4 }).map((_, categoryIndex) => (
                <div key={categoryIndex} className="space-y-8">
                  <Skeleton className="h-8 w-64 mx-auto" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
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
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-20">
              {/* Servicios Corporativos */}
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                    Servicios Corporativos
                  </h3>
                  <div className="h-1 w-24 bg-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Servicios especializados para el crecimiento y desarrollo corporativo de tu empresa.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services?.filter(service => service.category === "Servicios Corporativos").map((service) => (
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
                              <li className="text-sm text-muted-foreground flex items-center gap-1">
                                <span>+{service.features.length - 3} beneficios más</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-3 w-3 cursor-help inline-block" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <div className="space-y-1">
                                        <p className="font-semibold mb-2">Todas las inclusiones:</p>
                                        <ul className="space-y-1">
                                          {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-xs">
                                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                                              {feature}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
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
              </div>

              {/* SAS */}
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                    SAS - Sociedades por Acciones Simplificadas
                  </h3>
                  <div className="h-1 w-24 bg-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Constituye tu empresa de forma ágil y segura con todos los beneficios legales.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services?.filter(service => service.category === "SAS").map((service) => (
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
                              <li className="text-sm text-muted-foreground flex items-center gap-1">
                                <span>+{service.features.length - 3} beneficios más</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-3 w-3 cursor-help inline-block" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <div className="space-y-1">
                                        <p className="font-semibold mb-2">Todas las inclusiones:</p>
                                        <ul className="space-y-1">
                                          {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-xs">
                                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                                              {feature}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
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
              </div>

              {/* Servicios Digitales - Interactive Section */}
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                    Servicios Digitales
                  </h3>
                  <div className="h-1 w-24 bg-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Soluciones digitales para facturación electrónica y firmas certificadas.
                  </p>
                </div>

                <DigitalServicesSection 
                  services={services || []}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </div>
          )}
          </div>
        </section>
        
        {/* FAQ Section - Optimizado para IA */}
        <FAQSection />
      </main>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#FEC817] text-[#ffffff]">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Todavía te quedan dudas?</h2>
          <p className="text-lg mb-8 opacity-90">Una de las ventajas de trabajar con Lo Simple es que puedes preguntar todo lo que quieras sobre nuestros productos en nuestro número de Whatsapp.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-lg px-8 py-6 bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600"
              onClick={() => window.open('https://wa.me/593958613237', '_blank')}
              data-testid="button-contact-advisor"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contactar a una Asesora
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[#141464] text-white py-12 px-4">
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
                  <a href="https://chat.whatsapp.com/Bq5HBYmLeEaAp2pKuonsqM" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
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
                  <a href="mailto:joseantonio@losimple.ai" className="hover:opacity-100 transition-opacity">
                    Consultas
                  </a>
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <Link href="/admin-login" className="hover:opacity-100 transition-opacity" data-testid="link-admin-access-footer">
                    Acceso Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <div className="flex justify-center gap-6 mb-4 text-sm">
              <a href="/terminos-y-condiciones" className="hover:opacity-80 transition-opacity">
                Términos y Condiciones
              </a>
              <a href="/politica-privacidad-datos-lo-simple" className="hover:opacity-80 transition-opacity">
                Política de Privacidad
              </a>
            </div>
            <div className="text-sm opacity-60">
              © 2025 Lo Simple. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}