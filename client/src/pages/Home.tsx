import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Cart } from "@/components/Cart";
import { ShoppingCart, Star, Users, Building, CheckCircle, MessageCircle, Phone, Mail, FileText, Edit, Info, Shield } from "lucide-react";
import { Link } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import isotipoUrl from "@assets/aArtboard 1@2x_1757538290957.png";
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
        {/* Hero Section - Lo Simple Brand Design */}
        <header className="bg-gradient-to-br from-primary/15 via-background to-accent/10 py-20 px-4 relative overflow-hidden" role="banner">
        {/* Abstract Brand Elements - Inspired by Lo Simple isotipo */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
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
              <span className="text-primary">Lo Simple (antes simpleSAS)</span>
            </h1>
            
            {/* Definiciones claras para AIO */}
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 mb-8 text-left max-w-3xl mx-auto shadow-sm border border-primary/10">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-primary mb-2">¿Qué es Lo Simple?</h2>
                <p className="text-sm text-muted-foreground"><strong>Lo Simple ayuda a constituir empresas SAS en Ecuador en 5 días.</strong> Incluye trámites legales, libros sociales, títulos acción.</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary mb-2">¿Qué es una SAS en Ecuador?</h2>
                <p className="text-sm text-muted-foreground"><strong>Una SAS es una empresa que puedes crear tú solo.</strong> No necesita capital mínimo y protege tu patrimonio personal.</p>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Constituye tu empresa SAS en Ecuador en 5 días. Todo incluido: logo, página web, redes sociales, trámites legales, facturación electrónica y firma digital por $688.85.</p>
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
              onClick={() => window.open('https://wa.me/593958613237', '_blank')}
              data-testid="button-contact-whatsapp"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contactar Asesora
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
      </header>
      
      {/* Por qué elegir una SAS - Optimizado para AIO */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir una SAS en Ecuador?</h2>
            <p className="text-muted-foreground">Las SAS son ideales para emprendedores que buscan formalizar su negocio sin complicaciones.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Sin capital mínimo requerido</h3>
                  <p className="text-sm text-muted-foreground">Puedes constituir tu SAS con el capital que tengas disponible, sin mínimos obligatorios.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Responsabilidad limitada</h3>
                  <p className="text-sm text-muted-foreground">Tu patrimonio personal está protegido. Solo respondes por el capital que aportaste a la empresa.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Flexible y simplificada</h3>
                  <p className="text-sm text-muted-foreground">Puedes crear una SAS tú solo o con socios. No necesitas junta de socios ni consejo administrativo.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">100% en línea</h3>
                  <p className="text-sm text-muted-foreground">Todo el proceso se realiza digitalmente a través de la Superintendencia de Compañías, sin trámites presenciales.</p>
                </div>
              </div>
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
            <a href="https://www.forbes.com.ec/negocios/transformo-sus-derrotas-una-plataforma-medio-millon-dolares-n71419" target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:opacity-80 transition-opacity">
              Forbes Ecuador
            </a>
            <a href="https://www.linkedin.com/posts/natassjaruybal_el-nuevo-programa-de-aceleraci%C3%B3n-de-endeavor-activity-7176238819048873986-sQUp/?originalSubdomain=es" target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:opacity-80 transition-opacity">
              Endeavor
            </a>
            <a href="https://impaqto.net/cerramos-con-exito-kinesis-un-programa-de-aceleracion-de-impacto-transformador/" target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:opacity-80 transition-opacity">
              Impaqto
            </a>
            <a href="https://strivecommunity.org/programs/viqtoria" target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:opacity-80 transition-opacity">
              Strive Community
            </a>
          </div>
        </div>
      </section>
      {/* Testimonios Section */}
      <section className="py-20 px-4 bg-muted/30" itemScope itemType="https://schema.org/Organization">
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
            <article className="bg-background rounded-lg p-6 shadow-sm" data-testid="testimonial-card-1" itemScope itemType="https://schema.org/Review">
              <div className="flex items-center mb-4" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground" itemProp="ratingValue">5.0</span>
              </div>
              <p className="text-sm mb-4 italic" itemProp="reviewBody">
                "Excelente servicio, muy profesionales y rápidos. Me ayudaron a constituir mi SAS en tiempo record."
              </p>
              <div className="text-sm" itemProp="author" itemScope itemType="https://schema.org/Person">
                <div className="font-semibold" itemProp="name">María González</div>
                <div className="text-muted-foreground">Fundadora, Tech Solutions</div>
              </div>
            </article>

            <article className="bg-background rounded-lg p-6 shadow-sm" data-testid="testimonial-card-2" itemScope itemType="https://schema.org/Review">
              <div className="flex items-center mb-4" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground" itemProp="ratingValue">5.0</span>
              </div>
              <p className="text-sm mb-4 italic" itemProp="reviewBody">
                "El proceso fue súper simple y transparente. Recomiendo 100% los servicios de Lo Simple."
              </p>
              <div className="text-sm" itemProp="author" itemScope itemType="https://schema.org/Person">
                <div className="font-semibold" itemProp="name">Carlos Mendoza</div>
                <div className="text-muted-foreground">CEO, Mendoza Consulting</div>
              </div>
            </article>

            <article className="bg-background rounded-lg p-6 shadow-sm" data-testid="testimonial-card-3" itemScope itemType="https://schema.org/Review">
              <div className="flex items-center mb-4" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground" itemProp="ratingValue">5.0</span>
              </div>
              <p className="text-sm mb-4 italic" itemProp="reviewBody">
                "Asesoría especializada y seguimiento personalizado. Definitivamente los mejores."
              </p>
              <div className="text-sm" itemProp="author" itemScope itemType="https://schema.org/Person">
                <div className="font-semibold" itemProp="name">Ana Rodriguez</div>
                <div className="text-muted-foreground">Directora, Digital Marketing Pro</div>
              </div>
            </article>
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
      
      {/* Cómo funciona - Proceso paso a paso */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo funciona el proceso de constitución de tu SAS?</h2>
            <p className="text-muted-foreground">En 4 pasos simples tienes tu empresa legalmente constituida</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start bg-background rounded-lg p-6 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Elige tu servicio y realiza el pago</h3>
                <p className="text-sm text-muted-foreground">Selecciona el paquete que mejor se adapte a tus necesidades. Puedes pagar con tarjeta de crédito o débito a través de Stripe.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start bg-background rounded-lg p-6 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Completa el formulario con los datos de tu empresa</h3>
                <p className="text-sm text-muted-foreground">Te guiamos paso a paso para recopilar toda la información necesaria: nombre de la empresa, actividad económica, datos de accionistas y más.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start bg-background rounded-lg p-6 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Nosotros gestionamos todos los trámites</h3>
                <p className="text-sm text-muted-foreground">Nuestro equipo se encarga de preparar los estatutos, inscribir la empresa en la Superintendencia de Compañías y obtener tu RUC en el SRI.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start bg-background rounded-lg p-6 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Recibe tu empresa lista para operar</h3>
                <p className="text-sm text-muted-foreground">En 5 días tienes tu SAS constituida con todos los documentos legales, acceso a facturación electrónica y firma digital.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <main role="main">
        {/* Services Section */}
        <section id="services" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros Servicios Legales para SAS en Ecuador
            </h2>
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

              {/* Otros - Servicios Contables y Legales */}
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                    Otros Servicios
                  </h3>
                  <div className="h-1 w-24 bg-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Servicios complementarios de contabilidad y consultoría legal especializados.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {services?.filter(service => service.category === "Otros" || service.category === "Servicios Contables" || service.category === "Servicios Legales").map((service) => (
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