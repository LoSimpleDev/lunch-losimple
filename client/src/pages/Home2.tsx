import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Rocket, 
  Scale, 
  PenTool, 
  FileText, 
  CheckCircle, 
  Building, 
  Calculator, 
  Globe, 
  MessageCircle,
  ChevronRight,
  Shield,
  Users,
  Zap,
  Megaphone,
  Laptop,
  TrendingUp,
  Package,
  Star
} from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";
import launchImage from "@assets/stock_images/modern_business_laun_4f912675.jpg";
import legalImage from "@assets/stock_images/legal_documents_cont_84ea744a.jpg";
import firmaImage from "@assets/stock_images/digital_signature_el_96b790f1.jpg";
import facturacionImage from "@assets/stock_images/electronic_invoicing_3458f773.jpg";
import forbesLogo from "@assets/forbes ecuador_1764020045377.png";
import kinesisLogo from "@assets/Logo KINESIS_1764020056113.png";
import impaqtoLogo from "@assets/impaqto logo_1764020086029.png";
import bidLabLogo from "@assets/RETO BID LAB LOGO_1764020098244.avif";
import launchDashboardSAS from "@assets/Screenshot 2025-11-25 at 11.06.51_1764086813530.png";
import launchDashboardLanding from "@assets/Screenshot 2025-11-25 at 11.13.59_1764087244847.png";
import launchDashboardFacturacion from "@assets/Screenshot 2025-11-25 at 11.14.52_1764087296521.png";
import launchDashboardSoporte from "@assets/Screenshot 2025-11-25 at 11.11.13_1764087078790.png";
import loSimpleLlaveMano from "@assets/Screenshot 2025-11-25 at 11.06.51_1764086813530.png";
import loSimpleFirma from "@assets/Screenshot 2025-11-25 at 11.22.10_1764087734934.png";
import loSimpleFacturacion from "@assets/Screenshot 2025-11-25 at 11.14.52_1764087296521.png";
import loSimpleReviews from "@assets/Image web Lo Simple (1)_1764090599190.png";
import legalConstitucionSAS from "@assets/legal_constitucion_sas_dashboard.png";
import legalReformaEstatuto from "@assets/legal_reforma_estatuto_dashboard.png";
import legalCesionAcciones from "@assets/Image web Lo Simple (1)_1764123404042.png";
import legalLiquidacion from "@assets/Image web Lo Simple (2)_1764123656987.png";
import facturacionGenerador from "@assets/facturacion_generador.png";
import facturacionReportes from "@assets/facturacion_reportes.png";
import facturacionConfiguracion from "@assets/facturacion_configuracion.png";
import facturacionIndicadores from "@assets/facturacion_indicadores.png";
import facturacionEmpiezaGratis from "@assets/facturacion_empieza_gratis.png";
import avatarMariaGonzalez from "@assets/Image web Lo Simple (3)_1764129726261.png";
import avatarCarlosMendoza from "@assets/Image web Lo Simple (4)_1764129710184.png";
import avatarAnaPerez from "@assets/Image web Lo Simple (5)_1764129694505.png";

// Data structures for repeated sections
const benefits = [
  {
    icon: Zap,
    title: "Todo en un lugar",
    description: "Desde la constitución hasta la operación diaria. No necesitas coordinar con múltiples proveedores."
  },
  {
    icon: Shield,
    title: "100% Legal y Seguro",
    description: "Cumplimiento total con la Superintendencia de Compañías y SRI. Tu empresa protegida desde el día uno."
  },
  {
    icon: Users,
    title: "Soporte Experto",
    description: "Asesores especializados disponibles para guiarte en cada paso. No estás solo en este camino."
  },
  {
    icon: CheckCircle,
    title: "Entregas Rápidas",
    description: "Tu empresa constituida en 5 días. Servicio Launch completo en 2 días. Comienza a operar pronto."
  },
  {
    icon: Globe,
    title: "Digital Primero",
    description: "Accede a todo desde tu computadora o celular. Dashboard en tiempo real para ver el progreso de tus trámites."
  },
  {
    icon: Building,
    title: "Red de Aliados",
    description: "Acceso a servicios verificados: contabilidad, oficinas, marketing y más. Todo lo que necesitas para crecer."
  }
];

const testimonials = [
  {
    name: "María González",
    title: "CEO, EcoTienda SAS",
    content: "Lo Simple hizo que constituir mi empresa fuera súper fácil. En menos de una semana ya estaba operando legalmente. El seguimiento fue excelente.",
    avatar: avatarMariaGonzalez
  },
  {
    name: "Carlos Mendoza",
    title: "Fundador, TechSolutions",
    content: "El servicio Launch fue increíble. Tener logo, web y todo lo legal en 2 semanas me permitió lanzar mi negocio mucho más rápido de lo que pensaba.",
    avatar: avatarCarlosMendoza
  },
  {
    name: "Ana Pérez",
    title: "Directora, Consultora Legal",
    content: "Recomiendo Lo Simple a todos mis clientes. Son profesionales, rápidos y tienen excelente atención. Todo digital y transparente.",
    avatar: avatarAnaPerez
  }
];

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

const recursos = [
  {
    icon: Scale,
    title: "Guía completa para constituir una SAS en Ecuador",
    description: "Todo lo que necesitas saber sobre Sociedades por Acciones Simplificadas",
    gradient: "from-primary/20 to-accent/20"
  },
  {
    icon: FileText,
    title: "Facturación electrónica: Guía paso a paso",
    description: "Aprende cómo implementar facturación electrónica en tu negocio",
    gradient: "from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: TrendingUp,
    title: "Cómo hacer crecer tu empresa en Ecuador",
    description: "Estrategias probadas para escalar tu negocio",
    gradient: "from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20",
    iconColor: "text-green-600 dark:text-green-400"
  }
];

const home2Faqs = [
  {
    question: "¿Qué incluye el servicio Launch?",
    answer: "Launch es nuestro paquete completo que incluye: constitución de tu SAS, landing page profesional, facturación electrónica y firma electrónica por un año, más soporte continuo. Todo listo en solo 2 días."
  },
  {
    question: "¿Cuánto tiempo toma constituir una SAS?",
    answer: "Con nuestro servicio de constitución, tu SAS estará lista en 5 días hábiles. Si eliges el paquete Launch, tendrás todo operativo en solo 2 días."
  },
  {
    question: "¿Qué es la firma electrónica y para qué la necesito?",
    answer: "La firma electrónica es un certificado digital con validez legal que te permite firmar documentos, contratos y facturas de forma segura desde cualquier dispositivo. Es indispensable para facturar electrónicamente."
  },
  {
    question: "¿La facturación electrónica es obligatoria?",
    answer: "Sí, en Ecuador la facturación electrónica es obligatoria para empresas. Nuestro sistema está 100% autorizado por el SRI y puedes empezar a facturar gratis desde el primer día."
  },
  {
    question: "¿Puedo crear una SAS siendo una sola persona?",
    answer: "Sí, puedes constituir una SAS con un solo accionista. No necesitas socios y no se requiere capital mínimo para empezar."
  },
  {
    question: "¿Qué documentos necesito para empezar?",
    answer: "Solo necesitas tu cédula de identidad. Nosotros te guiamos paso a paso con un formulario en línea para recopilar toda la información necesaria."
  },
  {
    question: "¿Ofrecen soporte después de crear mi empresa?",
    answer: "Sí, con el paquete Launch tienes un año de soporte continuo para consultas legales. Además, nuestra red de aliados te conecta con servicios de contabilidad, marketing y más."
  },
  {
    question: "¿Cuánto cuesta el servicio de constitución?",
    answer: "El servicio de constitución de SAS tiene un costo desde USD 179 más IVA para empresas de un solo accionista. El paquete Launch con todo incluido tiene un precio especial que puedes consultar con nuestras asesoras."
  }
];

export default function Home2() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-32 md:py-40 px-4">
        {/* Decorative Geometric Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left - Angular shapes */}
          <div className="absolute -top-20 -left-20 w-64 h-64 md:w-96 md:h-96">
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#6C5CE7] opacity-90 rounded-br-full transform rotate-45"></div>
            <div className="absolute top-20 left-20 w-32 h-32 bg-[#00D4FF] opacity-80 rounded-lg transform rotate-12"></div>
            <div className="absolute top-10 left-40 w-24 h-2 bg-[#FFB800] opacity-90"></div>
            <div className="absolute top-32 left-12 w-8 h-8 bg-white opacity-60 rounded-full"></div>
          </div>
          
          {/* Top Right - Circular shapes */}
          <div className="absolute -top-32 -right-32 w-80 h-80 md:w-[500px] md:h-[500px]">
            <div className="absolute top-20 right-0 w-64 h-64 bg-[#6C5CE7] opacity-80 rounded-full"></div>
            <div className="absolute top-40 right-32 w-40 h-40 bg-[#00D4FF] opacity-70 rounded-full"></div>
            <div className="absolute top-10 right-20 w-12 h-12 bg-white opacity-50 rounded-full"></div>
            <div className="absolute bottom-20 right-40 w-6 h-6 bg-white opacity-60 rounded-full"></div>
          </div>
          
          {/* Bottom Left - Small accents */}
          <div className="absolute bottom-20 left-10 w-16 h-16 bg-[#FFB800] opacity-70 rounded-lg transform rotate-45 hidden md:block"></div>
          
          {/* Bottom Right - Small accents */}
          <div className="absolute bottom-32 right-20 w-20 h-20 bg-[#00D4FF] opacity-60 rounded-full hidden md:block"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            {/* Lo Simple Logo */}
            <div className="mb-8 flex justify-center">
              <img 
                src={logoUrl} 
                alt="Lo Simple" 
                className="h-16 md:h-20 w-auto"
                data-testid="img-logo-losimple"
              />
            </div>

            {/* Main Headline */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Empezar negocios en Ecuador
              </h1>
            </div>

            <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
              La puerta de entrada para constituir y operar negocios en Ecuador. 
              Todo lo que necesitas en un solo lugar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Button 
                size="lg" 
                className="text-xl px-12 py-8 font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-get-started"
              >
                Comenzar Ahora
                <ChevronRight className="ml-2 h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-xl px-12 py-8 font-semibold border-2"
                onClick={() => window.open('https://wa.me/593958613237', '_blank')}
                data-testid="button-contact-advisor"
              >
                <MessageCircle className="mr-2 h-6 w-6" />
                Hablar con Asesora
              </Button>
            </div>

            {/* Featured In Section */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 opacity-70">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Nos viste en:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10">
                <a 
                  href="https://www.forbes.com.ec/negocios/transformo-sus-derrotas-una-plataforma-medio-millon-dolares-n71419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-100 opacity-70"
                  data-testid="link-forbes"
                >
                  <img 
                    src={forbesLogo} 
                    alt="Forbes Ecuador" 
                    className="h-6 md:h-7 w-auto grayscale hover:grayscale-0 transition-all"
                  />
                </a>
                <a 
                  href="https://impaqto.net/cerramos-con-exito-kinesis-un-programa-de-aceleracion-de-impacto-transformador/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-100 opacity-70"
                  data-testid="link-kinesis"
                >
                  <img 
                    src={kinesisLogo} 
                    alt="Kinesis" 
                    className="h-8 md:h-9 w-auto grayscale hover:grayscale-0 transition-all"
                  />
                </a>
                <a 
                  href="https://www.youtube.com/shorts/L3MLSx1ga4I"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-100 opacity-70"
                  data-testid="link-impaqto"
                >
                  <img 
                    src={impaqtoLogo} 
                    alt="Impaqto" 
                    className="h-8 md:h-9 w-auto grayscale hover:grayscale-0 transition-all"
                  />
                </a>
                <a 
                  href="https://impaqto.net/reto-de-innovacion-digitalizacion-y-sostenibilidad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-100 opacity-70"
                  data-testid="link-bidlab"
                >
                  <img 
                    src={bidLabLogo} 
                    alt="Reto BID Lab" 
                    className="h-8 md:h-9 w-auto grayscale hover:grayscale-0 transition-all"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Tabs Section */}
      <section id="servicios" className="py-[35px] px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
              Nuestra Oferta
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              Todo lo que necesitas para empezar un negocio en Ecuador
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Constituye tu empresa y conecta con todos los servicios que necesitas en un solo lugar.
            </p>
          </div>

          <Tabs defaultValue="losimple" className="w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
              <TabsList className="grid grid-cols-2 lg:grid-cols-5 p-2 h-auto bg-muted/50 rounded-xl">
                <TabsTrigger value="losimple" className="text-base md:text-lg py-4 px-6 data-[state=active]:shadow-md" data-testid="tab-losimple">
                  Lo Simple
                </TabsTrigger>
                <TabsTrigger value="launch" className="text-base md:text-lg py-4 px-6 data-[state=active]:shadow-md" data-testid="tab-launch">
                  <Rocket className="h-5 w-5 mr-2" />
                  Launch
                </TabsTrigger>
                <TabsTrigger value="legal" className="text-base md:text-lg py-4 px-6 data-[state=active]:shadow-md" data-testid="tab-legal">
                  <Scale className="h-5 w-5 mr-2" />
                  Legal
                </TabsTrigger>
                <TabsTrigger value="firma" className="text-base md:text-lg py-4 px-6 data-[state=active]:shadow-md" data-testid="tab-firma">
                  <PenTool className="h-5 w-5 mr-2" />
                  Firma Electrónica
                </TabsTrigger>
                <TabsTrigger value="facturacion" className="text-base md:text-lg py-4 px-6 data-[state=active]:shadow-md" data-testid="tab-facturacion">
                  <FileText className="h-5 w-5 mr-2" />
                  Facturación
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-4">
                <Link href="/launch">
                  <Button 
                    size="lg" 
                    className="bg-purple-600 hover:bg-purple-700"
                    data-testid="button-launch-main"
                  >
                    Launch
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.open('https://calendly.com/veronica-losimple/30min', '_blank')}
                  data-testid="button-schedule-main"
                >
                  Agendemos
                </Button>
              </div>
            </div>

            <TabsContent value="losimple" className="mt-8">
              <div className="space-y-0">
                {/* Lo Simple - Mix of Launch colors */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3">Lo Simple</p>
                    <h3 className="text-2xl font-bold mb-4">Inicio Llave en Mano</h3>
                    <p className="text-sm text-muted-foreground mb-6">Con Launch obtén todo lo que necesitas para empezar en sólo 2 días.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={loSimpleLlaveMano} alt="Dashboard Inicio Llave en Mano" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                  <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 mb-3">Lo Simple</p>
                    <h3 className="text-2xl font-bold mb-4">Firma Electrónica Simple</h3>
                    <p className="text-sm text-muted-foreground mb-6">La forma más sencilla de obtener tu firma electrónica está aquí.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={loSimpleFirma} alt="Dashboard Firma Electrónica Simple" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-3">Lo Simple</p>
                    <h3 className="text-2xl font-bold mb-4">Facturación Electrónica</h3>
                    <p className="text-sm text-muted-foreground mb-6">Empieza facturando de forma gratuita hoy.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={loSimpleFacturacion} alt="Dashboard Facturación Electrónica" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                </div>

                {/* Description with Border Frame */}
                <div className="border-2 border-purple-600 rounded-2xl p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold">¿Por qué Lo Simple?</h3>
                      <p className="text-lg text-foreground">Lo Simple te brinda una experiencia confiable respaldada por más de 2000 clientes satisfechos en Ecuador.</p>
                    </div>
                    <div className="h-64 rounded-lg overflow-hidden">
                      <img 
                        src={loSimpleReviews} 
                        alt="Reseñas de clientes satisfechos" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="launch" className="mt-8">
              <div className="space-y-0">
                {/* Top Row - 3 Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3">Launch</p>
                    <h3 className="text-2xl font-bold mb-4">Compañía SAS</h3>
                    <p className="text-sm text-muted-foreground mb-6">Creamos la SAS que necesitas para empezar de forma simple y sin errores.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={launchDashboardSAS} alt="Dashboard Compañía SAS" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3">Launch</p>
                    <h3 className="text-2xl font-bold mb-4">Landing Page</h3>
                    <p className="text-sm text-muted-foreground mb-6">Sitio web profesional en una experiencia que te hará alucinar.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={launchDashboardLanding} alt="Dashboard Landing Page" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3">Launch</p>
                    <h3 className="text-2xl font-bold mb-4">Facturación y Firma</h3>
                    <p className="text-sm text-muted-foreground mb-6">Habilitamos tu facturación y firma electrónicas por un año en el mismo paquete.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={launchDashboardFacturacion} alt="Dashboard Facturación y Firma" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                </div>

                {/* Bottom Row - 4th Card + Description Frame side by side */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3">Launch</p>
                    <h3 className="text-2xl font-bold mb-4">Soporte Continuo</h3>
                    <p className="text-sm text-muted-foreground mb-6">Soporte Continuo en consultas legales por un año.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={launchDashboardSoporte} alt="Dashboard Soporte Continuo" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                  {/* Description with Border Frame - spans 2 columns */}
                  <div className="md:col-span-2 border-2 border-purple-600 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center h-full">
                      <div className="space-y-3 flex-1">
                        <h3 className="text-2xl font-bold">Lanza tu negocio en 2 días</h3>
                        <p className="text-base text-foreground">Todo lo que necesitas para empezar: sitio web, asistencia en verificación de redes sociales en cuentas de meta, constitución legal, facturación electrónica y firma digital.</p>
                        <Link href="/launch">
                          <Button className="bg-purple-600 hover:bg-purple-700 mt-2" data-testid="button-launch-info">
                            Más Información
                          </Button>
                        </Link>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg h-48 w-full md:w-48 flex-shrink-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="legal" className="mt-8">
              <div className="space-y-0">
                {/* Partial View - 3 Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 mb-3">Legal</p>
                    <h3 className="text-2xl font-bold mb-4">Constitución de SAS</h3>
                    <p className="text-sm text-muted-foreground mb-6">Trámites legales completos ante la Superintendencia en 5 días</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={legalConstitucionSAS} alt="Dashboard Constitución de SAS" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                  <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 mb-3">Legal</p>
                    <h3 className="text-2xl font-bold mb-4">Reforma de Estatuto</h3>
                    <p className="text-sm text-muted-foreground mb-6">Todo el proceso para añadir o quitar actividades de tu SAS de forma ágil.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={legalReformaEstatuto} alt="Reforma de Estatuto" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                  <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 mb-3">Legal</p>
                    <h3 className="text-2xl font-bold mb-4">Cesión de Acciones</h3>
                    <p className="text-sm text-muted-foreground mb-6">Te acompañamos en la cesión de una parte de tu empresa con asesoría completa.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={legalCesionAcciones} alt="Cesión de Acciones" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                </div>

                {/* Bottom Row - Description Frame + 4th Card side by side */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Description with Border Frame - spans 2 columns */}
                  <div className="md:col-span-2 border-2 border-cyan-600 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center h-full">
                      <div className="space-y-3 flex-1">
                        <h3 className="text-2xl font-bold">Constituye tu SAS en 5 días</h3>
                        <p className="text-base text-foreground">Servicio completo de constitución de empresas en 5 días, Nuestro servicio estrella con más de 2000 compañías creadas</p>
                        <Link href="/launch">
                          <Button className="bg-cyan-600 hover:bg-cyan-700 mt-2" data-testid="button-legal-info">
                            Más Información
                          </Button>
                        </Link>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg h-48 w-full md:w-48 flex-shrink-0"></div>
                    </div>
                  </div>
                  <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 mb-3">Legal</p>
                    <h3 className="text-2xl font-bold mb-4">Liquidación de Empresa</h3>
                    <p className="text-sm text-muted-foreground mb-6">Cierra tu compañía SAS a tiempo, no incrementes obligaciones innecesarias.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden">
                      <img src={legalLiquidacion} alt="Liquidación de Empresa" className="w-full h-full object-cover object-center" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="firma" className="mt-8">
              <div className="space-y-0">
                {/* Partial View - 3 Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3">Firma Electrónica</p>
                    <h3 className="text-2xl font-bold mb-4">Certificados digitales</h3>
                    <p className="text-sm text-muted-foreground mb-6">Persona natural y jurídica con validez legal</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg"></div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3">Firma Electrónica</p>
                    <h3 className="text-2xl font-bold mb-4">Firma segura</h3>
                    <p className="text-sm text-muted-foreground mb-6">Valida la autenticidad e integridad de documentos y contratos en el entorno digital.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg"></div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3">Firma Electrónica</p>
                    <h3 className="text-2xl font-bold mb-4">Todo incluido</h3>
                    <p className="text-sm text-muted-foreground mb-6">Adquiere tu firma con la vigencia que necesites con el proceso más rápido del mercado.</p>
                    <div className="h-32 bg-white/50 dark:bg-black/20 rounded-lg"></div>
                  </div>
                </div>

                {/* Description with Border Frame */}
                <div className="border-2 border-green-600 rounded-2xl p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold">Firma Electrónica con validez legal</h3>
                      <p className="text-lg text-foreground">Certificados digitales de persona natural y jurídica. Firma documentos, facturas y contratos con total seguridad.</p>
                      <a href="https://ecuadorfirmasimple.com/" target="_blank" rel="noopener noreferrer">
                        <Button className="bg-green-600 hover:bg-green-700 mt-2" data-testid="button-firma-info">
                          Más Información
                        </Button>
                      </a>
                    </div>
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg h-64"></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="facturacion" className="mt-8">
              <div className="space-y-0">
                {/* Partial View - 3 Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-3">Facturación</p>
                    <h3 className="text-2xl font-bold mb-4">Facturación electrónica</h3>
                    <p className="text-sm text-muted-foreground mb-6">100% cumplimiento SRI, autorizado y confiable</p>
                    <img src={facturacionGenerador} alt="Generador de Facturas Lo Simple" className="w-full h-32 object-cover object-top rounded-lg shadow-md" />
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-3">Facturación</p>
                    <h3 className="text-2xl font-bold mb-4">Reportes automáticos</h3>
                    <p className="text-sm text-muted-foreground mb-6">Genera reportes listos para el SRI automaticamente</p>
                    <img src={facturacionReportes} alt="Reportes de facturación" className="w-full h-32 object-cover object-top rounded-lg shadow-md" />
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-3">Facturación</p>
                    <h3 className="text-2xl font-bold mb-4">Acceso multiplataforma</h3>
                    <p className="text-sm text-muted-foreground mb-6">Desde web, móvil o escritorio en cualquier momento</p>
                    <img src={facturacionConfiguracion} alt="Configuración multiplataforma" className="w-full h-32 object-cover object-top rounded-lg shadow-md" />
                  </div>
                </div>

                {/* Bottom Row - Description Frame + New Card side by side */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Description with Border Frame - spans 2 columns */}
                  <div className="md:col-span-2 border-2 border-yellow-600 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center h-full">
                      <div className="space-y-3 flex-1">
                        <h3 className="text-2xl font-bold">Sistema de Facturación Electrónica</h3>
                        <p className="text-base text-foreground">Plataforma completa de facturación autorizada por el SRI. Emite facturas, notas de crédito y más desde cualquier dispositivo.</p>
                        <a href="https://facturacion.losimple.ai/" target="_blank" rel="noopener noreferrer">
                          <Button className="bg-yellow-600 hover:bg-yellow-700 mt-2" data-testid="button-facturacion-info">
                            Más Información
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-3">Facturación</p>
                    <h3 className="text-2xl font-bold mb-4">Empieza Gratis</h3>
                    <p className="text-sm text-muted-foreground mb-6">Genera un usuario y usa las facturas que te damos de cortesía sin necesidad de ingresar forma de pago.</p>
                    <img src={facturacionIndicadores} alt="Indicadores de facturación" className="w-full h-32 object-cover object-top rounded-lg shadow-md" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Why Lo Simple - Benefits Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              ¿Qué hace Lo Simple?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Somos un aliado para la formalización de negocios en Ecuador, nuestros servicios permiten que los negocios empiecen con seguridad y seriedad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="group" data-testid={`card-benefit-${index}`}>
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-6">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              Construido para emprendedores. Amado por emprendedores.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Miles de empresas confían en Lo Simple
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all hover:border-primary/30" data-testid={`card-testimonial-${index}`}>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-foreground mb-8 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-lg">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources/Blog Section */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              Recursos para emprendedores
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Guías prácticas para ayudarte a construir y hacer crecer tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {recursos.map((recurso, index) => {
              const IconComponent = recurso.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden p-2 md:p-0" data-testid={`card-resource-${index}`}>
                  <div className={`h-48 bg-gradient-to-br ${recurso.gradient} flex items-center justify-center`}>
                    <IconComponent className={`h-16 w-16 ${recurso.iconColor || 'text-primary'}`} />
                  </div>
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg">{recurso.title}</CardTitle>
                    <CardDescription>
                      {recurso.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={() => window.open('https://sasecuador.com/blog', '_blank')}
                      data-testid={`button-resource-${index}`}
                    >
                      Leer más
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.open('https://sasecuador.com/blog', '_blank')}
              data-testid="button-view-all-resources"
            >
              Ver todos los recursos
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>


      {/* FAQs Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Todo lo que necesitas saber
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {home2Faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background rounded-lg px-6 border"
                itemScope 
                itemProp="mainEntity" 
                itemType="https://schema.org/Question"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger 
                  className="hover:no-underline py-4 text-left"
                  data-testid={`faq-trigger-${index}`}
                >
                  <span className="font-semibold" itemProp="name">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent 
                  className="text-muted-foreground pb-4"
                  itemScope 
                  itemProp="acceptedAnswer" 
                  itemType="https://schema.org/Answer"
                  data-testid={`faq-content-${index}`}
                >
                  <div itemProp="text">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">
              ¿Tienes más preguntas?
            </p>
            <Button 
              size="lg"
              className="text-xl px-12 py-8 font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.open('https://wa.me/593958613237', '_blank')}
              data-testid="button-schedule-consultation"
            >
              <MessageCircle className="mr-2 h-6 w-6" />
              Agenda una consulta gratuita
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 md:py-40 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Menos trámites. Más acción.
          </h2>
          <p className="text-2xl md:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Únete a Lo Simple y comienza a construir el negocio de tus sueños hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="text-xl px-12 py-8 font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-final-cta"
            >
              Comenzar Ahora
              <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-xl px-12 py-8 font-semibold border-2"
              onClick={() => window.open('https://wa.me/593958613237', '_blank')}
              data-testid="button-final-contact"
            >
              <MessageCircle className="mr-2 h-6 w-6" />
              Hablar con Asesora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Simple version for now */}
      <footer className="bg-[#141464] text-white py-12 px-4 mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img src={logoUrl} alt="Lo Simple" className="h-8 w-auto mb-4 brightness-0 invert" />
              <p className="text-sm mb-4 opacity-80">
                La puerta de entrada a la formalización en Ecuador. 
                Construimos patrimonios familiares sólidos una pequeña empresa a la vez.
              </p>
              <p className="text-sm opacity-60">
                Hecho en Ecuador con 💜
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link href="/" className="hover:opacity-100 transition-opacity" data-testid="link-footer-inicio">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/launch" className="hover:opacity-100 transition-opacity" data-testid="link-footer-launch">
                    Launch
                  </Link>
                </li>
                <li>
                  <Link href="/saslegal-plus" className="hover:opacity-100 transition-opacity" data-testid="link-footer-membresia">
                    Membresía
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Ecuador</li>
                <li>
                  <a href="mailto:hola@losimple.ai" className="hover:opacity-100 transition-opacity" data-testid="link-footer-email">
                    hola@losimple.ai
                  </a>
                </li>
                <li>
                  <a href="tel:+593958613237" className="hover:opacity-100 transition-opacity" data-testid="link-footer-phone">
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
                <Link href="/terminos-y-condiciones" className="hover:opacity-100 transition-opacity" data-testid="link-footer-terminos">
                  Términos y Condiciones
                </Link>
                <Link href="/politica-privacidad-datos-lo-simple" className="hover:opacity-100 transition-opacity" data-testid="link-footer-privacidad">
                  Política de Privacidad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
